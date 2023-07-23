import { Router } from "express";
import {
  CompanyLogin,
  CompanyRegister,
} from "./controller/authentication/company_auth";
import { UserLogin, UserRegister } from "./controller/authentication/user_auth";

import { UpdateUser } from "./controller/accounts/user_account";
import { UpdateCompany,DeleteCompany,UpdateCompanyPassword } from "./controller/accounts/company_account";

import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
} from "./controller/jobs/job_posts";
import { UserApplyJob } from "./controller/jobs/user_apply_job";
import { getAllApplications } from "./controller/jobs/get_job_applications";

import { authMiddleware } from "./middleware/auth_middleware";
import { keys } from "./config/keys";
import { upload } from "./middleware/upload";

const router = Router();

const uploadFiles = upload.fields([
  {
    name: "cv",
    maxCount: 1,
  },
  {
    name: "avatar",
    maxCount: 1,
  },
]);

//----------- COMPANY --------------

router.get("/vagas", getAllPosts);
router.get("/vaga/:id", getPost);
router.post("/cadastrar-empresa", upload.single("avatar"), CompanyRegister);
router.post("/login-empresa", CompanyLogin);
router.post(
  "/criar-vaga",
  authMiddleware(keys.COMPANIES_SECRET_KEY!),
  createPost
);

router.delete(
  "/delete-company-post",
  authMiddleware(keys.COMPANIES_SECRET_KEY!),
  deletePost
);

router.patch(
  "/atualizar-vaga/:id",
  authMiddleware(keys.COMPANIES_SECRET_KEY!),
  updatePost
);

router.patch(
  "/atualizar-conta-empresa/:id",
  authMiddleware(keys.COMPANIES_SECRET_KEY!),
  upload.single("avatar"),
  UpdateCompany
);

router.get(
  "/candidatos/:id",
  //authMiddleware(keys.COMPANIES_SECRET_KEY!),
  getAllApplications
);

router.delete('/delete-company/:id', DeleteCompany)

router.patch('/atualizar-senha-empresa/:id', UpdateCompanyPassword)

//----------- USERS --------------

router.post("/cadastrar-usuario", uploadFiles, UserRegister);
router.post("/login-usuario", UserLogin);
router.patch(
  "/atualizar-conta/:id",
  authMiddleware(keys.USERS_SECRET_KEY!),
  uploadFiles,
  UpdateUser
);

router.post(
  "/candidatar-usuario/:id",
  authMiddleware(keys.USERS_SECRET_KEY!),
  UserApplyJob
);

export default router;
