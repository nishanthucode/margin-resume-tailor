import { Navigate, Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import PageShell from "../components/PageShell";
import { useApp } from "../context/AppContext";

function WaxSeal({ score }) {
  const tone =
    score >= 70 ? "proof-green" : score >= 40 ? "proof-gold" : "proof-red";
  const strokeColor =
    score >= 70 ? "#4C7A63" : score >= 40 ? "#C9A227" : "#B23A2F";

  return (
    <div className="relative w-32 h-32 shrink-0 -rotate-6 select-none">
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <circle
          cx="64" cy="64" r="58"
          fill="none" stroke={strokeColor} strokeWidth="2.5"
          strokeDasharray="3 5"
        />
        <circle
          cx="64" cy="64" r="48"
          fill="none" stroke={strokeColor} strokeWidth="1"
        />
        <text
          x="64" y="58" textAnchor="middle"
          className="font-mono"
          fontSize="26" fill={strokeColor} fontWeight="600"
        >
          {score}%
        </text>
        <text
          x="64" y="76" textAnchor="middle"
          className="font-mono uppercase"
          fontSize="7.5" fill={strokeColor} letterSpacing="1.5"
        >
          match score
        </text>
      </svg>
    </div>
  );
}

export default function Analysis() {
  const { analysis, jdParsed } = useApp();

  if (!analysis || !jdParsed) {
    return <Navigate to="/" replace />;
  }

  const { matchScore, matches, gaps } = analysis;

  return (
    <PageShell
      eyebrow="Step II"
      title="Marked up against the posting"
      description="Requirements from the job description, annotated the way an editor would mark a draft — a check where your resume already covers it, a circle where it doesn't yet."
      folio="fol. 02"
    >
      <div className="flex flex-col-reverse md:flex-row gap-8 md:gap-12">
        <div className="flex-1 min-w-0">
          <div className="space-y-2.5">
            {matches.map((m) => (
              <div key={m} className="flex items-center gap-3 group">
                <span className="w-6 h-6 rounded-full bg-proof-green/10 flex items-center justify-center shrink-0">
                  <Check size={13} className="text-proof-green" strokeWidth={2.5} />
                </span>
                <span className="text-ink underline decoration-proof-green/40 decoration-2 underline-offset-4">
                  {m}
                </span>
                <span className="text-[11px] font-mono text-proof-green/70 ml-auto">
                  covered
                </span>
              </div>
            ))}
            {gaps.map((g) => (
              <div key={g} className="flex items-center gap-3 group">
                <span className="w-6 h-6 rounded-full border-2 border-proof-red/60 shrink-0" />
                <span className="text-ink/70">{g}</span>
                <span className="text-[11px] font-mono text-proof-red/70 ml-auto">
                  gap
                </span>
              </div>
            ))}
          </div>

          {gaps.length === 0 && (
            <p className="text-sm text-ink/50 italic mt-2">
              No gaps found against the parsed requirements — strong alignment.
            </p>
          )}
        </div>

        <div className="flex md:flex-col items-center md:items-end gap-4 md:w-40 shrink-0">
          <WaxSeal score={matchScore} />
          <div className="text-right md:text-right text-xs font-mono text-ink/50 space-y-0.5">
            <p>{matches.length} matched</p>
            <p>{gaps.length} gaps</p>
          </div>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-ink/10 flex items-center justify-between">
        <p className="text-xs text-ink/40 max-w-sm">
          Next, generate resume bullets rewritten to speak directly to the
          language this job description uses.
        </p>
        <Link
          to="/tailor"
          className="inline-flex items-center gap-2 bg-ink text-paper px-5 py-3 rounded-sm font-medium text-sm hover:bg-proof-green transition-colors shrink-0"
        >
          Tailor my bullets
          <ArrowRight size={16} />
        </Link>
      </div>
    </PageShell>
  );
}
