import { Request, Response } from "express";
import { CompanyModel } from "../../model/company_auth_model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { keys } from "../../config/keys";

export const CompanyRegister = async (req: Request, res: Response) => {
  try {
    const new_company = new CompanyModel(req.body);

    if (req.file) {
      new_company.avatar = req.file.path;
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
    const verify_if_company_exists = await CompanyModel.findOne({
      email: req.body.company_email,
    });
    if (!verify_if_company_exists) {
      return res
        .status(400)
        .send("Esse Email/Senha não existe ou estão incorretos");
    }

    const login_company = bcrypt.compareSync(
      req.body.password,
      verify_if_company_exists.password
    );

    if (!login_company) {
      return res.status(400).send("Esse Email/Senha incorreto");
    }

    const token = jwt.sign(
      { _id: verify_if_company_exists._id },
      keys.COMPANIES_SECRET_KEY!
    );
    res.header("Authorization", token);
    res.status(200).json(token);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
};
