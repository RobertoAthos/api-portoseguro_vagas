import { Request, Response } from "express";
import { CompanyModel } from "../../model/company_auth_model";
import bcrypt from "bcryptjs";
import { PostsModel } from "../../model/posts";

export const UpdateCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { company_email, company_name, avatar, cnpj, aboutCompany } = req.body;
    const company = await CompanyModel.findById(id);

    const update_company = await CompanyModel.findByIdAndUpdate(
      { _id: id },
      {
        company_email,
        company_name,
        avatar,
        cnpj,
        aboutCompany,
      },
      { new: true }
    );

    if (req.file) {
      company!.avatar = req.file.path;
    }

    res.status(200).json(update_company);
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

    if (!company) {
      return res
        .status(404)
        .json("Você ainda não possui nenhuma vaga cadastrada");
    }

    const company_posts = await PostsModel.find({
      company_id: company?._id,
    }).sort({ _id: -1 });

    res.status(200).json(company_posts);
  } catch (error: any) {
    res.status(400).json(error.message);
  }
};

export const GetCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const company = await CompanyModel.findById(id);
    res.status(200).json(company);
  } catch (error: any) {
    res.status(400).json(error.message);
  }
};
