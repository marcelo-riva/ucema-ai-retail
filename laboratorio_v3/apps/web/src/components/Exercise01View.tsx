"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { ExerciseStepLayout } from "./ExerciseStepLayout";
import { WorkbookStatusCard } from "./WorkbookStatusCard";
import { CheckpointForm } from "./labs/CheckpointForm";
import type { Group, SystemScoreboard } from "../types/lab";

const prompt1 = `Usando el workbook del Laboratorio 1, analizá la hoja 03_BASE_SKUS.

Quiero que actúes como analista de inteligencia comercial. Antes de clasificar producto por producto, ayudame a entender el portfolio por familias o categorías.

Devolveme:

1. Qué familias concentran revenue.
2. Qué familias concentran margen bruto.
3. Qué familias tienen mayor stock, DDI o capital inmovilizado.
4. Qué familias tienen más productos suspendidos o con baja rotación.
5. Qué familias muestran caída reciente, margen bajo o señales de riesgo.
6. Qué familias tienen buena cobertura de mercado y podrían ser sensibles si se eliminan productos.
7. Qué señales deberían influir en la decisión de portfolio.
8. Qué tensiones aparecen entre revenue, margen, inventario, cobertura y riesgo comercial.

No completes todavía la clasificación SKU por SKU. Primero quiero entender el negocio por familias y las señales más importantes.`;

const prompt2 = `Usando el análisis por familias de 03_BASE_SKUS, proponé tres escenarios potenciales de optimización de portfolio:

1. Escenario Conservador
2. Escenario Balanceado
3. Escenario Agresivo

Usá estas definiciones:

Escenario Conservador:
Busca reducir destrucción de valor con bajo riesgo comercial. Solo recomienda eliminar SKUs con señales muy claras: suspendidos, margen negativo o muy bajo, baja venta, baja rotación, alto DDI o capital inmovilizado sin aporte relevante. Si hay dudas, el SKU debería quedar en Review.

Escenario Balanceado:
Busca mejorar eficiencia económica sin descuidar demasiado la cobertura. Puede recomendar eliminar SKUs débiles y algunos SKUs Review cuando combinen bajo margen, baja rotación, alto DDI, baja tendencia o capital inmovilizado relevante. Es el escenario base para discutir una primera decisión.

Escenario Agresivo:
Busca liberar capital y simplificar el portfolio más rápido. Puede recomendar eliminar más SKUs Review, especialmente si tienen alto capital inmovilizado, DDI alto, margen bajo, tendencia negativa o baja relevancia comercial. Acepta mayor riesgo de revenue, margen, cobertura y leakage comercial.

Para cada escenario, devolveme:

1. Qué objetivo prioriza.
2. Qué tipo de SKUs tendería a mantener como Core.
3. Qué tipo de SKUs tendería a dejar en Review.
4. Qué tipo de SKUs tendería a Eliminar.
5. Qué impacto potencial podría tener sobre cobertura.
6. Qué impacto potencial podría tener sobre capital inmovilizado.
7. Qué impacto potencial podría tener sobre margen generado.
8. Qué revenue podría quedar en riesgo.
9. Qué margen podría quedar en riesgo.
10. Qué leakage comercial podría generar.
11. Qué riesgos debería revisar el equipo antes de ejecutar.
12. Qué escenario recomendarías como base para clasificar SKU por SKU y por qué.

No clasifiques todavía todos los SKUs.
No presentes los impactos como predicciones exactas.
Presentalos como lectura estratégica y trade-offs potenciales.
Separá hallazgos basados en datos de hipótesis o supuestos.`;

const prompt3 = `Usando el workbook del Laboratorio 1, trabajá con estas hojas:

- 03_BASE_SKUS: usala como fuente de datos del negocio.
- 06_PORTFOLIO: usala como hoja de trabajo para completar la propuesta de portfolio.

No modifiques la hoja 03_BASE_SKUS. La clasificación debe completarse o proponerse en 06_PORTFOLIO.

Antes de clasificar, usá como criterio estratégico el escenario elegido por el equipo:

Escenario elegido: [Conservador / Balanceado / Agresivo]
Prioridad estratégica: [Generación de caja / Rentabilidad / Crecimiento o cobertura]

Usá la prioridad estratégica como criterio dominante cuando haya tensiones entre variables:

- Si la prioridad es Generación de caja, pesá más capital inmovilizado, DDI, stock actual y oportunidad de liquidación/no reposición.
- Si la prioridad es Rentabilidad, pesá más margen bruto, margen porcentual, contribución económica y destrucción de valor.
- Si la prioridad es Crecimiento o cobertura, pesá más cobertura de mercado, revenue, familias estratégicas, disponibilidad y riesgo de leakage comercial.

No ignores las demás variables, pero explicá cómo la prioridad elegida influyó en la clasificación.

Quiero que actúes como analista de inteligencia comercial. El objetivo es construir una primera estrategia de portfolio y completar una propuesta por SKU.

Clasificá cada SKU usando estas categorías:

Core:
Producto a proteger, sostener o potenciar. Usalo para SKUs activos con alta contribución a revenue o margen, tendencia estable o positiva, margen saludable, buena cobertura, relevancia comercial o riesgo alto si se discontinuaran.

Review:
Producto que requiere revisión antes de decidir. Usalo para SKUs con señales mixtas: buen revenue pero margen bajo, buen margen pero baja rotación, stock alto, DDI elevado, caída reciente, precio desalineado, cobertura relevante, datos contradictorios o dudas comerciales.

Eliminar:
Producto candidato a salida controlada, liquidación o no reposición. Usalo para SKUs suspendidos o con baja contribución, margen bajo o negativo, tendencia negativa, baja rotación, alto capital inmovilizado sin justificación o bajo riesgo comercial si se retiran.

Aplicá estas reglas según el escenario elegido:

- Si el escenario elegido es Conservador, ante dudas marcá Review. Solo recomendá Eliminar cuando las señales sean claras.
- Si el escenario elegido es Balanceado, decidí según el balance entre contribución económica, capital inmovilizado, margen, cobertura y riesgo comercial.
- Si el escenario elegido es Agresivo, podés recomendar Eliminar en más casos, pero debés explicitar el leakage comercial y el riesgo de cobertura.

Completá o proponé valores para estas columnas de 06_PORTFOLIO:

- decision_portfolio: Core / Review / Eliminar.
- action_90_days: acción recomendada para los próximos 90 días.
- decision_reason: razón principal de la clasificación.
- priority: Alta / Media / Baja.
- commercial_risk: principal riesgo comercial.
- ai_comment: comentario breve que explique la lógica de la recomendación.
- team_comment: dejar vacío salvo que el equipo quiera corregir o desafiar la recomendación.

Criterio para priority:

- Alta: requiere acción rápida por alto impacto, alto riesgo, alto capital inmovilizado, riesgo de quiebre, leakage comercial o decisión crítica.
- Media: relevante, pero no urgente o de impacto moderado.
- Baja: bajo impacto, bajo riesgo o baja urgencia.

Importante:
- No inventes datos.
- Si una variable no existe o no es clara, aclaralo.
- No clasifiques usando una sola variable aislada.
- Si el caso es dudoso, marcá Review.
- Separá hallazgos basados en datos de hipótesis.
- Priorizá la explicación comercial por sobre la aparente precisión matemática.
- Aclará cuando una recomendación dependa del escenario elegido.

Si no podés editar el archivo directamente, devolveme una tabla lista para copiar a 06_PORTFOLIO, respetando sku_id y las columnas solicitadas.`;

const prompt4 = `Usá la hoja 06_PORTFOLIO ya completada como fuente principal para resumir cómo quedó el portfolio. Si necesitás revenue, margen, stock, DDI, cobertura o familia, cruzalo contra 03_BASE_SKUS usando sku_id.

El escenario elegido fue:

Escenario elegido: [Conservador / Balanceado / Agresivo]
Prioridad estratégica: [Generación de caja / Rentabilidad / Crecimiento o cobertura]

Devolveme:

1. Cantidad total de SKUs clasificados como Core, Review y Eliminar.
2. Cantidad de SKUs en cada clasificación por familia o categoría.
3. Revenue total asociado a cada clasificación.
4. Margen bruto total asociado a cada clasificación.
5. Margen porcentual promedio o rango relevante por clasificación.
6. Stock actual asociado a cada clasificación.
7. Capital inmovilizado asociado a cada clasificación.
8. Capital potencialmente liberable por SKUs candidatos a eliminación.
9. Cobertura actual del portfolio.
10. Cobertura final estimada según la clasificación propuesta.
11. Revenue histórico asociado a SKUs candidatos a eliminación.
12. Margen histórico asociado a SKUs candidatos a eliminación.
13. Margen positivo en riesgo.
14. Margen negativo o destrucción de valor que podría evitarse.
15. Leakage comercial estimado.
16. Principales familias donde se concentra la decisión de Eliminar.
17. Principales familias donde se concentra la decisión de Review.
18. Principales familias que quedan como Core.
19. Riesgos comerciales de ejecutar el escenario elegido.
20. Qué decisiones deberían revisarse manualmente antes de ejecutar.

Compará:
- Antes: portfolio sin decisión explícita.
- Después: portfolio clasificado en Core / Review / Eliminar bajo el escenario elegido.

Definiciones sugeridas:
- Capital inmovilizado: current_inventory_value.
- Capital potencialmente liberable: current_inventory_value de SKUs clasificados como Eliminar.
- Cobertura actual: cobertura del portfolio antes de ejecutar decisiones.
- Cobertura final: cobertura estimada del portfolio que queda como Core o Review.
- Revenue en riesgo: revenue_12m asociado a SKUs clasificados como Eliminar.
- Margen en riesgo: gross_margin_12m positivo asociado a SKUs clasificados como Eliminar.
- Leakage comercial: pérdida potencial de valor comercial por eliminar SKUs que todavía tenían revenue, margen, cobertura o valor estratégico.
- Destrucción de valor evitada: margen negativo o bajo retorno asociado a SKUs que podrían salir del portfolio.

Importante:
- No presentes el impacto como resultado financiero garantizado.
- Hablá de impacto potencial, exposición asociada o capital potencialmente liberable.
- Si no podés calcular alguna métrica con los datos disponibles, aclaralo.
- Separá datos calculados de supuestos.
- Marcá qué supuestos debería validar el negocio antes de ejecutar.
- No ocultes riesgos del escenario elegido.

Cerrá con un resumen ejecutivo de 5 bullets sobre cómo impacta esta decisión al negocio.

Después cerrá tu respuesta con una sección llamada "Respuesta para plataforma" usando exactamente estos 5 bloques:

1. Resumen de clasificación
2. Escenario recomendado o elegido
3. Impacto potencial en el negocio
4. Decisiones a revisar antes de ejecutar
5. Datos o supuestos a validar`;

const metrics = [
  "Revenue total.",
  "Margen bruto total.",
  "Margen porcentual.",
  "Unidades vendidas.",
  "Stock actual.",
  "DDI.",
  "Capital inmovilizado.",
  "Tendencia reciente.",
  "Estatus activo o suspendido.",
  "Cobertura de mercado.",
  "Precio vs mercado, si está disponible.",
  "Elasticidad proxy, si está disponible."
];

const criteria = [
  {
    key: "core",
    title: "Core",
    subtitle: "Proteger, sostener o potenciar",
    description: "Productos relevantes para el negocio que conviene cuidar o desarrollar.",
    when: [
      "Alta contribución a revenue.",
      "Alta contribución a margen.",
      "Margen saludable.",
      "Tendencia estable o positiva.",
      "Buena cobertura de mercado.",
      "Relevancia dentro de una familia importante.",
      "Riesgo alto si se discontinúa."
    ],
    actions: [
      "Mantener disponibilidad.",
      "Cuidar stock.",
      "Revisar pricing con prudencia.",
      "Priorizar abastecimiento.",
      "Potenciar si la demanda crece."
    ]
  },
  {
    key: "review",
    title: "Review",
    subtitle: "Revisar antes de decidir",
    description: "Productos con señales mixtas que requieren análisis adicional.",
    when: [
      "Buen revenue pero margen bajo.",
      "Buen margen pero baja rotación.",
      "Stock alto.",
      "DDI elevado.",
      "Capital inmovilizado relevante.",
      "Tendencia negativa.",
      "Precio desalineado.",
      "Cobertura relevante pero eficiencia económica dudosa.",
      "Datos contradictorios o insuficientes."
    ],
    actions: [
      "Revisar precio.",
      "Ajustar forecast.",
      "Validar con negocio.",
      "Reducir compras.",
      "Hacer prueba comercial.",
      "Promoción selectiva."
    ]
  },
  {
    key: "eliminate",
    title: "Eliminar",
    subtitle: "Salida controlada, liquidación o no reposición",
    description: "Productos candidatos a salir del portfolio activo. No significa borrarlos sin análisis.",
    when: [
      "Producto suspendido.",
      "Margen negativo o muy bajo.",
      "Baja contribución a revenue.",
      "Baja contribución a margen.",
      "Baja rotación.",
      "Tendencia negativa.",
      "Alto DDI.",
      "Alto capital inmovilizado sin justificación.",
      "Bajo riesgo comercial si se retira.",
      "Baja cobertura o baja relevancia dentro de la familia."
    ],
    actions: [
      "Liquidar stock.",
      "No reponer.",
      "Devolver a proveedor si aplica.",
      "Promoción de salida.",
      "Discontinuar del catálogo activo."
    ]
  }
];

const scenarios = [
  {
    key: "conservative",
    title: "Escenario Conservador",
    objective: "Reducir destrucción de valor con bajo riesgo comercial.",
    logic: "Solo recomienda eliminar SKUs donde la evidencia es fuerte. Prioriza proteger revenue, margen existente y cobertura de mercado.",
    eliminate: [
      "SKUs suspendidos.",
      "SKUs con margen negativo o muy bajo.",
      "SKUs con baja venta.",
      "SKUs con baja rotación.",
      "SKUs con alto DDI.",
      "SKUs con capital inmovilizado sin aporte relevante.",
      "SKUs con bajo riesgo comercial si salen."
    ],
    maintain: [
      "SKUs con buen revenue, aunque tengan problemas de margen.",
      "SKUs con buena cobertura.",
      "SKUs con valor estratégico dentro de una familia.",
      "SKUs donde hay dudas de datos.",
      "SKUs cuya salida podría generar leakage comercial."
    ],
    tradeoff: "Libera menos caja y simplifica menos el portfolio, pero reduce el riesgo de eliminar productos comercialmente relevantes."
  },
  {
    key: "balanced",
    title: "Escenario Balanceado",
    objective: "Mejorar eficiencia económica sin descuidar demasiado la cobertura comercial.",
    logic: "Combina liberación de capital, mejora de margen y cuidado de revenue. Es el escenario base para discutir una primera decisión de portfolio.",
    eliminate: [
      "SKUs claramente débiles.",
      "SKUs con bajo margen y baja rotación.",
      "SKUs con DDI alto.",
      "SKUs con capital inmovilizado relevante y baja contribución.",
      "SKUs con tendencia negativa.",
      "SKUs Review donde se combinan varias señales negativas."
    ],
    maintain: [
      "SKUs con buen margen.",
      "SKUs con buen revenue.",
      "SKUs relevantes para familias estratégicas.",
      "SKUs con cobertura importante.",
      "SKUs con leakage comercial medio o alto."
    ],
    tradeoff: "Libera más caja que el escenario conservador y mejora la eficiencia del portfolio, pero asume cierto riesgo de revenue, margen o cobertura."
  },
  {
    key: "aggressive",
    title: "Escenario Agresivo",
    objective: "Simplificar el portfolio y liberar capital rápidamente.",
    logic: "Acepta mayor riesgo comercial para acelerar la salida de SKUs ineficientes, dudosos o con alto capital inmovilizado.",
    eliminate: [
      "SKUs débiles.",
      "Más SKUs Review.",
      "SKUs con alto capital inmovilizado.",
      "SKUs con DDI alto.",
      "SKUs con margen bajo aunque todavía vendan.",
      "SKUs con tendencia negativa.",
      "SKUs con baja cobertura.",
      "SKUs con baja relevancia relativa dentro de su familia."
    ],
    maintain: [
      "Core claros.",
      "SKUs con alto revenue.",
      "SKUs con alto margen.",
      "SKUs con cobertura crítica.",
      "SKUs cuya eliminación generaría leakage comercial alto."
    ],
    tradeoff: "Libera más caja y simplifica más el portfolio, pero puede generar mayor pérdida de revenue, margen, cobertura y leakage comercial."
  }
];

const priorities = [
  {
    key: "cash",
    title: "Generación de caja",
    when: "Conviene elegirla cuando el negocio necesita mejorar liquidez, reducir inventario excedente o acelerar la salida de productos con baja rotación.",
    focus: [
      "Capital inmovilizado.",
      "Stock actual.",
      "DDI elevado.",
      "Baja rotación.",
      "Productos suspendidos.",
      "SKUs con bajo aporte económico relativo.",
      "Oportunidad de liquidación o no reposición."
    ],
    risk: "Liberar caja a costa de perder algo de cobertura, revenue o margen futuro."
  },
  {
    key: "profitability",
    title: "Rentabilidad",
    when: "Conviene elegirla cuando el negocio necesita proteger margen, reducir productos que destruyen valor o concentrarse en SKUs con mejor contribución.",
    focus: [
      "Margen bruto generado.",
      "Margen porcentual.",
      "SKUs con margen negativo o muy bajo.",
      "Revenue con baja contribución económica.",
      "Productos que venden, pero aportan poco margen.",
      "Relación entre margen, stock y rotación.",
      "Riesgo de sostener productos que ocupan capital sin generar valor suficiente."
    ],
    risk: "Mejorar margen, pero afectar revenue, cobertura o presencia comercial si se eliminan productos relevantes para el cliente."
  },
  {
    key: "growth",
    title: "Crecimiento o cobertura",
    when: "Conviene elegirla cuando el negocio está priorizando expansión, defensa de mercado, disponibilidad o cobertura de categorías estratégicas.",
    focus: [
      "Cobertura de mercado.",
      "Revenue actual.",
      "Familias estratégicas.",
      "SKUs que sostienen variedad o profundidad de oferta.",
      "Riesgo de perder clientes por discontinuar productos relevantes.",
      "Sustitutos disponibles dentro del portfolio.",
      "Leakage comercial por eliminar productos con valor de cobertura."
    ],
    risk: "Sostener cobertura a costa de mantener capital inmovilizado, baja rotación o menor rentabilidad."
  }
];

const impactVariables = [
  { term: "Cobertura actual", definition: "Nivel de cobertura del portfolio antes de tomar decisiones de eliminación." },
  { term: "Cobertura final estimada", definition: "Nivel de cobertura esperado si se ejecuta el escenario. No debe interpretarse como predicción exacta, sino como exposición o riesgo potencial." },
  { term: "Capital inmovilizado", definition: "Valor de inventario asociado a los SKUs actuales." },
  { term: "Capital potencialmente liberable", definition: "Valor de inventario asociado a los SKUs candidatos a eliminación, liquidación o no reposición. No significa caja garantizada. Es capital que podría liberarse parcial o progresivamente." },
  { term: "Margen generado", definition: "Margen histórico asociado a los SKUs o familias analizadas." },
  { term: "Revenue en riesgo", definition: "Revenue histórico asociado a SKUs candidatos a eliminación. No significa que todo ese revenue se pierda, pero sí que queda expuesto por la decisión." },
  { term: "Margen en riesgo", definition: "Margen histórico positivo asociado a SKUs candidatos a eliminación." },
  { term: "Leakage comercial", definition: "Pérdida potencial de valor comercial por eliminar SKUs que todavía tenían revenue, margen, cobertura o valor estratégico." }
];

function CopyPromptBlock({ label, intro, prompt }: { label: string; intro: string; prompt: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="promptSingle">
      <div className="promptSingleHeader">
        <span>{label}</span>
        <button
          aria-label={copied ? "Copiado" : "Copiar prompt"}
          className="iconButton"
          onClick={copy}
          type="button"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <div className="panel" style={{ margin: 0, border: "none", borderRadius: 0, background: "rgba(255,255,255,0.72)" }}>
        <p className="muted" style={{ margin: 0 }}>{intro}</p>
      </div>
      <pre>{prompt}</pre>
    </div>
  );
}

export function Exercise01View({
  group,
  stateVersion,
  scoreboard,
  onSave: _onSave,
  onSubmit: _onSubmit
}: {
  group: Group;
  stateVersion: string;
  scoreboard: SystemScoreboard;
  onSave?: (payload: { fields: Record<string, string>; confirmations: Record<string, boolean>; workbookName?: string; reportName?: string }) => Promise<void>;
  onSubmit?: (payload: { fields: Record<string, string>; confirmations: Record<string, boolean>; workbookName?: string; reportName?: string; requiredFields: string[]; requiredConfirmations: string[] }) => Promise<void>;
}) {
  return (
    <ExerciseStepLayout
      eyebrow="AI Revenue & Inventory Copilot"
      title="Ejercicio 1: Portfolio Optimization"
      subtitle="Clasificar SKUs como Core, Review o Eliminar bajo un escenario y una prioridad estratégica."
      meta={[
        { label: "Grupo", value: group.name },
        { label: "Estado", value: stateVersion },
        { label: "Workbook", value: "único" },
        { label: "Checkpoint", value: "borrador" }
      ]}
    >
      <WorkbookStatusCard stateVersion={stateVersion} lastWorkbookName={scoreboard.lastWorkbookName} />

      <section className="card">
        <div className="eyebrow">Objetivo</div>
        <h2>Qué estás resolviendo</h2>
        <p className="muted">
          En este ejercicio vas a definir una primera estrategia de portfolio.
        </p>
        <p className="muted">
          Una estrategia de portfolio no se define producto por producto a ojo. Primero necesitás entender cómo se comporta el negocio por familias o categorías: dónde está el revenue, dónde está el margen, dónde hay inventario inmovilizado, qué productos están suspendidos y dónde aparecen señales de caída o riesgo.
        </p>
        <p className="muted">
          Después vas a explorar escenarios estratégicos, elegir una prioridad de negocio y usar tu AI personal para aplicar ese criterio SKU por SKU en el workbook.
        </p>
        <p className="muted">
          La decisión operativa por producto queda en el Excel. La síntesis del impacto, los riesgos y la decisión estratégica quedan en la plataforma.
        </p>
      </section>

      <section className="card" style={{ background: "rgba(15, 107, 93, 0.06)", borderColor: "var(--brand)" }}>
        <div className="eyebrow" style={{ color: "var(--brand-strong)" }}>Parte A</div>
        <h2>Entender el criterio de portfolio</h2>
        <p className="muted">
          Antes de pedirle a la IA que clasifique productos, revisá cómo pensar Core, Review y Eliminar. La plataforma te da el marco conceptual; después la IA te ayuda a aplicarlo al negocio real.
        </p>
      </section>

      <section className="card">
        <div className="eyebrow">Criterios</div>
        <h2>Criterios de decisión de portfolio</h2>
        <p className="muted">
          Usá estos criterios para orientar la clasificación. No son reglas rígidas: la IA propone una primera lectura y el equipo revisa los casos críticos o dudosos.
        </p>
        <div className="criterionGrid">
          {criteria.map((criterion) => (
            <article className="criterionCard" key={criterion.key}>
              <div className="criterionHeader">
                <h3>{criterion.title}</h3>
                <span>{criterion.subtitle}</span>
              </div>
              <p className="muted">{criterion.description}</p>
              <div className="criterionBlock">
                <strong>Cuándo usarlo</strong>
                <ul className="simpleList">
                  {criterion.when.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="criterionBlock">
                <strong>Acciones típicas</strong>
                <ul className="simpleList">
                  {criterion.actions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="eyebrow">Métricas</div>
        <h2>Métricas que ayudan a decidir</h2>
        <p className="muted">
          Para aplicar el criterio, mirá señales combinadas. No clasifiques usando una sola variable aislada.
        </p>
        <ul className="simpleList">
          {metrics.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <div className="eyebrow">Prompt 1</div>
        <h2>Lectura por familias</h2>
        <CopyPromptBlock
          intro="Usá este prompt para que tu AI personal identifique familias motor, familias con riesgo, stock atrapado, tensiones comerciales y señales relevantes para la decisión de portfolio."
          label="Prompt recomendado"
          prompt={prompt1}
        />
      </section>

      <section className="card" style={{ background: "rgba(191, 111, 40, 0.06)", borderColor: "var(--accent)" }}>
        <div className="eyebrow" style={{ color: "var(--accent)" }}>Parte B</div>
        <h2>Explorar escenarios estratégicos</h2>
        <p className="muted">
          Antes de clasificar SKU por SKU, vas a usar la IA para explorar posibles escenarios de optimización.
        </p>
        <p className="muted">
          Los escenarios no son tres respuestas correctas distintas. Son tres formas de expresar el apetito de riesgo del negocio. El escenario elegido define qué tan prudente o exigente será la IA al recomendar la salida de SKUs. No cambia los datos. Cambia el criterio de decisión.
        </p>
      </section>

      <section className="card">
        <div className="eyebrow">Escenarios</div>
        <h2>Escenarios de optimización</h2>
        <div className="criterionGrid">
          {scenarios.map((scenario) => (
            <article className="criterionCard" key={scenario.key}>
              <div className="criterionHeader">
                <h3>{scenario.title}</h3>
                <span>{scenario.objective}</span>
              </div>
              <p className="muted">{scenario.logic}</p>
              <div className="criterionBlock">
                <strong>Tiende a eliminar</strong>
                <ul className="simpleList">
                  {scenario.eliminate.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="criterionBlock">
                <strong>Tiende a mantener o revisar</strong>
                <ul className="simpleList">
                  {scenario.maintain.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="criterionBlock">
                <strong>Trade-off</strong>
                <p className="muted" style={{ margin: 0 }}>{scenario.tradeoff}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="eyebrow">Variables de impacto</div>
        <h2>Variables que deben aparecer en el análisis de escenarios</h2>
        <p className="muted">
          Para comparar escenarios, la IA debe mirar especialmente:
        </p>
        <div className="grid two">
          {impactVariables.map((variable) => (
            <div className="panel" key={variable.term}>
              <strong>{variable.term}</strong>
              <p className="muted" style={{ margin: "6px 0 0" }}>{variable.definition}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="eyebrow">Prompt 2</div>
        <h2>Explorar escenarios potenciales</h2>
        <CopyPromptBlock
          intro="Usá este prompt para que la IA proponga tres escenarios y compare sus trade-offs antes de clasificar SKU por SKU."
          label="Prompt recomendado"
          prompt={prompt2}
        />
      </section>

      <section className="card" style={{ background: "rgba(15, 107, 93, 0.06)", borderColor: "var(--brand)" }}>
        <div className="eyebrow" style={{ color: "var(--brand-strong)" }}>Parte C</div>
        <h2>Elegir escenario y prioridad estratégica</h2>
        <p className="muted">
          Ahora el equipo debe elegir con qué lógica quiere clasificar el portfolio. La IA puede recomendar un escenario, pero la decisión es del equipo.
        </p>
      </section>

      <section className="card">
        <div className="eyebrow">Escenario</div>
        <h2>Elegí un escenario</h2>
        <ul className="simpleList">
          <li>Conservador.</li>
          <li>Balanceado.</li>
          <li>Agresivo.</li>
        </ul>
      </section>

      <section className="card">
        <div className="eyebrow">Prioridad</div>
        <h2>Elegí una prioridad estratégica</h2>
        <div className="criterionGrid">
          {priorities.map((priority) => (
            <article className="criterionCard" key={priority.key}>
              <div className="criterionHeader">
                <h3>{priority.title}</h3>
              </div>
              <p className="muted">{priority.when}</p>
              <div className="criterionBlock">
                <strong>Prestá especial atención a</strong>
                <ul className="simpleList">
                  {priority.focus.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="criterionBlock">
                <strong>Riesgo principal</strong>
                <p className="muted" style={{ margin: 0 }}>{priority.risk}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="eyebrow">Combinación</div>
        <h2>Cómo se combinan escenario y prioridad</h2>
        <p className="muted">
          El escenario define el nivel de agresividad de la decisión. La prioridad estratégica define el objetivo de negocio dominante.
        </p>
        <p className="muted">
          Por ejemplo:
        </p>
        <ul className="simpleList">
          <li>Un escenario Conservador + prioridad Caja buscará liberar capital, pero solo en casos muy claros.</li>
          <li>Un escenario Balanceado + prioridad Rentabilidad buscará mejorar margen sin desarmar demasiado el portfolio.</li>
          <li>Un escenario Agresivo + prioridad Caja aceptará mayor riesgo comercial para liberar más capital.</li>
          <li>Un escenario Conservador + prioridad Cobertura tenderá a proteger más SKUs y dejar más casos en Review.</li>
          <li>Un escenario Agresivo + prioridad Rentabilidad puede eliminar SKUs de bajo margen aunque todavía tengan algo de revenue.</li>
        </ul>
        <p className="muted">
          La IA debe usar ambas decisiones como marco: el escenario indica qué tan prudente o agresiva debe ser la recomendación; la prioridad indica qué variable debe pesar más cuando haya trade-offs.
        </p>
        <div className="panel">
          <strong>Reglas generales</strong>
          <ul className="simpleList">
            <li><strong>Conservador:</strong> ante la duda, marcá Review. Eliminá solo SKUs con señales fuertes de destrucción de valor, baja rotación, margen negativo, producto suspendido o capital inmovilizado sin justificación.</li>
            <li><strong>Balanceado:</strong> buscá equilibrio entre contribución económica, capital inmovilizado y riesgo comercial. Podés eliminar SKUs con señales mixtas negativas, pero tenés que cuidar cobertura, revenue y margen.</li>
            <li><strong>Agresivo:</strong> podés recomendar eliminación en más casos, pero debés explicitar el leakage comercial, el riesgo de cobertura y el impacto potencial en revenue o margen.</li>
          </ul>
        </div>
      </section>

      <section className="card" style={{ background: "rgba(191, 111, 40, 0.06)", borderColor: "var(--accent)" }}>
        <div className="eyebrow" style={{ color: "var(--accent)" }}>Parte D</div>
        <h2>Aplicar el criterio y resumir impacto</h2>
        <p className="muted">
          Ahora usá tu AI personal para aplicar el escenario y la prioridad elegidos al workbook. La IA debería completar la hoja 06_PORTFOLIO y después generar un reporte de impacto.
        </p>
      </section>

      <section className="card">
        <div className="eyebrow">Prompt 3</div>
        <h2>Completar decisiones SKU por SKU</h2>
        <CopyPromptBlock
          intro="Usá este prompt para que la IA clasifique SKU por SKU en 06_PORTFOLIO, usando el escenario y la prioridad estratégica elegidos por el equipo."
          label="Prompt recomendado"
          prompt={prompt3}
        />
      </section>

      <section className="card">
        <div className="eyebrow">Prompt 4</div>
        <h2>Reporte final</h2>
        <CopyPromptBlock
          intro="Usá este prompt para que la IA resuma el portfolio resultante, el impacto potencial y los riesgos comerciales, usando 06_PORTFOLIO y 03_BASE_SKUS."
          label="Prompt recomendado"
          prompt={prompt4}
        />
      </section>

      <section className="card">
        <div className="eyebrow">Subir workbook</div>
        <h2>Subí el workbook actualizado</h2>
        <p className="muted">
          Cuando el equipo haya revisado la propuesta y completado el workbook, subí el archivo actualizado para registrar el checkpoint del Ejercicio 1.
        </p>
      </section>

      <CheckpointForm
        exerciseId="ex-01"
        exerciseVersion={1}
        fields={[
          {
            id: "classification_summary",
            label: "1. Resumen de clasificación",
            type: "textarea",
            placeholder: "Ejemplo: cuántos SKUs quedaron como Core, Review y Eliminar, y en qué familias se concentran.",
            required: true
          },
          {
            id: "selected_scenario",
            label: "2. Escenario recomendado o elegido",
            type: "textarea",
            placeholder: "Ejemplo: escenario Conservador, Balanceado o Agresivo; prioridad estratégica elegida; y por qué ese escenario tiene sentido para el caso.",
            required: true
          },
          {
            id: "business_impact",
            label: "3. Impacto potencial en el negocio",
            type: "textarea",
            placeholder: "Ejemplo: capital potencialmente liberable, cobertura final estimada, revenue en riesgo, margen en riesgo, margen negativo evitado o leakage comercial.",
            required: true
          },
          {
            id: "decisions_to_review",
            label: "4. Decisiones a revisar antes de ejecutar",
            type: "textarea",
            placeholder: "Ejemplo: casos dudosos, SKUs críticos, familias sensibles, productos con alto revenue, productos con buena cobertura o decisiones que requieren validación con negocio.",
            required: true
          },
          {
            id: "assumptions_to_validate",
            label: "5. Datos o supuestos a validar",
            type: "textarea",
            placeholder: "Ejemplo: supuestos de recupero de inventario, calidad del dato de cobertura, vigencia de precios, sustitutos disponibles, elasticidad, tendencia de demanda o reglas usadas por la IA.",
            required: true
          }
        ]}
        saveLabel="Guardar checkpoint"
        submitLabel="Subir checkpoint del workbook"
      />
    </ExerciseStepLayout>
  );
}
