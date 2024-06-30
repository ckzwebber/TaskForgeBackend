const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = 3030;

app.use(bodyParser.json());
app.use(cors());

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
      res.status(500).send("Server error");
      return;
    }
    res.json(result);
  });
});

app.post("/tasks", (req, res) => {
  const { title, completed } = req.body;
  db.query(
    "INSERT INTO tasks (title, completed) VALUES (?, ?)",
    [title, completed],
    (err, result) => {
      if (err) {
        console.error("Error creating task:", err);
        res.status(500).send("Server error");
        return;
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
        console.error(`Error updating task with ID ${id}:`, err);
        res.status(500).send("Server error");
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).send("Task not found");
        return;
      }
      res.send("Task updated successfully");
    }
  );
});

app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM tasks WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error(`Error deleting task with ID ${id}:`, err);
      res.status(500).send("Server error");
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).send("Task not found");
      return;
    }
    res.send("Task deleted successfully");
  });
});
