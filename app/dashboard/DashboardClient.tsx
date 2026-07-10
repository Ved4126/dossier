"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, Plus } from "lucide-react";
import type { ApplicationStatus, StoredApplication } from "@/lib/storage";import { statusList } from "@/lib/mock-data";
import { CaseCard } from "@/components/dossier/CaseCard";

type DashboardClientProps = {
  user: {
    id: string;
    name: string | null;
    email: string;
  };
};


function fromDatabaseStatus(status: string): ApplicationStatus {
  switch (status) {
    case "APPLIED":
      return "Applied";
    case "OA":
      return "Online Assessment";
    case "INTERVIEW":
      return "Interview";
    case "REJECTED":
      return "Rejected";
    case "OFFER":
      return "Offer";
    default:
      return "Applied";
  }
}



export default function DashboardClient({ user }: DashboardClientProps) {

  const [applications, setApplications] = useState<StoredApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
  async function loadApplications() {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("/api/applications");
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not load applications.");
        return;
      }

      const mappedApplications: StoredApplication[] = data.applications.map(
  (application: {
    id: string;
    company: string;
    role: string;
    jobDescription: string;
    status: string;
    appliedDate: string | null;
    updatedAt: string;
    resumeVersionId: string | null;
    resumeVersion: {
      id: string;
      label: string;
      fileName: string;
    } | null;
  }) => ({
    id: application.id,
    company: application.company,
    role: application.role,
    jobDescription: application.jobDescription,
    status: fromDatabaseStatus(application.status),
    appliedDate: application.appliedDate
      ? application.appliedDate.slice(0, 10)
      : "Unknown",
    lastUpdated: application.updatedAt,
    resumeVersionId: application.resumeVersionId || "",
    resumeFileName: application.resumeVersion?.fileName || "",
    resumeLabel: application.resumeVersion?.label || "",
    notes: "",
  })
);

      setApplications(mappedApplications);
    } catch {
      setError("Something went wrong while loading applications.");
    } finally {
      setIsLoading(false);
    }
  }

  loadApplications();
}, []);

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const matchesStatus =
        activeStatus === "All" || application.status === activeStatus;

      const query = searchQuery.toLowerCase().trim();

      const matchesSearch =
        !query ||
        application.company.toLowerCase().includes(query) ||
        application.role.toLowerCase().includes(query) ||
        application.jobDescription.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [applications, activeStatus, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: applications.length,
      applied: applications.filter((app) => app.status === "Applied").length,
      oa: applications.filter((app) => app.status === "Online Assessment").length,
      interview: applications.filter((app) => app.status === "Interview").length,
      offer: applications.filter((app) => app.status === "Offer").length,
      rejected: applications.filter((app) => app.status === "Rejected").length,
    };
  }, [applications]);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="font-typewriter text-[11px] tracking-[0.3em] uppercase text-ink-soft">
            Case Board
          </div>

          <h1 className="font-typewriter text-3xl text-ink">
            Open Applications
          </h1>

          <p className="font-hand text-stamp text-xl mt-1 rotate-[-1deg] inline-block">
            every lead, resume, and outcome pinned in place.
          </p>

          <p className="font-typewriter text-xs uppercase tracking-widest text-ink/50 mt-3">
            Logged in as {user.email}
          </p>
        </div>

        <Link
          href="/applications/new"
          className="inline-flex items-center justify-center gap-2 font-typewriter uppercase tracking-widest text-sm bg-stamp text-paper px-5 py-3 rounded-sm hover:bg-stamp-dark transition shadow"
        >
          <Plus className="h-4 w-4" />
          New Case
        </Link>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatsCard label="Total" value={stats.total} />
        <StatsCard label="Applied" value={stats.applied} />
        <StatsCard label="OA" value={stats.oa} />
        <StatsCard label="Interview" value={stats.interview} />
        <StatsCard label="Offer" value={stats.offer} />
        <StatsCard label="Rejected" value={stats.rejected} />
      </section>

      <section className="paper-card-2 rounded-md p-4 space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />

            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cases by company, role, or job description..."
              className="w-full paper-card rounded-sm pl-9 pr-3 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:ring-2 focus:ring-stamp/50"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {["All", ...statusList].map((status) => {
              const isActive = activeStatus === status;

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setActiveStatus(status)}
                  className={`font-typewriter text-[11px] uppercase tracking-widest px-3 py-2 rounded-sm border transition ${
                    isActive
                      ? "bg-stamp text-paper border-stamp"
                      : "bg-paper text-ink-soft border-paper-edge hover:border-stamp hover:text-stamp"
                  }`}
                >
                  {status}
                </button>
              );
            })}
          </div>
        </div>

        {isLoading && (
  <div className="paper-card rounded-md p-6 text-center text-sm text-ink-soft">
    Loading cases from the case archive...
  </div>
)}

{error && (
  <div className="rounded-sm border border-stamp bg-stamp/10 px-3 py-2 text-sm text-stamp">
    {error}
  </div>
)}

        {!isLoading && filteredApplications.length > 0 ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredApplications.map((application, index) => (
              <CaseCard
                key={application.id}
                app={application}
                index={index}
              />
            ))}
          </div>
        ) :  !isLoading ? (
          <div className="paper-card rounded-md p-10 text-center">
            <h2 className="font-typewriter text-xl text-ink">
              No cases found
            </h2>

            <p className="mt-2 text-sm text-ink-soft">
              No applications match your current search or filter.
            </p>

            <Link
              href="/applications/new"
              className="mt-5 inline-flex items-center justify-center gap-2 font-typewriter uppercase tracking-widest text-sm bg-stamp text-paper px-5 py-3 rounded-sm hover:bg-stamp-dark transition shadow"
            >
              <Plus className="h-4 w-4" />
              Open New Case
            </Link>
          </div>
        ) : null }
      </section>
    </div>
  );
}

function StatsCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="paper-card rounded-sm p-4 shadow-sm">
      <div className="font-typewriter text-[10px] uppercase tracking-widest text-ink-soft">
        {label}
      </div>

      <div className="font-typewriter text-3xl text-ink mt-2">
        {value}
      </div>
    </div>
  );
}