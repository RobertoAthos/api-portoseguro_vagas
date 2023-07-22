
import { Request, Response } from "express";
import { CompanyModel } from "../model/company_auth_model";

export const UpdateCompany = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { company_email, company_name, avatar, cnpj } = req.body;
      const company = await CompanyModel.findById(id);
      if (!company) {
        res.status(404).send("Empresa não existe");
      }
  
      company!.company_name = company_name;
      company!.company_email = company_email;
      company!.cnpj = cnpj;
      company!.avatar = avatar;
  
      if (req.file) {
        company!.avatar = req.file.path;
      }
  
      const updatedCompany = await company!.save();
  
      res.status(200).json(updatedCompany);
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  };


export const DeleteUser = async (req: Request, res: Response) => {}

export const UpdatePassword = async (req: Request, res: Response) => {}