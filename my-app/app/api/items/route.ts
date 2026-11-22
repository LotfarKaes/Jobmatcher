import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

/** List tracked applications (table: job_applications). */
export async function GET() {
  const supabase = getSupabase();

  if (!supabase) {
    return NextResponse.json(
      {
        error: "Supabase not configured",
        hint: "Set SUPABASE_URL and SUPABASE_ANON_KEY in .env.local",
      },
      { status: 503 },
    );
  }

  const { data, error } = await supabase
    .from("job_applications")
    .select("id, title, company, status, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ items: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = getSupabase();

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 },
    );
  }

  let body: { title?: string; company?: string; status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { title, company, status } = body;

  if (!title || !company) {
    return NextResponse.json(
      { error: "title and company are required" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("job_applications")
    .insert({ title, company, status: status ?? "applied" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ item: data }, { status: 201 });
}