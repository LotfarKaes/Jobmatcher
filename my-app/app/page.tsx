export default function HomePage() {
  return (
    <main className="flex-1">
      <section
        id="home"
        className="mx-auto max-w-5xl px-4 py-16 sm:py-24"
        aria-labelledby="hero-heading"
      >
        <p className="text-sm font-medium uppercase tracking-wide text-brand">
          Job search, simplified
        </p>
        <h1
          id="hero-heading"
          className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl"
        >
          Jobmatcher
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
          This project helps job seekers save time and stay organized: AI finds
          the best-matching jobs for your CV and tracks every application in one
          visual dashboard—from applying to getting hired.
        </p>
        <article className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-slate-900">Team</h2>
          <ul className="mt-4 grid gap-2 text-slate-700 sm:grid-cols-2">
            {[
              "Lotfar Kaes",
              "Gustav Jeppsson",
              "Andreas Rimheden",
              "Anastasiya Lakhmakova",
              "Marina Silakova",
            ].map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </article>
        <ApiHints />
      </section>
    </main>
  );
}

/** Pages and API share the same Next.js app — one `npm run dev`. */
function ApiHints() {
  const routes = ["/api/health", "/api/items", "/api/gemini"];
  return (
    <div className="mt-8 text-sm text-slate-500">
      <p>
        API routes (Postman or browser):{" "}
        {routes.map((path) => (
          <code
            key={path}
            className="mr-2 rounded bg-slate-100 px-1.5 py-0.5 text-slate-700"
          >
            {path}
          </code>
        ))}
      </p>
      <p className="mt-2">
        Secrets go in <code className="text-slate-600">.env.local</code> (see{" "}
        <code className="text-slate-600">.env.local.example</code>).
      </p>
    </div>
  );
}