import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Jobmatcher — AI job matching & application tracker",
    template: "%s | Jobmatcher",
  },
  description:
    "Save time as a job seeker: AI finds the best-matching roles for your CV and tracks every application in one visual dashboard.",
  openGraph: {
    title: "Jobmatcher",
    description:
      "AI-powered job matching and application tracking in one dashboard.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        {children}
        <footer className="border-t border-slate-200 bg-white py-8 mt-auto">
          <SiteFooter />
        </footer>
      </body>
    </html>
  );
}

function SiteFooter() {
  return (
    <div className="mx-auto max-w-5xl px-4 text-center text-sm text-slate-600">
      <p>© {new Date().getFullYear()} Jobmatcher. Built for organized job search.</p>
    </div>
  );
}