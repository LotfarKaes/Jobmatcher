import { Router } from "express";
import { getSupabase } from "../services/supabase.js";

export const itemsRouter = Router();

/** Example REST surface for tracked applications (table: job_applications). */
itemsRouter.get("/", async (_req, res) => {
  const supabase = getSupabase();

  if (!supabase) {
    return res.status(503).json({
      error: "Supabase not configured",
      hint: "Set SUPABASE_URL and SUPABASE_ANON_KEY in .env",
    });
  }

  const { data, error } = await supabase
    .from("job_applications")
    .select("id, title, company, status, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ items: data ?? [] });
});

itemsRouter.post("/", async (req, res) => {
  const supabase = getSupabase();

  if (!supabase) {
    return res.status(503).json({ error: "Supabase not configured" });
  }

  const { title, company, status } = req.body as {
    title?: string;
    company?: string;
    status?: string;
  };

  if (!title || !company) {
    return res.status(400).json({ error: "title and company are required" });
  }

  const { data, error } = await supabase
    .from("job_applications")
    .insert({ title, company, status: status ?? "applied" })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ item: data });
});