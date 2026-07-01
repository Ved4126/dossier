"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Paperclip, ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/dossier/StatusBadge";

export default function AuthPage() {
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const router = useRouter();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <CorkPanel />
      <div className="flex items-center justify-center p-6 sm:p-10 relative">
        <div className="w-full max-w-md relative float-in">
          <div className="absolute -top-4 -right-2 stamp text-xs stamp-in z-10" style={{ animationDelay: "300ms" }}>Confidential</div>
          <div className="absolute -top-3 left-6 z-10"><Paperclip className="h-7 w-7 text-ink-soft -rotate-45" /></div>
          <div className="paper-card rounded-md p-8 pt-10">
            <div className="flex gap-2 mb-6">
              <TabButton active={mode === "signup"} onClick={() => setMode("signup")}>New Case</TabButton>
              <TabButton active={mode === "login"} onClick={() => setMode("login")}>Reopen Case</TabButton>
            </div>
            <h1 className="font-typewriter text-2xl text-ink">
              {mode === "signup" ? "File a new dossier" : "Reopen your dossier"}
            </h1>
            <p className="text-sm text-ink-soft mt-1">
              {mode === "signup" ? "Set up your account and start filing cases." : "Welcome back, investigator."}
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-3">
              {mode === "signup" && <Field label="Full name" placeholder="Jane Doe" />}
              <Field label="Email" type="email" placeholder="you@example.com" />
              <Field label="Password" type="password" placeholder="••••••••" />
              {mode === "signup" && <Field label="Confirm password" type="password" placeholder="••••••••" />}
              <button type="submit" className="w-full mt-3 font-typewriter uppercase tracking-widest text-sm bg-stamp text-paper px-5 py-3 rounded-sm hover:bg-stamp-dark transition shadow inline-flex items-center justify-center gap-2 group">
                {mode === "signup" ? "Open Case" : "Reopen Case"}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/" className="font-typewriter text-xs uppercase tracking-widest text-ink-soft hover:text-stamp">← back to file room</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick}
      className={`folder-tab flex-1 text-center transition-all ${active ? "!bg-paper text-ink" : "!bg-paper-2 text-ink-soft hover:text-ink"}`}>
      {children}
    </button>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="font-typewriter text-[11px] uppercase tracking-widest text-ink-soft">{label}</span>
      <input {...props} required
        className="mt-1 w-full paper-card-2 rounded-sm px-3 py-2.5 text-sm text-ink placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-stamp/50" />
    </label>
  );
}

function CorkPanel() {
  return (
    <div className="relative hidden lg:flex flex-col justify-between p-10 overflow-hidden">
      <div className="absolute inset-0 -z-0 opacity-95" />
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 600 800" fill="none" preserveAspectRatio="none">
        <path d="M 80 150 Q 300 280 500 180" stroke="#b23a32" strokeWidth="2.5" className="draw-string" />
        <path d="M 500 180 Q 380 450 100 500" stroke="#b23a32" strokeWidth="2.5" className="draw-string" style={{ animationDelay: "0.5s" }} />
        <path d="M 100 500 Q 300 620 520 680" stroke="#b23a32" strokeWidth="2.5" className="draw-string" style={{ animationDelay: "1s" }} />
      </svg>

      <div className="relative z-10">
        <div className="flex items-center gap-2">
          <div className="relative"><div className="pin-head static !w-4 !h-4" /></div>
          <span className="font-typewriter text-2xl tracking-[0.3em] text-paper drop-shadow">DOSSIER</span>
        </div>
        <p className="font-hand text-2xl text-paper/90 mt-3 rotate-[-2deg] inline-block">keep every case straight</p>
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-6 my-8">
        <MiniCard tilt={-4} delay={100} company="Northwind Inc." role="SWE Intern" status="Interview" resume="backend_resume_v4.pdf" />
        <MiniCard tilt={3} delay={250} gold company="BrightPath" role="Backend Intern" status="Offer" resume="backend_resume_v4.pdf" />
        <MiniCard tilt={-2} delay={400} company="Alto Systems" role="Frontend Intern" status="Online Assessment" resume="frontend_resume_v2.pdf" />
        <MiniCard tilt={4} delay={550} company="Fernbank Labs" role="Full Stack" status="Applied" resume="fullstack_resume_v1.pdf" />
      </div>

      <div className="relative z-10 font-typewriter text-xs uppercase tracking-widest text-paper/70">
        Confidential · Case Management · Est. 2026
      </div>
    </div>
  );
}

function MiniCard({ company, role, status, resume, tilt, delay, gold }: any) {
  return (
    <div className="relative float-in sway" style={{ ["--tilt" as string]: `${tilt}deg`, animationDelay: `${delay}ms` }}>
      <div className={gold ? "pin-head-gold" : "pin-head"} style={{ left: "50%", transform: "translateX(-50%)", top: "-8px" }} />
      <div className="paper-card rounded-sm p-3 pt-4">
        <div className="font-typewriter text-[9px] tracking-[0.2em] text-ink-soft uppercase">{company}</div>
        <div className="text-[11px] text-ink font-medium mt-0.5">{role}</div>
        <div className="mt-2"><StatusBadge status={status} /></div>
        <div className="mt-2 flex items-center gap-1 text-[10px] text-ink-soft font-typewriter truncate">
          <Paperclip className="h-3 w-3 text-stamp" />{resume}
        </div>
      </div>
    </div>
  );
}