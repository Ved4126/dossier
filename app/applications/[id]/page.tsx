import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ApplicationStatus } from "@/lib/storage";
import CaseDetailClient from "./CaseDetailClient";

type CasePageProps = {
  params: Promise<{
    id: string;
  }>;
};

function fromDatabaseStatus(status: string): ApplicationStatus {
  switch (status) {
    case "APPLIED":
      return "Applied";
    case "OA":
      return "Online Assessment";
    case "INTERVIEW":
      return "Interview";
    case "REJECTED":
      return "Rejected";
    case "OFFER":
      return "Offer";
    default:
      return "Applied";
  }
}

function formatDate(date: Date | null) {
  if (!date) {
    return "Unknown";
  }

  return date.toISOString().slice(0, 10);
}

export default async function CasePage({ params }: CasePageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth");
  }

  const { id } = await params;

  const application = await prisma.application.findFirst({
    where: {
      id,
      userId: user.id,
    },
    include: {
      resumeVersion: true,
    },
  });

  if (!application) {
    notFound();
  }

  return (
    <CaseDetailClient
      application={{
        id: application.id,
        company: application.company,
        role: application.role,
        jobDescription: application.jobDescription,
        status: fromDatabaseStatus(application.status),
        appliedDate: formatDate(application.appliedDate),
        lastUpdated: formatDate(application.updatedAt),
        resumeVersion: application.resumeVersion
  ? {
      id: application.resumeVersion.id,
      label: application.resumeVersion.label,
      fileName: application.resumeVersion.fileName,
      fileUrl: application.resumeVersion.fileUrl,
      uploadedAt: application.resumeVersion.uploadedAt
        .toISOString()
        .slice(0, 10),
      mimeType: application.resumeVersion.mimeType,
    }
  : null,
      }}
    />
  );
}