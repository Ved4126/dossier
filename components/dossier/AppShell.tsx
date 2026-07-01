"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, FilePlus2, FolderArchive, BarChart3, Settings, Search, User } from "lucide-react";
import { type ReactNode } from "react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/applications/new", label: "New Case", icon: FilePlus2 },
  { href: "/resumes", label: "Resume Library", icon: FolderArchive },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen">
      <TopBar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-4">
        <div className="flex flex-wrap gap-1 items-end">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`folder-tab flex items-center gap-2 transition-all ${
                  active
                    ? "!bg-paper text-ink -mb-px translate-y-0 shadow-md"
                    : "!bg-paper-2 text-ink-soft translate-y-1 hover:translate-y-0"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="paper-card rounded-t-none rounded-b-lg p-6 sm:p-8 min-h-[70vh]">
          {children}
        </div>
      </div>
      <footer className="mx-auto max-w-7xl px-4 sm:px-6 py-8 text-center font-typewriter text-xs text-paper/70 tracking-widest">
        DOSSIER · CONFIDENTIAL CASE MANAGEMENT
      </footer>
    </div>
  );
}

function TopBar() {
  return (
    <header className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 pb-2">
      <div className="paper-card rounded-lg px-4 py-3 flex items-center gap-3 flex-wrap">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="pin-head static !w-4 !h-4" />
          </div>
          <span className="font-typewriter text-xl tracking-[0.25em] text-ink group-hover:text-stamp transition">
            DOSSIER
          </span>
        </Link>
        <div className="hidden sm:flex flex-1 min-w-[200px] items-center gap-2 paper-card-2 rounded-md px-3 py-1.5">
          <Search className="h-4 w-4 text-ink-soft" />
          <input
            className="bg-transparent outline-none text-sm w-full placeholder:text-ink-soft/60"
            placeholder="Search cases, companies, resumes…"
          />
        </div>
        <Link
          href="/applications/new"
          className="font-typewriter uppercase tracking-widest text-xs bg-stamp text-paper px-3 py-2 rounded-sm hover:bg-stamp-dark transition shadow"
        >
          + New Case
        </Link>
        <Link
          href="/resumes"
          className="font-typewriter uppercase tracking-widest text-xs text-ink border border-ink/30 px-3 py-2 rounded-sm hover:bg-paper-2 transition"
        >
          Resume Library
        </Link>
        <button className="ml-auto sm:ml-0 h-9 w-9 rounded-full bg-paper-2 border border-paper-edge flex items-center justify-center text-ink-soft hover:text-stamp">
          <User className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}