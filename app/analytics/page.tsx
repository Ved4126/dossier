import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const statusList = [
  "Applied",
  "Online Assessment",
  "Interview",
  "Rejected",
  "Offer",
] as const;

function fromDatabaseStatus(status: string) {
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

export default async function Analytics() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth");
  }

  const applications = await prisma.application.findMany({
    where: {
      userId: user.id,
    },
    include: {
      resumeVersion: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const resumes = await prisma.resumeVersion.findMany({
    where: {
      userId: user.id,
    },
    include: {
      applications: true,
    },
    orderBy: {
      uploadedAt: "desc",
    },
  });

  const total = applications.length;

  const breakdown = statusList.map((status) => ({
    status,
    count: applications.filter(
      (application) => fromDatabaseStatus(application.status) === status
    ).length,
  }));

  const max = Math.max(1, ...breakdown.map((item) => item.count));

  const totalInterviews = applications.filter(
    (application) =>
      application.status === "INTERVIEW" || application.status === "OFFER"
  ).length;

  const interviewRate =
    total > 0 ? Math.round((totalInterviews / total) * 100) : 0;

  const totalOffers = applications.filter(
    (application) => application.status === "OFFER"
  ).length;

  const linkedApplications = applications.filter(
    (application) => application.resumeVersionId
  ).length;

  const resumePerformance = resumes.map((resume) => {
    const linkedCases = resume.applications;

    const interviews = linkedCases.filter(
      (application) =>
        application.status === "INTERVIEW" || application.status === "OFFER"
    ).length;

    const rate =
      linkedCases.length > 0
        ? Math.round((interviews / linkedCases.length) * 100)
        : null;

    return {
      id: resume.id,
      label: resume.label,
      fileName: resume.fileName,
      linkedCount: linkedCases.length,
      interviews,
      interviewRate: rate,
    };
  });

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-8">
        <div className="font-typewriter text-[11px] tracking-[0.3em] uppercase text-ink-soft">
          Evidence Report
        </div>

        <h1 className="font-typewriter text-3xl text-ink">
          Case Analytics
        </h1>

        <p className="font-hand text-stamp text-xl mt-1 rotate-[-1deg] inline-block">
          the paper trail, in patterns.
        </p>

        <p className="font-typewriter text-xs uppercase tracking-widest text-ink/50 mt-3">
          Analytics for {user.email}
        </p>
      </header>

      <section className="grid sm:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Cases" value={total} />
        <StatCard label="Interview Rate" value={`${interviewRate}%`} />
        <StatCard label="Offers" value={totalOffers} />
        <StatCard label="Linked Resumes" value={linkedApplications} />
      </section>

      <section className="mb-10">
        <h2 className="font-typewriter text-sm uppercase tracking-widest text-ink-soft mb-3">
          Status Breakdown
        </h2>

        <div className="paper-card-2 rounded-md p-6 space-y-3">
          {breakdown.map((item) => (
            <div
              key={item.status}
              className="grid grid-cols-[160px_1fr_auto] gap-3 items-center"
            >
              <div className="font-typewriter text-xs uppercase tracking-widest text-ink">
                {item.status}
              </div>

              <div className="h-6 paper-card rounded-sm overflow-hidden relative">
                <div
                  className="h-full bg-stamp/80 transition-all"
                  style={{
                    width: `${(item.count / max) * 100}%`,
                  }}
                />
              </div>

              <div className="font-typewriter text-ink text-lg tabular-nums">
                {item.count}
              </div>
            </div>
          ))}

          <div className="pt-3 border-t border-dashed border-paper-edge font-typewriter text-xs uppercase tracking-widest text-ink-soft flex justify-between">
            <span>Total Cases Filed</span>
            <span className="text-ink text-base">{total}</span>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-typewriter text-sm uppercase tracking-widest text-ink-soft mb-3">
          Resume Performance
        </h2>

        {resumePerformance.length === 0 ? (
          <div className="paper-card rounded-md p-10 text-center">
            <h3 className="font-typewriter text-xl text-ink">
              No resume evidence yet.
            </h3>

            <p className="text-ink-soft mt-2">
              Upload resume versions and link them to cases to see performance
              patterns here.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {resumePerformance.map((resume, index) => (
              <div
                key={resume.id}
                className="relative float-in"
                style={{
                  animationDelay: `${index * 80}ms`,
                }}
              >
                <div
                  className={index % 2 === 0 ? "pin-head" : "pin-head-gold"}
                  style={{
                    left: "50%",
                    transform: "translateX(-50%)",
                    top: "-8px",
                  }}
                />

                <div className="paper-card rounded-sm p-5 pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-typewriter text-[10px] uppercase tracking-widest text-ink-soft">
                        Exhibit
                      </div>

                      <h3 className="font-typewriter text-lg text-ink mt-1">
                        {resume.label}
                      </h3>

                      <div className="font-typewriter text-xs text-ink-soft break-all">
                        {resume.fileName}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-typewriter text-[10px] uppercase tracking-widest text-ink-soft">
                        Interview Rate
                      </div>

                      <div className="font-typewriter text-3xl text-stamp">
                        {resume.interviewRate !== null
                          ? `${resume.interviewRate}%`
                          : "—"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                    <div className="paper-card-2 rounded-sm p-2">
                      <div className="font-typewriter text-[10px] uppercase tracking-widest text-ink-soft">
                        Applications
                      </div>

                      <div className="font-typewriter text-xl text-ink">
                        {resume.linkedCount}
                      </div>
                    </div>

                    <div className="paper-card-2 rounded-sm p-2">
                      <div className="font-typewriter text-[10px] uppercase tracking-widest text-ink-soft">
                        Interviews
                      </div>

                      <div className="font-typewriter text-xl text-ink">
                        {resume.linkedCount > 0 ? resume.interviews : "—"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="paper-card rounded-md p-4">
      <div className="font-typewriter text-[10px] uppercase tracking-widest text-ink-soft">
        {label}
      </div>

      <div className="font-typewriter text-2xl text-ink mt-2">
        {value}
      </div>
    </div>
  );
}