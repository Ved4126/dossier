
export default function Settings() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header>
        <div className="font-typewriter text-[11px] tracking-[0.3em] uppercase text-ink-soft">Case Preferences</div>
        <h1 className="font-typewriter text-3xl text-ink">Settings</h1>
      </header>

      <Section title="Profile">
        <Row label="Full name" value="Jane Doe" />
        <Row label="Email" value="jane@example.com" />
      </Section>

      <Section title="Account">
        <Row label="Password" value="••••••••" />
        <Row label="Plan" value="Investigator (Free)" />
      </Section>

      <Section title="Preferences">
        <Row label="Default status" value="Applied" />
        <Row label="Date format" value="YYYY-MM-DD" />
      </Section>

      <Section title="Connected Accounts">
        <p className="text-sm text-ink-soft">Sign in with Google or GitHub — coming soon.</p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="paper-card-2 rounded-md p-6">
      <h2 className="font-typewriter text-sm uppercase tracking-widest text-ink-soft mb-3">{title}</h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-dashed border-paper-edge py-2 last:border-0">
      <div className="font-typewriter text-xs uppercase tracking-widest text-ink-soft">{label}</div>
      <div className="text-ink font-typewriter">{value}</div>
    </div>
  );
}