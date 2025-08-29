import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { 
  startInterview,
  addAnswer,
  endInterview,
  getMyInterviews , deleteInterview
} from "../controllers/interviewController.js";

const router = express.Router();

router.post("/start", protect, startInterview);
router.post("/:id/answer", protect, addAnswer);
router.post("/:id/end", protect, endInterview);
router.get("/my", protect, getMyInterviews);

router.delete("/:id", protect, deleteInterview);

export default router;
