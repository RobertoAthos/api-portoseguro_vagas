import { Request, Response } from "express";
import { UserModel } from "../../model/user_auth_model";
import { PostsModel } from "../../model/posts";
import { ApplyJobModel } from "../../model/apply_jobs_model";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { keys } from "../../config/keys";

export const UserApplyJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userEmail, userId, userPhone } = req.body;
    const job_post = await PostsModel.findById(id);
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userAlreadyApplied = await ApplyJobModel.findOne({
      jobId: job_post!._id,
      userId: userId
    })

    if(userAlreadyApplied){
      return res.status(400).json("Você já enviou sua candidatura para essa vaga!")
    }

    const S3 = new S3Client({
      region: "auto",
      endpoint: keys.R2_ENDPOINT,
      credentials: {
        accessKeyId: keys.R2_ACCESS_KEY_ID!,
        secretAccessKey: keys.R2_SECRET_ACCESS_KEY!,
      },
    });

    const new_application = new ApplyJobModel({
      jobId: job_post!._id,
      jobTitle: job_post!.title,
      userEmail,
      userPhone,
      userId,
      userName: user.fullName,
      userPhoto: user.avatar,
    });

    if (new_application && req.file) {
      const CvFileName = path.basename(req.file.originalname);

      const uploadParams = {
        Body: req.file.buffer,
        Bucket: "psjobs",
        Key: CvFileName,
        ContentType: req.file.mimetype,
      };

      console.log("sending to R2");
      await S3.send(new PutObjectCommand(uploadParams));
      console.log("image sent");

      new_application.userCV = CvFileName;
      await new_application.save();
    }

    await PostsModel.updateOne({ _id: id }, { $inc: { candidates: 1 } });
    const application = await ApplyJobModel.find();
    console.log(req.body);
    res.status(201).json(application);
  } catch (error: any) {
    console.log(error);
    res.status(400);
  }
};

export const GetUserAppliedJobs = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const appliedJobs  = await ApplyJobModel.find({ userId: id });
    const jobIds = appliedJobs.map(job=>job.jobId)
    const getJobsApplied = await PostsModel.find({ _id: { $in: jobIds } })

    res.status(200).json(getJobsApplied);
  } catch (error) {
    console.log(error)
  }
};
