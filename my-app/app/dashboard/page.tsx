import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardApp } from "@/components/dashboard/DashboardApp";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Jobmatcher analytical command hub — track jobs, matches, and interviews.",
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

  const userLabel =
    (user.user_metadata?.full_name as string | undefined)?.trim() ||
    user.email ||
    "Signed in";

  return (
    <main className="flex-1">
      <DashboardApp userLabel={userLabel} />
    </main>
  );
}