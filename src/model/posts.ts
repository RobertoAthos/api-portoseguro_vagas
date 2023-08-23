import mongoose from "mongoose";

const PostsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  salary: { type: Number, required: true },
  location: { type: String, required: true },
  about: { type: String, required: true },
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Companies" },
  company_photo: {type: String},
  company_name: { type: String, required: true },
  candidates: { type: Number, default: 0 },
});

export const PostsModel = mongoose.model("Posts", PostsSchema);
