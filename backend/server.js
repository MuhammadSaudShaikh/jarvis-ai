const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

// Middleware
app.use(express.json());

// Import database (auto-creates tables)
require("./config/db");

// Routes
const chatRoute = require("./routes/chat");
const authRoute = require("./routes/auth");

// API endpoints
app.use("/chat", chatRoute);
app.use("/auth", authRoute);

// Home route
app.get("/", (req, res) => {
  res.json({ 
    status: "Jarvis is running",
    version: "2.0.0",
    database: "SQLite",
    ai: "Groq (LLaMA 3.3 70B)",
    auth: "JWT Enabled",
    endpoints: {
      register: "POST /auth/register",
      login: "POST /auth/login",
      chat: "POST /chat (requires token)",
      history: "GET /chat/history (requires token)",
      clearHistory: "DELETE /chat/history (requires token)"
    }
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Jarvis server running on http://localhost:${PORT}`);
  console.log(`\n📡 Available Endpoints:`);
  console.log(`   POST   /auth/register  - Create new account`);
  console.log(`   POST   /auth/login     - Login to account`);
  console.log(`   POST   /chat           - Send message (Bearer token required)`);
  console.log(`   GET    /chat/history   - Get chat history (Bearer token required)`);
  console.log(`   DELETE /chat/history   - Clear history (Bearer token required)`);
  console.log(`   GET    /health         - Health check`);
  console.log(`\n✅ Server ready!\n`);
});
