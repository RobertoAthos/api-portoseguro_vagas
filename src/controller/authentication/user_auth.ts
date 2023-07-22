import { Request, Response } from "express";
import { UserModel } from "../../model/user_auth_model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { keys } from "../../config/keys";

export const UserRegister = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const new_user = new UserModel(req.body);

    const emailAlreadyExists = await UserModel.findOne({
      email: req.body.email,
    });

    if (emailAlreadyExists) {
      return res.status(400).json("Email já existente");
    }

    if ("cv" in req.files! && Array.isArray(req.files["cv"])) {
      new_user.cv = req.files["cv"][0].path;
    }

    if ("avatar" in req.files! && Array.isArray(req.files["avatar"])) {
      new_user.avatar = req.files["avatar"][0].path;
    }

    console.log(req.files);
    const salt = await bcrypt.genSalt(10);
    new_user.password = bcrypt.hashSync(req.body.password, salt);

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

    const token = jwt.sign({ _id: user._id }, keys.USERS_SECRET_KEY!);
    res.header("Authorization", token);
    res.status(200).json({ user, token });
  } catch (error: any) {
    res.status(400).send(error.message);
  }
};
