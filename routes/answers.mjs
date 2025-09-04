import express from "express";
import { getAnswersByQuestion, createAnswer, deleteAnswer } from "../controllers/answersController.mjs";

const router = express.Router();

router.get("/:questionId", getAnswersByQuestion);

router.post("/", createAnswer);

router.delete("/:id", deleteAnswer);

export default router;
