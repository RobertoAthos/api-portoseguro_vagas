
import { Request, Response } from "express";
import { UserModel } from "../../model/user_auth_model";

export const UpdateUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { fullName, email, location, cv, avatar } = req.body;
      const user = await UserModel.findById(id);
      if (!user) {
        res.status(404).send("Usuário não existe");
      }
  
      user!.fullName = fullName;
      user!.email = email;
      user!.location = location;
      user!.cv = cv;
      user!.avatar = avatar;
  
      if ("cv" in req.files! && Array.isArray(req.files["cv"])) {
        user!.cv = req.files["cv"][0].path;
      }
      
      if ("avatar" in req.files! && Array.isArray(req.files["avatar"])) {
        user!.avatar = req.files["avatar"][0].path;
      }
  
      const updatedUser = await user!.save();
  
      res.status(200).json(updatedUser);
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  };


export const DeleteUser = async (req: Request, res: Response) => {}

export const UpdatePassword = async (req: Request, res: Response) => {}