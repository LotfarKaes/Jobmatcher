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
    label: "Dashboard",
    description: "Overview stats and quick actions",
  },
  {
    id: "job-search",
    label: "Job search / AI match",
    description: "Ranked roles for your CV",
  },
  {
    id: "kanban",
    label: "Kanban board",
    description: "Applied → Interview → Offer",
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

export const DASHBOARD_META = {
  suiteTitle: "Jobmatcher suite",
  telemetry: "Application telemetry",
  nodeId: "Node ID: #8849-JM",
  pageTitle: "Analytical command hub",
  pageSubtitle:
    "Real-time profile mapping against live job requirements (demo data for now).",
  parseSynced: "Auto-parse synced: 4m ago",
} as const;