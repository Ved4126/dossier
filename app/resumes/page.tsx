"use client";

import { resumes } from "@/lib/mock-data";
import { Upload, Eye, Download, Trash2, FileText, Paperclip } from "lucide-react";

export default function ResumeLibrary() {
  return (
    <div>
      <header className="mb-6">
        <div className="font-typewriter text-[11px] tracking-[0.3em] uppercase text-ink-soft">Evidence Locker</div>
        <h1 className="font-typewriter text-3xl text-ink">Resume Evidence Locker</h1>
        <p className="font-hand text-stamp text-xl mt-1 rotate-[-1deg] inline-block">every version, every filing.</p>
      </header>

      <div className="paper-card-2 rounded-md p-6 mb-8 relative">
        <Paperclip className="absolute -top-3 left-6 h-7 w-7 text-ink-soft -rotate-45" />
        <div className="flex items-center gap-2 text-stamp">
          <Upload className="h-4 w-4" />
          <h2 className="font-typewriter text-sm uppercase tracking-widest">Upload New Resume</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-3 mt-4">
          <input placeholder="Resume label (e.g. Backend v5)" className="paper-card rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stamp/50" />
          <label className="paper-card rounded-sm px-3 py-2.5 text-sm cursor-pointer flex items-center gap-2 text-ink-soft">
            <FileText className="h-4 w-4" /> Choose file…
            <input type="file" className="hidden" />
          </label>
          <input placeholder="Notes (optional)" className="paper-card rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stamp/50" />
        </div>
        <button className="mt-4 font-typewriter uppercase tracking-widest text-xs bg-stamp text-paper px-5 py-2.5 rounded-sm hover:bg-stamp-dark transition">
          Upload Resume
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumes.map((r, i) => (
          <div key={r.id} className="relative float-in sway" style={{ ["--tilt" as string]: `${[-1.5, 1, -1, 1.5][i % 4]}deg`, animationDelay: `${i * 80}ms` }}>
            <div className={i % 2 === 0 ? "pin-head" : "pin-head-gold"} style={{ left: "50%", transform: "translateX(-50%)", top: "-8px" }} />
            <div className="paper-card rounded-sm p-5 pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-typewriter text-[10px] uppercase tracking-widest text-ink-soft">Resume Version</div>
                  <h3 className="font-typewriter text-lg text-ink mt-1">{r.label}</h3>
                </div>
                <FileText className="h-6 w-6 text-stamp" />
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-ink font-typewriter">
                <Paperclip className="h-3.5 w-3.5 text-stamp" />
                {r.fileName}
              </div>
              <div className="text-[11px] text-ink-soft mt-1 font-typewriter">
                {r.fileType} · uploaded {r.uploadedAt}
              </div>

              <div className="mt-4 pt-3 border-t border-dashed border-paper-edge grid grid-cols-2 gap-2">
                <div>
                  <div className="font-typewriter text-[10px] uppercase tracking-widest text-ink-soft">Linked</div>
                  <div className="font-typewriter text-lg text-ink">{r.linkedCount}</div>
                </div>
                <div>
                  <div className="font-typewriter text-[10px] uppercase tracking-widest text-ink-soft">Interview Rate</div>
                  <div className="font-typewriter text-lg text-ink">
                    {r.interviewRate !== null ? `${r.interviewRate}%` : <span className="text-ink-soft text-sm">insufficient data</span>}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <SmallBtn icon={Eye}>View</SmallBtn>
                <SmallBtn icon={Download}>Download</SmallBtn>
                <SmallBtn icon={Trash2} danger>Delete</SmallBtn>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SmallBtn({ icon: Icon, children, danger }: { icon: any; children: React.ReactNode; danger?: boolean }) {
  return (
    <button className={`inline-flex items-center gap-1.5 font-typewriter text-[10px] uppercase tracking-widest px-2.5 py-1.5 rounded-sm transition border ${
      danger ? "border-stamp text-stamp hover:bg-stamp hover:text-paper" : "border-ink/30 text-ink hover:bg-paper-2"
    }`}>
      <Icon className="h-3 w-3" />{children}
    </button>
  );
}