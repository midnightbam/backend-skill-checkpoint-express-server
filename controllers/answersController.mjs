import pool from "../utils/db.mjs";

export async function getAnswersByQuestion(req, res) {
  try {
    const { questionId } = req.params;

    const q = await pool.query("SELECT id FROM questions WHERE id=$1", [questionId]);
    if (q.rows.length === 0) return res.status(404).json({ message: "Question not found" });

    const r = await pool.query(
      "SELECT id, question_id, content, created_at FROM answers WHERE question_id=$1 ORDER BY id DESC",
      [questionId]
    );
    return res.json({ data: r.rows });
  } catch (err) {
    console.error("getAnswersByQuestion:", err);
    return res.status(500).json({ message: "Failed to fetch answers" });
  }
}

export async function createAnswer(req, res) {
  try {
    const { question_id, content } = req.body;
    if (!question_id || !content) return res.status(400).json({ message: "question_id and content are required" });
    if (typeof content !== "string" || content.length === 0) return res.status(400).json({ message: "content must be a non-empty string" });
    if (content.length > 300) return res.status(400).json({ message: "content must be 300 characters or less" });

    const q = await pool.query("SELECT id FROM questions WHERE id=$1", [question_id]);
    if (q.rows.length === 0) return res.status(404).json({ message: "Question not found" });

    const r = await pool.query(
      "INSERT INTO answers (question_id, content) VALUES ($1,$2) RETURNING id, question_id, content, created_at",
      [question_id, content]
    );

    return res.status(201).json({ data: r.rows[0] });
  } catch (err) {
    console.error("createAnswer:", err);
    return res.status(500).json({ message: "Failed to create answer" });
  }
}
export async function deleteAnswer(req, res) {
  try {
    const { id } = req.params;
    const r = await pool.query("DELETE FROM answers WHERE id=$1 RETURNING id", [id]);
    if (r.rows.length === 0) return res.status(404).json({ message: "Answer not found" });
    return res.json({ message: "Answer deleted" });
  } catch (err) {
    console.error("deleteAnswer:", err);
    return res.status(500).json({ message: "Failed to delete answer" });
  }
}
