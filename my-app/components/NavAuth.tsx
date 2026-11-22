"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { createClient, createClientIfConfigured } from "@/lib/supabase/client";

const guestLinks = (
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

/** Navbar auth links update right away after login/logout (no manual refresh). */
export function NavAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [configured] = useState(() => createClientIfConfigured() !== null);

  const syncUser = useCallback(async () => {
    const supabase = createClientIfConfigured();
    if (!supabase) {
      setUser(null);
      return;
    }
    const {
      data: { user: current },
    } = await supabase.auth.getUser();
    setUser(current);
  }, []);

  useEffect(() => {
    if (!configured) {
      return;
    }

    const supabase = createClientIfConfigured();
    if (!supabase) {
      return;
    }

    void syncUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
      },
    );

    const onAuthChanged = () => {
      void syncUser();
    };
    window.addEventListener("jobmatcher:auth-changed", onAuthChanged);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("jobmatcher:auth-changed", onAuthChanged);
    };
  }, [syncUser, pathname, configured]);

  async function handleLogout() {
    if (!configured) {
      return;
    }
    const supabase = createClient();
    await fetch("/api/auth/logout", { method: "POST" });
    await supabase.auth.signOut();
    setUser(null);
    window.dispatchEvent(new Event("jobmatcher:auth-changed"));
    router.push("/");
    router.refresh();
  }

  if (!configured) {
    return guestLinks;
  }

  if (!user) {
    return guestLinks;
  }

  const fullName =
    (user.user_metadata?.full_name as string | undefined) ?? user.email;

  return (
    <div className="flex items-center gap-3 text-sm">
      <span
        className="hidden max-w-[140px] truncate text-slate-600 sm:inline"
        title={user.email}
      >
        {fullName}
      </span>
      <button
        type="button"
        onClick={handleLogout}
        className="text-sm font-medium text-slate-600 hover:text-brand"
      >
        Log out
      </button>
    </div>
  );
}