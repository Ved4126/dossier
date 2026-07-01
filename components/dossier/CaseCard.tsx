import Link from "next/link";
import { Paperclip, ArrowRight } from "lucide-react";
import { getStoredResumes, type StoredApplication } from "@/lib/storage";
import { StatusBadge } from "./StatusBadge";

export function CaseCard({
  app,
  index = 0,
}: {
  app: StoredApplication;
  index?: number;
}) {
  const resumes = getStoredResumes();
  const resume = resumes.find((item) => item.id === app.resumeVersionId);
  const tilts = [-2, 1.5, -1, 2, -1.8, 1];
  const tilt = tilts[index % tilts.length];
  return (
    <div
      className="relative float-in sway"
      style={{ ["--tilt" as string]: `${tilt}deg`, animationDelay: `${index * 80}ms` }}
    >
      <div className="pin-head left-1/2 -translate-x-1/2 -top-2 z-10" />
      <Link
        href={`/applications/${app.id}`}
        className="paper-card block rounded-sm p-5 pt-6 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-typewriter text-[11px] tracking-[0.2em] text-ink-soft uppercase">
              Case № {String(index + 1).padStart(3, "0")}
            </div>
            <h3 className="font-typewriter text-xl text-ink leading-tight mt-1">{app.company}</h3>
            <p className="text-sm text-ink-soft mt-1">{app.role}</p>
          </div>
          <StatusBadge status={app.status} />
        </div>

        <div className="mt-4 pt-3 border-t border-dashed border-paper-edge">
          <div className="flex items-center gap-2 text-xs text-ink-soft">
            <Paperclip className="h-3.5 w-3.5 text-stamp" />
            <span className="font-typewriter truncate">{resume?.fileName ?? "no resume linked"}</span>
          </div>
          <p className="font-hand text-stamp/80 text-sm mt-1">the exact resume you sent →</p>
        </div>

        <div className="mt-4 flex items-end justify-between text-[11px] text-ink-soft">
          <div className="font-typewriter">
            <div>Filed: {app.appliedDate}</div>
            <div>
  Updated: {(app.lastUpdated ?? new Date().toISOString()).slice(0, 10)}
</div>
          </div>
          <span className="inline-flex items-center gap-1 text-stamp font-typewriter uppercase tracking-wider text-[10px] group-hover:gap-2 transition-all">
            Open Case <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </Link>
    </div>
  );
}