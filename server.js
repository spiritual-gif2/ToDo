const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

const TelegramBot = require('node-telegram-bot-api');

// Replace 'YOUR_BOT_API_TOKEN' with your Telegram bot token from BotFather
const token = '7622321751:AAFY9p2wr7TLji_NGH0V9BtaKova2xTnYCM';
const bot = new TelegramBot(token, { polling: true });


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


// Listen for "/start" command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  // Send a welcome message with an inline button that opens your To-Do app
  bot.sendMessage(chatId, 'Welcome! Manage your tasks:', {
    reply_markup: {
      inline_keyboard: [
        [
          { 
            text: 'Open To-Do App', 
            web_app: { 
              url: 'http://ec2-52-91-60-230.compute-1.amazonaws.com/' 
            }
          }
        ],
      ],
    },
  });
});



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
