import express from "express";
import {
  dbCheck,
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  searchQuestions,
} from "../controllers/questionsController.mjs";

const router = express.Router();

router.get("/db-check", dbCheck);   
router.get("/", getAllQuestions);   
router.get("/search", searchQuestions); 
router.get("/:id", getQuestionById);  
router.post("/", createQuestion);     
router.put("/:id", updateQuestion);   
router.delete("/:id", deleteQuestion);
export default router;
