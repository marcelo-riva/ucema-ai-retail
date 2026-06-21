"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { ExerciseCheckpointForm } from "./ExerciseCheckpointForm";
import { ExerciseStepLayout } from "./ExerciseStepLayout";
import { WorkbookStatusCard } from "./WorkbookStatusCard";
import type { Group, LabCheckpoint, SystemScoreboard } from "../types/lab";

const recommendedPrompt = `Usando el workbook del Laboratorio 1, analizá la hoja de SKUs y la hoja de portfolio.

Quiero que actúes como analista de inteligencia comercial. El objetivo es construir una primera estrategia de portfolio y completar una propuesta por SKU.

Primero hacé una lectura agregada por familia o categoría:
1. Qué familias concentran revenue.
2. Qué familias concentran margen.
3. Dónde hay más stock, DDI o capital inmovilizado.
4. Dónde hay productos suspendidos con stock.
5. Dónde hay caída reciente o bajo margen.
6. Qué señales deberían influir en la decisión de portfolio.

Después, clasificá cada SKU usando estas categorías:

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

const familySignals = [
  "Revenue total.",
  "Margen bruto total.",
  "Margen porcentual.",
  "Unidades vendidas.",
  "Stock actual.",
  "DDI.",
  "Capital inmovilizado.",
  "Tendencia reciente.",
  "Cantidad de SKUs activos o suspendidos.",
  "Precio vs mercado, si está disponible.",
  "Elasticidad proxy, si está disponible."
];

const portfolioColumns = [
  "decision_portfolio: Core / Review / Eliminar.",
  "action_90_days: acción recomendada para los próximos 90 días.",
  "decision_reason: razón principal de la clasificación.",
  "priority: Alta / Media / Baja.",
  "commercial_risk: principal riesgo comercial.",
  "ai_comment: comentario breve que explique la lógica de la recomendación.",
  "team_comment: dejar vacío salvo que el equipo quiera corregir o desafiar la recomendación."
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
  const [copied, setCopied] = useState(false);

  async function copyPrompt() {
    await navigator.clipboard.writeText(recommendedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const fieldLabels = [
    { key: "criterio", label: "¿Qué criterio usó el equipo para clasificar Core / Review / Eliminar?", placeholder: "Resumí las reglas o lógica que aplicó el equipo." },
    { key: "familias", label: "¿Qué familias o grupos de productos aparecen como más importantes o problemáticos?", placeholder: "Identificá las familias que concentran resultados o generan riesgos." },
    { key: "revisionesManuales", label: "¿Qué decisiones revisarían manualmente antes de ejecutar?", placeholder: "Casos dudosos, críticos o de alto impacto comercial." },
    { key: "riesgos", label: "¿Qué riesgos comerciales detectaron?", placeholder: "Riesgos de revenue, margen, stock, quiebre o ejecución." }
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
          Antes de clasificar productos SKU por SKU, necesitás entender cómo se comporta el negocio por familias o categorías: dónde está el revenue, dónde está el margen, dónde hay inventario inmovilizado, qué productos están suspendidos y dónde aparecen señales de caída o riesgo.
        </p>
        <p className="muted">
          Después vas a usar tu AI personal para aplicar criterios de portfolio y completar una propuesta por producto en el workbook.
        </p>
        <p className="muted">
          La decisión operativa por producto queda en el Excel. La síntesis del criterio queda en la plataforma.
        </p>
      </section>

      <section className="card">
        <div className="eyebrow">Paso 1</div>
        <h2>Entendé el portfolio por familias</h2>
        <p className="muted">
          Antes de completar decisiones por SKU, mirá el portfolio a nivel familias o categorías. Esto te ayuda a no clasificar productos de forma aislada.
        </p>
        <ul className="simpleList">
          {familySignals.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <div className="eyebrow">Paso 2</div>
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
        <div className="eyebrow">Paso 3</div>
        <h2>Usá tu AI personal para completar la propuesta por SKU</h2>
        <p className="muted">
          Ahora usá tu AI personal para aplicar estos criterios a la hoja de portfolio.
        </p>
        <p className="muted">
          La IA debería proponer una clasificación por SKU y completar las columnas de decisión del workbook. Después, el equipo revisa los casos críticos, dudosos o de alto impacto antes de subir el archivo actualizado.
        </p>

        <div className="panel">
          <h3>Columnas que la IA debe completar o proponer</h3>
          <ul className="simpleList">
            {portfolioColumns.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="muted" style={{ marginTop: 12, marginBottom: 0 }}>
            La prioridad no es un score matemático exacto. Es una prioridad comercial para gestionar en los próximos 90 días.
          </p>
        </div>

        <div className="promptSingle">
          <div className="promptSingleHeader">
            <span>Prompt recomendado</span>
            <button
              aria-label={copied ? "Copiado" : "Copiar prompt"}
              className="iconButton"
              onClick={copyPrompt}
              type="button"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
          <pre>{recommendedPrompt}</pre>
        </div>
      </section>

      <section className="card">
        <div className="eyebrow">Paso 4</div>
        <h2>Subí el workbook actualizado</h2>
        <p className="muted">
          Cuando el equipo haya revisado la propuesta y completado el workbook, subí el archivo actualizado para registrar el checkpoint del Ejercicio 1.
        </p>
      </section>

      <section className="card">
        <div className="eyebrow">Síntesis del equipo</div>
        <h2>Guardá la síntesis del criterio</h2>
        <p className="muted">
          La plataforma no pide copiar toda la tabla. Capturá la síntesis del criterio y los riesgos que el equipo se lleva del ejercicio.
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
