import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
  company_name: { type: String, required: true },
  company_email: { type: String, required: true },
  password: { type: String, required: true },
  photo: String,
  cnpj: { type: String, required: true },
});

export const CompanyModel = mongoose.model("Companies", CompanySchema);
