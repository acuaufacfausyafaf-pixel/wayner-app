const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../../frontend')));

const db = new sqlite3.Database(path.join(__dirname, '../data/wayner.db'));

// Auth
app.post('/api/auth/login', (req,res) => {
  const {username,password} = req.body;
  db.get("SELECT * FROM users WHERE username=? AND password=?", [username,password], (err,row)=>{
    if(err) return res.status(500).json({error:err.message});
    if(!row) return res.status(401).json({error:"Invalid"});
    res.json({id:row.id, username:row.username, role:row.role});
  });
});

// Jobs
app.post('/api/jobs', (req,res)=>{
  const {user_id,date,hours} = req.body;
  db.run("INSERT INTO jobs (user_id,date,hours) VALUES (?,?,?)",
    [user_id,date,hours], function(err){
      if(err) return res.status(500).json({error:err.message});
      res.json({id:this.lastID});
    });
});

app.get('/api/jobs', (req,res)=>{
  db.all("SELECT * FROM jobs", [], (err,rows)=>{
    if(err) return res.status(500).json({error:err.message});
    res.json(rows);
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=> console.log("Server running on "+PORT));
