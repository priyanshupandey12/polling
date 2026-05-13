import { Router, type IRouter } from "express";
import { getAnalytics } from "../controller/analytics.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router: IRouter = Router();

router.get("/:pollId", authMiddleware, getAnalytics);

export default router;