const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

// ✅ Load API key from .env
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// 🔹 Chat route
router.post("/chat", async (req, res) => {
  const { message } = req.body;
  console.log("user prompt:", message);

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", // ✅ FIXED
    });

    const results = await model.generateContent(message);
    const reply = results.response.text();

    console.log("bot reply:", reply);
    res.json({ reply });
  } catch (error) {
    console.error("Error generating reply:", error);
    res.status(500).json({ error: "Failed to generate reply" });
  }
});

// 🔹 Generate Questions route
router.post("/generate-questions", async (req, res) => {
  const { techstack, qty, difficulty } = req.body;

  if (!qty) {
    return res.status(400).json({ error: "Quantity of questions is required" });
  }

  const actualDifficulty = difficulty || "random";

  const prompt = `Generate ${qty} interview questions (with answers) for topic: ${techstack} in ${actualDifficulty} level difficulty.`;

  console.log("Prompt:", prompt);

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", // ✅ FIXED HERE ALSO
    });

    const results = await model.generateContent(prompt);
    const generatedText = results.response.text();

    console.log("Generated Questions:", generatedText);

    res.json({ questions: generatedText });
  } catch (error) {
    console.error("Error generating questions:", error);
    res.status(500).json({ error: "Failed to generate questions" });
  }
});

module.exports = router;
