const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, '../data/wayner.db'));

db.serialize(()=>{
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, role TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS jobs (id INTEGER PRIMARY KEY, user_id INTEGER, date TEXT, hours INTEGER)");
  db.run("INSERT INTO users (username,password,role) VALUES ('shamshy','shamshy95','admin')");
});
