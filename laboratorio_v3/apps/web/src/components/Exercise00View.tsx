"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { ExerciseCheckpointForm } from "./ExerciseCheckpointForm";
import { ExerciseStepLayout } from "./ExerciseStepLayout";
import { SystemScoreboardCard } from "./SystemScoreboardCard";
import { WorkbookStatusCard } from "./WorkbookStatusCard";
import type { Group, LabCheckpoint, SystemScoreboard } from "../types/lab";

const recommendedPrompt = `Subí el workbook y analizá principalmente la hoja de SKUs.

Quiero que actúes como analista de inteligencia comercial. El objetivo es explorar la base para entender el negocio antes de definir una estrategia comercial.

Primero identificá qué hojas y columnas relevantes tiene el archivo. Luego analizá la hoja de SKUs y devolveme:

1. Qué categorías o familias concentran mayor revenue.
2. Qué categorías o familias concentran mayor margen.
3. Dónde aparece más stock, DDI o capital inmovilizado.
4. Qué productos o categorías muestran caída reciente.
5. Qué productos tienen margen bajo o negativo.
6. Qué señales parecen relevantes para pensar decisiones de portfolio, pricing, inventario o forecast.
7. Qué preguntas debería investigar el equipo antes de tomar decisiones.

Importante:

* No inventes datos.
* Si no encontrás una columna o variable, aclaralo.
* Separá hallazgos basados en datos de hipótesis.
* No propongas todavía una estrategia final.
* Cerrá con una lista de 5 hallazgos principales y 3 preguntas críticas para seguir investigando.`;

const quickLookBullets = [
  "Qué hojas hay.",
  "Cuál es la hoja de SKUs.",
  "Qué variables comerciales aparecen.",
  "Qué representa cada fila."
];

const validationTips = [
  "Pedile a la IA que indique en qué hoja o columna se basa.",
  "Si algo suena raro, contrastalo contra el workbook.",
  "Antes de avanzar, chequeá 2 o 3 afirmaciones importantes."
];

export function Exercise00View({
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
    { key: "hallazgos", label: "5 hallazgos principales sobre el negocio", placeholder: "Listá cinco hallazgos concretos de la exploración." },
    { key: "preguntas", label: "3 preguntas que conviene investigar antes de decidir", placeholder: "¿Qué debería investigar el equipo antes de tomar decisiones?" },
    { key: "alerta", label: "1 alerta sobre los datos o la interpretación de la IA", placeholder: "¿Qué limitación, duda o señal de cautela encontraron?" }
  ];

  const requiredFields = fieldLabels.map((field) => field.key);

  return (
    <ExerciseStepLayout
      eyebrow="AI Revenue & Inventory Copilot"
      title="Ejercicio 0: Entender el negocio y explorar la base"
      subtitle="Antes de decidir qué productos mantener, ajustar o retirar, necesitás entender cómo está compuesto el negocio."
      meta={[
        { label: "Grupo", value: group.name },
        { label: "Estado", value: stateVersion },
        { label: "Workbook", value: "único" },
        { label: "Checkpoint", value: checkpoint?.status ?? "borrador" }
      ]}
    >
      <WorkbookStatusCard stateVersion={stateVersion} lastWorkbookName={scoreboard.lastWorkbookName} />
      <SystemScoreboardCard scoreboard={scoreboard} />

      <section className="card">
        <div className="eyebrow">Objetivo</div>
        <h2>Qué estás resolviendo</h2>
        <p className="muted">
          En este ejercicio vas a usar tu AI personal para explorar una base de SKUs y construir una primera lectura comercial. Todavía no buscamos definir una estrategia final: buscamos detectar patrones, alertas y buenas preguntas para seguir investigando.
        </p>
      </section>

      <section className="card">
        <div className="eyebrow">Paso 1</div>
        <h2>Mirá rápido el workbook</h2>
        <p className="muted">
          Antes de subir el archivo a tu AI personal, abrilo unos minutos y entendé qué contiene.
        </p>
        <p className="muted">
          No hace falta analizar todo manualmente. El objetivo es reconocer qué información tenés disponible para poder validar si la IA está respondiendo en base al contenido real del archivo.
        </p>
        <ul className="simpleList">
          {quickLookBullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <div className="eyebrow">Paso 2</div>
        <h2>Subí el workbook a tu AI personal</h2>
        <p className="muted">
          Subí el workbook a ChatGPT, Claude, Gemini u otra AI que pueda leer archivos.
        </p>
        <p className="muted">
          Usá la IA para explorar la base, detectar patrones y ordenar preguntas de negocio. No le pidas todavía una estrategia final: en este ejercicio buscamos entender el negocio antes de decidir.
        </p>

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

        <div className="tipBox">
          <h3>Tips para validar la respuesta</h3>
          <ul className="simpleList">
            {validationTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="card">
        <div className="eyebrow">Paso 3</div>
        <h2>Guardá la síntesis del equipo</h2>
        <p className="muted">
          No copies toda la respuesta de la IA. Guardá solamente lo que el equipo se lleva del análisis.
        </p>
        <p className="muted">
          La evidencia numérica queda en el Excel. La interpretación del equipo queda en la plataforma.
        </p>

        <ExerciseCheckpointForm
          checkpoint={checkpoint}
          confirmations={[]}
          fieldLabels={fieldLabels}
          onSave={onSave}
          onSubmit={onSubmit}
          requiredFields={requiredFields}
          title="Guardá la síntesis del equipo"
        />
      </section>
    </ExerciseStepLayout>
  );
}
