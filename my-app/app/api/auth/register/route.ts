import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const MIN_PASSWORD_LENGTH = 8;

export async function POST(request: Request) {
  let body: {
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const fullName = body.fullName?.trim();
  const email = body.email?.trim().toLowerCase();
  const password = body.password;
  const confirmPassword = body.confirmPassword;

  if (!fullName || fullName.length < 2) {
    return NextResponse.json(
      { error: "Full name is required (at least 2 characters)" },
      { status: 400 },
    );
  }

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }

  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
      { status: 400 },
    );
  }

  if (password !== confirmPassword) {
    return NextResponse.json(
      { error: "Password and confirm password do not match" },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(
    {
      user: data.user
        ? { id: data.user.id, email: data.user.email }
        : null,
      message:
        data.session ?
          "Account created. You are signed in."
        : "Account created. Check your email to confirm your address if confirmation is enabled.",
    },
    { status: 201 },
  );
}