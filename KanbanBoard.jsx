import React, { useState, useEffect } from "react";
import "./KanbanBoard.css";
" use client"
const COLUMNS = [
  { id: "saved", title: "Saved" },
  { id: "applied", title: "Applied" },
  { id: "interview", title: "Interview" },
  { id: "offer", title: "Offer" },
  { id: "rejected", title: "Rejected" },
];

const INITIAL_JOBS = [
  { id: "job-1", company: "LINEAR", role: "Senior Product Designer", match: 84, status: "saved", note: "Portfolio review requested", appliedAt: null },
  { id: "job-2", company: "VERCEL", role: "Design Engineer", match: 79, status: "saved", note: "Next.js & Tailwind focus", appliedAt: null },
  { id: "job-3", company: "FIGMA", role: "Product Designer, Design Systems", match: 91, status: "saved", note: "High Priority", appliedAt: null },
  { id: "job-4", company: "STRIPE", role: "Frontend Architect", match: 94, status: "applied", note: "Sent via referral", appliedAt: Date.now() - 8 * 86400000 },
];

export default function KanbanBoard() {
  const [jobs, setJobs] = useState(() => {
    const saved = localStorage.getItem("jobmatcher_kanban_react");
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });
  const [search, setSearch] = useState("");
  const [dragId, setDragId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [match, setMatch] = useState(85);
  const [status, setStatus] = useState("saved");
  const [note, setNote] = useState("");

  useEffect(() => {
    localStorage.setItem("jobmatcher_kanban_react", JSON.stringify(jobs));
  }, [jobs]);

  const handleDrop = (targetStatus) => {
    if (!dragId) return;
    setJobs((prev) =>
      prev.map((j) =>
        j.id === dragId
          ? { ...j, status: targetStatus, appliedAt: targetStatus === "applied" && !j.appliedAt ? Date.now() : j.appliedAt }
          : j
      )
    );
    setDragId(null);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;
    const newJob = {
      id: "job-" + Date.now(),
      company: company.trim().toUpperCase(),
      role: role.trim(),
      match: Number(match) || 85,
      status,
      note: note.trim(),
      appliedAt: status === "applied" ? Date.now() : null,
    };
    setJobs((prev) => [newJob, ...prev]);
    setCompany(""); setRole(""); setMatch(85); setStatus("saved"); setNote("");
    setModalOpen(false);
  };

  const handleDelete = (id) => setJobs((prev) => prev.filter((j) => j.id !== id));

  const isOverdue = (j) => j.status === "applied" && j.appliedAt && Date.now() - j.appliedAt >= 7 * 86400000;

  const filtered = jobs.filter(
    (j) => j.company.toLowerCase().includes(search.toLowerCase()) || j.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="kb-page">
      <header className="kb-header">
        <div>
          <span className="kb-badge">● PIPELINE TRACKER</span>
          <h1 className="kb-title">Application Pipeline Tracker</h1>
        </div>
        <div className="kb-controls">
          <input className="kb-search" placeholder="Filter by company or role..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="kb-btn-primary" onClick={() => setModalOpen(true)}>+ Add Job</button>
        </div>
      </header>

      <div className="kb-board">
        {COLUMNS.map((col) => {
          const colJobs = filtered.filter((j) => j.status === col.id);
          return (
            <div key={col.id} className="kb-column" onDragOver={(e) => e.preventDefault()} onDrop={() => handleDrop(col.id)}>
              <div className="kb-col-header">
                <span className="kb-col-title">{col.title.toUpperCase()}</span>
                <span className="kb-counter">{colJobs.length}</span>
              </div>
              <div className="kb-card-list">
                {colJobs.map((job) => (
                  <div key={job.id} className={`kb-card ${isOverdue(job) ? "overdue" : ""}`} draggable onDragStart={() => setDragId(job.id)}>
                    <div className="kb-card-top">
                      <span className="kb-company">{job.company}</span>
                      <div className="kb-card-right">
                        <span className="kb-match">{job.match}%</span>
                        <button className="kb-del-btn" onClick={() => handleDelete(job.id)}>×</button>
                      </div>
                    </div>
                    <h3 className="kb-role">{job.role}</h3>
                    {job.note && <p className="kb-note">{job.note}</p>}
                    {isOverdue(job) && <div className="kb-alert">⏰ 7+ days in Applied — Send follow-up!</div>}
                    <div className="kb-card-footer">
                      <button className="kb-btn-sec" onClick={() => alert(`Cover Letter for ${job.company}`)}>Cover Letter</button>
                      <button className="kb-btn-ai" onClick={() => alert(`Prep AI for ${job.role}`)}>Prep AI →</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {modalOpen && (
        <div className="kb-modal-bg" onClick={() => setModalOpen(false)}>
          <div className="kb-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Job Application</h2>
            <form className="kb-form" onSubmit={handleAdd}>
              <input className="kb-input" placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} required />
              <input className="kb-input" placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} required />
              <input className="kb-input" type="number" min="1" max="100" value={match} onChange={(e) => setMatch(e.target.value)} />
              <select className="kb-input" value={status} onChange={(e) => setStatus(e.target.value)}>
                {COLUMNS.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
              <input className="kb-input" placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
              <div className="kb-modal-actions">
                <button type="button" className="kb-btn-cancel" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="kb-btn-primary">Save Job</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
