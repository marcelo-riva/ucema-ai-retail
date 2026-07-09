"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, Save, Send } from "lucide-react";
import { ExerciseHeader } from "./labs/ExerciseHeader";
import { ExerciseWorkbookDownloadCard } from "./ExerciseWorkbookDownloadCard";
import { WorkbookStatusCard } from "./WorkbookStatusCard";
import { getLabRepository } from "../lib/repositories/labRepository";
import type { Group, LabCheckpoint, SystemScoreboard } from "../types/lab";
import type { Session } from "../lib/repositories/labRepository.types";
import styles from "./Exercise02InitialView.module.css";

const prompt1 = `Analizá las hojas 03_BASE_SKUS, 06_PORTFOLIO y 07_PRICING del workbook.

Quiero que actúes como analista senior de pricing.
Antes de recomendar precios, ayudame a entender el portfolio por familias.

No uses 07_FORECAST_90_DIAS.
No modifiques ni reinterpretes las decisiones de portfolio en 06_PORTFOLIO.
No recomiendes precios todavía.

Devolveme por familia:
1. Revenue actual y participación en el total.
2. Margen bruto actual y margen porcentual promedio.
3. Índice de competitividad promedio (price_index_vs_market).
4. Elasticidad proxy promedio y distribución (alta/media/baja).
5. Cantidad de SKUs Core, Review y Eliminar.
6. SKUs con margen negativo — cuántos y qué peso tienen en la familia.
7. Principales tensiones entre margen, volumen y competitividad.
8. Señales que deberían influir en la estrategia de pricing.

Separá hallazgos basados en datos de hipótesis o supuestos.
Si una métrica no puede calcularse, aclaralo.
Cerrá con 5 bullets: las señales más importantes para decidir pricing.`;

const prompt2 = `Usando 03_BASE_SKUS, 06_PORTFOLIO y 07_PRICING del workbook.
No uses 07_FORECAST_90_DIAS. No inventes nombres de hojas.
No cambies las decisiones de portfolio en 06_PORTFOLIO.

Quiero que actúes como analista senior de pricing.
Objetivo: construir un diagnóstico cuantitativo antes de definir la estrategia.

Las variables elasticity_proxy y price_index_vs_market ya están calculadas
en 03_BASE_SKUS. Usá esos valores directamente — no los recalcules.

Clasificá sensibilidad como:
- Baja: elasticity_proxy ≤ 0.5
- Media: 0.5 < elasticity_proxy ≤ 1.0
- Alta: elasticity_proxy > 1.0

Clasificá competitividad como:
- Subvaluado: price_index_vs_market < 0.95
- Alineado: 0.95 ≤ price_index_vs_market ≤ 1.05
- Sobrevaluado: price_index_vs_market > 1.05

Pricing leakage: valor potencialmente no capturado por vender por debajo
del mercado en SKUs con elasticidad baja o media y margen mejorable.

Potencial económico: estimación del impacto de corregir precios,
considerando elasticidad, índice competitivo y margen actual.

Devolveme:
1. Tabla ejecutiva por familia:
   family | revenue | margen | índice competitividad promedio |
   elasticidad promedio | SKUs subvaluados | SKUs sobrevaluados |
   pricing leakage estimado | potencial económico | riesgo de volumen |
   recomendación preliminar

2. Tabla de SKUs críticos (los más relevantes para la decisión):
   sku_id | sku_name | family | portfolio_decision | precio actual |
   precio mercado | price_index | gross_margin_pct | elasticity_proxy |
   diagnóstico | oportunidad o riesgo | recomendación preliminar

3. Síntesis cuantitativa:
   - Total SKUs subvaluados y sobrevaluados.
   - Potencial económico total estimado.
   - Familias con mayor oportunidad de capturar margen.
   - Familias con mayor riesgo competitivo.
   - Familias que podrían sostener posicionamiento premium.
   - Supuestos que el equipo debería validar.

No completes todavía 07_PRICING.
Separá datos calculados de supuestos.
Cerrá con una sección "Lectura para decidir posicionamiento" con 5 bullets.`;

const prompt3 = `Usando el diagnóstico cuantitativo de pricing ya construido y el workbook
(03_BASE_SKUS, 06_PORTFOLIO, 07_PRICING). No uses 07_FORECAST_90_DIAS.

El equipo eligió el siguiente posicionamiento:
- ÉTICOS: [Más barato / Igual mercado / Premium / Mixto]
- MASIVOS: [Más barato / Igual mercado / Premium / Mixto]
- SELECTIVOS: [Más barato / Igual mercado / Premium / Mixto]
- Margen objetivo mínimo: [X%]

Actuá como consultor de pricing. Devolveme:
1. Qué posicionamiento recomendarías por familia y por qué.
2. Dónde el posicionamiento elegido coincide o diverge de tu recomendación.
3. Trade-offs del posicionamiento elegido (margen vs volumen vs competitividad).
4. Cómo debería trasladarse el posicionamiento a SKUs Core, Review y Eliminar.
5. Arquitectura de precios propuesta:
   - Regla por familia (posicionamiento y rango de price_index objetivo).
   - Regla para SKUs Core: proteger precio o capturar margen.
   - Regla para SKUs Review: revisión de competitividad o ajuste de margen.
   - Regla para SKUs Eliminar: precio de salida, liquidación o no reposición.
   - Regla de margen mínimo.
   - Riesgos a monitorear.
6. Impacto estimado del posicionamiento elegido sobre:
   - Revenue proyectado (dirección y magnitud estimada).
   - Margen proyectado.
   - Índice de competitividad final.
   - Familias con mayor riesgo de pérdida de volumen.

No completes todavía 07_PRICING SKU por SKU.
Primero quiero validar la arquitectura y el criterio de decisión.`;

const prompt4 = `Usando el workbook (03_BASE_SKUS, 06_PORTFOLIO, 07_PRICING).
No uses 07_FORECAST_90_DIAS. No modifiques 06_PORTFOLIO.

Posicionamiento y arquitectura elegidos:
- ÉTICOS: [posicionamiento]
- MASIVOS: [posicionamiento]
- SELECTIVOS: [posicionamiento]
- Margen objetivo mínimo: [X%]

Actuá como analista senior de pricing.
Completá o proponé completar 07_PRICING con una recomendación por SKU.

Para cada SKU, completá:
- pricing_decision: Mantener precio / Subir precio / Bajar precio /
  Precio promocional / Liquidación / Revisar competitividad
- price_m13, price_m14, price_m15: precio recomendado para los 3 meses.
- rationale: razón principal de la decisión.
- risk: principal riesgo comercial de la decisión.
- ai_comment: comentario breve sobre la lógica de la recomendación.

Reglas de aplicación:
1. SKUs Core con elasticidad baja y price_index < 0.95: candidatos a
   "Subir precio" hasta alinearse al mercado manteniendo el margen objetivo.
2. SKUs Core con margen negativo: "Revisar competitividad" — no subir sin
   antes entender la estructura de costos.
3. SKUs Review: analizar caso por caso; priorizar competitividad sobre captura.
4. SKUs Eliminar: "Liquidación" o "Precio promocional" para acelerar salida.
5. No recomendar subas agresivas en SKUs con elasticidad alta sin advertir riesgo.
6. No recomendar precio premium si el SKU está sobrevaluado y perdiendo volumen.
7. Mantener coherencia de precios dentro de cada familia (no invertir jerarquías).
8. Respetar el posicionamiento elegido por familia.

Si no podés editar el archivo, devolvé una tabla lista para copiar en 07_PRICING
respetando sku_id y las columnas solicitadas.
Separá datos observados de supuestos.
Avisá si una recomendación asume datos no disponibles en el workbook.`;

const prompt5short = `Usando 03_BASE_SKUS, 06_PORTFOLIO y 07_PRICING ya completada.
No uses 07_FORECAST_90_DIAS.

Posicionamiento elegido:
- ÉTICOS: [...] · MASIVOS: [...] · SELECTIVOS: [...]
- Margen objetivo: [...]

Devolveme una síntesis ejecutiva en el mismo orden que el checkpoint:
1. Distribución de decisiones: cuántos SKUs por decisión de pricing
   (Mantener / Subir / Bajar / Promocional / Liquidación / Revisar)
   y en qué familias se concentra cada una.
2. Posicionamiento y arquitectura: el criterio elegido, por qué tiene sentido
   para este portfolio y qué trade-offs asume.
3. Impacto estimado en el negocio:
   - Revenue proyectado M13-M15 (vs baseline sin cambios).
   - Margen proyectado M13-M15.
   - Índice de competitividad final estimado.
   - Pricing leakage capturado.
   - Riesgo de volumen: familias o SKUs con mayor exposición.
4. Decisiones a revisar antes de ejecutar: SKUs críticos, casos dudosos,
   familias sensibles, SKUs con margen negativo aún sin resolver.
5. Supuestos a validar: elasticidad proxy, precios de competencia,
    estructura de costos, vigencia de referencias de mercado.

No presentes el impacto como resultado garantizado: es proyección
basada en supuestos. Separá datos observados de estimaciones.
No inventes datos.`;

const prompt5full = `Usando 03_BASE_SKUS, 06_PORTFOLIO y 07_PRICING como fuente principal.
No uses 07_FORECAST_90_DIAS.

Posicionamiento elegido: [...]

Devolveme:
1. Cantidad de SKUs por cada pricing_decision.
2. Revenue proyectado M13-M15 por familia.
3. Margen proyectado M13-M15 por familia.
4. Margen porcentual proyectado vs margen histórico.
5. Índice de competitividad promedio ponderado final por familia.
6. Pricing leakage total capturado (estimado).
7. Familias con mayor captura de margen.
8. Familias con mayor riesgo de volumen.
9. SKUs Core con margen negativo aún sin resolver — qué acción requieren.
10. SKUs críticos para revisión manual antes de ejecutar.
11. Impacto en scoreboard: revenue proyectado, margen proyectado,
    índice de competitividad.
12. Riesgos comerciales principales.
13. Supuestos que deben validarse antes de ejecutar.

Compará: portfolio antes (pricing actual) vs después (nueva arquitectura).
No presentes como resultado garantizado; hablá de proyección estimada.
Separá datos de supuestos. No ocultes riesgos de la estrategia elegida.

Cerrá con "Respuesta para plataforma" en 5 bloques:
1) Distribución de decisiones
2) Posicionamiento y arquitectura
3) Impacto estimado
4) Decisiones a revisar
5) Supuestos a validar`;

const positioningOptions = [
  "Más barato que mercado",
  "Igual mercado",
  "Premium",
  "Mixto (definido por tipo de SKU)"
];

const marginOptions = [
  "15%",
  "20%",
  "25%",
  "30%",
  "Definido por familia"
];

type Exercise02InitialViewProps = {
  checkpoint: LabCheckpoint | null;
  group: Group;
  scoreboard: SystemScoreboard;
  stateVersion: string;
  onSave?: (payload: {
    fields: Record<string, string>;
    confirmations: Record<string, boolean>;
    workbookName?: string;
    reportName?: string;
  }) => Promise<void>;
  onSubmit?: (payload: {
    fields: Record<string, string>;
    confirmations: Record<string, boolean>;
    workbookName?: string;
    reportName?: string;
    requiredFields: string[];
    requiredConfirmations: string[];
  }) => Promise<void>;
};

type Message = {
  type: "success" | "error" | "info";
  text: string;
};

async function copyToClipboard(text: string) {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    }
  } catch {
    // Silently ignore copy errors.
  }
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      aria-label={copied ? "Copiado" : "Copiar prompt"}
      className="iconButton"
      onClick={async () => {
        await copyToClipboard(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      type="button"
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  );
}

export function Exercise02InitialView({
  group,
  scoreboard,
  stateVersion
}: Exercise02InitialViewProps) {
  const repo = getLabRepository();
  const isAmplify = useMemo(
    () => (process.env.NEXT_PUBLIC_DATA_MODE ?? "local") === "amplify",
    []
  );

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [checkpointStatus, setCheckpointStatus] = useState<string>("borrador");
  const [submittedAt, setSubmittedAt] = useState<string | undefined>();
  const successRef = useRef<HTMLDivElement | null>(null);

  // Intermediate fields persisted as draft.
  const [hypo1, setHypo1] = useState("");
  const [hypo2, setHypo2] = useState("");
  const [posEticos, setPosEticos] = useState("");
  const [posMasivos, setPosMasivos] = useState("");
  const [posSelectivos, setPosSelectivos] = useState("");
  const [marginObj, setMarginObj] = useState("");

  // Final checkpoint fields.
  const [decisionDistribution, setDecisionDistribution] = useState("");
  const [positioningArchitecture, setPositioningArchitecture] = useState("");
  const [businessImpact, setBusinessImpact] = useState("");
  const [decisionsToReview, setDecisionsToReview] = useState("");
  const [assumptionsToValidate, setAssumptionsToValidate] = useState("");

  const intermediateFields = {
    hypo1,
    hypo2,
    posEticos,
    posMasivos,
    posSelectivos,
    marginObj
  };

  const finalFields = {
    decision_distribution: decisionDistribution,
    positioning_architecture: positioningArchitecture,
    business_impact: businessImpact,
    decisions_to_review: decisionsToReview,
    assumptions_to_validate: assumptionsToValidate
  };

  const allFieldValues = { ...intermediateFields, ...finalFields };

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const currentSession = await repo.getSession();
      if (cancelled) return;
      setSession(currentSession);

      if (currentSession?.groupId) {
        const submission = await repo.getSubmission({
          groupId: currentSession.groupId,
          exerciseId: "ex02",
          exerciseVersion: 1
        });
        if (cancelled) return;

        if (submission) {
          setCheckpointStatus(submission.status);
          setSubmittedAt(submission.submittedAt ?? undefined);

          if (submission.responsesJson) {
            const r = submission.responsesJson as Record<string, string>;
            setHypo1(r.hypo1 ?? "");
            setHypo2(r.hypo2 ?? "");
            setPosEticos(r.posEticos ?? "");
            setPosMasivos(r.posMasivos ?? "");
            setPosSelectivos(r.posSelectivos ?? "");
            setMarginObj(r.marginObj ?? "");
            setDecisionDistribution(r.decision_distribution ?? "");
            setPositioningArchitecture(r.positioning_architecture ?? "");
            setBusinessImpact(r.business_impact ?? "");
            setDecisionsToReview(r.decisions_to_review ?? "");
            setAssumptionsToValidate(r.assumptions_to_validate ?? "");
          }
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [repo]);

  useEffect(() => {
    const hasSuccess = messages.some((m) => m.type === "success");
    if (hasSuccess && successRef.current) {
      successRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [messages]);

  function validateFinal(): string[] {
    const missing: string[] = [];
    if (!decisionDistribution.trim()) missing.push("Distribución de decisiones de pricing");
    if (!positioningArchitecture.trim()) missing.push("Posicionamiento y arquitectura elegidos");
    if (!businessImpact.trim()) missing.push("Impacto estimado en el negocio");
    if (!decisionsToReview.trim()) missing.push("Decisiones a revisar antes de ejecutar");
    if (!assumptionsToValidate.trim()) missing.push("Supuestos a validar");
    return missing;
  }

  async function handleSaveDraft() {
    if (!session?.groupId) {
      setMessages([{ type: "error", text: "Iniciá sesión como grupo para guardar el borrador." }]);
      return;
    }

    setLoading(true);
    setMessages([]);

    try {
      await repo.saveSubmission({
        groupId: session.groupId,
        exerciseId: "ex02",
        exerciseVersion: 1,
        responsesJson: allFieldValues,
        status: "draft"
      });
      setCheckpointStatus("draft");
      setSubmittedAt(undefined);
      setMessages([{ type: "success", text: "Borrador guardado." }]);
    } catch (error) {
      setMessages([{ type: "error", text: `No se pudo guardar: ${String(error)}` }]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (!session?.groupId) {
      setMessages([{ type: "error", text: "Iniciá sesión como grupo para enviar el checkpoint." }]);
      return;
    }

    const missing = validateFinal();
    if (missing.length > 0) {
      setErrors(
        new Set([
          "decision_distribution",
          "positioning_architecture",
          "business_impact",
          "decisions_to_review",
          "assumptions_to_validate"
        ])
      );
      setMessages([{ type: "error", text: `Faltan campos obligatorios: ${missing.join(", ")}` }]);
      return;
    }

    setLoading(true);
    setErrors(new Set());
    setMessages([]);

    try {
      const now = new Date().toISOString();
      await repo.submitSubmission({
        groupId: session.groupId,
        exerciseId: "ex02",
        exerciseVersion: 1,
        responsesJson: allFieldValues
      });
      setCheckpointStatus("submitted");
      setSubmittedAt(now);
      setMessages([{ type: "success", text: "Checkpoint enviado correctamente." }]);
    } catch (error) {
      setMessages([{ type: "error", text: `No se pudo enviar: ${String(error)}` }]);
    } finally {
      setLoading(false);
    }
  }

  if (!session) {
    return (
      <ExerciseHeader
        eyebrow="AI Revenue & Inventory Copilot"
        title="Ejercicio 2: Pricing Optimization"
        subtitle="Cargando sesión..."
        groupName={group.name}
      >
        <section className="card">
          <p className="muted">Cargando ejercicio...</p>
        </section>
      </ExerciseHeader>
    );
  }

  return (
    <ExerciseHeader
      eyebrow="AI Revenue & Inventory Copilot"
      title="Ejercicio 2: Pricing Optimization"
      subtitle="La decisión de precios no arranca de cero: arranca de un portfolio ya clasificado. En este ejercicio la IA actúa como analista cuantitativo y simulador de escenarios. El equipo decide el posicionamiento y la arquitectura; la IA calcula el impacto."
      groupName={group.name}
      checkpointStatus={checkpointStatus}
      submittedAt={submittedAt}
    >
      <ExerciseWorkbookDownloadCard exerciseId="ex02" />

      <WorkbookStatusCard stateVersion={stateVersion} lastWorkbookName={scoreboard.lastWorkbookName} />

      {/* CONTEXT: INHERITED DECISION */}
      <section className="card">
        <div className="eyebrow">Dónde estás en el recorrido</div>
        <h2>El pricing arranca de una decisión ya tomada</h2>
        <p className="muted">
          En este laboratorio las decisiones se encadenan. El portfolio ya fue clasificado en el Ejercicio 1; ese resultado es el input del Ejercicio 2. No es necesario haber hecho el Ejercicio 1 individualmente: todos los grupos parten del <strong>mismo workbook base</strong>, completado bajo escenario Balanceado con prioridad Generación de caja.
        </p>
        <div className={styles.inheritBox} style={{ marginTop: 14 }}>
          <strong>Escenario heredado:</strong> Balanceado · Prioridad: Generación de caja
          <br />
          <span className="muted" style={{ fontSize: 13 }}>
            Core 3.361 SKUs · Review 1.786 · Eliminar 2.752 · Hoja: 06_PORTFOLIO
          </span>
        </div>
        <p className="muted" style={{ marginTop: 14, marginBottom: 0 }}>
          En el trabajo real sucede exactamente lo mismo: el pricing no se decide en el vacío, sino sobre un portfolio con restricciones ya definidas por otros o en otros momentos. La habilidad ejecutiva está en trabajar dentro de ese contexto, no en ignorarlo.
        </p>

        <div className={styles.funnelMini} style={{ marginTop: 18 }}>
          <div className={`${styles.funnelStage} ${styles.done}`}>
            Negocio<small>Ejercicio 0</small>
          </div>
          <span className={styles.funnelArrow}>→</span>
          <div className={`${styles.funnelStage} ${styles.done}`}>
            Familias<small>Ejercicio 1 A</small>
          </div>
          <span className={styles.funnelArrow}>→</span>
          <div className={`${styles.funnelStage} ${styles.done}`}>
            Portfolio<small>Ejercicio 1 E</small>
          </div>
          <span className={styles.funnelArrow}>→</span>
          <div className={`${styles.funnelStage} ${styles.current}`}>
            Pricing<small>Ejercicio 2 · acá</small>
          </div>
          <span className={styles.funnelArrow}>→</span>
          <div className={styles.funnelStage}>
            Forecast<small>Ejercicio 3</small>
          </div>
        </div>
      </section>

      {/* PARTE A */}
      <section className="stepSection">
        <div className="stepTitle">
          <span>A</span>
          <div>
            <span className={styles.partTag}>Parte A</span>
            <h2 style={{ marginTop: 8 }}>El problema y las variables en juego</h2>
            <div className={styles.sectionTime}>
              <span className={styles.timeChip}>⏱ ~6 min</span>
            </div>
          </div>
        </div>

        <section className="card">
          <div className="eyebrow">Reencuadre</div>
          <h3>Definir precios no es poner un número: es navegar tres tensiones simultáneas</h3>
          <p className="muted">
            El precio óptimo no existe como valor único. Es el resultado de equilibrar tres fuerzas que casi nunca se alinean solas. Antes de pedir cualquier análisis a la IA, conviene tener claras estas tensiones.
          </p>
          <div className={styles.tensionGrid}>
            <div className={styles.tensionCard}>
              <span className={styles.tensionVs}>Margen vs Volumen</span>
              <h3>¿Capturás más o vendés más?</h3>
              <p>
                Subir precio mejora el margen por unidad, pero puede reducir el volumen vendido. La elasticidad indica cuánto se mueve la demanda ante un cambio de precio: alta elasticidad = riesgo alto al subir.
              </p>
            </div>
            <div className={styles.tensionCard}>
              <span className={styles.tensionVs}>Precio vs Competencia</span>
              <h3>¿Cuánto margen de movimiento tenés?</h3>
              <p>
                El índice de competitividad mide si estás por encima o por debajo del mercado. Estar por debajo puede ser una oportunidad de suba; estar por encima, un riesgo de pérdida de participación.
              </p>
            </div>
            <div className={styles.tensionCard}>
              <span className={styles.tensionVs}>Consistencia interna</span>
              <h3>¿Los precios tienen lógica dentro de la familia?</h3>
              <p>
                No alcanza con optimizar cada SKU por separado. Los precios dentro de una familia deben guardar coherencia: un producto sustituto más barato que el premium rompe la arquitectura.
              </p>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="eyebrow">Variables clave del workbook</div>
          <h3>Lo que ya está calculado en 03_BASE_SKUS y 07_PRICING</h3>
          <p className="muted">
            A diferencia del Ejercicio 1, en este ejercicio la IA no necesita calcular desde cero las variables centrales: ya están pre-calculadas en el workbook. Lo que hace el diagnóstico es <strong>interpretar</strong> esas variables en combinación.
          </p>

          <div className={styles.defGrid}>
            <div className={styles.defCard}>
              <div className={styles.tag}>elasticity_proxy</div>
              <h3>Elasticidad proxy</h3>
              <p>
                Aproximación de la sensibilidad del volumen ante cambios de precio, calculada a partir del histórico. No es una elasticidad econométrica exacta. Se interpreta como <em>baja</em> (≤0.5), <em>media</em> (0.5–1.0) o <em>alta</em> (&gt;1.0). En este portfolio: 61% baja, 33% media, 6% alta.
              </p>
            </div>
            <div className={styles.defCard}>
              <div className={styles.tag}>price_index_vs_market</div>
              <h3>Índice de competitividad</h3>
              <p>
                Precio propio dividido por el precio de mercado de referencia. Menor a 1 = más barato que mercado (posible oportunidad de suba). Mayor a 1 = más caro (riesgo competitivo). En este portfolio: 85% alineados, 9% subvaluados, 6% sobrevaluados.
              </p>
            </div>
          </div>

          <div className={styles.defGrid} style={{ marginTop: 14 }}>
            <div className={styles.defCard}>
              <div className={styles.tag}>pricing_leakage</div>
              <h3>
                Pricing leakage{" "}
                <span style={{ fontSize: 11, color: "var(--accent)", marginLeft: 6 }}>
                  ≠ leakage comercial del Ej1
                </span>
              </h3>
              <p>
                Valor económico potencialmente perdido por vender por <em>debajo</em> de una referencia de mercado o margen defendible. Es diferente al <strong>leakage comercial</strong> del Ejercicio 1, que era la pérdida por eliminar SKUs con revenue existente. Mismo término, distinto nivel de análisis.
              </p>
            </div>
            <div className={styles.defCard}>
              <div className={styles.tag}>expected_volume_effect_pct</div>
              <h3>Efecto de volumen esperado</h3>
              <p>
                Regla de negocio incluida en el workbook que estima el impacto en volumen según la decisión de pricing: Subir precio −5%, Bajar precio +5%, Precio promocional +10%, Liquidación +20%, Mantener y Revisar competitividad 0%. Es un supuesto razonable de partida — la IA podría estimarlo con más precisión si se lo pedís.
              </p>
            </div>
          </div>

          <div className="exampleBox" style={{ marginTop: 14 }}>
            <strong>La desambiguación sobre &quot;Premium&quot;:</strong> en la clase se usó Premium como categoría de sensibilidad (producto con baja elasticidad, cliente que prioriza valor). Acá Premium también es una opción de <em>posicionamiento competitivo</em> (precio por encima del mercado). Son conceptos distintos. Un producto sensible al precio no puede sostener posicionamiento premium aunque sea de alta gama. Usá la elasticidad proxy y el índice de competitividad para decidir qué posicionamiento es sostenible para cada familia.
          </div>
        </section>

        <section className="card">
          <div className="eyebrow">El rol de la IA en este ejercicio</div>
          <h3>Tres roles, en orden</h3>
          <p className="muted">
            La IA no define la estrategia. A lo largo del ejercicio va cambiando de rol:
          </p>
          <ul className="simpleList">
            <li>
              <strong>Data Analyst (Partes A–B):</strong> interpreta las variables calculadas, detecta SKUs subvaluados o sobrevaluados, cuantifica el leakage y el potencial económico. Transforma datos en diagnóstico.
            </li>
            <li>
              <strong>Simulador de escenarios (Parte C):</strong> a partir del posicionamiento que elige el equipo, proyecta el impacto en margen, volumen y competitividad. Responde &quot;si elegís esto, el impacto estimado es el siguiente&quot;.
            </li>
            <li>
              <strong>Ejecutor con criterio (Parte D):</strong> baja la arquitectura definida al nivel de SKU, respetando el portfolio heredado, la lógica dentro de cada familia y las reglas de negocio del workbook.
            </li>
          </ul>
          <p className="muted" style={{ marginBottom: 0 }}>
            En ningún momento le pedís a la IA que <em>decida</em> el posicionamiento. Le pedís que te ayude a <em>ver</em> mejor para que el equipo decida.
          </p>
        </section>
      </section>

      {/* PARTE B */}
      <section className="stepSection">
        <div className="stepTitle">
          <span>B</span>
          <div>
            <span className={styles.partTag}>Parte B</span>
            <h2 style={{ marginTop: 8 }}>Lectura por familias y diagnóstico cuantitativo</h2>
            <div className={styles.sectionTime}>
              <span className={styles.timeChip}>⏱ ~14 min</span>
            </div>
          </div>
        </div>

        <section className="card">
          <div className="eyebrow">Antes del diagnóstico</div>
          <h3>Ahora sí podés anticipar</h3>
          <p className="muted">
            En el Ejercicio 0 no podías anticipar nada porque era el primer contacto con el negocio. Ahora conocés las familias, el portfolio y las tensiones. Antes de correr el diagnóstico cuantitativo, registrá la hipótesis del equipo:
          </p>
          <div className={styles.formRow4} style={{ marginTop: 6 }}>
            <div className="formField">
              <label className="formLabel" htmlFor="hypo1">
                ¿Qué familia intuís que tiene mayor oportunidad de subir precio?
              </label>
              <textarea
                id="hypo1"
                className={styles.miniTextarea}
                placeholder="Familia ___ porque ___. Señal principal: ___."
                value={hypo1}
                onChange={(e) => setHypo1(e.target.value)}
              />
            </div>
            <div className="formField">
              <label className="formLabel" htmlFor="hypo2">
                ¿Qué familia creés que no toleraría una suba sin perder volumen?
              </label>
              <textarea
                id="hypo2"
                className={styles.miniTextarea}
                placeholder="Familia ___ porque ___. Señal principal: ___."
                value={hypo2}
                onChange={(e) => setHypo2(e.target.value)}
              />
            </div>
          </div>
          <p className="muted" style={{ marginTop: 12, marginBottom: 0 }}>
            Después de correr los prompts, van a poder contrastar estas hipótesis contra el diagnóstico cuantitativo. Ese contraste es el aprendizaje: los datos pueden confirmar o contradecir la intuición del equipo.
          </p>
        </section>

        <section className="card">
          <div className="eyebrow">Prompt 1 · Lectura por familias</div>
          <h3>Entender el portfolio de pricing antes de diagnosticar</h3>
          <p className="muted">
            Igual que en el Ejercicio 1, el análisis comienza por familias. Antes de ir SKU por SKU, se necesita el contexto de cada familia: dónde está el margen, qué tan competitivos son los precios, qué tan sensibles son los clientes. Las hojas de referencia son <strong>03_BASE_SKUS</strong>, <strong>06_PORTFOLIO</strong> y <strong>07_PRICING</strong>.
          </p>
          <div className="promptSingle">
            <div className="promptSingleHeader">
              <span className="statusPill info">Prompt provisto</span>
              <CopyButton text={prompt1} />
            </div>
            <pre>{prompt1}</pre>
          </div>
        </section>

        <section className="card">
          <div className="eyebrow">Prompt 2 · Diagnóstico cuantitativo</div>
          <h3>Cuantificar el problema antes de elegir estrategia</h3>
          <p className="muted">
            Con la lectura por familias como contexto, ahora se construye el diagnóstico cuantitativo. El objetivo es tener evidencia — no intuición — para responder: ¿dónde hay oportunidad de capturar margen?, ¿dónde hay riesgo de perder volumen?, ¿cuánto vale económicamente corregir los precios?
          </p>

          <div className={styles.targetBox} style={{ marginTop: 6 }}>
            <h3>Resultado esperado de este diagnóstico</h3>
            <ul className="simpleList">
              <li>Tabla por familia: elasticidad, competitividad, SKUs sub/sobrevaluados, leakage y potencial.</li>
              <li>Tabla de SKUs críticos con diagnóstico individual (subvaluado / alineado / sobrevaluado).</li>
              <li>Cuantificación del potencial económico total de corrección de precios.</li>
              <li>Identificación de familias con mayor oportunidad y mayor riesgo.</li>
              <li>Lectura para decidir posicionamiento en 5 bullets.</li>
            </ul>
          </div>

          <div className="promptSingle" style={{ marginTop: 14 }}>
            <div className="promptSingleHeader">
              <span className="statusPill info">Prompt provisto</span>
              <CopyButton text={prompt2} />
            </div>
            <pre>{prompt2}</pre>
          </div>

          <div className="tipBox" style={{ marginTop: 16 }}>
            <h3>Contrastar con la hipótesis</h3>
            <p className="muted" style={{ margin: 0 }}>
              Cuando tengás el diagnóstico, volvé a las hipótesis que escribiste antes. ¿La IA confirmó o contradijo la intuición del equipo sobre qué familia tiene más oportunidad? ¿Dónde el dato sorprendió? Ese contraste es el insight real de la etapa.
            </p>
          </div>
        </section>
      </section>

      {/* PARTE C */}
      <section className="stepSection">
        <div className="stepTitle">
          <span>C</span>
          <div>
            <span className={styles.partTag}>Parte C</span>
            <h2 style={{ marginTop: 8 }}>Definir posicionamiento y arquitectura de precios</h2>
            <div className={styles.sectionTime}>
              <span className={styles.timeChip}>⏱ ~10 min</span>
            </div>
          </div>
        </div>

        <section className="card">
          <div className="eyebrow">La decisión es del equipo</div>
          <h3>El posicionamiento no lo define la IA</h3>
          <p className="muted">
            La IA puede recomendar un posicionamiento, pero la decisión corresponde al equipo. Es la misma lógica que el escenario en el Ejercicio 1: la IA no tiene apetito de riesgo, no conoce las prioridades comerciales del negocio ni las limitaciones operativas. El equipo sí.
          </p>

          <div className={styles.whyBox} style={{ marginTop: 12 }}>
            <h3>Coherencia con el escenario heredado</h3>
            <p>
              El portfolio base se construyó con prioridad <strong>Generación de caja</strong>. El posicionamiento de pricing tiene que conversar con esa prioridad. Por ejemplo: elegir un posicionamiento &quot;más barato que mercado&quot; de forma generalizada podría acelerar la rotación de los SKUs a eliminar, pero reduciría el margen de los Core. Un posicionamiento premium generalizado podría mejorar el margen pero frenar el movimiento del inventario. Esa tensión es la decisión que el equipo tiene que resolver.
            </p>
          </div>

          <div className={styles.posGrid} style={{ marginTop: 16 }}>
            <div className={styles.posCard}>
              <h3>Más barato que mercado</h3>
              <p className={styles.posWhen}>
                Conviene cuando la categoría es sensible, hay alta elasticidad, fuerte competencia o el objetivo es defender volumen.
              </p>
              <ul className="simpleList">
                <li>SKUs con alta elasticidad proxy.</li>
                <li>Familias donde el índice es ≥ 1.0 y hay riesgo de pérdida de participación.</li>
                <li>SKUs Eliminar donde se busca acelerar liquidación.</li>
              </ul>
            </div>
            <div className={styles.posCard}>
              <h3>Igual mercado</h3>
              <p className={styles.posWhen}>
                Conviene cuando el objetivo es mantener competitividad sin resignar margen innecesariamente.
              </p>
              <ul className="simpleList">
                <li>SKUs Core bien posicionados y con elasticidad media.</li>
                <li>Familias estratégicas donde la cobertura importa más que el margen extra.</li>
                <li>SKUs con precio_index entre 0.95 y 1.05.</li>
              </ul>
            </div>
            <div className={styles.posCard}>
              <h3>Premium</h3>
              <p className={styles.posWhen}>
                Conviene cuando hay baja elasticidad, margen defendible, buena propuesta de valor o fortaleza comercial.
              </p>
              <ul className="simpleList">
                <li>SKUs Core con elasticidad baja y price_index &lt; 0.95 (subvaluados).</li>
                <li>Familias con diferenciación y baja sustitución.</li>
                <li>No usar en SKUs con margen negativo — primero hay que resolver el costo.</li>
              </ul>
            </div>
          </div>

          <p className="muted" style={{ marginTop: 14, marginBottom: 0 }}>
            El posicionamiento puede ser mixto: una familia con criterio premium y otra con criterio igual mercado. La arquitectura de precios es el conjunto de reglas que define esa lógica para todo el portfolio.
          </p>
        </section>

        <section className="card">
          <div className="eyebrow">Decisión del equipo</div>
          <h3>Elegí un posicionamiento por familia</h3>
          <div className={styles.formRow4} style={{ marginTop: 6 }}>
            <div className="formField">
              <label className="formLabel" htmlFor="posEticos">
                ÉTICOS — posicionamiento
              </label>
              <select
                id="posEticos"
                value={posEticos}
                onChange={(e) => setPosEticos(e.target.value)}
              >
                <option value="">Seleccionar…</option>
                {positioningOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="formField">
              <label className="formLabel" htmlFor="posMasivos">
                MASIVOS — posicionamiento
              </label>
              <select
                id="posMasivos"
                value={posMasivos}
                onChange={(e) => setPosMasivos(e.target.value)}
              >
                <option value="">Seleccionar…</option>
                {positioningOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="formField">
              <label className="formLabel" htmlFor="posSelectivos">
                SELECTIVOS — posicionamiento
              </label>
              <select
                id="posSelectivos"
                value={posSelectivos}
                onChange={(e) => setPosSelectivos(e.target.value)}
              >
                <option value="">Seleccionar…</option>
                {positioningOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="formField">
              <label className="formLabel" htmlFor="marginObj">
                Margen objetivo mínimo
              </label>
              <select
                id="marginObj"
                value={marginObj}
                onChange={(e) => setMarginObj(e.target.value)}
              >
                <option value="">Seleccionar…</option>
                {marginOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="eyebrow">Prompt 3 · Arquitectura de precios</div>
          <h3>La IA simula el impacto de tu posicionamiento</h3>
          <p className="muted">
            Con el posicionamiento elegido, la IA construye la arquitectura de precios: las reglas que van a guiar las decisiones SKU por SKU. Antes de bajar al nivel de SKU, el equipo valida que la arquitectura tenga sentido.
          </p>
          <div className="promptSingle">
            <div className="promptSingleHeader">
              <span className="statusPill info">Reemplazá los campos entre corchetes</span>
              <CopyButton text={prompt3} />
            </div>
            <pre>{prompt3}</pre>
          </div>
        </section>
      </section>

      {/* PARTE D */}
      <section className="stepSection">
        <div className="stepTitle">
          <span>D</span>
          <div>
            <span className={styles.partTag}>Parte D</span>
            <h2 style={{ marginTop: 8 }}>Completar decisiones de pricing SKU por SKU</h2>
            <div className={styles.sectionTime}>
              <span className={styles.timeChip}>⏱ ~10 min</span>
            </div>
          </div>
        </div>

        <section className="card">
          <div className="eyebrow">Regla de negocio del workbook</div>
          <h3>El efecto de volumen ya tiene una regla incorporada</h3>
          <p className="muted">
            La hoja <strong>07_PRICING</strong> incluye una fórmula para <code>expected_volume_effect_pct</code> que aplica automáticamente según la decisión elegida. Es un supuesto de partida razonable — la IA podría estimarlo con más precisión por SKU si se lo pedís, pero para esta etapa la regla sirve para comparar impactos entre SKUs de forma consistente.
          </p>

          <div className={styles.ruleBox}>
            <h3>Reglas de efecto en volumen según pricing_decision</h3>
            <table className={styles.ruleTable}>
              <thead>
                <tr>
                  <th>Decisión</th>
                  <th>Efecto volumen esperado</th>
                  <th>Lógica</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Mantener precio</td>
                  <td>0%</td>
                  <td>Sin cambio de demanda esperado.</td>
                </tr>
                <tr>
                  <td>Subir precio</td>
                  <td>−5%</td>
                  <td>Suba moderada con caída de volumen.</td>
                </tr>
                <tr>
                  <td>Bajar precio</td>
                  <td>+5%</td>
                  <td>Baja atrae volumen incremental.</td>
                </tr>
                <tr>
                  <td>Precio promocional</td>
                  <td>+10%</td>
                  <td>Promoción genera demanda adicional.</td>
                </tr>
                <tr>
                  <td>Liquidación</td>
                  <td>+20%</td>
                  <td>Precio agresivo acelera salida de stock.</td>
                </tr>
                <tr>
                  <td>Revisar competitividad</td>
                  <td>0%</td>
                  <td>Pendiente de análisis; sin cambio por defecto.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="card">
          <div className="eyebrow">Prompt 4 · Completar 07_PRICING</div>
          <h3>Bajar la arquitectura al nivel de SKU</h3>
          <p className="muted">
            Con la arquitectura validada, la IA completa la hoja <strong>07_PRICING</strong> respetando el portfolio heredado de 06_PORTFOLIO y las reglas de la arquitectura definida en la Parte C.
          </p>
          <div className="promptSingle">
            <div className="promptSingleHeader">
              <span className="statusPill info">Reemplazá los campos entre corchetes</span>
              <CopyButton text={prompt4} />
            </div>
            <pre>{prompt4}</pre>
          </div>

          <div className="tipBox" style={{ marginTop: 16 }}>
            <h3>Validá una recomendación</h3>
            <p className="muted" style={{ margin: 0 }}>
              Antes de cerrar esta parte, elegí un SKU que la IA recomendó &quot;Subir precio&quot; y verificá en 03_BASE_SKUS que el <code>elasticity_proxy</code> y el <code>price_index_vs_market</code> respaldan esa recomendación. Si los datos no coinciden con lo que dice la IA, marcalo en la columna <code>risk</code>.
            </p>
          </div>
        </section>
      </section>

      {/* PARTE E */}
      <section className="stepSection">
        <div className="stepTitle">
          <span>E</span>
          <div>
            <span className={styles.partTag}>Parte E</span>
            <h2 style={{ marginTop: 8 }}>Reporte de impacto y síntesis</h2>
            <div className={styles.sectionTime}>
              <span className={styles.timeChip}>⏱ ~10 min</span>
            </div>
          </div>
        </div>

        <section className="card">
          <div className="eyebrow">Prompt 5 · Reporte final</div>
          <h3>Sintetizá el impacto de la estrategia elegida</h3>
          <p className="muted">
            La salida de este prompt es exactamente lo que se carga en el checkpoint — no hace falta recopilar nada a mano. La versión de clase es corta; la extendida queda como referencia para completar fuera de clase.
          </p>

          <div className="promptSingle">
            <div className="promptSingleHeader">
              <span className="statusPill success">Versión de clase</span>
              <CopyButton text={prompt5short} />
            </div>
            <pre>{prompt5short}</pre>
          </div>

          <details className="promptReveal" style={{ marginTop: 12 }}>
            <summary>
              <span>Prompt 5 extendido · Reporte completo (referencia)</span>
              <span className="muted" style={{ fontWeight: 700, fontSize: 13 }}>
                Para completar fuera de clase ▾
              </span>
            </summary>
            <div>
              <div className="promptSingleHeader" style={{ padding: "12px 16px" }}>
                <span className="statusPill warning">Entregable extendido</span>
                <CopyButton text={prompt5full} />
              </div>
              <pre style={{ background: "#14211b", color: "#eff8f1", fontFamily: "SFMono-Regular, Consolas, monospace", fontSize: 13, lineHeight: 1.55, margin: 0, overflowX: "auto", padding: 16, whiteSpace: "pre-wrap" }}>
                {prompt5full}
              </pre>
            </div>
          </details>
        </section>
      </section>

      {/* CHECKPOINT */}
      <section className="stepSection">
        <section className={`card ${styles.checkBox}`}>
          <div className="eyebrow">Checkpoint</div>
          <h2>Guardá la síntesis, no el output completo</h2>
          <p className="muted">
            No copiés toda la respuesta de la IA ni la tabla completa del workbook. Guardá la síntesis del equipo. Los cinco campos siguen el mismo orden que la salida del Prompt 5.
          </p>
          <p className={styles.sourceNote}>Estos cinco valores provienen directamente del reporte del Prompt 5.</p>

          {messages.length > 0 ? (
            <div ref={successRef} className="messageList" style={{ marginBottom: 16, marginTop: 12 }}>
              {messages.map((message, index) => (
                <div className={`message ${message.type}`} key={`${message.type}-${index}`} style={{ padding: 12 }}>
                  {message.type === "success" && checkpointStatus === "submitted" ? (
                    <div>
                      <strong style={{ display: "block", marginBottom: 4 }}>Checkpoint enviado</strong>
                      <span>{message.text} Podés continuar con el siguiente ejercicio o volver a editar este envío.</span>
                    </div>
                  ) : (
                    message.text
                  )}
                </div>
              ))}
            </div>
          ) : null}

          <div className="grid" style={{ marginTop: 12 }}>
            <div className={`formField ${errors.has("decision_distribution") ? "error" : ""}`}>
              <label className="formLabel">
                1. Distribución de decisiones de pricing <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <textarea
                className={`${styles.miniTextarea}`}
                placeholder="Cuántos SKUs por decisión (Mantener / Subir / Bajar / Promocional / Liquidación / Revisar) y en qué familias se concentra cada una."
                value={decisionDistribution}
                onChange={(e) => {
                  setDecisionDistribution(e.target.value);
                  setErrors((prev) => {
                    const next = new Set(prev);
                    next.delete("decision_distribution");
                    return next;
                  });
                }}
              />
              {errors.has("decision_distribution") ? <span className="errorText">Este campo es obligatorio.</span> : null}
            </div>
            <div className={`formField ${errors.has("positioning_architecture") ? "error" : ""}`}>
              <label className="formLabel">
                2. Posicionamiento y arquitectura elegidos <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <textarea
                className={styles.miniTextarea}
                placeholder="Qué posicionamiento por familia, criterio aplicado a Core/Review/Eliminar, y por qué tiene sentido para este portfolio."
                value={positioningArchitecture}
                onChange={(e) => {
                  setPositioningArchitecture(e.target.value);
                  setErrors((prev) => {
                    const next = new Set(prev);
                    next.delete("positioning_architecture");
                    return next;
                  });
                }}
              />
              {errors.has("positioning_architecture") ? <span className="errorText">Este campo es obligatorio.</span> : null}
            </div>
            <div className={`formField ${errors.has("business_impact") ? "error" : ""}`}>
              <label className="formLabel">
                3. Impacto estimado en el negocio <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <textarea
                className={styles.miniTextarea}
                placeholder="Revenue y margen proyectados M13-M15, índice de competitividad final, pricing leakage capturado, riesgo de volumen."
                value={businessImpact}
                onChange={(e) => {
                  setBusinessImpact(e.target.value);
                  setErrors((prev) => {
                    const next = new Set(prev);
                    next.delete("business_impact");
                    return next;
                  });
                }}
              />
              {errors.has("business_impact") ? <span className="errorText">Este campo es obligatorio.</span> : null}
            </div>
            <div className={`formField ${errors.has("decisions_to_review") ? "error" : ""}`}>
              <label className="formLabel">
                4. Decisiones a revisar antes de ejecutar <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <textarea
                className={styles.miniTextarea}
                placeholder="SKUs críticos, casos con margen negativo sin resolver, familias sensibles, decisiones que requieren validación comercial."
                value={decisionsToReview}
                onChange={(e) => {
                  setDecisionsToReview(e.target.value);
                  setErrors((prev) => {
                    const next = new Set(prev);
                    next.delete("decisions_to_review");
                    return next;
                  });
                }}
              />
              {errors.has("decisions_to_review") ? <span className="errorText">Este campo es obligatorio.</span> : null}
            </div>
            <div className={`formField ${errors.has("assumptions_to_validate") ? "error" : ""}`}>
              <label className="formLabel">
                5. Supuestos a validar <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <textarea
                className={styles.miniTextarea}
                placeholder="Elasticidad proxy, precios de competencia, estructura de costos, vigencia de referencias de mercado, reglas de volumen usadas."
                value={assumptionsToValidate}
                onChange={(e) => {
                  setAssumptionsToValidate(e.target.value);
                  setErrors((prev) => {
                    const next = new Set(prev);
                    next.delete("assumptions_to_validate");
                    return next;
                  });
                }}
              />
              {errors.has("assumptions_to_validate") ? <span className="errorText">Este campo es obligatorio.</span> : null}
            </div>
          </div>

          <div className="buttonRow" style={{ marginTop: 18 }}>
            <button className="button secondary" disabled={loading} onClick={handleSaveDraft} type="button">
              <Save size={17} /> Guardar borrador
            </button>
            <button className="button primary" disabled={loading} onClick={handleSubmit} type="button">
              <Send size={17} /> Enviar checkpoint
            </button>
          </div>
          {isAmplify ? null : (
            <p className="muted" style={{ marginTop: 10, fontSize: 12 }}>
              Modo local: el borrador y el checkpoint se guardan en este dispositivo.
            </p>
          )}
        </section>
      </section>
    </ExerciseHeader>
  );
}
