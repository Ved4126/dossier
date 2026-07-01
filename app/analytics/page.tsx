import { applications, resumes, statusList } from "@/lib/mock-data";

export default function Analytics() {
  const total = applications.length;
  const breakdown = statusList.map((s) => ({
    status: s,
    count: applications.filter(a => a.status === s).length,
  }));
  const max = Math.max(1, ...breakdown.map(b => b.count));

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-8">
        <div className="font-typewriter text-[11px] tracking-[0.3em] uppercase text-ink-soft">Evidence Report</div>
        <h1 className="font-typewriter text-3xl text-ink">Case Analytics</h1>
        <p className="font-hand text-stamp text-xl mt-1 rotate-[-1deg] inline-block">the paper trail, in patterns.</p>
      </header>

      <section className="mb-10">
        <h2 className="font-typewriter text-sm uppercase tracking-widest text-ink-soft mb-3">Status Breakdown</h2>
        <div className="paper-card-2 rounded-md p-6 space-y-3">
          {breakdown.map((b) => (
            <div key={b.status} className="grid grid-cols-[160px_1fr_auto] gap-3 items-center">
              <div className="font-typewriter text-xs uppercase tracking-widest text-ink">{b.status}</div>
              <div className="h-6 paper-card rounded-sm overflow-hidden relative">
                <div className="h-full bg-stamp/80 transition-all" style={{ width: `${(b.count / max) * 100}%` }} />
              </div>
              <div className="font-typewriter text-ink text-lg tabular-nums">{b.count}</div>
            </div>
          ))}
          <div className="pt-3 border-t border-dashed border-paper-edge font-typewriter text-xs uppercase tracking-widest text-ink-soft flex justify-between">
            <span>Total Cases Filed</span><span className="text-ink text-base">{total}</span>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-typewriter text-sm uppercase tracking-widest text-ink-soft mb-3">Resume Performance</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {resumes.map((r, i) => {
            const interviews = Math.round(((r.interviewRate ?? 0) / 100) * r.linkedCount);
            return (
              <div key={r.id} className="relative float-in" style={{ animationDelay: `${i * 80}ms` }}>
                <div className={i % 2 === 0 ? "pin-head" : "pin-head-gold"} style={{ left: "50%", transform: "translateX(-50%)", top: "-8px" }} />
                <div className="paper-card rounded-sm p-5 pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-typewriter text-[10px] uppercase tracking-widest text-ink-soft">Exhibit</div>
                      <h3 className="font-typewriter text-lg text-ink mt-1">{r.label}</h3>
                      <div className="font-typewriter text-xs text-ink-soft">{r.fileName}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-typewriter text-[10px] uppercase tracking-widest text-ink-soft">Interview Rate</div>
                      <div className="font-typewriter text-3xl text-stamp">
                        {r.interviewRate !== null ? `${r.interviewRate}%` : "—"}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                    <div className="paper-card-2 rounded-sm p-2">
                      <div className="font-typewriter text-[10px] uppercase tracking-widest text-ink-soft">Applications</div>
                      <div className="font-typewriter text-xl text-ink">{r.linkedCount}</div>
                    </div>
                    <div className="paper-card-2 rounded-sm p-2">
                      <div className="font-typewriter text-[10px] uppercase tracking-widest text-ink-soft">Interviews</div>
                      <div className="font-typewriter text-xl text-ink">{r.interviewRate !== null ? interviews : "—"}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}