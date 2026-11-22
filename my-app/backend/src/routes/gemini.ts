import { GoogleGenerativeAI } from "@google/generative-ai";
import { Router } from "express";

export const geminiRouter = Router();

geminiRouter.post("/", async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(503).json({
      error: "Gemini not configured",
      hint: "Set GEMINI_API_KEY in .env",
    });
  }

  const { prompt, model } = req.body as { prompt?: string; model?: string };

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "prompt (string) is required" });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const generativeModel = genAI.getGenerativeModel({
      model: model ?? "gemini-2.0-flash",
    });

    const result = await generativeModel.generateContent(prompt);
    const text = result.response.text();

    res.json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gemini request failed";
    res.status(502).json({ error: message });
  }
});