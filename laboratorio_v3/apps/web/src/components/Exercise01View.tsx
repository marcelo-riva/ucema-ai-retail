"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { ExerciseCheckpointForm } from "./ExerciseCheckpointForm";
import { ExerciseStepLayout } from "./ExerciseStepLayout";
import { WorkbookStatusCard } from "./WorkbookStatusCard";
import type { Group, LabCheckpoint, SystemScoreboard } from "../types/lab";

const prompt1 = `Usando el workbook del Laboratorio 1, analizá la hoja de SKUs.

Quiero que actúes como analista de inteligencia comercial. Antes de clasificar producto por producto, ayudame a entender el portfolio por familias o categorías.

Devolveme:

1. Qué familias concentran revenue.
2. Qué familias concentran margen.
3. Qué familias tienen mayor stock, DDI o capital inmovilizado.
4. Qué familias tienen más productos suspendidos o con baja rotación.
5. Qué familias muestran caída reciente, margen bajo o señales de riesgo.
6. Qué señales deberían influir en la decisión de portfolio.

No completes todavía la clasificación SKU por SKU. Primero quiero entender el negocio por familias y las señales más importantes.`;

const prompt2 = `Usando el workbook del Laboratorio 1, analizá la hoja de SKUs y la hoja de portfolio.

Quiero que actúes como analista de inteligencia comercial. El objetivo es construir una primera estrategia de portfolio y completar una propuesta por SKU.

Clasificá cada SKU usando estas categorías:

Core:
Producto a proteger, sostener o potenciar. Usalo para SKUs activos con alta contribución a revenue o margen, tendencia estable o positiva, margen saludable, relevancia comercial o riesgo alto si se discontinuaran.

Review:
Producto que requiere revisión antes de decidir. Usalo para SKUs con señales mixtas: buen revenue pero margen bajo, buen margen pero baja rotación, stock alto, DDI elevado, caída reciente, precio desalineado, datos contradictorios o dudas comerciales.

Eliminar:
Producto candidato a salida controlada, liquidación o no reposición. Usalo para SKUs suspendidos o con baja contribución, margen bajo o negativo, tendencia negativa, baja rotación, alto capital inmovilizado sin justificación o bajo riesgo comercial si se retiran.

Completá o proponé valores para estas columnas del workbook:

- decision_portfolio: Core / Review / Eliminar.
- action_90_days: acción recomendada para los próximos 90 días.
- decision_reason: razón principal de la clasificación.
- priority: Alta / Media / Baja.
- commercial_risk: principal riesgo comercial.
- ai_comment: comentario breve que explique la lógica de la recomendación.
- team_comment: dejar vacío salvo que el equipo quiera corregir o desafiar la recomendación.

Criterio para priority:
- Alta: requiere acción rápida por alto impacto, alto riesgo, alto capital inmovilizado, riesgo de quiebre o decisión crítica.
- Media: relevante, pero no urgente o de impacto moderado.
- Baja: bajo impacto, bajo riesgo o baja urgencia.

Importante:
- No inventes datos.
- Si una variable no existe o no es clara, aclaralo.
- No clasifiques usando una sola variable aislada.
- Si el caso es dudoso, marcá Review.
- Separá hallazgos basados en datos de hipótesis.
- Priorizá la explicación comercial por sobre la aparente precisión matemática.`;

const prompt3 = `Ahora analizá cómo quedó el portfolio después de completar la clasificación Core / Review / Eliminar.

Necesito un resumen para contestar en la plataforma.

Devolveme:

1. Cantidad total de SKUs clasificados como Core, Review y Eliminar.
2. Cantidad de SKUs en cada clasificación por familia o categoría.
3. Revenue total asociado a cada clasificación.
4. Margen bruto total asociado a cada clasificación.
5. Stock actual y capital inmovilizado asociado a cada clasificación.
6. Principales familias donde se concentra la decisión de Eliminar.
7. Principales familias donde se concentra la decisión de Review.
8. Principales familias que quedan como Core.
9. Riesgos comerciales de la nueva clasificación.
10. Qué decisiones deberían revisarse manualmente antes de ejecutar.

Si es posible, compará:
- Antes: portfolio sin decisión explícita.
- Después: portfolio clasificado en Core / Review / Eliminar.

Cerrá con un resumen ejecutivo de 5 bullets sobre cómo impacta esta decisión al negocio.

Importante:
- No presentes el impacto como resultado financiero garantizado.
- Hablá de impacto potencial o exposición asociada a la clasificación.
- Si no podés calcular alguna métrica con los datos disponibles, aclaralo.`;

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
      "Alta contribución a revenue o margen.",
      "Producto activo.",
      "Tendencia estable o positiva.",
      "Margen saludable.",
      "Relevancia comercial dentro de una familia importante.",
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
      "Stock alto o DDI elevado.",
      "Tendencia negativa reciente.",
      "Precio desalineado contra mercado.",
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
      "Baja contribución a revenue y margen.",
      "Margen negativo o muy bajo.",
      "Tendencia negativa.",
      "Baja rotación.",
      "Alto capital inmovilizado sin justificación.",
      "Bajo riesgo comercial si se retira."
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
  checkpoint,
  scoreboard,
  onSave,
  onSubmit
}: {
  group: Group;
  stateVersion: string;
  checkpoint: LabCheckpoint | null;
  scoreboard: SystemScoreboard;
  onSave: (payload: { fields: Record<string, string>; confirmations: Record<string, boolean>; workbookName?: string; reportName?: string }) => Promise<void>;
  onSubmit: (payload: { fields: Record<string, string>; confirmations: Record<string, boolean>; workbookName?: string; reportName?: string; requiredFields: string[]; requiredConfirmations: string[] }) => Promise<void>;
}) {
  const fieldLabels = [
    { key: "resumenClasificacion", label: "1. Resumen de clasificación", placeholder: "Ejemplo: cuántos SKUs quedaron como Core, Review y Eliminar, y en qué familias se concentran." },
    { key: "impactoPotencial", label: "2. Impacto potencial en el negocio", placeholder: "Ejemplo: qué implica la clasificación sobre revenue, margen, inventario, capital inmovilizado o riesgo comercial." },
    { key: "decisionesRevisar", label: "3. Decisiones a revisar antes de ejecutar", placeholder: "Ejemplo: casos dudosos, SKUs críticos, familias sensibles o decisiones que requieren validación con negocio." },
    { key: "limitesCuidados", label: "4. Límites o cuidados de la recomendación", placeholder: "Ejemplo: supuestos de la IA, datos a validar, variables faltantes o riesgos de interpretar mal el workbook." }
  ];

  const requiredFields = fieldLabels.map((field) => field.key);

  return (
    <ExerciseStepLayout
      eyebrow="AI Revenue & Inventory Copilot"
      title="Ejercicio 1: Definir decisiones de portfolio"
      subtitle="Clasificar SKUs como Core, Review o Eliminar y justificar la decisión con datos."
      meta={[
        { label: "Grupo", value: group.name },
        { label: "Estado", value: stateVersion },
        { label: "Workbook", value: "único" },
        { label: "Checkpoint", value: checkpoint?.status ?? "borrador" }
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
          Después vas a usar tu AI personal para aplicar criterios de portfolio y completar una propuesta por producto en el workbook.
        </p>
        <p className="muted">
          La decisión operativa por producto queda en el Excel. La síntesis del impacto y los riesgos queda en la plataforma.
        </p>
      </section>

      <section className="card">
        <div className="eyebrow">Parte A</div>
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
          intro="Usá este prompt para que tu AI personal identifique familias motor, familias con riesgo, stock atrapado y señales relevantes para la decisión de portfolio. Todavía no le pidas completar todas las filas."
          label="Prompt recomendado"
          prompt={prompt1}
        />
      </section>

      <section className="card">
        <div className="eyebrow">Parte B</div>
        <h2>Aplicar el criterio al workbook</h2>
        <p className="muted">
          Ahora usá tu AI personal para aplicar los criterios al workbook. La IA debería proponer una clasificación por SKU y completar las columnas de decisión. Después, el equipo revisa los casos críticos, dudosos o de alto impacto antes de subir el archivo actualizado.
        </p>
      </section>

      <section className="card">
        <div className="eyebrow">Prompt 2</div>
        <h2>Completar decisiones SKU por SKU</h2>
        <CopyPromptBlock
          intro="Usá este prompt para que la IA proponga una clasificación por producto y complete las columnas de portfolio en el workbook."
          label="Prompt recomendado"
          prompt={prompt2}
        />
      </section>

      <section className="card">
        <div className="eyebrow">Prompt 3</div>
        <h2>Resumir portfolio resultante e impacto</h2>
        <CopyPromptBlock
          intro="Después de completar la clasificación, pedile a la IA un resumen de cómo quedó el portfolio y qué impacto potencial tiene sobre el negocio. Este resumen te sirve para completar la síntesis final en la plataforma."
          label="Prompt recomendado"
          prompt={prompt3}
        />
      </section>

      <section className="card">
        <div className="eyebrow">Subir workbook</div>
        <h2>Subí el workbook actualizado</h2>
        <p className="muted">
          Cuando el equipo haya revisado la propuesta y completado el workbook, subí el archivo actualizado para registrar el checkpoint del Ejercicio 1.
        </p>
      </section>

      <section className="card">
        <div className="eyebrow">Síntesis final</div>
        <h2>Síntesis final del Ejercicio 1</h2>
        <p className="muted">
          No copies toda la respuesta de la IA ni toda la tabla del Excel. Guardá la síntesis del resultado y las decisiones que revisarías antes de ejecutar.
        </p>

        <ExerciseCheckpointForm
          checkpoint={checkpoint}
          confirmations={[]}
          fieldLabels={fieldLabels}
          onSave={onSave}
          onSubmit={onSubmit}
          requiredFields={requiredFields}
          title="Subir checkpoint del workbook"
        />
      </section>
    </ExerciseStepLayout>
  );
}
