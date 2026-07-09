import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createApplicationSchema = z.object({
  company: z.string().min(1, "Company is required."),
  role: z.string().min(1, "Role is required."),
  jobDescription: z.string().min(1, "Job description is required."),
  status: z
    .enum(["APPLIED", "OA", "INTERVIEW", "REJECTED", "OFFER"])
    .optional(),
  appliedDate: z.string().optional(),
  resumeVersionId: z.string().optional().nullable(),
});

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json(
      { error: "Not authenticated." },
      { status: 401 }
    );
  }

  const applications = await prisma.application.findMany({
    where: {
      userId: user.id,
    },
    include: {
      resumeVersion: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return Response.json({
    ok: true,
    applications,
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

    const parsed = createApplicationSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          error: "Invalid application data.",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      company,
      role,
      jobDescription,
      status,
      appliedDate,
      resumeVersionId,
    } = parsed.data;

    const application = await prisma.application.create({
      data: {
        userId: user.id,
        company,
        role,
        jobDescription,
        status: status ?? "APPLIED",
        appliedDate: appliedDate ? new Date(appliedDate) : null,
        resumeVersionId: resumeVersionId || null,
      },
      include: {
        resumeVersion: true,
      },
    });

    return Response.json(
      {
        ok: true,
        application,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create application error:", error);

    return Response.json(
      {
        error: "Something went wrong while creating the application.",
      },
      { status: 500 }
    );
  }
}