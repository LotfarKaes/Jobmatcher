import type { Metadata } from "next";
import { RegisterForm } from "@/components/RegisterForm";

export const metadata: Metadata = {
  title: "Register",
  description: "Create your Jobmatcher account with email or Google.",
};

export default function RegisterPage() {
  return (
    <main className="flex-1 px-4 py-12 sm:py-16">
      <RegisterForm />
    </main>
  );
}