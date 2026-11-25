/** Demo dashboard copy and menu labels — swap for API data later. */

export type DashboardNavId =
  | "dashboard"
  | "job-search"
  | "kanban"
  | "interview"
  | "cv"
  | "settings";

export type DashboardNavItem = {
  id: DashboardNavId;
  label: string;
  description: string;
};

export const DASHBOARD_NAV: DashboardNavItem[] = [
  {
    id: "dashboard",
    label: "Job search",
    description: "Search openings by role, company, or keyword",
  },
  {
    id: "job-search",
    label: "AI match",
    description: "Four roles ranked against your profile (demo data).",
  },
  {
    id: "kanban",
    label: "Kanban board",
    description: "Pipeline stats, export, and application board",
  },
  {
    id: "interview",
    label: "Interview prep",
    description: "Notes and upcoming sessions",
  },
  {
    id: "cv",
    label: "My CV",
    description: "Profiles and uploads",
  },
  {
    id: "settings",
    label: "Settings",
    description: "Account preferences",
  },
];

export const DASHBOARD_STATS = [
  {
    id: "pipeline",
    eyebrow: "Pipeline volume",
    label: "Total jobs saved",
    value: "12",
    badge: "Active watch",
    trend: "+4 added this week",
    trendUp: true,
    hint: "Jobs you bookmarked or started applying to",
  },
  {
    id: "match",
    eyebrow: "Match relevance",
    label: "Average match score",
    value: "82",
    valueSuffix: "/100",
    badge: "High tier",
    hint: "Top 10% of applicants in your tier (demo)",
    highlight: true,
  },
  {
    id: "funnel",
    eyebrow: "Funnel conversion",
    label: "Interviews booked",
    value: "3",
    badge: "2 upcoming this week",
    hint: "Next round: Thursday, 14:00",
  },
] as const;

export type DashboardJobMatch = {
  id: string;
  tabLabel: string;
  job: {
    company: string;
    unit: string;
    title: string;
    logoText: string;
    location: string;
    salary: string;
    indexedAgo: string;
    tags: string[];
    primaryTag?: string;
    jobId: string;
  };
  fit: {
    percent: number;
    ringLabel: string;
    fitBadge: string;
    headline: string;
    summary: string;
  };
};

/** Four saved roles — one tab each on the dashboard (demo until API). */
export const DASHBOARD_JOB_MATCHES: DashboardJobMatch[] = [
  {
    id: "match-1",
    tabLabel: "Northwind",
    job: {
      company: "NORTHWIND",
      unit: "Labs • Platform",
      title: "Senior Frontend Developer, Design Systems",
      logoText: "N/",
      location: "Stockholm (Hybrid / remote eligible)",
      salary: "€55,000 – €68,000 + benefits",
      indexedAgo: "Indexed 2 days ago",
      tags: ["Full-time", "React", "TypeScript", "Level: Senior"],
      primaryTag: "Full-time",
      jobId: "NW-FE-4421",
    },
    fit: {
      percent: 94,
      ringLabel: "Vector fit",
      fitBadge: "Very high fit",
      headline: "Top 5% candidate",
      summary:
        "Your parsed credentials rank above 95% of benchmark profiles for React, TypeScript, and component architecture.",
    },
  },
  {
    id: "match-2",
    tabLabel: "Blue Harbor",
    job: {
      company: "BLUE HARBOR",
      unit: "Engineering • Product",
      title: "Full-Stack Engineer, Billing & APIs",
      logoText: "B/",
      location: "Malmö (Hybrid)",
      salary: "€52,000 – €62,000",
      indexedAgo: "Indexed 3 days ago",
      tags: ["Full-time", "Next.js", "Supabase", "Level: Mid/Senior"],
      primaryTag: "Full-time",
      jobId: "BH-FS-8812",
    },
    fit: {
      percent: 91,
      ringLabel: "Vector fit",
      fitBadge: "Very high fit",
      headline: "Strong API overlap",
      summary:
        "CV signals align with API design, SSR patterns, and PostgreSQL workflows used in this squad.",
    },
  },
  {
    id: "match-3",
    tabLabel: "Laxicon",
    job: {
      company: "LAXICON",
      unit: "Studio • UX Dev",
      title: "Junior UX Developer, Motion & UI",
      logoText: "L/",
      location: "Remote (EU)",
      salary: "€38,000 – €45,000",
      indexedAgo: "Indexed 5 days ago",
      tags: ["Full-time", "Figma", "Tailwind", "Level: Junior"],
      primaryTag: "Full-time",
      jobId: "LX-UX-1209",
    },
    fit: {
      percent: 88,
      ringLabel: "Vector fit",
      fitBadge: "High fit",
      headline: "Portfolio-friendly match",
      summary:
        "Design tooling and front-end motion skills match the brief; minor gap in formal UX research methods.",
    },
  },
  {
    id: "match-4",
    tabLabel: "Stripe (demo)",
    job: {
      company: "STRIPE (DEMO)",
      unit: "Billing & Invoicing Unit",
      title: "Senior Product Designer, Billing & Invoicing",
      logoText: "S/",
      location: "San Francisco, CA (Hybrid / remote eligible)",
      salary: "$175,000 – $215,000 + equity",
      indexedAgo: "Indexed 3 days ago",
      tags: ["Full-time", "Design Systems", "FinTech", "Level: L5/Senior"],
      primaryTag: "Full-time",
      jobId: "STP-BLG-9842",
    },
    fit: {
      percent: 85,
      ringLabel: "Vector fit",
      fitBadge: "Very high fit",
      headline: "Top 5% candidate",
      summary:
        "Your parsed credentials outrank 95% of benchmarked candidates across structural design and fintech domain parameters.",
    },
  },
];

export const DASHBOARD_META = {
  suiteTitle: "Jobmatcher suite",
  telemetry: "Application telemetry",
  nodeId: "Node ID: #8849-JM",
  pageTitle: "Analytical command hub",
  pageSubtitle:
    "Real-time profile mapping against live job requirements (demo data for now).",
  parseSynced: "Auto-parse synced: 4m ago",
} as const;