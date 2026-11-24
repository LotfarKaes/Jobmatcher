"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { GoogleSignInButton } from "./GoogleSignInButton";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackError = searchParams.get("error");
  const [error, setError] = useState<string | null>(
    callbackError === "auth_callback_failed"
      ? "Google sign-in failed. Check Supabase Google provider settings."
      : null,
  );
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? ""),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Login failed");
      return;
    }

    window.dispatchEvent(new Event("jobmatcher:auth-changed"));
    router.refresh();
    router.push("/dashboard");
  }

  return (
    <div className="glass-panel mx-auto w-full max-w-md rounded-2xl p-8 shadow-card">
      <h1 className="text-2xl font-bold text-white">Log in</h1>
      <p className="mt-2 text-sm text-white/65">
        Email and password, or one click with Google.
      </p>

      <div className="mt-6 space-y-4">
        <GoogleSignInButton label="Log in with Google" />
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-white/45">or email</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white/80">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1 w-full rounded-lg border border-white/15 bg-midnight px-3 py-2 text-white shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-white/80">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-1 w-full rounded-lg border border-white/15 bg-midnight px-3 py-2 text-white shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-midnight hover:bg-accent-bright disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-white/60">
        No account yet?{" "}
        <Link href="/register" className="font-medium text-accent hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}