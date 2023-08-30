import { Request, Response } from "express";
import { UserModel } from "../../model/user_auth_model";
import bcrypt from "bcryptjs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { keys } from "../../config/keys";
import path from "path";

export const UpdateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fullName, email, location } = req.body;

    const update_user = await UserModel.findByIdAndUpdate(
      { _id: id },
      {
        fullName,
        email,
        location,
      },
      { new: true }
    );

    const S3 = new S3Client({
      region: "auto",
      endpoint: keys.R2_ENDPOINT,
      credentials: {
        accessKeyId: keys.R2_ACCESS_KEY_ID!,
        secretAccessKey: keys.R2_SECRET_ACCESS_KEY!,
      },
    });

    if (update_user && req.file) {
      const avatarFileName = path.basename(req.file!.originalname);

      const uploadParams = {
        Body: req.file!.buffer,
        Bucket: "psjobs",
        Key: avatarFileName,
        ContentType: req.file!.mimetype,
      };

      await S3.send(new PutObjectCommand(uploadParams));

      update_user!.avatar = avatarFileName;
      await update_user!.save();
    }

    res.status(200).json(update_user);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
};

export const DeleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleteUser = await UserModel.findByIdAndDelete(id);
    res.status(200).json(deleteUser);
  } catch (error: any) {
    console.log(error);
    res.status(400).json("Algo deu errado na hora de deletar sua conta");
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(400).json("Algo deu errado ao procurar usuário");
  }
};

export const UpdateUserPassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const update_password = await UserModel.findByIdAndUpdate(
      { _id: id },
      {
        password: hashedPassword,
      },
      { new: true }
    );

    res.status(200).json(update_password);
  } catch (error) {
    console.log(error);
    res.status(400).json("Algo deu errado na hora de mudar sua senha");
  }
};
