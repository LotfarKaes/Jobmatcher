/** Read Supabase URL + anon key (supports SUPABASE_* or NEXT_PUBLIC_*). */
export function getSupabaseConfig() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    process.env.SUPABASE_URL ??
    "";
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    "";

  return {
    url,
    key,
    configured: url.length > 0 && key.length > 0,
  };
}