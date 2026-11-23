import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // So the browser can auth with only SUPABASE_* in .env.local (no duplicate NEXT_PUBLIC_* required).
  env: {
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      process.env.SUPABASE_ANON_KEY ??
      "",
  },
};

export default nextConfig;