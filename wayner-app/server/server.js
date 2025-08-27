const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// DB setup
const db = new sqlite3.Database("wayner.db", (err) => {
  if (err) {
    console.error("DB error:", err.message);
  } else {
    console.log("Connected to SQLite DB");
  }
});

// Reports API
app.get("/reports", (req, res) => {
  db.all("SELECT * FROM reports", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.post("/reports", (req, res) => {
  const { user, report } = req.body;
  db.run("INSERT INTO reports(user, report) VALUES(?, ?)", [user, report], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: this.lastID });
    }
  });
});

// Admin login (fixed login/pass)
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "Rasul85" && password === "Rasul85") {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
