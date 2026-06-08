const express = require("express");
const router = express.Router();

const groq = require("../config/ai");
const { saveMessage, getChatHistory, clearHistory } = require("../models/Chat");
const verifyToken = require("../middleware/verifyToken");

// In-memory per user cache (har user ki alag memory)
const userMemories = new Map();

function getUserMemory(userId) {
  if (!userMemories.has(userId)) {
    userMemories.set(userId, [
      {
        role: "system",
        content: "You are Jarvis, a smart AI assistant. You speak in Roman Urdu and English mix. Be helpful and friendly."
      }
    ]);
  }
  return userMemories.get(userId);
}

function addUserMessage(userId, role, content) {
  const memory = getUserMemory(userId);
  memory.push({ role, content });
  
  // Keep last 15 messages (excluding system prompt)
  if (memory.length > 16) {
    memory.splice(1, 1);
  }
}

// POST /chat - Send message (Protected route)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;
    const username = req.user.username;
    
    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }
    
    // Save user message to database
    await saveMessage(userId, "user", message);
    
    // Add to in-memory
    addUserMessage(userId, "user", message);
    const memory = getUserMemory(userId);
    
    // Get AI response
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: memory,
    });
    
    const reply = response.choices[0].message.content;
    
    // Save assistant reply to database
    await saveMessage(userId, "assistant", reply);
    
    // Add to in-memory
    addUserMessage(userId, "assistant", reply);
    
    res.json({ 
      reply,
      user: username
    });
    
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /chat/history - Get user's chat history
router.get("/history", verifyToken, async (req, res) => {
  try {
    const history = await getChatHistory(req.user.id, 100);
    res.json({ 
      history, 
      user: req.user.username,
      count: history.length 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /chat/history - Clear user's history
router.delete("/history", verifyToken, async (req, res) => {
  try {
    const deleted = await clearHistory(req.user.id);
    // Clear in-memory cache for this user
    userMemories.delete(req.user.id);
    res.json({ 
      message: "History cleared", 
      deletedCount: deleted,
      user: req.user.username
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
