import { Router, type IRouter } from "express";
import { createPoll,getPollById,publishPoll,getUserPolls ,getPollDetail} from "../controller/poll.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import optionalAuthMiddleware from "../middleware/responseauth.middlware.js";

const router: IRouter = Router();

router.get("/", authMiddleware, getUserPolls);
router.post("/", authMiddleware, createPoll);
router.get("/:pollId", optionalAuthMiddleware, getPollById);
router.patch("/:pollId/publish", authMiddleware, publishPoll);
router.get("/:pollId/detail", authMiddleware, getPollDetail);

export default router;