export default function PageShell({ eyebrow, title, description, folio, children }) {
  return (
    <div className="paper-card w-full max-w-4xl mx-auto p-8 md:p-12 relative">
      <div className="mb-8">
        {eyebrow && (
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-proof-red mb-3">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-3xl md:text-4xl leading-tight text-ink">
          {title}
        </h1>
        {description && (
          <p className="mt-3 text-ink/60 text-[15px] max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {children}

      {folio && (
        <div className="mt-12 pt-4 border-t border-ink/10 flex justify-between items-center text-ink/30 font-mono text-[11px]">
          <span>Margin — Resume Tailoring Studio</span>
          <span>{folio}</span>
        </div>
      )}
    </div>
  );
}
