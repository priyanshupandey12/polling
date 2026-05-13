import { Router, type IRouter } from "express";
import {createQuestion} from "../controller/questions.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router: IRouter = Router(); 

router.post("/:pollId", authMiddleware, createQuestion); 

export default router;