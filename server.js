import express from "express";
import cors from "cors";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Initialize Groq Client
const client = new Groq({
  apiKey: process.env.VITE_GROQ_API_KEY,
});

// ✅ Test server
console.log("Groq backend running on port 5000");

app.post("/api/groq", async (req, res) => {
  try {
    console.log("Body received from frontend:", req.body);

    const { topic, prompt } = req.body;

    if (!topic || !prompt) {
      return res.status(400).json({ error: "Missing topic or prompt" });
    }

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    });

    const content = completion.choices[0].message.content;
    return res.json({ content });
  } catch (err) {
    console.error("🔥 Backend Groq Error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});


app.listen(5000, () => {
  console.log("🚀 Groq backend server running on http://localhost:5000");
});
