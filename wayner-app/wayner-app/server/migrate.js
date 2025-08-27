const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("wayner.db");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS reports(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user TEXT,
    report TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
});

db.close();
