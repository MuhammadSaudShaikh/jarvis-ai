const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const path = require("path");
const app = express();

// Middleware
app.use(express.json());

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Import database
require("./config/db");

// Routes
const chatRoute = require("./routes/chat");
const authRoute = require("./routes/auth");

// API routes
app.use("/chat", chatRoute);
app.use("/auth", authRoute);

// API home route
app.get("/api", (req, res) => {
  res.json({ 
    status: "Jarvis is running",
    version: "2.0.0",
    database: "SQLite",
    ai: "Groq (LLaMA 3.3 70B)",
    auth: "JWT Enabled"
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Catch-all route for frontend (SPA support)
// Express 5.x compatible way
app.get(/.*/, (req, res) => {
  // Skip API routes that were already handled
  if (req.path.startsWith('/api') || 
      req.path.startsWith('/chat') || 
      req.path.startsWith('/auth') ||
      req.path === '/health') {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Jarvis server running on http://localhost:${PORT}`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`📡 API Base: http://localhost:${PORT}/api`);
  console.log(`🔐 Auth: http://localhost:${PORT}/auth`);
  console.log(`💬 Chat: http://localhost:${PORT}/chat`);
});

