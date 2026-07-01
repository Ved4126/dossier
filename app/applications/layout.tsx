import { AppShell } from "@/components/dossier/AppShell";

export default function AppSectionLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
