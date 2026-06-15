export function TeamHypothesisForm({
  initialHypothesis,
  decisionCriteria,
  risksTradeoffs,
  onInitialHypothesisChange,
  onDecisionCriteriaChange,
  onRisksTradeoffsChange
}: {
  initialHypothesis: string;
  decisionCriteria: string;
  risksTradeoffs: string;
  onInitialHypothesisChange: (value: string) => void;
  onDecisionCriteriaChange: (value: string) => void;
  onRisksTradeoffsChange: (value: string) => void;
}) {
  return (
    <section className="card">
      <div className="eyebrow">Tu recomendación ejecutiva</div>
      <h2>Explicá la decisión en palabras simples</h2>
      <div className="grid">
        <label className="formField">
          <span className="formLabel">Diagnóstico</span>
          <textarea
            onChange={(event) => onInitialHypothesisChange(event.target.value)}
            placeholder="¿Qué problema detectaron en el portfolio? Ejemplo: muchos SKUs de baja rotación inmovilizan capital y aportan poco margen."
            value={initialHypothesis}
          />
        </label>
        <label className="formField">
          <span className="formLabel">Criterios de decisión</span>
          <textarea
            onChange={(event) => onDecisionCriteriaChange(event.target.value)}
            placeholder="¿Qué reglas usaron para clasificar productos como CORE, REVIEW o ELIMINAR? Ejemplo: DDI alto + bajo margen + baja venta = candidato a eliminar."
            value={decisionCriteria}
          />
        </label>
        <label className="formField">
          <span className="formLabel">Riesgos y cuidados</span>
          <textarea
            onChange={(event) => onRisksTradeoffsChange(event.target.value)}
            placeholder="¿Qué podría salir mal si aplican esta decisión? Ejemplo: perder cobertura en una categoría estratégica o liquidar productos con demanda estacional."
            value={risksTradeoffs}
          />
        </label>
      </div>
    </section>
  );
}
