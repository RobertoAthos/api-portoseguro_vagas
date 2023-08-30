import { Request, Response } from "express";
import { UserModel } from "../../model/user_auth_model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { keys } from "../../config/keys";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const UserRegister = async (req: Request, res: Response) => {
  try {
    const new_user = new UserModel(req.body);

    const emailAlreadyExists = await UserModel.findOne({
      email: req.body.email,
    });

    if (emailAlreadyExists) {
      return res.status(400).json("Email já existente");
    }

    const S3 = new S3Client({
      region: "auto",
      endpoint: keys.R2_ENDPOINT,
      credentials: {
        accessKeyId: keys.R2_ACCESS_KEY_ID!,
        secretAccessKey: keys.R2_SECRET_ACCESS_KEY!,
      },
    });

    if (new_user && req.file) {
      new_user.avatar = req.file.path;

      const avatarFileName = path.basename(req.file.originalname);

      const uploadParams = {
        Body: req.file.buffer,
        Bucket: "psjobs",
        Key: avatarFileName,
        ContentType: req.file.mimetype,
      };

      console.log("sending to R2");
      await S3.send(new PutObjectCommand(uploadParams));
      console.log("image sent");

      new_user.avatar = avatarFileName;
    }

    const salt = await bcrypt.genSalt(10);
    new_user.password = bcrypt.hashSync(req.body.password, salt);
    console.log(req.body);
    const save_user = await new_user.save();
    res.status(201).json(save_user);
  } catch (error: any) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

export const UserLogin = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findOne({
      email: req.body.email,
    });
    if (!user) {
      return res
        .status(400)
        .send("Esse Email/Senha não existe ou estão incorretos");
    }

    const login_user = bcrypt.compareSync(req.body.password, user.password);
    if (!login_user) {
      return res.status(400).send("Esse Email/Senha incorreto");
    }

    const payload = {
      _id: user._id,
      name: user.fullName,
      email: user.email,
      location: user.location,
      avatar: user.avatar,
    };

    const token = jwt.sign(payload, keys.USERS_SECRET_KEY!);
    res.header("Authorization", token);
    res.status(200).json({ user, token });

    const data = jwt.decode(token);
    console.log(data);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
};
