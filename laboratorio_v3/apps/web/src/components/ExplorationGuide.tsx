const mainQuestions = [
  "¿Qué categorías concentran mayor revenue?",
  "¿Qué productos tienen bajo margen o margen negativo?",
  "¿Qué productos tienen mucho stock o DDI alto?",
  "¿Qué productos venden poco pero ocupan capital?",
  "¿Qué productos conviene revisar antes de eliminar porque pueden tener rol comercial?"
];

const advancedQuestions = [
  "¿Qué SKUs muestran caída de unidades en los últimos 3 meses?",
  "¿Qué SKUs parecen estacionales?",
  "¿Qué productos tienen suba de costos no trasladada a precios?",
  "¿Qué productos deberían pasar a pricing review antes de discontinuarse?",
  "¿Qué productos deberían liquidarse en los próximos 90 días?"
];

export function ExplorationGuide() {
  return (
    <section className="card">
      <div className="eyebrow">Guía de exploración</div>
      <h2>Antes de decidir, explorá la base</h2>
      <p className="muted">
        Estas preguntas te ayudan a mirar ventas, margen y stock antes de clasificar
        productos. Capital inmovilizado significa dinero atrapado en stock.
      </p>
      <div className="questionGrid">
        {mainQuestions.map((question) => (
          <div className="questionItem" key={question}>
            {question}
          </div>
        ))}
      </div>
      <details className="simpleDetails">
        <summary>Ver preguntas avanzadas</summary>
        <div className="questionGrid" style={{ marginTop: 12 }}>
          {advancedQuestions.map((question) => (
            <div className="questionItem" key={question}>
              {question}
            </div>
          ))}
        </div>
      </details>
    </section>
  );
}
