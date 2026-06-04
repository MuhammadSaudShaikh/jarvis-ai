const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

app.use(express.json());

// routes
const chatRoute = require("./routes/chat");

app.use("/chat", chatRoute);

// home
app.get("/", (req, res) => {
  res.json({ status: "Jarvis is running" });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
