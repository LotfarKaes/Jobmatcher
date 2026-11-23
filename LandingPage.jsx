"use client";
import React, { useState } from "react";
import "./LandingPage.css";

export default function LandingPage({ onOpenKanban }) {
  const [modalMode, setModalMode] = useState(null); // "login" | "signup" | null
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem(
      "jobmatcher_user",
      JSON.stringify({ email, name: fullName || email.split("@") })
    );
    setModalMode(null);
    if (onOpenKanban) onOpenKanban();
  };

  return (
    <div className="lp-page">
      {/* Navbar */}
      <header className="lp-navbar">
        <button className="lp-logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <span className="lp-dot"></span>
          Jobmatcher
        </button>

        <nav className="lp-links">
          <a href="#features">Features</a>
          <button className="lp-link-btn" onClick={onOpenKanban}>
            Kanban Demo
          </button>
        </nav>

        <div className="lp-actions">
          <button className="lp-btn-ghost" onClick={() => setModalMode("login")}>
            Log In
          </button>
          <button className="lp-btn-primary" onClick={() => setModalMode("signup")}>
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="lp-hero">
          <div>
            <span className="lp-badge">● AI-Powered Job Search for Sweden</span>
            <h1>Find your best role and track every application in one place.</h1>
            <p className="lp-subtitle">
              Upload your CV, see instant AI match scores for local Swedish jobs, and organize your entire hiring pipeline on a visual Kanban board.
            </p>

            <div className="lp-cta-row">
              <button className="lp-btn-primary lp-btn-lg" onClick={() => setModalMode("signup")}>
                Get Started Free →
              </button>
              <button className="lp-btn-outline lp-btn-lg" onClick={onOpenKanban}>
                Preview Kanban Board
              </button>
            </div>

            <div className="lp-stats">
              <div><strong>94%</strong><span>Avg. Match Accuracy</span></div>
              <div><strong>5 Stages</strong><span>Visual Pipeline</span></div>
              <div><strong>7-Day</strong><span>Smart Follow-Up Alerts</span></div>
            </div>
          </div>

          <div className="lp-preview">
            <div className="lp-preview-top">
              <span>LIVE AI MATCH PREVIEW</span>
              <span className="lp-score">94% Match</span>
            </div>
            <h3>Senior Product Designer</h3>
            <p className="lp-company">STRIPE · Stockholm / Hybrid</p>
            <ul className="lp-checklist">
              <li>✓ Matches Design Systems & UI Architecture</li>
              <li>✓ Added directly to Kanban "Applied" column</li>
              <li>✓ Auto-reminder set for 7 days</li>
            </ul>
            <div className="lp-steps">
              <span className="lp-step">Saved</span>
              <span className="lp-step active">Applied</span>
              <span className="lp-step">Interview</span>
              <span className="lp-step">Offer</span>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="lp-features" id="features">
          <span className="lp-badge">CORE WORKFLOW</span>
          <h2>Built for clarity from CV upload to job offer</h2>
          <div className="lp-grid">
            <article className="lp-card">
              <span className="lp-num">01</span>
              <h3>Smart CV Parser</h3>
              <p>Extract your key skills, experience, and tech stack automatically without filling out repetitive forms.</p>
            </article>
            <article className="lp-card">
              <span className="lp-num">02</span>
              <h3>AI Match Scoring</h3>
              <p>See exactly why a role fits your profile with percentage scores tailored for the Swedish job market.</p>
            </article>
            <article className="lp-card">
              <span className="lp-num">03</span>
              <h3>Kanban Pipeline Tracker</h3>
              <p>Drag and drop applications across Saved, Applied, Interview, Offer, and Rejected with smart follow-up alerts.</p>
            </article>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="lp-footer">
        <span>© 2026 Jobmatcher — Team Green Project</span>
        <button className="lp-link-btn" onClick={onOpenKanban}>Open Kanban Board →</button>
      </footer>

      {/* Auth Modal */}
      {modalMode && (
        <div className="lp-modal-bg" onClick={() => setModalMode(null)}>
          <div className="lp-modal" onClick={(e) => e.stopPropagation()}>
            <button className="lp-close" onClick={() => setModalMode(null)}>×</button>
            <div className="lp-tabs">
              <button
                className={`lp-tab ${modalMode === "login" ? "active" : ""}`}
                onClick={() => setModalMode("login")}
              >
                Log In
              </button>
              <button
                className={`lp-tab ${modalMode === "signup" ? "active" : ""}`}
                onClick={() => setModalMode("signup")}
              >
                Sign Up
              </button>
            </div>

            <h2>{modalMode === "signup" ? "Create your account" : "Welcome back"}</h2>
            <p className="lp-modal-desc">
              {modalMode === "signup"
                ? "Start organizing your Swedish job applications with AI."
                : "Enter your details to access your Jobmatcher dashboard."}
            </p>

            <form className="lp-form" onSubmit={handleSubmit}>
              {modalMode === "signup" && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              )}
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button type="submit" className="lp-btn-primary lp-btn-full">
                {modalMode === "signup" ? "Create Account & Open Board →" : "Log In to Workspace →"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
