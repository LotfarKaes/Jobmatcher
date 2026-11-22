import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./LogoutButton";

export async function NavAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex items-center gap-3 text-sm font-medium">
        <Link href="/login" className="text-slate-600 hover:text-brand">
          Log in
        </Link>
        <Link
          href="/register"
          className="rounded-lg bg-brand px-3 py-1.5 text-white hover:bg-brand-dark"
        >
          Register
        </Link>
      </div>
    );
  }

  const fullName =
    (user.user_metadata?.full_name as string | undefined) ?? user.email;

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="hidden max-w-[140px] truncate text-slate-600 sm:inline" title={user.email}>
        {fullName}
      </span>
      <LogoutButton />
    </div>
  );
}