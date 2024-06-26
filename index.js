const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "sql@serverTask#01",
  database: "taskforge",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to TaskForge MySQL database");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.get("/tasks", (req, res) => {
  db.query("SELECT * FROM tasks", (err, result) => {
    if (err) {
      console.error("Error when searching for tasks:", err);
      return;
    }
    res.json(result);
  });
});

const newTask = "teste1";
const comp = 0;

app.post("/tasks", (req, res) => {
  const { title, completed } = req.body;
  db.query(
    "INSERT INTO tasks (title, completed) VALUES (?, ?)",
    [title, completed],
    (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(201).json({ id: result.insertId, title, completed });
    }
  );
});

app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  db.query(
    "UPDATE tasks SET title = ?, completed = ? WHERE id = ?",
    [title, completed, id],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (results.affectedRows === 0) {
        return res.status(404).send("Task not found");
      }
      res.send("Task updated successfully");
    }
  );
});

app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM tasks WHERE id = ?", [id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      if (results.affectedRows === 0) {
        return res.status(404).send("Task not found");
      }
      res.send("Task deleted successfully");
    }
  });
});
