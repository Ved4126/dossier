"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.push("/auth");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="folder-tab flex items-center gap-2 transition-all bg-paper-2 text-ink-soft translate-y-1 hover:translate-y-0"
    >
      <LogOut className="h-3.5 w-3.5" />
      Logout
    </button>
  );
}