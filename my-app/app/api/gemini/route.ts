import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error: "Gemini not configured",
        hint: "Set GEMINI_API_KEY in .env.local",
      },
      { status: 503 },
    );
  }

  let body: { prompt?: string; model?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { prompt, model } = body;

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json(
      { error: "prompt (string) is required" },
      { status: 400 },
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const generativeModel = genAI.getGenerativeModel({
      model: model ?? "gemini-2.0-flash",
    });

    const result = await generativeModel.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gemini request failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}