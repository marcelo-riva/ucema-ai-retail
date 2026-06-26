"use client";

import { ExerciseHeader } from "./labs/ExerciseHeader";
import { PromptBlock } from "./labs/PromptBlock";
import { CheckpointForm } from "./labs/CheckpointForm";
import type { Group } from "../types/lab";

type Exercise02InitialViewProps = {
  group: Group;
  stateVersion: string;
};

export function Exercise02InitialView({ group, stateVersion }: Exercise02InitialViewProps) {
  return (
    <ExerciseHeader
      eyebrow="AI Revenue & Inventory Copilot"
      title="Ejercicio 2: Pricing Optimization"
      subtitle="Definir una arquitectura de precios que maximice margen manteniendo posicionamiento competitivo."
      groupName={group.name}
      stateVersion={stateVersion}
      workbookLabel="Pricing Optimization"
      checkpointStatus="borrador"
    >
      <section className="card">
        <div className="eyebrow">Objetivo</div>
        <h2>Qué estás resolviendo</h2>
        <p className="muted">
          En este ejercicio vas a definir una arquitectura de precios para los próximos meses.
        </p>
        <p className="muted">
          El desafío es equilibrar tres objetivos: capturar margen, defender volumen y mantener la posición competitiva, sin romper la lógica de precios dentro de cada familia.
        </p>
        <p className="muted">
          La decisión operativa por SKU queda en el workbook. La síntesis del impacto, los riesgos y la estrategia elegida quedan en la plataforma.
        </p>
      </section>

      <section className="card" style={{ background: "rgba(15, 107, 93, 0.06)", borderColor: "var(--brand)" }}>
        <div className="eyebrow" style={{ color: "var(--brand-strong)" }}>Parte A</div>
        <h2>Exploración inicial</h2>
        <p className="muted">
          Antes de recomendar precios, entendé cómo se comportan las familias y SKUs en términos de precio, costo, volumen, margen y competitividad.
        </p>
      </section>

      <PromptBlock
        eyebrow="Prompt 1"
        title="Lectura inicial de pricing"
        helperText="Usá este prompt para que tu IA personal explore la base de precios, costos, volúmenes y competencia antes de proponer ajustes."
        prompt="[Placeholder] Analizá la hoja 03_BASE_SKUS y 09_PRICING para describir el comportamiento actual de precios, margen y volumen por familia. No recomiendes ajustes todavía."
      />

      <section className="card" style={{ background: "rgba(191, 111, 40, 0.06)", borderColor: "var(--accent)" }}>
        <div className="eyebrow" style={{ color: "var(--accent)" }}>Parte B</div>
        <h2>Diagnóstico por familia</h2>
        <p className="muted">
          Identificá dónde hay oportunidades de captura de margen, dónde conviene defender competitividad y dónde el precio puede usarse como herramienta táctica.
        </p>
      </section>

      <PromptBlock
        eyebrow="Prompt 2"
        title="Diagnóstico de oportunidades"
        helperText="Usá este prompt para que la IA compare familias y proponga una estrategia de pricing direccional antes de decidir SKU por SKU."
        prompt="[Placeholder] Compará familias según margen, elasticidad proxy, índice de competitividad y rol de portfolio. Recomendá una estrategia direccional: capturar margen, defender volumen o liquidar/acelerar salida."
      />

      <section className="card" style={{ background: "rgba(15, 107, 93, 0.06)", borderColor: "var(--brand)" }}>
        <div className="eyebrow" style={{ color: "var(--brand-strong)" }}>Parte C</div>
        <h2>Arquitectura de precios</h2>
        <p className="muted">
          Definí la lógica de precios que respete la relación entre productos, familias y posicionamiento competitivo. La arquitectura es el marco que después se aplica SKU por SKU.
        </p>
      </section>

      <section className="card" style={{ background: "rgba(191, 111, 40, 0.06)", borderColor: "var(--accent)" }}>
        <div className="eyebrow" style={{ color: "var(--accent)" }}>Parte D</div>
        <h2>Decisión SKU por SKU</h2>
        <p className="muted">
          Aplicá la arquitectura de precios al nivel de SKU. La decisión debe ser concreta: subir precio, bajar precio, mantener precio, precio promocional o liquidación.
        </p>
      </section>

      <PromptBlock
        eyebrow="Prompt 3"
        title="Decisión SKU por SKU"
        helperText="Usá este prompt para que la IA complete la propuesta de pricing en la hoja 09_PRICING, respetando la estrategia elegida y la arquitectura de precios."
        prompt="[Placeholder] Completá la hoja 09_PRICING con la decisión de pricing por SKU para los próximos meses, incluyendo precio recomendado, efecto esperado en volumen, rationale y riesgo."
      />

      <section className="card">
        <div className="eyebrow">Checkpoint</div>
        <h2>Guardá la síntesis del Ejercicio 2</h2>
        <p className="muted">
          No copies toda la respuesta de la IA. Guardá la síntesis del diagnóstico, la estrategia elegida, el impacto esperado y los riesgos que revisarías antes de ejecutar.
        </p>

        <CheckpointForm
          exerciseId="ex02"
          exerciseVersion={1}
          fields={[
            {
              id: "pricing_diagnosis",
              label: "1. Diagnóstico de pricing",
              type: "textarea",
              placeholder: "Ejemplo: principales familias con oportunidad de margen, riesgo de volumen o presión competitiva.",
              required: true
            },
            {
              id: "pricing_strategy",
              label: "2. Estrategia de precios elegida",
              type: "textarea",
              placeholder: "Ejemplo: capturar margen, defender volumen, liquidar o estrategia mixta por familia; explicar por qué.",
              required: true
            },
            {
              id: "business_impact",
              label: "3. Impacto esperado en margen, revenue y competitividad",
              type: "textarea",
              placeholder: "Ejemplo: impacto esperado direccional en margen, revenue, volumen y posicionamiento competitivo.",
              required: true
            },
            {
              id: "risks_to_review",
              label: "4. Riesgos y decisiones a revisar",
              type: "textarea",
              placeholder: "Ejemplo: SKUs con subas agresivas, familias sensibles, riesgo de perder volumen o romper arquitectura de precios.",
              required: true
            },
            {
              id: "assumptions_to_validate",
              label: "5. Datos o supuestos a validar",
              type: "textarea",
              placeholder: "Ejemplo: elasticidad proxy, precios de competidores, costos, vigencia de promociones y supuestos de reacción del mercado.",
              required: true
            }
          ]}
          saveLabel="Guardar borrador"
          submitLabel="Enviar checkpoint"
        />
      </section>
    </ExerciseHeader>
  );
}
