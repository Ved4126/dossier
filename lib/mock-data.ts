export type Status = "Applied" | "Online Assessment" | "Interview" | "Rejected" | "Offer";

export interface Resume {
  id: string;
  label: string;
  fileName: string;
  fileType: string;
  uploadedAt: string;
  linkedCount: number;
  interviewRate: number | null;
  notes?: string;
}

export interface Application {
  id: string;
  caseNumber: string;
  company: string;
  role: string;
  status: Status;
  resumeId: string;
  appliedDate: string;
  updatedDate: string;
  jobDescription: string;
  notes?: string;
}

export const resumes: Resume[] = [
  { id: "r1", label: "Backend Resume v4", fileName: "backend_resume_v4.pdf", fileType: "PDF", uploadedAt: "2026-05-12", linkedCount: 6, interviewRate: 33 },
  { id: "r2", label: "Frontend Resume v2", fileName: "frontend_resume_v2.pdf", fileType: "PDF", uploadedAt: "2026-05-20", linkedCount: 4, interviewRate: 25 },
  { id: "r3", label: "Full Stack Resume v1", fileName: "fullstack_resume_v1.pdf", fileType: "PDF", uploadedAt: "2026-06-01", linkedCount: 3, interviewRate: null },
  { id: "r4", label: "AI Resume v3", fileName: "ai_resume_v3.pdf", fileType: "PDF", uploadedAt: "2026-06-08", linkedCount: 2, interviewRate: null },
];

export const applications: Application[] = [
  {
    id: "a1", caseNumber: "DSR-001", company: "Northwind Inc.", role: "Software Engineering Intern",
    status: "Interview", resumeId: "r1", appliedDate: "2026-06-10", updatedDate: "2026-06-25",
    jobDescription: "Join Northwind's platform team to build reliable distributed backend services in Go and TypeScript. You will collaborate with senior engineers on ingestion pipelines, on-call rotations, and internal tooling.",
  },
  {
    id: "a2", caseNumber: "DSR-002", company: "Alto Systems", role: "Frontend Developer Intern",
    status: "Online Assessment", resumeId: "r2", appliedDate: "2026-06-14", updatedDate: "2026-06-22",
    jobDescription: "Craft accessible, performant interfaces in React and TypeScript. Work alongside designers to ship polished product surfaces used by thousands of enterprise operators.",
  },
  {
    id: "a3", caseNumber: "DSR-003", company: "Fernbank Labs", role: "Full Stack Intern",
    status: "Applied", resumeId: "r3", appliedDate: "2026-06-18", updatedDate: "2026-06-18",
    jobDescription: "Own features end-to-end across our Node.js API and Next.js dashboard. Ship weekly, own quality, and pair with the founding team.",
  },
  {
    id: "a4", caseNumber: "DSR-004", company: "Redwood AI", role: "ML Intern",
    status: "Rejected", resumeId: "r4", appliedDate: "2026-05-30", updatedDate: "2026-06-15",
    jobDescription: "Applied research on retrieval and evaluation for LLM systems. Python, PyTorch, and a bias toward rigorous experiments.",
  },
  {
    id: "a5", caseNumber: "DSR-005", company: "BrightPath", role: "Backend Intern",
    status: "Offer", resumeId: "r1", appliedDate: "2026-05-22", updatedDate: "2026-06-20",
    jobDescription: "Design and ship reliable services powering logistics for regional distributors. Postgres, Go, and lots of ownership.",
  },
];

export const statusList: Status[] = ["Applied", "Online Assessment", "Interview", "Rejected", "Offer"];

export function getResume(id: string) {
  return resumes.find((r) => r.id === id);
}
export function getApplication(id: string) {
  return applications.find((a) => a.id === id);
}