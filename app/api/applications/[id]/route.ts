import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateApplicationSchema = z.object({
  company: z.string().min(1, "Company is required.").optional(),
  role: z.string().min(1, "Role is required.").optional(),
  jobDescription: z.string().min(1, "Job description is required.").optional(),
  status: z
    .enum(["APPLIED", "OA", "INTERVIEW", "REJECTED", "OFFER"])
    .optional(),
  appliedDate: z.string().optional(),
  resumeVersionId: z.string().optional().nullable(),
});

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json(
      { error: "Not authenticated." },
      { status: 401 }
    );
  }

  const { id } = await context.params;

  const existingApplication = await prisma.application.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!existingApplication) {
    return Response.json(
      { error: "Application not found." },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();

    const parsed = updateApplicationSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          error: "Invalid application data.",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const updatedApplication = await prisma.application.update({
      where: {
        id: existingApplication.id,
      },
      data: {
        ...(data.company !== undefined && { company: data.company }),
        ...(data.role !== undefined && { role: data.role }),
        ...(data.jobDescription !== undefined && {
          jobDescription: data.jobDescription,
        }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.appliedDate !== undefined && {
          appliedDate: data.appliedDate ? new Date(data.appliedDate) : null,
        }),
        ...(data.resumeVersionId !== undefined && {
          resumeVersionId: data.resumeVersionId || null,
        }),
      },
      include: {
        resumeVersion: true,
      },
    });

    return Response.json({
      ok: true,
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Update application error:", error);

    return Response.json(
      { error: "Something went wrong while updating the application." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json(
      { error: "Not authenticated." },
      { status: 401 }
    );
  }

  const { id } = await context.params;

  const existingApplication = await prisma.application.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!existingApplication) {
    return Response.json(
      { error: "Application not found." },
      { status: 404 }
    );
  }

  await prisma.application.delete({
    where: {
      id: existingApplication.id,
    },
  });

  return Response.json({
    ok: true,
    message: "Application deleted successfully.",
  });
}