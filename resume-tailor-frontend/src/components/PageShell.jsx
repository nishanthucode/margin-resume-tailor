export default function PageShell({ eyebrow, title, description, folio, children }) {
  return (
    <article className="w-full max-w-4xl mx-auto">
      <header className="paper-card mb-6">
        <div className="mb-2">
          {eyebrow && (
            <p className="font-mono text-xs uppercase tracking-wider text-proof-red mb-2">
              {eyebrow}
            </p>
          )}
          <h1 className="font-display text-2xl md:text-3xl lg:text-4xl leading-tight text-ink">
            {title}
          </h1>
          {description && (
            <p className="mt-3 text-ink/70 text-sm md:text-base max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </header>

      <main className="mb-8">{children}</main>

      {folio && (
        <footer className="mt-6 text-ink/40 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span>Margin — Recruiter Studio</span>
            <span>{folio}</span>
          </div>
        </footer>
      )}
    </article>
  );
}
