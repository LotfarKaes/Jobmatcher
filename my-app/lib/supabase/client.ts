import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "./env";

export function createClient(): SupabaseClient {
  const { url, key, configured } = getSupabaseConfig();

  if (!configured) {
    throw new Error(
      "Supabase is not configured. Add SUPABASE_URL and SUPABASE_ANON_KEY to my-app/.env.local (then restart npm run dev).",
    );
  }

  return createBrowserClient(url, key);
}

/** Use in the navbar when env might be missing — avoids a hard crash on load. */
export function createClientIfConfigured(): SupabaseClient | null {
  const { url, key, configured } = getSupabaseConfig();
  if (!configured) {
    return null;
  }
  return createBrowserClient(url, key);
}