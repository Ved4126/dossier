import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createResumeSchema = z.object({
  label: z.string().min(1, "Resume label is required."),
  fileName: z.string().min(1, "File name is required."),
  fileUrl: z.string().min(1, "File URL is required."),
  storageKey: z.string().optional().nullable(),
  mimeType: z.string().optional().nullable(),
  fileSize: z.number().int().positive().optional().nullable(),
});

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json(
      { error: "Not authenticated." },
      { status: 401 }
    );
  }

  const resumes = await prisma.resumeVersion.findMany({
    where: {
      userId: user.id,
    },
    include: {
      applications: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      uploadedAt: "desc",
    },
  });

  return Response.json({
    ok: true,
    resumes: resumes.map((resume) => ({
      id: resume.id,
      label: resume.label,
      fileName: resume.fileName,
      fileUrl: resume.fileUrl,
      storageKey: resume.storageKey,
      mimeType: resume.mimeType,
      fileSize: resume.fileSize,
      uploadedAt: resume.uploadedAt,
      linkedApplications: resume.applications.length,
    })),
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json(
      { error: "Not authenticated." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const parsed = createResumeSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          error: "Invalid resume data.",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      label,
      fileName,
      fileUrl,
      storageKey,
      mimeType,
      fileSize,
    } = parsed.data;

    const resume = await prisma.resumeVersion.create({
      data: {
        userId: user.id,
        label,
        fileName,
        fileUrl,
        storageKey: storageKey || null,
        mimeType: mimeType || null,
        fileSize: fileSize || null,
      },
    });

    return Response.json(
      {
        ok: true,
        resume,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create resume error:", error);

    return Response.json(
      {
        error: "Something went wrong while creating the resume.",
      },
      { status: 500 }
    );
  }
}