import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, ClipboardPaste, ArrowRight, Loader2, X } from "lucide-react";
import PageShell from "../components/PageShell";
import { useApp } from "../context/AppContext";
import { parseResume, parseJD, runGapAnalysis } from "../lib/api";

export default function Upload() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const {
    resumeText, setResumeText,
    jdText, setJdText,
    setResumeParsed, setJdParsed, setAnalysis,
  } = useApp();

  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = (file) => {
    if (!file) return;
    setResumeFile(file);
    setResumeText("");
  };

  const clearFile = () => {
    setResumeFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const canAnalyze =
    (resumeFile || resumeText.trim().length > 20) && jdText.trim().length > 20;

  const handleAnalyze = async () => {
    setError("");
    if (!canAnalyze) {
      setError("Add your resume (text or file) and the job description to continue.");
      return;
    }
    setLoading(true);
    try {
      const [rp, jp] = await Promise.all([
        parseResume(resumeFile || resumeText),
        parseJD(jdText),
      ]);
      setResumeParsed(rp);
      setJdParsed(jp);
      if (rp.rawText) setResumeText(rp.rawText);
      const gap = await runGapAnalysis(rp, jp);
      setAnalysis(gap);
      navigate("/analysis");
    } catch (e) {
      setError(e.message || "Something went wrong while analyzing. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      eyebrow="Step I"
      title="Bring in your resume and the job posting"
      description="Paste text directly, or upload a .pdf, .docx, or .txt file. Everything below stays on this page until you run the analysis."
      folio="fol. 01"
    >
      <div className="grid md:grid-cols-2 gap-6">
        {/* Resume input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-ink/80">Your resume</label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-proof-green hover:text-ink transition-colors"
            >
              <UploadCloud size={14} strokeWidth={1.75} />
              Upload file
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.pdf,.docx"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>

          {resumeFile ? (
            <div className="w-full h-[calc(12*1.625rem+2rem)] rounded-sm border border-dashed border-proof-green/50 bg-white/30 flex flex-col items-center justify-center gap-3 text-center px-6">
              <UploadCloud size={22} className="text-proof-green" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium text-ink">{resumeFile.name}</p>
                <p className="text-xs text-ink/40 font-mono mt-0.5">
                  {(resumeFile.size / 1024).toFixed(0)} KB — parsed server-side on analyze
                </p>
              </div>
              <button
                type="button"
                onClick={clearFile}
                className="inline-flex items-center gap-1 text-xs text-ink/50 hover:text-proof-red transition-colors"
              >
                <X size={13} />
                Remove and paste text instead
              </button>
            </div>
          ) : (
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here…"
              rows={12}
              className="w-full resize-none rounded-sm border border-ink/15 bg-white/40 p-4 text-sm leading-relaxed text-ink placeholder:text-ink/30 focus:border-proof-green focus:ring-0 outline-none"
            />
          )}
        </div>

        {/* JD input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-ink/80">Job description</label>
            <span className="inline-flex items-center gap-1.5 text-xs text-ink/35">
              <ClipboardPaste size={14} strokeWidth={1.75} />
              Paste from posting
            </span>
          </div>
          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste the full job description here…"
            rows={12}
            className="w-full resize-none rounded-sm border border-ink/15 bg-white/40 p-4 text-sm leading-relaxed text-ink placeholder:text-ink/30 focus:border-proof-red focus:ring-0 outline-none"
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 text-sm text-proof-red font-medium">{error}</p>
      )}

      <div className="mt-8 flex items-center justify-between gap-6">
        <p className="text-xs text-ink/40 max-w-sm">
          Parsing, gap analysis, and bullet generation all run through the
          Express backend — LLM parsing, embeddings-based match scoring, and
          MongoDB-backed tracking.
        </p>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-ink text-paper px-5 py-3 rounded-sm font-medium text-sm hover:bg-proof-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Analyzing…
            </>
          ) : (
            <>
              Run gap analysis
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </PageShell>
  );
}
