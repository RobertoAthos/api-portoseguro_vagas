import mongoose from "mongoose";

const ApplyJobSchemma = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Posts" },
  userName: { type: String, ref: "Users" },
  userEmail: { type: String, ref: "Users" },
  userPhoto: { type: String, ref: "Users" },
  userCV: { type: String, ref: "Users" },
});

export const ApplyJobModel = mongoose.model("apply_jobs", ApplyJobSchemma);
