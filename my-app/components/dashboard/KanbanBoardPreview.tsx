/** Demo kanban columns under pipeline stats. */
export function KanbanBoardPreview() {
  const columns = [
    { title: "Applied", count: 5, accent: "text-brand-light" },
    { title: "Interview", count: 3, accent: "text-accent" },
    { title: "Offer", count: 1, accent: "text-emerald-400" },
  ];

  return (
    <section aria-labelledby="kanban-preview-heading">
      <h2 id="kanban-preview-heading" className="text-lg font-bold text-white">
        Board <span className="text-accent">preview</span>
      </h2>
      <p className="mt-1 text-sm text-white/55">
        Drag cards between columns when connected to Supabase (demo counts).
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {columns.map((col) => (
          <li
            key={col.title}
            className="glass-panel rounded-2xl p-4"
          >
            <p className={`text-xs font-bold uppercase tracking-wide ${col.accent}`}>
              {col.title}
            </p>
            <p className="mt-2 text-3xl font-bold text-white">{col.count}</p>
            <p className="mt-2 text-xs text-white/45">applications</p>
          </li>
        ))}
      </ul>
    </section>
  );
}