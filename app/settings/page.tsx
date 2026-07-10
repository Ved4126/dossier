import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function Settings() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth");
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header>
        <div className="font-typewriter text-[11px] tracking-[0.3em] uppercase text-ink-soft">
          Case Preferences
        </div>

        <h1 className="font-typewriter text-3xl text-ink">
          Settings
        </h1>

        <p className="font-hand text-stamp text-xl mt-1 rotate-[-1deg] inline-block">
          your investigator profile and case defaults.
        </p>
      </header>

      <Section title="Profile">
        <Row label="Full name" value={user.name || "No name saved"} />
        <Row label="Email" value={user.email} />
        <Row label="Member since" value={memberSince} />
      </Section>

      <Section title="Account">
        <Row label="Password" value="••••••••" />
        <Row label="Plan" value="Investigator (Free)" />
        <Row label="Session" value="Active" />
      </Section>

      <Section title="Preferences">
        <Row label="Default status" value="Applied" />
        <Row label="Date format" value="YYYY-MM-DD" />
        <Row label="Dashboard view" value="Case board" />
      </Section>

      <Section title="Connected Accounts">
        <p className="text-sm text-ink-soft">
          Sign in with Google or GitHub — coming soon.
        </p>
      </Section>

      <Section title="Data Controls">
        <p className="text-sm text-ink-soft">
          Export application data, delete account, and advanced privacy controls
          will be added after the core case and resume system is complete.
        </p>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="paper-card-2 rounded-md p-6">
      <h2 className="font-typewriter text-sm uppercase tracking-widest text-ink-soft mb-3">
        {title}
      </h2>

      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-dashed border-paper-edge py-2 last:border-0 gap-4">
      <div className="font-typewriter text-xs uppercase tracking-widest text-ink-soft">
        {label}
      </div>

      <div className="text-ink font-typewriter text-right break-all">
        {value}
      </div>
    </div>
  );
}