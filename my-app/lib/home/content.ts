export const TEAM_MEMBERS = [
  "Lotfar Kaes",
  "Gustav Jeppsson",
  "Andreas Rimheden",
  "Marina Silakova",
] as const;

export const FEATURES = [
  {
    title: "Smart CV matching",
    description:
      "Upload your resume and get roles ranked by fit score—focus only on jobs worth your time.",
    icon: "sparkles",
  },
  {
    title: "Application tracker",
    description:
      "Kanban-style board from Applied → Interview → Offer. Every step visible at a glance.",
    icon: "layout",
  },
  {
    title: "Skills gap signals",
    description:
      "See what employers want versus what you have—clear yellow highlights on missing skills.",
    icon: "chart",
  },
] as const;

export const STEPS = [
  {
    step: "01",
    title: "Upload your CV",
    description: "Drop a PDF or DOCX. We build your profile in seconds.",
  },
  {
    step: "02",
    title: "Review matches",
    description:
      "AI ranks open roles with fit scores, location, and skill overlap.",
  },
  {
    step: "03",
    title: "Track & apply",
    description:
      "Save favorites, move cards on your board, and land the offer.",
  },
] as const;

export const HERO_STATS = [
  { value: "94%", label: "Top match accuracy" },
  { value: "3×", label: "Faster applications" },
  { value: "1", label: "Unified dashboard" },
] as const;

export const FEATURED_JOBS = [
  {
    company: "Northwind Labs",
    role: "Frontend Developer",
    location: "Remote · EU",
    match: 94,
    tags: ["React", "TypeScript", "Tailwind"],
  },
  {
    company: "Blue Harbor",
    role: "Full-Stack Engineer",
    location: "Stockholm",
    match: 91,
    tags: ["Next.js", "Supabase", "API"],
  },
  {
    company: "Laxicon Studio",
    role: "Junior UX Developer",
    location: "Hybrid",
    match: 88,
    tags: ["Figma", "React", "Motion"],
  },
] as const;