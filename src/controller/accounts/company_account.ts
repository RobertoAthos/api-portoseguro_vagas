import { Request, Response } from "express";
import { CompanyModel } from "../../model/company_auth_model";
import bcrypt from "bcryptjs";
import { PostsModel } from "../../model/posts";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { keys } from "../../config/keys";
import path from "path";

export const UpdateCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { company_email, company_name, cnpj, aboutCompany } =
      req.body;

    const S3 = new S3Client({
      region: "auto",
      endpoint: keys.R2_ENDPOINT,
      credentials: {
        accessKeyId: keys.R2_ACCESS_KEY_ID!,
        secretAccessKey: keys.R2_SECRET_ACCESS_KEY!,
      },
    });

    const update_company = await CompanyModel.findByIdAndUpdate(
      { _id: id },
      {
        company_email,
        company_name,
        cnpj,
        aboutCompany,
      },
      { new: true }
    );

    if (update_company && req.file) {
      const avatarFileName = path.basename(req.file.originalname);

      const uploadParams = {
        Body: req.file.buffer,
        Bucket: "psjobs",
        Key: avatarFileName,
        ContentType: req.file.mimetype,
      };

      await S3.send(new PutObjectCommand(uploadParams));

      update_company!.avatar = avatarFileName;
      await update_company!.save();
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
    const { companyId, jobId } = req.query; // Retrieve query parameters

    if (jobId) {
      const jobPost = await PostsModel.findById(jobId);
      if (jobPost) {
        const company = await CompanyModel.findById(jobPost.company_id).select(
          "-password"
        );
        res.status(200).json(company);
      } else {
        res.status(404).json({ error: "Job not found" });
      }
    } else if (companyId) {
      const company = await CompanyModel.findById(companyId).select(
        "-password"
      );
      if (company) {
        res.status(200).json(company);
      } else {
        res.status(404).json({ error: "Company not found" });
      }
    } else {
      res.status(400).json({ error: "Missing query parameters" });
    }
  } catch (error: any) {
    res.status(400).json(error.message);
  }
};
