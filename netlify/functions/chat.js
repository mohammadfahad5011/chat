const express = require("express");
const serverless = require("serverless-http");
require("dotenv").config();

const app = express();
app.use(express.json());

// Route to handle OpenAI API requests
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message content is required." });
  }

  try {
    const systemMessage = {
      role: "system",
      content: "You are NEO, the Neural Executive Officer of 300...",
    };
    const userMessage = { role: "user", content: message };
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [systemMessage, userMessage],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `OpenAI API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports.handler = serverless(app);
