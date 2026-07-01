import { applications as mockApplications, resumes as mockResumes } from "@/lib/mock-data";

export type ApplicationStatus =
  | "Applied"
  | "Online Assessment"
  | "Interview"
  | "Rejected"
  | "Offer";

export type StoredApplication = {
  id: string;
  company: string;
  role: string;
  jobDescription: string;
  status: ApplicationStatus;
  appliedDate: string;
  lastUpdated: string;
  resumeVersionId: string;
  notes?: string;
};

export type StoredResume = {
  id: string;
  label: string;
  fileName: string;
  fileType?: string;
  fileSize?: number;
  fileUrl?: string;
  uploadedAt: string;
  linkedApplications?: number;
};

const APPLICATIONS_KEY = "dossier_applications";
const RESUMES_KEY = "dossier_resumes";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getStoredApplications(): StoredApplication[] {
  if (!isBrowser()) return [];

  const stored = localStorage.getItem(APPLICATIONS_KEY);

  if (stored) {
    return JSON.parse(stored);
  }

  const starterApplications = mockApplications.map((app) => ({
    id: app.id,
    company: app.company,
    role: app.role,
    jobDescription: app.jobDescription,
    status: app.status,
    appliedDate: app.appliedDate,
    lastUpdated: app.updatedDate,
    resumeVersionId: app.resumeId,
    notes: app.notes ?? "",
  }));

  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(starterApplications));

  return starterApplications;
}

export function saveApplications(applications: StoredApplication[]) {
  if (!isBrowser()) return;
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
}

export function addApplication(application: StoredApplication) {
  const applications = getStoredApplications();
  const updated = [application, ...applications];
  saveApplications(updated);
  return application;
}

export function getStoredResumes(): StoredResume[] {
  if (!isBrowser()) return [];

  const stored = localStorage.getItem(RESUMES_KEY);

  if (stored) {
    return JSON.parse(stored);
  }

  const starterResumes = mockResumes.map((resume) => ({
  id: resume.id,
  label: resume.label,
  fileName: resume.fileName,
  fileType: "application/pdf",
  uploadedAt: resume.uploadedAt,
  linkedApplications: 0,
  fileUrl: "#",
}));

  localStorage.setItem(RESUMES_KEY, JSON.stringify(starterResumes));

  return starterResumes;
}

export function saveResumes(resumes: StoredResume[]) {
  if (!isBrowser()) return;
  localStorage.setItem(RESUMES_KEY, JSON.stringify(resumes));
}

export function addResume(resume: StoredResume) {
  const resumes = getStoredResumes();
  const updated = [resume, ...resumes];
  saveResumes(updated);
  return resume;
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result as string);
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
}