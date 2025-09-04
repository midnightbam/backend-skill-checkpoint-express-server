import express from "express";
import questionsRouter from "./routes/questions.mjs";
import answersRouter from "./routes/answers.mjs";
import pool from "./utils/db.mjs"; 

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.get("/test", (req, res) => res.json("Server API is working 🚀"));
app.use("/questions", questionsRouter);
app.use("/answers", answersRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
