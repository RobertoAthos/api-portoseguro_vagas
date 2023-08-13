import { Request, Response } from "express";
import { CompanyModel } from "../../model/company_auth_model";
import bcrypt from "bcryptjs";
import { PostsModel } from "../../model/posts";

export const UpdateCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { company_email, company_name, avatar, cnpj,about } = req.body;
    const company = await CompanyModel.findById(id);
    if (!company) {
      res.status(404).send("Empresa não existe");
    }

    company!.company_name = company_name;
    company!.company_email = company_email;
    company!.cnpj = cnpj;
    company!.avatar = avatar;
    company!.about = about

    if (req.file) {
      company!.avatar = req.file.path;
    }

    const updatedCompany = await company!.save();

    res.status(200).json(updatedCompany);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
};

export const DeleteCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleteCompany = await CompanyModel.findByIdAndDelete(id);
    res.status(200).json(deleteCompany);
  } catch (error: any) {
    console.log(error);
    res.status(400).json("Algo deu errado na hora de deletar sua conta");
  }
};

export const UpdateCompanyPassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const update_password = await CompanyModel.findByIdAndUpdate(
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

export const GetAccountPosts = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const company = await CompanyModel.findById(id);

    if(!company){
      return res.status(404).json("Você ainda não possui nenhuma vaga cadastrada")
    }

    const company_posts = await PostsModel.find({ company_id: company?._id });

    res.status(200).json(company_posts);
  } catch (error: any) {
    res.status(400).json(error.message);
  }
};
