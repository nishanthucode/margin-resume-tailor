import { useEffect, useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import PageShell from "../components/PageShell";
import { useApp } from "../context/AppContext";
import { listApplications, saveApplication, deleteApplication } from "../lib/api";

const STATUSES = ["Saved", "Applied", "Interviewing", "Offer", "Rejected"];

const STATUS_STYLE = {
  Saved: "text-ink/50 bg-ink/5",
  Applied: "text-proof-gold bg-proof-gold/10",
  Interviewing: "text-proof-green bg-proof-green/10",
  Offer: "text-proof-green bg-proof-green/20",
  Rejected: "text-proof-red bg-proof-red/10",
};

export default function Tracker() {
  const { jdParsed, analysis, tailoredBullets } = useApp();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRole, setNewRole] = useState("");
  const [newCompany, setNewCompany] = useState("");

  const refresh = () => listApplications().then((apps) => setApplications(apps));

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newRole.trim() || !newCompany.trim()) return;
    await saveApplication({
      role: newRole.trim(),
      company: newCompany.trim(),
      status: "Saved",
      matchScore: analysis?.matchScore ?? null,
      savedBullets: tailoredBullets ?? null,
      date: new Date().toISOString().slice(0, 10),
    });
    setNewRole("");
    setNewCompany("");
    refresh();
  };

  const handleSaveCurrent = async () => {
    if (!jdParsed) return;
    await saveApplication({
      role: "Role from current analysis",
      company: "Untitled company",
      status: "Saved",
      matchScore: analysis?.matchScore ?? null,
      savedBullets: tailoredBullets ?? null,
      date: new Date().toISOString().slice(0, 10),
    });
    refresh();
  };

  const handleStatusChange = async (app, status) => {
    await saveApplication({ ...app, status });
    refresh();
  };

  const handleDelete = async (id) => {
    await deleteApplication(id);
    refresh();
  };

  return (
    <PageShell
      eyebrow="Step IV"
      title="Every application, one ledger"
      description="Track status across everything you've tailored a resume for. Saved tailored versions travel with each row."
      folio="fol. 04"
    >
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          value={newCompany}
          onChange={(e) => setNewCompany(e.target.value)}
          placeholder="Company"
          className="flex-1 rounded-sm border border-ink/15 bg-white/40 px-3 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-proof-green outline-none"
        />
        <input
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          placeholder="Role title"
          className="flex-1 rounded-sm border border-ink/15 bg-white/40 px-3 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-proof-green outline-none"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 bg-ink text-paper px-4 py-2.5 rounded-sm text-sm font-medium hover:bg-proof-green transition-colors shrink-0"
        >
          <Plus size={15} />
          Add
        </button>
      </form>

      {jdParsed && (
        <button
          onClick={handleSaveCurrent}
          className="mb-6 inline-flex items-center gap-2 text-xs font-mono text-proof-green hover:text-ink transition-colors"
        >
          <Save size={13} />
          save current analysis + tailored bullets as a new row
        </button>
      )}

      <div className="border border-ink/10 rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-ink/5 text-left text-[11px] uppercase tracking-wide text-ink/40 font-mono">
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Match</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Saved</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink/40 text-sm">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && applications.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-ink/40 text-sm italic">
                  Nothing tracked yet — add a row above, or save an analysis from
                  the Tailor step.
                </td>
              </tr>
            )}
            {applications.map((app) => (
              <tr key={app.id} className="border-t border-ink/10">
                <td className="px-4 py-3 text-ink font-medium">{app.company}</td>
                <td className="px-4 py-3 text-ink/80">{app.role}</td>
                <td className="px-4 py-3 font-mono text-ink/70">
                  {app.matchScore != null ? `${app.matchScore}%` : "—"}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app, e.target.value)}
                    className={`text-xs font-medium rounded-full px-2.5 py-1 border-0 outline-none cursor-pointer ${STATUS_STYLE[app.status] || ""}`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 font-mono text-ink/40 text-xs">{app.date}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="text-ink/30 hover:text-proof-red transition-colors"
                    aria-label="Delete row"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-ink/40 font-mono">
        stored locally for this preview — moves to MongoDB once the backend is wired up
      </p>
    </PageShell>
  );
}
