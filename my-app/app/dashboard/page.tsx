import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your Jobmatcher application tracker dashboard.",
};

export default async function DashboardPage() {
  let user = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    redirect("/login");
  }

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex-1 px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Welcome to Jobmatcher dashboard
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-slate-600">
          This is your place to track job applications and stay organized. More
          features will appear here as your team builds them.
        </p>
      </div>
    </main>
  );
}