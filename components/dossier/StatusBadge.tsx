import type { Status } from "@/lib/mock-data";

const styles: Record<Status, string> = {
  "Applied": "text-ink-soft border-ink-soft/60",
  "Online Assessment": "text-pin border-pin/70",
  "Interview": "text-stamp border-stamp",
  "Rejected": "text-ink/70 border-ink/40 line-through decoration-stamp/70",
  "Offer": "text-emerald-800 border-emerald-800/70",
};

export function StatusBadge({ status, size = "sm" }: { status: Status; size?: "sm" | "lg" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 font-typewriter uppercase tracking-widest border-2 rounded-[3px] rotate-[-4deg] select-none ${styles[status]} ${
        size === "lg" ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-[10px]"
      }`}
      style={{ mixBlendMode: "multiply" }}
    >
      {status}
    </span>
  );
}