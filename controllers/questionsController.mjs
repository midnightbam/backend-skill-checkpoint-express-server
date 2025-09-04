import pool from "../utils/db.mjs";

export async function getAllQuestions(req, res) {
  try {
    const result = await pool.query(
      "SELECT id, title, description, category, created_at FROM questions ORDER BY id DESC"
    );
    return res.json({ data: result.rows });
  } catch (err) {
    console.error("getAllQuestions:", err);
    return res.status(500).json({ message: "Failed to fetch questions" });
  }
}

export async function getQuestionById(req, res) {
  try {
    const { id } = req.params;
    const q = await pool.query("SELECT id, title, description, category, created_at FROM questions WHERE id=$1", [id]);
    if (q.rows.length === 0) return res.status(404).json({ message: "Question not found" });

    const answers = await pool.query(
      "SELECT id, question_id, content, created_at FROM answers WHERE question_id=$1 ORDER BY id DESC",
      [id]
    );

    return res.json({ question: q.rows[0], answers: answers.rows });
  } catch (err) {
    console.error("getQuestionById:", err);
    return res.status(500).json({ message: "Failed to fetch question" });
  }
}

export async function createQuestion(req, res) {
  try {
    const { title, description = "", category } = req.body;
    if (!title || !category) {
      return res.status(400).json({ message: "title and category are required" });
    }

    const r = await pool.query(
      "INSERT INTO questions (title, description, category) VALUES ($1,$2,$3) RETURNING id, title, description, category, created_at",
      [title, description, category]
    );

    return res.status(201).json({ data: r.rows[0] });
  } catch (err) {
    console.error("createQuestion:", err);
    return res.status(500).json({ message: "Failed to create question" });
  }
}

export async function updateQuestion(req, res) {
  try {
    const { id } = req.params;
    const { title, description, category } = req.body;

    const exists = await pool.query("SELECT id FROM questions WHERE id=$1", [id]);
    if (exists.rows.length === 0) return res.status(404).json({ message: "Question not found" });

    const r = await pool.query(
      `UPDATE questions
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           category = COALESCE($3, category)
       WHERE id=$4
       RETURNING id, title, description, category, created_at`,
      [title ?? null, description ?? null, category ?? null, id]
    );

    return res.json({ data: r.rows[0] });
  } catch (err) {
    console.error("updateQuestion:", err);
    return res.status(500).json({ message: "Failed to update question" });
  }
}

export async function deleteQuestion(req, res) {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM answers WHERE question_id=$1", [id]);

    const r = await pool.query("DELETE FROM questions WHERE id=$1 RETURNING id", [id]);
    if (r.rows.length === 0) return res.status(404).json({ message: "Question not found" });

    return res.json({ message: "Question and associated answers deleted" });
  } catch (err) {
    console.error("deleteQuestion:", err);
    return res.status(500).json({ message: "Failed to delete question" });
  }
}

export async function searchQuestions(req, res) {
  try {
    const { keyword = "", category = "" } = req.query;
    const r = await pool.query(
      `SELECT id, title, description, category, created_at FROM questions
       WHERE ($1 = '' OR title ILIKE '%' || $1 || '%')
         AND ($2 = '' OR category ILIKE '%' || $2 || '%')
       ORDER BY id DESC`,
      [keyword, category]
    );
    return res.json({ data: r.rows });
  } catch (err) {
    console.error("searchQuestions:", err);
    return res.status(500).json({ message: "Failed to search questions" });
  }
}

export async function dbCheck(req, res) {
  try {
    const r = await pool.query("SELECT NOW()");
    return res.json({ connected: true, time: r.rows[0].now });
  } catch (err) {
    console.error("dbCheck:", err);
    return res.status(500).json({ connected: false, error: err.message });
  }
}
