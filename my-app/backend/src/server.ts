import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { geminiRouter } from "./routes/gemini.js";
import { healthRouter } from "./routes/health.js";
import { itemsRouter } from "./routes/items.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 4000;

// Frontend on :3000 calls this API during dev
app.use(cors({ origin: true }));
app.use(express.json({ limit: "1mb" }));

app.use("/api/health", healthRouter);
app.use("/api/items", itemsRouter);
app.use("/api/gemini", geminiRouter);

app.listen(port, () => {
  console.log(`Jobmatcher API listening on http://localhost:${port}`);
});