import React, { useState } from "react";
import LandingPage from "./components/LandingPage";
import KanbanBoard from "./components/KanbanBoard";

export default function App() {
  const [page, setPage] = useState("home");

  if (page === "kanban") {
    return (
      <div>
        <div style={{ backgroundColor: "#161920", padding: "10px 24px", borderBottom: "1px solid #2c313d" }}>
          <button
            onClick={() => setPage("home")}
            style={{ background: "none", border: "none", color: "#10b981", cursor: "pointer", fontWeight: 600, fontSize: "14px" }}
          >
            ← Back to Home
          </button>
        </div>
        <KanbanBoard />
      </div>
    );
  }

  return <LandingPage onOpenKanban={() => setPage("kanban")} />;
}
