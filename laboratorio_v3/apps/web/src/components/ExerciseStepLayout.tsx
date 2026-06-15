import { AppShell } from "./AppShell";

export function ExerciseStepLayout({
  eyebrow,
  title,
  subtitle,
  meta,
  children
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  meta: Array<{ label: string; value: string }>;
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      <header className="caseHeader">
        <div>
          <div className="eyebrow">{eyebrow}</div>
          <h1>{title}</h1>
          <p className="lead">{subtitle}</p>
        </div>
        <div className="caseMeta">
          {meta.map((item) => (
            <div key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </header>
      <div className="grid" style={{ gap: 22 }}>{children}</div>
    </AppShell>
  );
}
