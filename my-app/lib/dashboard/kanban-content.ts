/** Demo Kanban data — replace with /api/items + Supabase later. */

export type KanbanStageId = "saved" | "applied" | "interview" | "offer" | "rejected";

export type KanbanBadge = {
  label: string;
  tone: "accent" | "brand" | "warn" | "muted";
};

export type KanbanCardData = {
  id: string;
  company: string;
  title: string;
  matchPercent?: number;
  description?: string;
  badges?: KanbanBadge[];
  footer?: string;
  actionLink?: string;
  progress?: { label: string; percent: number };
  interviewEvent?: { title: string; when: string };
  offerLine?: string;
  deadline?: string;
  noteWarning?: string;
  dimmed?: boolean;
  strikethrough?: boolean;
  /** Interview column highlight + drawer label */
  featured?: boolean;
  drawerLabel?: string;
};

export type KanbanColumnConfig = {
  id: KanbanStageId;
  title: string;
  dot: "white" | "accent" | "muted";
  targetStage?: boolean;
};

export const KANBAN_COLUMNS: KanbanColumnConfig[] = [
  { id: "saved", title: "Saved", dot: "white" },
  { id: "applied", title: "Applied", dot: "white" },
  { id: "interview", title: "Interview", dot: "accent", targetStage: true },
  { id: "offer", title: "Offer", dot: "accent" },
  { id: "rejected", title: "Rejected", dot: "muted" },
];

export const KANBAN_CARDS: Record<KanbanStageId, KanbanCardData[]> = {
  saved: [
    {
      id: "s1",
      company: "LINEAR",
      title: "Staff Product Designer",
      matchPercent: 84,
      description: "Design systems, craft-led product work.",
      footer: "Saved 2d ago",
    },
    {
      id: "s2",
      company: "VERCEL",
      title: "Senior Product Engineer",
      matchPercent: 91,
      description: "Next.js platform, developer experience.",
      footer: "Vector matched 8h ago",
      actionLink: "Compare",
    },
    {
      id: "s3",
      company: "STRIPE",
      title: "Product Designer, Billing",
      matchPercent: 85,
      description: "FinTech, complex workflows.",
      footer: "Saved 5d ago",
    },
  ],
  applied: [
    {
      id: "a1",
      company: "NORTHWIND",
      title: "Frontend Developer",
      matchPercent: 94,
      badges: [{ label: "High priority", tone: "accent" }],
      footer: "Applied yesterday",
    },
    {
      id: "a2",
      company: "BLUE HARBOR",
      title: "Full-Stack Engineer",
      matchPercent: 88,
      description: "React, APIs, Supabase.",
      footer: "Applied 3d ago",
      actionLink: "Send ping",
    },
    {
      id: "a3",
      company: "FIGMA",
      title: "Design Advocate",
      matchPercent: 79,
      footer: "Applied 1w ago",
    },
    {
      id: "a4",
      company: "LAXICON",
      title: "Junior UX Developer",
      matchPercent: 88,
      noteWarning: "Need to update portfolio",
      footer: "Applied 4d ago",
    },
  ],
  interview: [
    {
      id: "i1",
      company: "NOTION",
      title: "Senior Product Designer",
      matchPercent: 92,
      badges: [{ label: "Prep active", tone: "brand" }],
      progress: { label: "Interview readiness", percent: 85 },
      interviewEvent: {
        title: "Round 2: Technical & case study",
        when: "Tomorrow, 2:00 PM CET",
      },
      featured: true,
      drawerLabel: "Drawer open",
    },
    {
      id: "i2",
      company: "SPOTIFY",
      title: "UX Engineer",
      matchPercent: 86,
      footer: "Recruiter screen done",
    },
    {
      id: "i3",
      company: "SHOPIFY",
      title: "Product Designer",
      matchPercent: 81,
      interviewEvent: { title: "Hiring manager chat", when: "Friday, 10:00" },
    },
  ],
  offer: [
    {
      id: "o1",
      company: "ACME LABS",
      title: "Lead Frontend Engineer",
      matchPercent: 90,
      offerLine: "Offer received: €72k base + equity",
      deadline: "Deadline: 5 days",
    },
  ],
  rejected: [
    {
      id: "r1",
      company: "MEGA CORP",
      title: "Staff Engineer",
      matchPercent: 62,
      footer: "Closed 1w ago",
      dimmed: true,
      strikethrough: true,
    },
  ],
};