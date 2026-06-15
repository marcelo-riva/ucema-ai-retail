"use client";

export function FinalPlanEditor({ fields, onChange }: { fields: Record<string, string>; onChange: (fields: Record<string, string>) => void }) {
  const items = [
    ["tesisFinal", "Tesis final"],
    ["decisiones", "Decisiones adoptadas"],
    ["impacto", "Impacto económico"],
    ["quickWins", "Quick wins"],
    ["roadmap", "Roadmap de implementación"],
    ["riesgos", "Riesgos"],
    ["roi", "ROI esperado"]
  ];
  return (
    <section className="card">
      <div className="eyebrow">Plan final</div>
      <h2>Plan de Captura de Valor 90 días</h2>
      <div className="grid">
        {items.map(([key, label]) => (
          <label className="formField" key={key}>
            <span className="formLabel">{label}</span>
            <textarea value={fields[key] ?? ""} onChange={(event) => onChange({ ...fields, [key]: event.target.value })} />
          </label>
        ))}
      </div>
    </section>
  );
}
