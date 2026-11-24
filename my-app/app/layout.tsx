import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

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
      <body className={`${fontSans.variable} min-h-screen flex flex-col font-sans`}>
        <Navbar />
        {children}
        <footer className="mt-auto border-t border-white/10 bg-midnight-surface/90 py-10 backdrop-blur">
          <SiteFooter />
        </footer>
      </body>
    </html>
  );
}

function SiteFooter() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-center text-sm text-white/60 sm:flex-row sm:justify-between">
      <p className="font-semibold text-white">
        Job<span className="text-accent">matcher</span>
      </p>
      <p>© {new Date().getFullYear()} Built for organized job search — Laxicon team.</p>
    </div>
  );
}