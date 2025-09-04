// Create PostgreSQL Connection Pool here !
import pkg from "pg";
const { Pool } = pkg;

const connectionString = "postgresql://postgres:postgres3@localhost:5432/quora_db";

const pool = new Pool({
  connectionString,
});

pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected PostgreSQL error", err);
  process.exit(-1);
});

export default pool;
