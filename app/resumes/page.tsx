import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import ResumesClient from "./ResumesClient";

export default async function ResumeLibraryPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth");
  }

  return <ResumesClient />;
}