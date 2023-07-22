import mongoose from "mongoose";

const PostsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  salary: { type: Number, required: true },
  location: { type: String, required: true },
  about: { type: String, required: true },
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Companies" },
  company_photo: {
    type: String,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr2TWLC89uQt3vWdCNxxESU3iK9Pj-acV5CA&usqp=CAU",
  },
  company_name: { type: String, required:true },
});

export const PostsModel = mongoose.model("Posts", PostsSchema);
