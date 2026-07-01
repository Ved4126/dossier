"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getApplication, getResume, statusList, type Status } from "@/lib/mock-data";
import { StatusBadge } from "@/components/dossier/StatusBadge";
import { Paperclip, Download, Eye, RefreshCw, Pencil, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";

export default function CasePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const original = getApplication(id);
  if (!original) return <div className="p-8 font-typewriter">Case file not found.</div>;

  const [app, setApp] = useState(original);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    company: app.company,
    role: app.role,
    jobDescription: app.jobDescription,
  });
  const resume = getResume(app.resumeId);

  const startEdit = () => {
    setDraft({ company: app.company, role: app.role, jobDescription: app.jobDescription });
    setEditing(true);
  };
  const cancelEdit = () => setEditing(false);
  const saveEdit = () => {
    setApp({ ...app, ...draft, updatedDate: new Date().toISOString().slice(0, 10) });
    setEditing(false);
    toast.success("Case file updated");
  };
  const updateStatus = (s: Status) => {
    setApp({ ...app, status: s, updatedDate: new Date().toISOString().slice(0, 10) });
    toast.success(`Status stamped: ${s}`);
  };
  const deleteCase = () => {
    if (!confirm("Close and shred this case file? This cannot be undone.")) return;
    toast.success("Case file shredded");
    router.push("/dashboard");
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/dashboard" className="font-typewriter text-xs uppercase tracking-widest text-ink-soft hover:text-stamp">
          ← Case Board
        </Link>
      </div>

      <div className="paper-card rounded-md p-6 sm:p-10 relative">
        <div className="absolute -top-3 left-8 stamp text-xs stamp-in">Case File</div>
        <div className="absolute -top-3 right-6"><Paperclip className="h-8 w-8 text-ink-soft -rotate-12" /></div>

        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div className="flex-1 min-w-[260px]">
            <div className="font-typewriter text-[11px] tracking-[0.3em] uppercase text-ink-soft">Case № {app.caseNumber}</div>
            {editing ? (
              <div className="space-y-2 mt-1">
                <input
                  value={draft.company}
                  onChange={(e) => setDraft({ ...draft, company: e.target.value })}
                  className="w-full font-typewriter text-3xl sm:text-4xl text-ink bg-transparent border-b-2 border-dashed border-stamp/50 focus:outline-none focus:border-stamp"
                />
                <input
                  value={draft.role}
                  onChange={(e) => setDraft({ ...draft, role: e.target.value })}
                  className="w-full text-ink-soft bg-transparent border-b border-dashed border-paper-edge focus:outline-none focus:border-stamp"
                />
              </div>
            ) : (
              <>
                <h1 className="font-typewriter text-3xl sm:text-4xl text-ink mt-1">Case File: {app.company}</h1>
                <p className="text-ink-soft mt-1">{app.role}</p>
              </>
            )}
          </div>
          <StatusBadge status={app.status} size="lg" />
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-6 pb-6 border-b border-dashed border-paper-edge">
          <Info label="Applied" value={app.appliedDate} />
          <Info label="Last Updated" value={app.updatedDate} />
          <Info label="Status" value={app.status} />
        </div>

        <section className="mt-8">
          <div className="paper-card-2 rounded-md p-6 border-l-4 border-stamp relative">
            <div className="absolute -top-3 left-6 stamp text-xs stamp-in" style={{ animationDelay: "300ms" }}>Evidence 01</div>
            <div className="flex items-center gap-2 text-stamp mt-1">
              <Paperclip className="h-5 w-5" />
              <h2 className="font-typewriter text-lg uppercase tracking-widest">Submitted Resume</h2>
            </div>
            <p className="font-hand text-stamp text-2xl mt-2 rotate-[-1deg] inline-block">
              this is the exact resume version linked to this application ↓
            </p>
            <div className="mt-4 grid sm:grid-cols-[1fr_auto] gap-4 items-center paper-card rounded-sm p-4">
              <div>
                <div className="font-typewriter text-[11px] uppercase tracking-widest text-ink-soft">{resume?.label}</div>
                <div className="font-typewriter text-xl text-ink mt-1">{resume?.fileName}</div>
                <div className="text-xs text-ink-soft mt-1">Uploaded {resume?.uploadedAt} · {resume?.fileType}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                <ActionBtn icon={Eye} onClick={() => toast("Preview coming soon")}>View</ActionBtn>
                <ActionBtn icon={Download} onClick={() => toast("Download coming soon")}>Download</ActionBtn>
                <ActionBtn icon={RefreshCw} variant="ghost" onClick={() => toast("Swap coming soon")}>Swap</ActionBtn>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="font-typewriter text-sm uppercase tracking-widest text-ink-soft">Job Description</h2>
          {editing ? (
            <textarea
              value={draft.jobDescription}
              onChange={(e) => setDraft({ ...draft, jobDescription: e.target.value })}
              rows={6}
              className="mt-2 w-full paper-card-2 rounded-sm p-5 text-ink leading-relaxed focus:outline-none focus:ring-2 focus:ring-stamp/40 bg-transparent"
            />
          ) : (
            <div className="mt-2 paper-card-2 rounded-sm p-5 text-ink leading-relaxed whitespace-pre-line">
              {app.jobDescription}
            </div>
          )}
        </section>

        <section className="mt-8">
          <h2 className="font-typewriter text-sm uppercase tracking-widest text-ink-soft">Update Status</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {statusList.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => updateStatus(s)}
                className={`font-typewriter uppercase tracking-widest text-xs px-3 py-2 rounded-sm transition ${
                  app.status === s ? "bg-stamp text-paper shadow" : "border border-ink/30 text-ink hover:bg-paper-2"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-10 pt-6 border-t border-dashed border-paper-edge flex flex-wrap gap-3">
          {editing ? (
            <>
              <ActionBtn icon={Save} onClick={saveEdit}>Save Changes</ActionBtn>
              <ActionBtn icon={X} variant="ghost" onClick={cancelEdit}>Cancel</ActionBtn>
            </>
          ) : (
            <ActionBtn icon={Pencil} onClick={startEdit}>Edit Case</ActionBtn>
          )}
          <ActionBtn icon={Trash2} variant="danger" onClick={deleteCase}>Delete Case</ActionBtn>
        </section>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-typewriter text-[10px] uppercase tracking-widest text-ink-soft">{label}</div>
      <div className="font-typewriter text-lg text-ink">{value}</div>
    </div>
  );
}

function ActionBtn({
  icon: Icon,
  children,
  variant = "solid",
  onClick,
}: {
  icon: any;
  children: React.ReactNode;
  variant?: "solid" | "ghost" | "danger";
  onClick?: () => void;
}) {
  const styles = {
    solid: "bg-stamp text-paper hover:bg-stamp-dark",
    ghost: "border-2 border-ink/40 text-ink hover:bg-paper-2",
    danger: "border-2 border-stamp text-stamp hover:bg-stamp hover:text-paper",
  }[variant];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 font-typewriter text-xs uppercase tracking-widest px-3 py-2 rounded-sm transition ${styles}`}
    >
      <Icon className="h-4 w-4" />
      {children}
    </button>
  );
}