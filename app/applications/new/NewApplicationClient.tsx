"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { statusList } from "@/lib/mock-data";
import {
  addResume,
  fileToDataUrl,
  getStoredResumes,
  type StoredResume,
} from "@/lib/storage";
import { Paperclip, Upload } from "lucide-react";

export default function NewApplicationClient() {
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [resumeOptions, setResumeOptions] = useState<StoredResume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");

  const [showUploadResume, setShowUploadResume] = useState(false);
  const [newResumeFile, setNewResumeFile] = useState<File | null>(null);
  const [newResumeLabel, setNewResumeLabel] = useState("");

  useEffect(() => {
    const storedResumes = getStoredResumes();
    setResumeOptions(storedResumes);

    if (storedResumes.length > 0) {
      setSelectedResumeId(storedResumes[0].id);
    }
  }, []);

  function toDatabaseStatus(status: string) {
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

  async function submit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();

  setError("");
  setIsSaving(true);

  try {
    const formData = new FormData(e.currentTarget);

    const company = String(formData.get("company") || "").trim();
    const role = String(formData.get("role") || "").trim();
    const jobDescription = String(formData.get("jobDescription") || "").trim();
    const appliedDate = String(formData.get("appliedDate") || "");
    const status = String(formData.get("status") || "Applied");

    if (!company || !role || !jobDescription || !appliedDate) {
      setError("Please fill in company, role, job description, and applied date.");
      return;
    }

    if (showUploadResume && newResumeFile) {
      const fileUrl = await fileToDataUrl(newResumeFile);

      const uploadedResume: StoredResume = {
        id: crypto.randomUUID(),
        label:
          newResumeLabel.trim() ||
          newResumeFile.name.replace(/\.[^/.]+$/, ""),
        fileName: newResumeFile.name,
        fileType: newResumeFile.type,
        fileSize: newResumeFile.size,
        fileUrl,
        uploadedAt: new Date().toISOString(),
        linkedApplications: 0,
      };

      addResume(uploadedResume);
      setSelectedResumeId(uploadedResume.id);
    }

    const dbStatus = toDatabaseStatus(status);

    const response = await fetch("/api/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company,
        role,
        jobDescription,
        status: dbStatus,
        appliedDate,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Could not save this case.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  } catch (error) {
    setError("Something went wrong while saving this case.");
  } finally {
    setIsSaving(false);
  }
}

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-6">
        <div className="font-typewriter text-[11px] tracking-[0.3em] uppercase text-ink-soft">
          New Filing
        </div>

        <h1 className="font-typewriter text-3xl text-ink">
          Open a New Case
        </h1>

        <p className="font-hand text-stamp text-xl mt-1 rotate-[-1deg] inline-block">
          every detail becomes evidence.
        </p>
      </header>

      <form
        onSubmit={submit}
        className="paper-card-2 rounded-md p-6 sm:p-8 space-y-5 relative"
      >
        <Paperclip className="absolute -top-3 left-8 h-7 w-7 text-ink-soft -rotate-45" />

        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            name="company"
            label="Company name"
            placeholder="Northwind Inc."
          />

          <Field
            name="role"
            label="Role / Title"
            placeholder="Software Engineering Intern"
          />
        </div>

        <div>
          <Label>Job description</Label>

          <textarea
            name="jobDescription"
            rows={5}
            required
            className="mt-1 w-full paper-card rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stamp/50"
            placeholder="Paste the JD here so future-you remembers exactly what you were up against."
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            name="appliedDate"
            label="Applied date"
            type="date"
          />

          <div>
            <Label>Initial status</Label>

            <select
              name="status"
              className="mt-1 w-full paper-card rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stamp/50"
            >
              {statusList.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="paper-card rounded-sm p-4 border-l-4 border-stamp">
          <div className="flex items-center gap-2 text-stamp">
            <Paperclip className="h-4 w-4" />

            <span className="font-typewriter text-xs uppercase tracking-widest">
              Linked Resume · The Paper Trail
            </span>
          </div>

          <p className="text-sm text-ink-soft mt-2">
            Attach the <em>exact</em> resume you submitted for this application.
            This is the paper trail you&apos;ll need before an interview.
          </p>

          <div className="grid sm:grid-cols-[1fr_auto] gap-3 mt-3">
            <select
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              className="paper-card-2 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stamp/50"
            >
              {resumeOptions.map((resume) => (
                <option key={resume.id} value={resume.id}>
                  {resume.label} — {resume.fileName}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setShowUploadResume((prev) => !prev)}
              className="inline-flex items-center gap-2 font-typewriter text-xs uppercase tracking-widest border-2 border-stamp text-stamp px-3 py-2 rounded-sm hover:bg-stamp hover:text-paper transition"
            >
              <Upload className="h-4 w-4" />

              {showUploadResume ? "Cancel Upload" : "Upload New"}
            </button>
          </div>

          {showUploadResume && (
            <div className="mt-4 rounded-sm border-2 border-dashed border-paper-edge bg-paper/60 p-4 space-y-3">
              <div>
                <label className="block font-typewriter text-xs uppercase tracking-widest text-ink-soft mb-2">
                  Resume Label
                </label>

                <input
                  type="text"
                  value={newResumeLabel}
                  onChange={(e) => setNewResumeLabel(e.target.value)}
                  placeholder="Backend Resume v4"
                  className="w-full rounded-sm border border-paper-edge bg-white/80 px-3 py-2 text-sm text-ink outline-none focus:border-stamp"
                />
              </div>

              <div>
                <label className="block font-typewriter text-xs uppercase tracking-widest text-ink-soft mb-2">
                  Resume File
                </label>

                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) {
                      setNewResumeFile(file);

                      if (!newResumeLabel) {
                        setNewResumeLabel(file.name.replace(/\.[^/.]+$/, ""));
                      }
                    }
                  }}
                  className="w-full rounded-sm border border-paper-edge bg-white/80 px-3 py-2 text-sm text-ink"
                />
              </div>

              {newResumeFile && (
                <p className="font-hand text-lg text-ink-soft">
                  Selected: {newResumeFile.name}
                </p>
              )}
            </div>
          )}
        </div>

        <div>
          <Label>Notes &#40;optional&#41;</Label>

          <textarea
            name="notes"
            rows={3}
            placeholder="Referrals, recruiter names, gut feelings…"
            className="mt-1 w-full paper-card rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stamp/50"
          />
        </div>

          {error && (
  <div className="rounded-sm border border-stamp bg-stamp/10 px-3 py-2 text-sm text-stamp">
    {error}
  </div>
)}
        <div className="flex gap-3 pt-2">
          <button
  type="submit"
  disabled={isSaving}
  className="font-typewriter uppercase tracking-widest text-sm bg-stamp text-paper px-6 py-3 rounded-sm hover:bg-stamp-dark transition shadow disabled:opacity-60 disabled:cursor-not-allowed"
>
  {isSaving ? "Saving Case..." : "Save Case"}
</button>

          <Link
            href="/dashboard"
            className="font-typewriter uppercase tracking-widest text-sm border-2 border-ink/30 text-ink px-6 py-3 rounded-sm hover:bg-paper-2 transition"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-typewriter text-[11px] uppercase tracking-widest text-ink-soft">
      {children}
    </span>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <Label>{label}</Label>

      <input
        {...props}
        required
        className="mt-1 w-full paper-card rounded-sm px-3 py-2.5 text-sm text-ink placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-stamp/50"
      />
    </label>
  );
}