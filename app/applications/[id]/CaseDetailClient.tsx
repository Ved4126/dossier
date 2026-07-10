"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Paperclip,
  Download,
  Eye,
  RefreshCw,
  Pencil,
  Trash2,
  Save,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/dossier/StatusBadge";
import type { ApplicationStatus } from "@/lib/storage";

type ResumeVersion = {
  id: string;
  label: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  mimeType: string | null;
} | null;

type CaseDetailApplication = {
  id: string;
  company: string;
  role: string;
  jobDescription: string;
  status: ApplicationStatus;
  appliedDate: string;
  lastUpdated: string;
  resumeVersion: ResumeVersion;
};

type CaseDetailClientProps = {
  application: CaseDetailApplication;
};

const statusList: ApplicationStatus[] = [
  "Applied",
  "Online Assessment",
  "Interview",
  "Rejected",
  "Offer",
];

function toDatabaseStatus(status: ApplicationStatus) {
  switch (status) {
    case "Applied":
      return "APPLIED";
    case "Online Assessment":
      return "OA";
    case "Interview":
      return "INTERVIEW";
    case "Rejected":
      return "REJECTED";
    case "Offer":
      return "OFFER";
    default:
      return "APPLIED";
  }
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function CaseDetailClient({
  application,
}: CaseDetailClientProps) {
  const router = useRouter();

  const [app, setApp] = useState(application);
  const [editing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draft, setDraft] = useState({
    company: application.company,
    role: application.role,
    jobDescription: application.jobDescription,
  });

  function startEdit() {
    setDraft({
      company: app.company,
      role: app.role,
      jobDescription: app.jobDescription,
    });

    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
  }

  async function saveEdit() {
    if (!draft.company.trim() || !draft.role.trim() || !draft.jobDescription.trim()) {
      toast.error("Company, role, and job description are required.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/applications/${app.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company: draft.company.trim(),
          role: draft.role.trim(),
          jobDescription: draft.jobDescription.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Could not update this case.");
        return;
      }

      setApp({
        ...app,
        company: data.application.company,
        role: data.application.role,
        jobDescription: data.application.jobDescription,
        lastUpdated: today(),
      });

      setEditing(false);
      toast.success("Case file updated.");
      router.refresh();
    } catch {
      toast.error("Something went wrong while updating this case.");
    } finally {
      setIsSaving(false);
    }
  }

  async function updateStatus(newStatus: ApplicationStatus) {
    setIsSaving(true);

    try {
      const response = await fetch(`/api/applications/${app.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: toDatabaseStatus(newStatus),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Could not update status.");
        return;
      }

      setApp({
        ...app,
        status: newStatus,
        lastUpdated: today(),
      });

      toast.success(`Status stamped: ${newStatus}`);
      router.refresh();
    } catch {
      toast.error("Something went wrong while updating status.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteCase() {
    const confirmed = confirm(
      "Close and shred this case file? This cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/applications/${app.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Could not delete this case.");
        return;
      }

      toast.success("Case file shredded.");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Something went wrong while deleting this case.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Link
          href="/dashboard"
          className="font-typewriter text-xs uppercase tracking-widest text-ink-soft hover:text-stamp"
        >
          ← Case Board
        </Link>
      </div>

      <div className="paper-card rounded-md p-6 sm:p-10 relative">
        <div className="absolute -top-3 left-8 stamp text-xs stamp-in">
          Case File
        </div>

        <div className="absolute -top-3 right-6">
          <Paperclip className="h-8 w-8 text-ink-soft -rotate-12" />
        </div>

        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div className="flex-1 min-w-[260px]">
            <div className="font-typewriter text-[11px] tracking-[0.3em] uppercase text-ink-soft">
              Case ID {app.id.slice(0, 8).toUpperCase()}
            </div>

            {editing ? (
              <div className="space-y-2 mt-1">
                <input
                  value={draft.company}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      company: e.target.value,
                    })
                  }
                  className="w-full font-typewriter text-3xl sm:text-4xl text-ink bg-transparent border-b-2 border-dashed border-stamp/50 focus:outline-none focus:border-stamp"
                />

                <input
                  value={draft.role}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      role: e.target.value,
                    })
                  }
                  className="w-full text-ink-soft bg-transparent border-b border-dashed border-paper-edge focus:outline-none focus:border-stamp"
                />
              </div>
            ) : (
              <>
                <h1 className="font-typewriter text-3xl sm:text-4xl text-ink mt-1">
                  Case File: {app.company}
                </h1>

                <p className="text-ink-soft mt-1">{app.role}</p>
              </>
            )}
          </div>

          <StatusBadge status={app.status} size="lg" />
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-6 pb-6 border-b border-dashed border-paper-edge">
          <Info label="Applied" value={app.appliedDate} />
          <Info label="Last Updated" value={app.lastUpdated} />
          <Info label="Status" value={app.status} />
        </div>

        <section className="mt-8">
          <div className="paper-card-2 rounded-md p-6 border-l-4 border-stamp relative">
            <div
              className="absolute -top-3 left-6 stamp text-xs stamp-in"
              style={{ animationDelay: "300ms" }}
            >
              Evidence 01
            </div>

            <div className="flex items-center gap-2 text-stamp mt-1">
              <Paperclip className="h-5 w-5" />

              <h2 className="font-typewriter text-lg uppercase tracking-widest">
                Submitted Resume
              </h2>
            </div>

            <p className="font-hand text-stamp text-2xl mt-2 rotate-[-1deg] inline-block">
              this is the exact resume version linked to this application ↓
            </p>

            {app.resumeVersion ? (
              <div className="mt-4 grid sm:grid-cols-[1fr_auto] gap-4 items-center paper-card rounded-sm p-4">
                <div>
                  <div className="font-typewriter text-[11px] uppercase tracking-widest text-ink-soft">
                    {app.resumeVersion.label}
                  </div>

                  <div className="font-typewriter text-xl text-ink mt-1">
                    {app.resumeVersion.fileName}
                  </div>

                  <div className="text-xs text-ink-soft mt-1">
                    Uploaded {app.resumeVersion.uploadedAt}
                    {app.resumeVersion.mimeType
                      ? ` · ${app.resumeVersion.mimeType}`
                      : ""}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
  <a
  href={`/api/resumes/${app.resumeVersion.id}`}
  target="_blank"
  rel="noreferrer"
  className="inline-flex items-center gap-2 font-typewriter text-xs uppercase tracking-widest px-3 py-2 rounded-sm transition bg-stamp text-paper hover:bg-stamp-dark"
>
  <Eye className="h-4 w-4" />
  View
</a>

<a
  href={`/api/resumes/${app.resumeVersion.id}`}
  download={app.resumeVersion.fileName}
  className="inline-flex items-center gap-2 font-typewriter text-xs uppercase tracking-widest px-3 py-2 rounded-sm transition bg-stamp text-paper hover:bg-stamp-dark"
>
  <Download className="h-4 w-4" />
  Download
</a>

  <ActionBtn icon={RefreshCw} variant="ghost">
    Swap
  </ActionBtn>
</div>
              </div>
            ) : (
              <div className="mt-4 paper-card rounded-sm p-4">
                <div className="font-typewriter text-sm text-ink">
                  No resume linked yet.
                </div>

                <p className="text-sm text-ink-soft mt-1">
                  Resume linking will be connected when we build the real Resume
                  Evidence Locker database flow.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="font-typewriter text-sm uppercase tracking-widest text-ink-soft">
            Job Description
          </h2>

          {editing ? (
            <textarea
              value={draft.jobDescription}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  jobDescription: e.target.value,
                })
              }
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
          <h2 className="font-typewriter text-sm uppercase tracking-widest text-ink-soft">
            Update Status
          </h2>

          <div className="mt-3 flex flex-wrap gap-2">
            {statusList.map((status) => (
              <button
                key={status}
                type="button"
                disabled={isSaving}
                onClick={() => updateStatus(status)}
                className={`font-typewriter uppercase tracking-widest text-xs px-3 py-2 rounded-sm transition disabled:opacity-60 disabled:cursor-not-allowed ${
                  app.status === status
                    ? "bg-stamp text-paper shadow"
                    : "border border-ink/30 text-ink hover:bg-paper-2"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-10 pt-6 border-t border-dashed border-paper-edge flex flex-wrap gap-3">
          {editing ? (
            <>
              <ActionBtn icon={Save} onClick={saveEdit} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </ActionBtn>

              <ActionBtn
                icon={X}
                variant="ghost"
                onClick={cancelEdit}
                disabled={isSaving}
              >
                Cancel
              </ActionBtn>
            </>
          ) : (
            <ActionBtn icon={Pencil} onClick={startEdit} disabled={isSaving}>
              Edit Case
            </ActionBtn>
          )}

          <ActionBtn
            icon={Trash2}
            variant="danger"
            onClick={deleteCase}
            disabled={isSaving}
          >
            Delete Case
          </ActionBtn>
        </section>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-typewriter text-[10px] uppercase tracking-widest text-ink-soft">
        {label}
      </div>

      <div className="font-typewriter text-lg text-ink">{value}</div>
    </div>
  );
}

function ActionBtn({
  icon: Icon,
  children,
  variant = "solid",
  onClick,
  disabled,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
  variant?: "solid" | "ghost" | "danger";
  onClick?: () => void;
  disabled?: boolean;
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
      disabled={disabled}
      className={`inline-flex items-center gap-2 font-typewriter text-xs uppercase tracking-widest px-3 py-2 rounded-sm transition disabled:opacity-60 disabled:cursor-not-allowed ${styles}`}
    >
      <Icon className="h-4 w-4" />
      {children}
    </button>
  );
}