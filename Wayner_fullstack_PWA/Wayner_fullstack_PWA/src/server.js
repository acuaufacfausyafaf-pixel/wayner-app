// server/src/server.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pkg from "pg";

const { Client } = pkg;
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
client.connect();

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const result = await client.query(
    "SELECT * FROM users WHERE username=$1 AND password=$2",
    [username, password]
  );

  if (result.rows.length > 0) {
    res.json({ success: true, role: result.rows[0].role });
  } else {
    res.json({ success: false, message: "Invalid credentials" });
  }
});

app.post("/report", async (req, res) => {
  const { username, content } = req.body;
  const user = await client.query("SELECT * FROM users WHERE username=$1", [username]);

  if (user.rows.length === 0) {
    return res.json({ success: false, message: "User not found" });
  }

  await client.query("INSERT INTO reports (user_id, content) VALUES ($1, $2)", [
    user.rows[0].id,
    content,
  ]);

  res.json({ success: true, message: "Report saved" });
});

app.get("/reports", async (req, res) => {
  const result = await client.query(`
    SELECT reports.id, users.username, reports.content, reports.created_at
    FROM reports
    JOIN users ON reports.user_id = users.id
    ORDER BY reports.created_at DESC
  `);
  res.json(result.rows);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
