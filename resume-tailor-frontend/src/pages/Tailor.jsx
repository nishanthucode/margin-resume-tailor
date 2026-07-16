import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Copy, Check, Loader2, ArrowRight } from "lucide-react";
import PageShell from "../components/PageShell";
import { useApp } from "../context/AppContext";
import { generateTailoredBullets } from "../lib/api";

export default function Tailor() {
  const { resumeText, jdText, analysis, tailoredBullets, setTailoredBullets } = useApp();
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    if (!tailoredBullets && analysis) {
      setLoading(true);
      generateTailoredBullets(resumeText, jdText, analysis.gaps, analysis.matches)
        .then(setTailoredBullets)
        .finally(() => setLoading(false));
    }
  }, [analysis, tailoredBullets, resumeText, jdText, setTailoredBullets]);

  if (!analysis) return <Navigate to="/" replace />;

  const handleCopy = (bullet) => {
    navigator.clipboard?.writeText(bullet.tailored);
    setCopiedId(bullet.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <PageShell
      eyebrow="Step III"
      title="Rewritten in the posting's own language"
      description="Same experience, reworded to surface what this job description is actually asking for. Review each line before it goes on the resume."
      folio="fol. 03"
    >
      {loading && (
        <div className="flex items-center gap-2 text-ink/50 text-sm py-10 justify-center">
          <Loader2 size={16} className="animate-spin" />
          Rewriting your bullets…
        </div>
      )}

      {!loading && tailoredBullets && (
        <div className="space-y-5">
          {tailoredBullets.map((bullet) => (
            <div key={bullet.id} className="border border-ink/10 rounded-sm p-4 bg-white/30">
              <p className="text-xs font-mono text-ink/35 mb-2">original</p>
              <p className="text-sm text-ink/50 line-through decoration-proof-red/40 mb-3">
                {bullet.original}
              </p>
              <p className="text-xs font-mono text-proof-green/80 mb-2">tailored</p>
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm text-ink leading-relaxed">{bullet.tailored}</p>
                <button
                  onClick={() => handleCopy(bullet)}
                  className="shrink-0 mt-0.5 text-ink/40 hover:text-proof-green transition-colors"
                  aria-label="Copy tailored bullet"
                >
                  {copiedId === bullet.id ? <Check size={15} /> : <Copy size={15} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && tailoredBullets && tailoredBullets.length === 0 && (
        <p className="text-sm text-ink/50 italic">
          Add a longer resume on the Upload step to generate tailored bullets.
        </p>
      )}

      <div className="mt-10 pt-6 border-t border-ink/10 flex items-center justify-between">
        <p className="text-xs text-ink/40 max-w-sm">
          Save this version to the tracker to keep it alongside the job you're
          applying to.
        </p>
        <Link
          to="/tracker"
          className="inline-flex items-center gap-2 bg-ink text-paper px-5 py-3 rounded-sm font-medium text-sm hover:bg-proof-green transition-colors shrink-0"
        >
          Go to tracker
          <ArrowRight size={16} />
        </Link>
      </div>
    </PageShell>
  );
}
