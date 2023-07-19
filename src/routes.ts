import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
} from "./controller/job_posts";
import { CompanyLogin, CompanyRegister } from "./controller/company_auth";
import { authMiddleware } from "./utils/auth_middleware";

const router = Router();

//----------- COMPANY --------------

router.get("/vagas", getAllPosts);
router.get("/vaga/:id", getPost);
router.post("/cadastrar-empresa", CompanyRegister);
router.post("/login-empresa", CompanyLogin);
// PRIVATE ROUTES
router.post("/criar-vaga", authMiddleware, createPost);
router.get("/delete", authMiddleware, deletePost);
router.patch("/atualizar-vaga/:id", authMiddleware, updatePost);

export default router;
