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
        <h2>Lectura por familias</h2>
        <p className="muted">
          Antes de recomendar precios SKU por SKU, entendé cómo se comportan las familias y SKUs en términos de precio, costo, volumen, margen y competitividad.
        </p>
      </section>

      <PromptBlock
        eyebrow="Prompt 1"
        title="Lectura por familias"
        helperText="Usá este prompt para que tu IA personal explore la base de precios, costos, volúmenes y competencia por familia. No recomiendes ajustes todavía."
        prompt="Analizá 03_BASE_SKUS, 06_PORTFOLIO y 09_PRICING para entender el problema por familias antes de recomendar precios SKU por SKU. No uses 07_FORECAST_90_DIAS."
      />

      <section className="card" style={{ background: "rgba(191, 111, 40, 0.06)", borderColor: "var(--accent)" }}>
        <div className="eyebrow" style={{ color: "var(--accent)" }}>Parte B</div>
        <h2>Definir estrategia de pricing</h2>
        <p className="muted">
          Compará los caminos de capturar margen, defender volumen/competitividad y liquidar/acelerar salida. Recomendá una estrategia principal o mixta por familia conectada con la clasificación de portfolio.
        </p>
      </section>

      <PromptBlock
        eyebrow="Prompt 2"
        title="Definir estrategia de pricing"
        helperText="Usá este prompt para que la IA compare familias y proponga una estrategia de pricing direccional antes de decidir SKU por SKU."
        prompt="Compará los caminos de capturar margen, defender volumen/competitividad y liquidar/acelerar salida. Recomendá una estrategia principal o mixta por familia conectada con la clasificación de portfolio."
      />

      <section className="card" style={{ background: "rgba(15, 107, 93, 0.06)", borderColor: "var(--brand)" }}>
        <div className="eyebrow" style={{ color: "var(--brand-strong)" }}>Parte C</div>
        <h2>Completar decisiones de pricing</h2>
        <p className="muted">
          Aplicá la arquitectura de precios al nivel de SKU. La decisión debe ser concreta: subir precio, bajar precio, mantener precio, precio promocional o liquidación.
        </p>
      </section>

      <PromptBlock
        eyebrow="Prompt 3"
        title="Completar decisiones de pricing"
        helperText="Usá este prompt para que la IA complete la propuesta de pricing en la hoja 09_PRICING, respetando la estrategia elegida y la arquitectura de precios."
        prompt="Completá o proponé completar 09_PRICING con decisión, precios M13-M15, efecto esperado, rationale, riesgo y comentarios, respetando el rol de cada SKU y la arquitectura de precios."
      />

      <section className="card" style={{ background: "rgba(191, 111, 40, 0.06)", borderColor: "var(--accent)" }}>
        <div className="eyebrow" style={{ color: "var(--accent)" }}>Parte D</div>
        <h2>Reporte final</h2>
        <p className="muted">
          Resumí la recomendación de pricing, el impacto esperado y los riesgos comerciales usando 09_PRICING como fuente principal.
        </p>
      </section>

      <PromptBlock
        eyebrow="Prompt 4"
        title="Reporte final"
        helperText="Usá este prompt para que la IA genere el resumen ejecutivo del Ejercicio 2."
        prompt="Resumí la recomendación de pricing, el impacto esperado y los riesgos comerciales usando 09_PRICING como fuente principal. No uses 07_FORECAST_90_DIAS."
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
