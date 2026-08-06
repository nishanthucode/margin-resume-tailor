import { NavLink } from "react-router-dom";
import { FileText, ScanSearch, PenLine, LayoutGrid } from "lucide-react";

const items = [
  { to: "/", label: "Candidates", num: "I", icon: FileText, end: true },
  { to: "/analysis", label: "Match Analysis", num: "II", icon: ScanSearch },
  { to: "/tailor", label: "Suggested Edits", num: "III", icon: PenLine },
  { to: "/tracker", label: "Pipeline", num: "IV", icon: LayoutGrid },
];

export default function Sidebar() {
  return (
    <>
      <aside className="hidden md:block md:w-64 shrink-0 border-b-0 md:border-r border-ink-line">
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-baseline gap-2">
          <span className="font-display italic text-2xl text-paper">Margin</span>
        </div>
        <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-paper/40 font-mono">
          Recruiter Studio
        </p>
      </div>

      <nav className="px-3 pb-8 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
        {items.map(({ to, label, num, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-sm whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-paper text-ink"
                  : "text-paper/60 hover:text-paper hover:bg-white/5"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`font-mono text-[10px] w-4 text-center ${
                    isActive ? "text-proof-red" : "text-paper/30"
                  }`}
                >
                  {num}
                </span>
                <Icon size={15} strokeWidth={1.75} />
                <span className="text-sm font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="hidden md:block px-6 pb-6 text-[11px] leading-relaxed text-paper/30 font-mono border-t border-ink-line pt-4 mx-3">
        v0.1 — frontend preview
        <br />
        backend wiring pending
      </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav
        className="mobile-bottom-nav md:hidden fixed left-0 right-0 bottom-3 mx-3 bg-ink/95 rounded-xl shadow-lg px-3 py-2 flex items-center justify-between z-40"
        aria-label="Primary navigation"
      >
        {items.map(({ to, label, num, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `inline-flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-md text-xs transition-colors ${
                isActive ? 'text-paper' : 'text-paper/60 hover:text-paper'
              }`
            }
            aria-label={label}
          >
            {({ isActive }) => (
              <>
                <Icon size={18} strokeWidth={1.75} />
                <span className="sr-only">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
