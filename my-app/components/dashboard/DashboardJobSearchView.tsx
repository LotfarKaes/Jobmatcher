/** Job search menu — search UI placeholder until listings API. */
export function DashboardJobSearchView() {
  return (
    <section className="max-w-2xl" aria-labelledby="job-search-heading">
      <h2 id="job-search-heading" className="text-2xl font-bold text-white">
        Find your next <span className="text-accent">role</span>
      </h2>
      <p className="mt-2 text-sm text-white/60">
        Search by title, company, or keyword. Results will load from your database in a later
        sprint.
      </p>
      <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
        <input
          type="search"
          name="q"
          placeholder="Role, company, keyword…"
          className="flex-1 rounded-xl border border-white/15 bg-midnight px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <button
          type="submit"
          className="rounded-xl bg-accent px-6 py-3 text-sm font-bold text-midnight transition hover:bg-accent-bright"
        >
          Search jobs
        </button>
      </form>
      <p className="mt-8 text-xs text-white/40">
        Tip: use <strong className="text-white/55">AI match</strong> in the sidebar for ranked
        roles against your CV.
      </p>
    </section>
  );
}