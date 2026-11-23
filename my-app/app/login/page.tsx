import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Log in",
  description: "Sign in to Jobmatcher with email or Google.",
};

export default function LoginPage() {
  return (
    <main className="flex-1 px-4 py-12 sm:py-16">
      <Suspense fallback={<p className="text-center text-slate-500">Loading…</p>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}