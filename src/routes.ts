import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
} from "./controller/job_posts";
import {
  UserLogin,
  UserRegister,
  UpdateUser,
} from "./controller/authentication/user_auth";
import {
  CompanyLogin,
  CompanyRegister,
} from "./controller/authentication/company_auth";
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
router.post("/cadastrar-empresa", CompanyRegister);
router.post("/login-empresa", CompanyLogin);
router.post("/cadastrar-usuario", uploadFiles, UserRegister);
router.post("/login-usuario", UserLogin);
// PRIVATE ROUTES
router.post(
  "/criar-vaga",
  authMiddleware(keys.COMPANIES_SECRET_KEY!),
  createPost
);

router.get("/delete", authMiddleware(keys.COMPANIES_SECRET_KEY!), deletePost);

router.patch(
  "/atualizar-vaga/:id",
  authMiddleware(keys.COMPANIES_SECRET_KEY!),
  updatePost
);

router.patch(
  "/atualizar-conta/:id",
  authMiddleware(keys.USERS_SECRET_KEY!),
  uploadFiles,
  UpdateUser
);

export default router;
