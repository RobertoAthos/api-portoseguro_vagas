import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
} from "./controller/job_posts";
import { UserLogin, UserRegister } from "./controller/authentication/user_auth";
import {
  CompanyLogin,
  CompanyRegister,
} from "./controller/authentication/company_auth";
import { authMiddleware } from "./middleware/auth_middleware";
import { keys } from "./config/keys";
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/resumes");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
const upload = multer({ storage: storage });

//----------- COMPANY --------------

router.get("/vagas", getAllPosts);
router.get("/vaga/:id", getPost);
router.post("/cadastrar-empresa", CompanyRegister);
router.post("/login-empresa", CompanyLogin);
router.post("/cadastrar-usuario", upload.single("cv"), UserRegister);
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

export default router;
