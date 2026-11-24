/** Small dev hint for teammates — kept subtle on the marketing home. */
export function DevApiNote() {
  const routes = ["/api/health", "/api/items", "/api/gemini"];
  return (
    <div className="border-t border-white/5 bg-midnight-surface/80 py-8">
      <div className="mx-auto max-w-6xl px-4 text-center text-xs text-white/35">
        <p>
          API routes for testing:{" "}
          {routes.map((path) => (
            <code
              key={path}
              className="mx-1 rounded bg-white/5 px-1.5 py-0.5 text-white/50"
            >
              {path}
            </code>
          ))}
        </p>
        <p className="mt-2">
          Secrets in <code className="text-white/45">.env.local</code> (see{" "}
          <code className="text-white/45">.env.local.example</code>).
        </p>
      </div>
    </div>
  );
}