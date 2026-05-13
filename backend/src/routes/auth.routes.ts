import { Router, type IRouter } from "express";
import {
  register,
  login,
  logout,
  refreshToken,
  getCurrentUser,
} from "../controller/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import validationMiddleware from "../middleware/validation.middleware.js";
import { registerSchema } from "../validation/register.validation.js";
import { loginSchema } from "../validation/login.validation.js";

const router: IRouter = Router();

router.post("/register", validationMiddleware(registerSchema), register);
router.post("/login", validationMiddleware(loginSchema), login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get("/me", authMiddleware, getCurrentUser);

export default router;