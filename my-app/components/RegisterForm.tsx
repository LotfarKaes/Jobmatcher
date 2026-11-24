"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoogleSignInButton } from "./GoogleSignInButton";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      fullName: String(form.get("fullName") ?? ""),
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
      confirmPassword: String(form.get("confirmPassword") ?? ""),
    };

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Registration failed");
      return;
    }

    setMessage(data.message ?? "Account created.");
    window.dispatchEvent(new Event("jobmatcher:auth-changed"));
    router.refresh();
    setTimeout(() => router.push("/dashboard"), 1500);
  }

  return (
    <div className="glass-panel mx-auto w-full max-w-md rounded-2xl p-8 shadow-card">
      <h1 className="text-2xl font-bold text-white">Create account</h1>
      <p className="mt-2 text-sm text-white/65">
        Register with email or use Google in one click.
      </p>

      <div className="mt-6 space-y-4">
        <GoogleSignInButton label="Sign up with Google" />

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-white/45">or email</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <Field label="Full name" name="fullName" type="text" autoComplete="name" required />
        <Field label="Email" name="email" type="email" autoComplete="email" required />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
        />
        <Field
          label="Confirm password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
        />

        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
        {message && (
          <p className="text-sm text-accent" role="status">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-midnight hover:bg-accent-bright disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Register"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-white/60">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-accent hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  name,
  type,
  autoComplete,
  required,
  minLength,
}: {
  label: string;
  name: string;
  type: string;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
}) {
  const id = name;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-white/80">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        className="mt-1 w-full rounded-lg border border-white/15 bg-midnight px-3 py-2 text-white shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      />
    </div>
  );
}