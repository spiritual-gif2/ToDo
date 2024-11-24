const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

const app = express();
const db = new sqlite3.Database("database.db");

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// API to get tasks
app.get("/api/tasks", (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API to add a task
app.post("/api/tasks", (req, res) => {
  const { title } = req.body;
  db.run("INSERT INTO tasks (title) VALUES (?)", [title], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// API to update a task
app.put("/api/tasks/:id", (req, res) => {
  const { completed } = req.body;
  db.run(
    "UPDATE tasks SET completed = ? WHERE id = ?",
    [completed, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.sendStatus(200);
    }
  );
});

// API to delete a task
app.delete("/api/tasks/:id", (req, res) => {
  db.run("DELETE FROM tasks WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.sendStatus(200);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
