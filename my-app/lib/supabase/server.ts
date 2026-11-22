import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseConfig } from "./env";

/** Supabase client with the visitor's auth session (login / register). */
export async function createClient() {
  const cookieStore = await cookies();
  const { url, key, configured } = getSupabaseConfig();

  if (!configured) {
    throw new Error("Supabase is not configured in environment variables.");
  }

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from Server Component where cookies cannot be set.
        }
      },
    },
  });
}