import { Router, type IRouter } from "express";
import { submitResponse } from "../controller/response.controller.js";
import optionalAuthMiddleware from "../middleware/responseauth.middlware.js";

const router: IRouter = Router();

router.post("/:pollId", optionalAuthMiddleware, submitResponse); 

export default router;