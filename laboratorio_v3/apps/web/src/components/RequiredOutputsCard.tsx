export function RequiredOutputsCard({ title = "Output esperado", required, recommended, preview }: { title?: string; required: string[]; recommended?: string[]; preview?: string[] }) {
  return (
    <section className="card">
      <div className="eyebrow">{title}</div>
      <h2>Qué completar en el workbook</h2>
      <div className="deliverableList">
        {required.map((item) => (
          <article key={item}>
            <strong>Obligatorio</strong>
            <p>{item}</p>
          </article>
        ))}
        {(recommended ?? []).map((item) => (
          <article key={item}>
            <strong>Recomendado</strong>
            <p>{item}</p>
          </article>
        ))}
        {(preview ?? []).map((item) => (
          <article key={item}>
            <strong>Preview</strong>
            <p>{item}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
