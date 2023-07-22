import { Request, Response } from "express";
import { ApplyJobModel } from "../model/apply_jobs_model";

export const getAllApplications = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const applications = await ApplyJobModel.find({ jobId: id })
      .populate("userId", "userCV userEmail userPhoto")
      .exec();

    const candidates = applications.map((candidate) => ({
      avatar: candidate.userPhoto,
      name: candidate.userName,
      email: candidate.userEmail,
      cv: candidate.userCV,
    }));

    res.status(200).json(candidates);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
