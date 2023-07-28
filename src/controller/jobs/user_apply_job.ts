import { Request, Response } from "express";
import { UserModel } from "../../model/user_auth_model";
import { PostsModel } from "../../model/posts";
import { ApplyJobModel } from "../../model/apply_jobs_model";

export const UserApplyJob = async (req: Request, res: Response) => {
  try {
    const { userEmail, userId, userPhone } = req.body;
    console.log(req.body);
    const { id } = req.params;
    const job_post = await PostsModel.findOne({ _id: id });
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log(job_post!.title);

    const new_application = new ApplyJobModel({
      jobId: job_post!._id,
      jobTitle: job_post!.title,
      userCV: user.cv,
      userEmail,
      userPhone,
      userId,
      userName: user.fullName,
      userPhoto: user.avatar,
    });

    await new_application.save();
    await PostsModel.updateOne({ _id: id }, { $inc: { candidates: 1 } });
    const application = await ApplyJobModel.find();
    res.status(201).json(application);
  } catch (error: any) {
    console.log(error);
    res.status(400);
  }
};
