import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};
export async function GET(_request: Request, context: RouteContext) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json(
      { error: "Not authenticated." },
      { status: 401 }
    );
  }

  const { id } = await context.params;

  const resume = await prisma.resumeVersion.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!resume) {
    return Response.json(
      { error: "Resume not found." },
      { status: 404 }
    );
  }

  if (!resume.fileUrl.startsWith("data:")) {
    return Response.redirect(resume.fileUrl);
  }

  const match = resume.fileUrl.match(/^data:(.*?);base64,(.*)$/);

  if (!match) {
    return Response.json(
      { error: "Invalid stored resume file." },
      { status: 400 }
    );
  }

  const mimeType = match[1] || resume.mimeType || "application/octet-stream";
  const base64Data = match[2];
  const fileBuffer = Buffer.from(base64Data, "base64");

  return new Response(fileBuffer, {
    headers: {
      "Content-Type": mimeType,
      "Content-Disposition": `inline; filename="${resume.fileName}"`,
    },
  });
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

  const existingResume = await prisma.resumeVersion.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!existingResume) {
    return Response.json(
      { error: "Resume not found." },
      { status: 404 }
    );
  }

  await prisma.resumeVersion.delete({
    where: {
      id: existingResume.id,
    },
  });

  return Response.json({
    ok: true,
    message: "Resume deleted successfully.",
  });
}