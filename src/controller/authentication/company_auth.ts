import { Request, Response } from "express";
import { CompanyModel } from "../../model/company_auth_model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { keys } from "../../config/keys";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import path from "path";

export const CompanyRegister = async (req: Request, res: Response) => {
  try {
    const verify_if_company_exists = await CompanyModel.findOne({
      email: req.body.company_email,
    });

    if (verify_if_company_exists) {
      return res.status(400).json("Email já existente");
    }

    const new_company = new CompanyModel(req.body);

    const S3 = new S3Client({
      region: "auto",
      endpoint: keys.R2_ENDPOINT,
      credentials: {
        accessKeyId: keys.R2_ACCESS_KEY_ID!,
        secretAccessKey: keys.R2_SECRET_ACCESS_KEY!,
      },
    });

    if (new_company && req.file) {
      new_company.avatar = req.file.path;

      const avatarFileName = path.basename(req.file.originalname);

      const uploadParams = {
        Body: req.file.buffer,
        Bucket: "psjobs",
        Key: avatarFileName,
        ContentType: req.file.mimetype,
      };

      await S3.send(new PutObjectCommand(uploadParams));

      new_company!.avatar = avatarFileName;
    }

    const salt = await bcrypt.genSalt(10);
    new_company.password = bcrypt.hashSync(req.body.password, salt);

    const save_company = await new_company.save();
    res.status(201).json(save_company);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
};

export const CompanyLogin = async (req: Request, res: Response) => {
  try {
    const company = await CompanyModel.findOne({
      email: req.body.company_email,
    });
    if (!company) {
      return res
        .status(400)
        .send("Esse Email/Senha não existe ou estão incorretos");
    }

    const login_company = bcrypt.compareSync(
      req.body.password,
      company.password
    );

    if (!login_company) {
      return res.status(400).send("Esse Email/Senha incorreto");
    }

    const payload = {
      _id: company._id,
      company_name: company.company_name,
      comapany_email: company.company_email,
      cnpj: company.cnpj,
      avatar: company.avatar,
    };

    const token = jwt.sign(payload, keys.COMPANIES_SECRET_KEY!);
    res.header("Authorization", token);
    res.status(200).json(token);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
};
