const dotenv = require("dotenv")
dotenv.config();

const express = require("express");
const Groq = require("groq-sdk");
const PORT = 3000;

const app = express();


// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ❗ Handle invalid JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON in request body" });
  }
  next();
});

// ✅ Groq setup
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


app.get("/", (req, res )=>{
  res.send("MY second route")
})

// 🧪 Test route
app.get("/second", (req, res) => {
  res.send("Jarvis AI (FREE) Running 🤖");
});



// 🤖 AI route
app.post("/ask", async (req, res) => {
  try {
    const userMessage = req.body?.message;

    // ❗ Validation
    if (!userMessage) {
      return res.status(400).json({
        error: "message is required in request body",
      });
    }

    // 🔥 AI Call
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // FREE model
      messages: [
        {
          role: "system",
          content: "You are Jarvis, a smart AI assistant.",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const reply =
      response?.choices?.[0]?.message?.content ||
      "Sorry, I could not generate a response.";

    return res.json({ reply });
  } catch (error) {
    console.error("AI Error:", error.message);

    return res.status(500).json({
      error: error.message || "Error talking to AI",
    });
  }
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`Server running `);
});