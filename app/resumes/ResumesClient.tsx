"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  Upload,
  Eye,
  Download,
  Trash2,
  FileText,
  Paperclip,
} from "lucide-react";
import { toast } from "sonner";

type Resume = {
  id: string;
  label: string;
  fileName: string;
  fileUrl: string;
  mimeType: string | null;
  fileSize: number | null;
  uploadedAt: string;
  linkedApplications: number;
};

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(String(reader.result));
    };

    reader.onerror = () => {
      reject(new Error("Could not read file."));
    };

    reader.readAsDataURL(file);
  });
}

export default function ResumesClient() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const [label, setLabel] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  async function loadResumes() {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("/api/resumes");
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not load resumes.");
        return;
      }

      setResumes(data.resumes);
    } catch {
      setError("Something went wrong while loading resumes.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadResumes();
  }, []);

  async function uploadResume(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedFile) {
      toast.error("Choose a resume file first.");
      return;
    }

    const cleanLabel =
      label.trim() || selectedFile.name.replace(/\.[^/.]+$/, "");

    setIsSaving(true);

    try {
      const fileUrl = await fileToDataUrl(selectedFile);

      const response = await fetch("/api/resumes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: cleanLabel,
          fileName: selectedFile.name,
          fileUrl,
          mimeType: selectedFile.type || null,
          fileSize: selectedFile.size,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Could not upload resume.");
        return;
      }

      toast.success("Resume filed in the evidence locker.");
      setLabel("");
      setSelectedFile(null);
      await loadResumes();
    } catch {
      toast.error("Something went wrong while uploading resume.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteResume(id: string) {
    const confirmed = confirm(
      "Delete this resume evidence file? This cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/resumes/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Could not delete resume.");
        return;
      }

      toast.success("Resume evidence deleted.");
      setResumes((currentResumes) =>
        currentResumes.filter((resume) => resume.id !== id)
      );
    } catch {
      toast.error("Something went wrong while deleting resume.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <header className="mb-6">
        <div className="font-typewriter text-[11px] tracking-[0.3em] uppercase text-ink-soft">
          Evidence Locker
        </div>

        <h1 className="font-typewriter text-3xl text-ink">
          Resume Evidence Locker
        </h1>

        <p className="font-hand text-stamp text-xl mt-1 rotate-[-1deg] inline-block">
          every version, every filing.
        </p>
      </header>

      <form
        onSubmit={uploadResume}
        className="paper-card-2 rounded-md p-6 mb-8 relative"
      >
        <Paperclip className="absolute -top-3 left-6 h-7 w-7 text-ink-soft -rotate-45" />

        <div className="flex items-center gap-2 text-stamp">
          <Upload className="h-4 w-4" />
          <h2 className="font-typewriter text-sm uppercase tracking-widest">
            Upload New Resume
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mt-4">
          <input
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="Resume label (e.g. Backend v5)"
            className="paper-card rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stamp/50"
          />

          <label className="paper-card rounded-sm px-3 py-2.5 text-sm cursor-pointer flex items-center gap-2 text-ink-soft">
            <FileText className="h-4 w-4" />
            {selectedFile ? selectedFile.name : "Choose file…"}
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(event) =>
                setSelectedFile(event.target.files?.[0] || null)
              }
            />
          </label>

          <input
            disabled
            placeholder="Notes coming soon"
            className="paper-card rounded-sm px-3 py-2.5 text-sm focus:outline-none opacity-60"
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="mt-4 font-typewriter uppercase tracking-widest text-xs bg-stamp text-paper px-5 py-2.5 rounded-sm hover:bg-stamp-dark transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSaving ? "Filing Resume..." : "Upload Resume"}
        </button>
      </form>

      {isLoading && (
        <div className="paper-card rounded-md p-6 text-center text-sm text-ink-soft">
          Loading resume evidence from the locker...
        </div>
      )}

      {error && (
        <div className="rounded-sm border border-stamp bg-stamp/10 px-3 py-2 text-sm text-stamp">
          {error}
        </div>
      )}

      {!isLoading && !error && resumes.length === 0 && (
        <div className="paper-card rounded-md p-10 text-center">
          <h2 className="font-typewriter text-xl text-ink">
            No resume evidence filed yet.
          </h2>

          <p className="text-ink-soft mt-2">
            Upload a resume version to start tracking which resume was submitted
            to each application.
          </p>
        </div>
      )}

      {!isLoading && !error && resumes.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume, index) => (
            <div
              key={resume.id}
              className="relative float-in sway"
              style={{
                ["--tilt" as string]: `${[-1.5, 1, -1, 1.5][index % 4]}deg`,
                animationDelay: `${index * 80}ms`,
              }}
            >
              <div
                className={index % 2 === 0 ? "pin-head" : "pin-head-gold"}
                style={{
                  left: "50%",
                  transform: "translateX(-50%)",
                  top: "-8px",
                }}
              />

              <div className="paper-card rounded-sm p-5 pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-typewriter text-[10px] uppercase tracking-widest text-ink-soft">
                      Resume Version
                    </div>

                    <h3 className="font-typewriter text-lg text-ink mt-1">
                      {resume.label}
                    </h3>
                  </div>

                  <FileText className="h-6 w-6 text-stamp" />
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-ink font-typewriter">
                  <Paperclip className="h-3.5 w-3.5 text-stamp" />
                  {resume.fileName}
                </div>

                <div className="text-[11px] text-ink-soft mt-1 font-typewriter">
                  {resume.mimeType || "Unknown file type"} · uploaded{" "}
                  {resume.uploadedAt.slice(0, 10)}
                </div>

                <div className="mt-4 pt-3 border-t border-dashed border-paper-edge grid grid-cols-2 gap-2">
                  <div>
                    <div className="font-typewriter text-[10px] uppercase tracking-widest text-ink-soft">
                      Linked
                    </div>

                    <div className="font-typewriter text-lg text-ink">
                      {resume.linkedApplications}
                    </div>
                  </div>

                  <div>
                    <div className="font-typewriter text-[10px] uppercase tracking-widest text-ink-soft">
                      Interview Rate
                    </div>

                    <div className="font-typewriter text-lg text-ink">
                      <span className="text-ink-soft text-sm">
                        insufficient data
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <SmallBtn icon={Eye}>View</SmallBtn>

                  <a
                    href={resume.fileUrl}
                    download={resume.fileName}
                    className="inline-flex items-center gap-1.5 font-typewriter text-[10px] uppercase tracking-widest px-2.5 py-1.5 rounded-sm transition border border-ink/30 text-ink hover:bg-paper-2"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </a>

                  <SmallBtn
                    icon={Trash2}
                    danger
                    onClick={() => deleteResume(resume.id)}
                    disabled={isSaving}
                  >
                    Delete
                  </SmallBtn>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SmallBtn({
  icon: Icon,
  children,
  danger,
  onClick,
  disabled,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
  danger?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 font-typewriter text-[10px] uppercase tracking-widest px-2.5 py-1.5 rounded-sm transition border disabled:opacity-60 disabled:cursor-not-allowed ${
        danger
          ? "border-stamp text-stamp hover:bg-stamp hover:text-paper"
          : "border-ink/30 text-ink hover:bg-paper-2"
      }`}
    >
      <Icon className="h-3 w-3" />
      {children}
    </button>
  );
}