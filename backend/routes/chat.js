const express = require("express");
const router = express.Router();

const groq = require("../config/ai");
const { getMemory, addMessage } = require("../memory/chatMemory");

// CHAT API
router.post("/", async (req, res) => {
  try {
    const { message, password } = req.body;

    if (password !== process.env.APP_PASSWORD) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    addMessage({ role: "user", content: message });

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: getMemory(),
    });

    const reply = response.choices[0].message.content;

    addMessage({ role: "assistant", content: reply });

    res.json({ reply });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
