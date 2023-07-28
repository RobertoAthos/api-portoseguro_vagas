import mongoose from "mongoose";

const ApplyJobSchemma = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Posts" },
  jobTitle: { type: String, ref: "Posts" },
  userEmail: { type: String, required: true },
  userPhone: { type: String, required: true },
  userName: { type: String },
  userPhoto: { type: String },
  userCV: { type: String },
});

export const ApplyJobModel = mongoose.model("ApplyJobs", ApplyJobSchemma);
