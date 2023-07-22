import { Request, Response } from "express";
import { PostsModel } from "../../model/posts";
import { CompanyModel } from "../../model/company_auth_model";

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, salary, location, about, companyId } = req.body;
    const company = await CompanyModel.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const new_post = new PostsModel({
      title,
      about,
      location,
      salary,
      company_id: company._id,
      company_photo: company.avatar,
      company_name: company.company_name,
    });

    if (!title || !about || !location || !salary) {
      res.json({ message: "Você provavelmente não preencheu alguns campos." });
    }
    console.log(new_post);
    await new_post.save();
    const post = await PostsModel.find().sort({ _id: -1 });
    res.status(201).json(post);
  } catch (error: any) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, salary, location, about, companyName } = req.body;
    const post = await PostsModel.findById(id);

    if (!post) {
      res.status(404).json("Anuncio de vaga não existe");
    }

    const company = await CompanyModel.findOne({ name: companyName });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const update_post = await PostsModel.findByIdAndUpdate(
      { _id: id },
      {
        title,
        salary,
        location,
        about,
        company_id: company?._id,
        company_photo: company.avatar,
        company_name: company.company_name,
      }
    );

    res.status(200).json(update_post);
  } catch (error: any) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const post = await PostsModel.find().sort({ _id: -1 });
    res.status(200).json(post);
  } catch (error: any) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await PostsModel.findById(id);
    res.status(200).json(post);
  } catch (error: any) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await PostsModel.findById(id);
    if (!post)
      res.send(
        "Anuncio não pode ser deletado pois ele não foi encontrado no nosso banco de dados"
      );
    const delete_post = await PostsModel.findByIdAndDelete(id);
    res.status(200).send(delete_post);
  } catch (error: any) {
    console.log(error);
    res.status(400).json(error.message);
  }
};
