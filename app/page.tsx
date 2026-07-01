import Link from "next/link";
import {
  FileText, FolderOpen, LinkIcon, Layers, Sparkles, ArrowRight,
  Paperclip, Search, BarChart3, ClipboardCheck,
} from "lucide-react";
import { StatusBadge } from "@/components/dossier/StatusBadge";

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Nav />
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="mx-auto max-w-7xl px-6 pt-6">
      <div className="paper-card rounded-lg px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative"><div className="pin-head static !w-4 !h-4" /></div>
          <span className="font-typewriter text-xl tracking-[0.25em] text-ink">DOSSIER</span>
        </div>
        <nav className="hidden sm:flex items-center gap-6 font-typewriter text-xs uppercase tracking-widest text-ink-soft">
          <a href="#problem" className="hover:text-stamp transition">The Problem</a>
          <a href="#solution" className="hover:text-stamp transition">How it works</a>
          <a href="#features" className="hover:text-stamp transition">Features</a>
        </nav>
        <Link href="/auth" className="font-typewriter uppercase tracking-widest text-xs bg-stamp text-paper px-4 py-2 rounded-sm hover:bg-stamp-dark transition">
          Open Case
        </Link>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-16 pb-24 grid lg:grid-cols-2 gap-12 items-center">
      <div className="float-in">
        <span className="stamp text-xs">Case File · Confidential</span>
        <h1 className="mt-6 font-typewriter text-5xl sm:text-6xl leading-[1.05] text-paper drop-shadow-[0_2px_0_rgba(0,0,0,0.35)]">
          Never forget which<br />resume you sent.
        </h1>
        <p className="mt-6 text-lg text-paper/90 max-w-lg leading-relaxed">
          Dossier keeps every job application tied to the <em>exact resume version</em> you submitted, so you walk into every interview prepared.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/auth" className="group font-typewriter uppercase tracking-widest text-sm bg-stamp text-paper px-6 py-3 rounded-sm hover:bg-stamp-dark transition shadow-lg inline-flex items-center gap-2">
            Open Your First Case <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
          </Link>
          <a href="#solution" className="font-typewriter uppercase tracking-widest text-sm border-2 border-paper/80 text-paper px-6 py-3 rounded-sm hover:bg-paper hover:text-ink transition">
            See How It Works
          </a>
        </div>
        <p className="font-hand text-paper/80 text-2xl mt-6 rotate-[-2deg] inline-block">every case has a paper trail →</p>
      </div>

      <CorkboardHero />
    </section>
  );
}

function CorkboardHero() {
  return (
    <div className="relative aspect-[5/6] max-w-xl mx-auto">
      {/* Red string SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 500 600" fill="none">
        <path d="M 90 120 Q 220 220 380 100" stroke="#b23a32" strokeWidth="2.5" className="draw-string" />
        <path d="M 380 100 Q 260 320 120 380" stroke="#b23a32" strokeWidth="2.5" className="draw-string" style={{ animationDelay: "0.4s" }} />
        <path d="M 120 380 Q 260 450 400 500" stroke="#b23a32" strokeWidth="2.5" className="draw-string" style={{ animationDelay: "0.8s" }} />
      </svg>

      {/* Pinned cards */}
      <PinnedCard tilt={-4} className="absolute top-4 left-2 w-56 z-10" delay={100}
        company="Alto Systems" role="Frontend Intern" status="Online Assessment" resume="frontend_resume_v2.pdf" />
      <PinnedCard tilt={5} className="absolute top-0 right-2 w-56 z-10" delay={200} gold
        company="BrightPath" role="Backend Intern" status="Offer" resume="backend_resume_v4.pdf" />

      {/* Highlight card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 z-20 float-in sway"
        style={{ ["--tilt" as string]: "-2deg", animationDelay: "300ms" }}>
        <div className="pin-head left-1/2 -translate-x-1/2 -top-2 z-10" />
        <div className="paper-card rounded-sm p-5 pt-6 shadow-2xl">
          <div className="font-typewriter text-[10px] tracking-[0.2em] text-ink-soft uppercase">Case № DSR-001</div>
          <h3 className="font-typewriter text-lg text-ink mt-1">Northwind Inc.</h3>
          <p className="text-xs text-ink-soft">Software Engineering Intern</p>
          <div className="mt-3">
            <StatusBadge status="Interview" />
          </div>
          <div className="mt-3 pt-3 border-t border-dashed border-paper-edge">
            <div className="flex items-center gap-2 text-xs text-ink">
              <Paperclip className="h-3.5 w-3.5 text-stamp" />
              <span className="font-typewriter">backend_resume_v4.pdf</span>
            </div>
            <p className="font-hand text-stamp text-lg mt-1 rotate-[-2deg]">this one ↑</p>
          </div>
        </div>
      </div>

      <PinnedCard tilt={-3} className="absolute bottom-2 left-6 w-52 z-10" delay={500}
        company="Fernbank Labs" role="Full Stack" status="Applied" resume="fullstack_resume_v1.pdf" />
      <PinnedCard tilt={4} className="absolute bottom-0 right-4 w-52 z-10" delay={650}
        company="Redwood AI" role="ML Intern" status="Rejected" resume="ai_resume_v3.pdf" />
    </div>
  );
}

function PinnedCard({
  company, role, status, resume, tilt, className, delay = 0, gold = false,
}: { company: string; role: string; status: any; resume: string; tilt: number; className?: string; delay?: number; gold?: boolean; }) {
  return (
    <div className={`${className} float-in sway`} style={{ ["--tilt" as string]: `${tilt}deg`, animationDelay: `${delay}ms` }}>
      <div className={`${gold ? "pin-head-gold" : "pin-head"} left-1/2 -translate-x-1/2 -top-2`} />
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

function ProblemSection() {
  return (
    <section id="problem" className="mx-auto max-w-6xl px-6 py-20">
      <div className="paper-card rounded-lg p-10 sm:p-14 relative overflow-hidden">
        <div className="absolute top-6 right-8 stamp text-xs stamp-in">Exhibit A</div>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-typewriter text-3xl sm:text-4xl text-ink">The interview call comes in…<br /><span className="text-stamp">which resume did I send?</span></h2>
            <p className="mt-5 text-ink-soft leading-relaxed">
              You tailor a new resume for every role. Weeks later, a recruiter emails back. You open your Downloads folder and find <em>seventeen</em> nearly-identical PDFs. None of them are labelled. None of them match what you actually sent.
            </p>
            <p className="font-hand text-stamp text-2xl mt-4 rotate-[-2deg] inline-block">panic. every time.</p>
          </div>
          <div className="relative h-72">
            {["resume_final.pdf", "resume_FINAL_v2.pdf", "resume_use_this.pdf", "resume_actually_final.pdf"].map((f, i) => (
              <div key={f} className="absolute paper-card-2 rounded-sm p-3 w-52 float-in"
                style={{ top: `${i * 40}px`, left: `${i * 30}px`, transform: `rotate(${[-6, 3, -2, 5][i]}deg)`, animationDelay: `${i * 100}ms` }}>
                <FileText className="h-5 w-5 text-ink-soft" />
                <div className="font-typewriter text-xs mt-1 text-ink">{f}</div>
                <div className="text-[10px] text-ink-soft">modified 3mo ago</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SolutionSection() {
  const steps = [
    { icon: FolderOpen, title: "Open a Case", desc: "Log each application as a case file. Company, role, JD." },
    { icon: LinkIcon, title: "Link the Exact Resume", desc: "Attach the resume version you actually submitted." },
    { icon: ClipboardCheck, title: "Track the Status", desc: "Applied → OA → Interview → Offer. All in one board." },
    { icon: Search, title: "Reopen Before Interview", desc: "Pull the case, review the resume, walk in prepared." },
  ];
  return (
    <section id="solution" className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-center mb-12">
        <span className="font-typewriter text-xs tracking-[0.3em] text-paper/80 uppercase">The Method</span>
        <h2 className="font-typewriter text-4xl text-paper mt-2">How Dossier works</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="relative float-in sway" style={{ ["--tilt" as string]: `${[-2, 1, -1, 2][i]}deg`, animationDelay: `${i * 120}ms` }}>
              <div className={i % 2 === 0 ? "pin-head" : "pin-head-gold"} style={{ left: "50%", transform: "translateX(-50%)", top: "-8px" }} />
              <div className="paper-card rounded-sm p-6 pt-8 h-full">
                <div className="font-typewriter text-[10px] tracking-[0.25em] text-ink-soft uppercase">Step 0{i + 1}</div>
                <Icon className="h-8 w-8 text-stamp mt-3" />
                <h3 className="font-typewriter text-lg text-ink mt-3">{s.title}</h3>
                <p className="text-sm text-ink-soft mt-2 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { icon: FolderOpen, title: "Application Cases", desc: "Every job is a case file with everything you'll need before an interview." },
    { icon: LinkIcon, title: "Resume Version Linking", desc: "Bind the exact PDF you sent to each application. No more guessing." },
    { icon: Layers, title: "Resume Library", desc: "All your versions in one evidence locker, labelled and searchable." },
    { icon: ClipboardCheck, title: "Status Board", desc: "See every case at a glance: applied, OA, interview, offer, rejected." },
    { icon: Sparkles, title: "Interview Prep Mode", desc: "One click to reopen the case with the linked resume and JD." },
    { icon: BarChart3, title: "Resume Performance", desc: "Which resume version actually gets you interviews? Find out." },
  ];
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-20">
      <div className="text-center mb-10">
        <span className="font-typewriter text-xs tracking-[0.3em] text-paper/80 uppercase">The Evidence</span>
        <h2 className="font-typewriter text-4xl text-paper mt-2">Everything in the file</h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="paper-card rounded-sm p-6 float-in hover:-translate-y-1 transition-transform"
              style={{ animationDelay: `${i * 80}ms` }}>
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-sm bg-stamp/10 border border-stamp/30">
                <Icon className="h-5 w-5 text-stamp" />
              </div>
              <h3 className="font-typewriter text-lg text-ink mt-4">{f.title}</h3>
              <p className="text-sm text-ink-soft mt-2 leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="mx-auto max-w-4xl px-6 pb-24">
      <div className="paper-card rounded-lg p-12 text-center relative">
        <div className="pin-head-gold" style={{ left: "50%", transform: "translateX(-50%)", top: "-10px" }} />
        <div className="absolute -top-3 -right-3 stamp text-xs stamp-in" style={{ animationDelay: "200ms" }}>Case Closed</div>
        <h2 className="font-typewriter text-4xl sm:text-5xl text-ink">Every application has a paper trail.</h2>
        <p className="font-hand text-stamp text-2xl mt-4 rotate-[-2deg] inline-block">start yours →</p>
        <div className="mt-6">
          <Link href="/auth" className="font-typewriter uppercase tracking-widest text-sm bg-stamp text-paper px-8 py-3 rounded-sm hover:bg-stamp-dark transition shadow-lg inline-flex items-center gap-2">
            Start Tracking <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-cork-dark/60">
      <div className="mx-auto max-w-7xl px-6 py-6 flex flex-wrap items-center justify-between gap-3 font-typewriter text-xs tracking-widest text-paper/70 uppercase">
        <div>Dossier · Confidential Case Management</div>
        <div>© 2026 — filed under useful things</div>
      </div>
    </footer>
  );
}