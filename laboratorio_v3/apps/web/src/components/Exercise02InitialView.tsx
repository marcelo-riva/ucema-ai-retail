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

const metaPrompt1 = `Quiero que escribas un prompt para un análisis de pricing.
No hagas el análisis: devolveme solo el prompt, listo para usar.

Objetivo del análisis:
Entender un portfolio de retail por familias antes de recomendar
precios — dónde está el margen, qué tan competitivos son los precios
y qué tan sensible es la demanda de cada familia.

Datos disponibles:
Un workbook con tres hojas:
- 03_BASE_SKUS: precios mensuales (pvp_m01..pvp_m12), volúmenes
  mensuales, márgenes, price_index_vs_market (precio propio vs mercado)
  y elasticity_proxy (sensibilidad al precio: 0.2 / 0.4 / 0.8 / 2.0).
- 06_PORTFOLIO: clasificación Core / Review / Eliminar ya decidida.
  No debe modificarse.
- 07_PRICING: hoja de trabajo del ejercicio. Todavía no se completa.

Contexto:
Mercado argentino. Antes de interpretar cualquier tendencia de precios
o volúmenes, el análisis debe validar si los datos muestran señal
inflacionaria (tendencia nominal de precios en los 12 meses).

El prompt que generes debe:
1. Asignar un rol de analista senior de pricing.
2. Pedir primero el chequeo de señal inflacionaria.
3. Producir después la lectura por familia: revenue, margen,
   competitividad, sensibilidad, distribución Core/Review/Eliminar,
   SKUs con margen negativo y tensiones principales.
4. Prohibir recomendar precios en esta etapa.
5. Cerrar con una síntesis ejecutiva de 5 bullets.`;

const prompt1 = `Sos un analista senior de pricing. Tenés acceso a las hojas
03_BASE_SKUS, 06_PORTFOLIO y 07_PRICING del workbook.

PASO 1 — Contexto inflacionario
Antes de analizar precios o márgenes, examiná la tendencia de pvp_m01
a pvp_m12 en 03_BASE_SKUS a nivel portfolio y por familia.
Respondé: ¿se detecta una tendencia nominal de precios que sugiera
inflación en el período? Estimá la variación promedio mensual.
Esto define si los datos deben interpretarse en términos nominales
o si hay que tener precaución al leer tendencias de volumen y precio juntas.

PASO 2 — Lectura por familia
Con ese contexto, analizá el portfolio por familia. Devolveme:
1. Revenue y participación en el total.
2. Margen bruto y margen porcentual promedio.
3. Índice de competitividad promedio (price_index_vs_market).
4. Distribución de elasticity_proxy por nivel (0.2 / 0.4 / 0.8 / 2.0).
5. Cantidad de SKUs Core, Review y Eliminar.
6. SKUs con margen negativo — cantidad y peso en la familia.
7. Principales tensiones entre margen, volumen y competitividad.

No modifiques 06_PORTFOLIO. No recomiendes precios todavía.
Separá hechos de interpretaciones.
Cerrá con 5 bullets: señales clave para decidir la estrategia de pricing.`;

const prompt2 = `Sos un analista senior de pricing. Usá 03_BASE_SKUS, 06_PORTFOLIO
y 07_PRICING. No modifiques 06_PORTFOLIO ni completes 07_PRICING todavía.

Usá las variables ya calculadas en 03_BASE_SKUS:
- elasticity_proxy: sensibilidad al precio (0.2=muy baja, 0.4=baja,
  0.8=media, 2.0=alta). Clasificá como baja (≤0.5), media (0.5–1),
  alta (>1).
- price_index_vs_market: ratio precio propio / precio mercado.
  Subvaluado <0.95 | Alineado 0.95–1.05 | Sobrevaluado >1.05.

Construí el diagnóstico cuantitativo de pricing:

1. Tabla por familia (una fila por familia):
   | family | revenue | margen% | price_index_prom | elasticity_prom |
   | SKUs_subvaluados | SKUs_sobrevaluados | pricing_leakage_est |
   | potencial_económico | riesgo_volumen | recomendación_preliminar |

2. Top SKUs críticos (los más relevantes por impacto económico):
   | sku_id | sku_name | family | portfolio_decision | avg_price_12m |
   | market_price_avg | price_index | gross_margin_pct | elasticity_proxy |
   | diagnóstico | recomendación |

3. Síntesis:
   - Total subvaluados y sobrevaluados.
   - Potencial económico total estimado.
   - Familia con mayor oportunidad y familia con mayor riesgo.
   - Supuestos que el equipo debería validar con datos actualizados.

Definiciones:
Pricing leakage = revenue * (1 - price_index) para SKUs subvaluados
con elasticity_proxy ≤ 0.8. Es estimación, no certeza.
Potencial económico = proyección de mejora de margen si se corrige el gap
competitivo, ponderado por elasticidad.

Separá hechos calculados de estimaciones. Marcá con ⚠ lo que depende
de supuestos sobre sensibilidad al precio.
Cerrá con "Para decidir posicionamiento" — 5 bullets ejecutivos.`;

const prompt3 = `Sos un consultor de pricing. Usá el diagnóstico ya construido y las hojas
03_BASE_SKUS, 06_PORTFOLIO y 07_PRICING. No completes 07_PRICING todavía.

El equipo eligió:
- ÉTICOS: [Más barato / Igual mercado / Premium / Mixto]
- MASIVOS: [Más barato / Igual mercado / Premium / Mixto]
- SELECTIVOS: [Más barato / Igual mercado / Premium / Mixto]

Referencia de margen del portfolio: Core ~43%, Review ~30%.
El portfolio heredado fue clasificado con prioridad Generación de caja.

Regla de traducción del posicionamiento:
- Target de price_index_vs_market: Más barato que mercado = 0.95 ·
  Igual mercado = 1.00 · Premium = 1.05.
- price_move_pct = movimiento necesario para llevar cada SKU al target de su
  familia, con tope de ±10%. Si el gap supera el tope, el SKU queda como caso
  a revisar.
- Excepciones que pisan la regla: margen negativo → Revisar competitividad ·
  Eliminar → Liquidación · elasticity_proxy 2.0 → no subir precio.
- Si el posicionamiento de una familia es Mixto, definí el target por tipo de
  SKU dentro de esa familia y justificalo.

Devolveme:
1. Dónde el posicionamiento elegido coincide con tu recomendación y dónde
   diverge, con justificación basada en el diagnóstico.
2. Trade-offs del posicionamiento elegido: margen capturado, riesgo de volumen
   (usá elasticity_proxy), posición competitiva final estimada.
3. Arquitectura aplicada — validá la regla contra el diagnóstico:
   - ¿En qué familias el target elegido es alcanzable dentro del tope de ±10%?
   - ¿Cuántos SKUs quedan fuera del tope y qué peso económico tienen?
   - ¿Dónde concentran más revenue las excepciones (margen negativo,
     elasticidad alta)?
4. Impacto estimado del posicionamiento elegido:
   - Dirección de revenue M13–M15 vs baseline
     (efecto volumen = −elasticity_proxy × price_move_pct).
   - Margen proyectado por familia.
   - Familias con mayor riesgo de pérdida de volumen.
5. Casos a revisar manualmente antes de ejecutar.

Separá recomendaciones basadas en datos de las que dependen de supuestos de
sensibilidad. Marcá con ⚠ las que requieren validación adicional.`;

const prompt4 = `Sos un analista senior de pricing. Usá 03_BASE_SKUS, 06_PORTFOLIO
y 07_PRICING. No modifiques 06_PORTFOLIO.

Posicionamiento elegido:
- ÉTICOS: [posicionamiento]
- MASIVOS: [posicionamiento]
- SELECTIVOS: [posicionamiento]

Completá 07_PRICING con una decisión por SKU. Para cada uno:
- pricing_decision: Subir precio / Bajar precio / Mantener precio /
  Liquidación / Revisar competitividad.
- positioning_rule: Premium / Igual mercado / Más barato /
  Excepción: Eliminar / Excepción: margen negativo /
  Excepción: elasticidad alta.
- price_move_pct: % de movimiento de precio (0% si se mantiene).
- price_m13, price_m14, price_m15: current_price_m12 × (1 + price_move_pct),
  igual en los tres meses.
- expected_volume_effect_pct: −elasticity_proxy × price_move_pct.
- rationale: razón principal en una línea.
- risk: principal riesgo de la decisión.
- ai_comment: lógica de la recomendación en una línea.

Aplicá la regla de traducción:
- Target de price_index_vs_market por familia según posicionamiento:
  Más barato que mercado = 0.95 · Igual mercado = 1.00 · Premium = 1.05.
- price_move_pct = lo necesario para llegar al target, con tope de ±10%.
  Si el gap supera el tope, aplicá el máximo y marcá el SKU con ⚠ como caso
  a revisar.
- Excepciones (pisan la regla):
  - Margen negativo → pricing_decision = Revisar competitividad,
    positioning_rule = Excepción: margen negativo, price_move_pct = 0%.
  - Eliminar → pricing_decision = Liquidación,
    positioning_rule = Excepción: Eliminar, price_move_pct = −20%.
  - elasticity_proxy 2.0 → pricing_decision = Mantener precio,
    positioning_rule = Excepción: elasticidad alta, price_move_pct = 0%.
- Mantener coherencia de precios dentro de cada familia.

Antes de recomendar una suba, mirá el efecto en volumen — una suba que captura
8% de precio pero pierde 16% de volumen probablemente destruye revenue.
Mostrá el cálculo de price_move_pct y expected_volume_effect_pct, no solo el
resultado.

Si no podés editar el archivo, devolvé una tabla lista para copiar en
07_PRICING respetando sku_id y las columnas indicadas.
Marcá con ⚠ decisiones que dependen de supuestos no verificables con los datos
disponibles.`;

const prompt5short = `Sos un analista senior de pricing.
Usá 03_BASE_SKUS, 06_PORTFOLIO y 07_PRICING ya completada.

Posicionamiento aplicado:
- ÉTICOS: [...] · MASIVOS: [...] · SELECTIVOS: [...]

Generá la síntesis ejecutiva en este orden exacto (es lo que se carga en la
plataforma):
1. Distribución de decisiones: cantidad de SKUs por cada pricing_decision y
   en qué familias se concentra cada una.
2. Posicionamiento y arquitectura: target de price_index aplicado por familia,
   reglas para Core/Review/Eliminar y por qué tiene sentido para este
   portfolio con prioridad Generación de caja.
3. Impacto estimado:
   - Revenue proyectado M13–M15 vs baseline (usá expected_volume_effect_pct,
     calculado como −elasticity_proxy × price_move_pct).
   - Margen proyectado M13–M15 por familia.
   - Pricing leakage capturado (estimado).
   - Familias o SKUs con mayor riesgo de pérdida de volumen.
4. Decisiones a revisar antes de ejecutar: SKUs con margen negativo sin
   resolver, SKUs que no llegan al target dentro del tope de ±10%, casos con
   elasticidad alta donde la suba es cuestionable, familias con posicionamiento
   mixto que requieren validación.
5. Supuestos a validar: vigencia de precios de competencia en el workbook,
   interpretación de elasticity_proxy en contexto inflacionario, aproximación
   lineal del efecto en volumen (−elasticidad × Δprecio), válida para
   movimientos moderados pero no para cambios grandes de precio.

Presentá el impacto como proyección estimada, no como resultado garantizado.
No inventes datos.`;

const prompt5full = `Sos un analista senior de pricing.
Usá 03_BASE_SKUS, 06_PORTFOLIO y 07_PRICING ya completada.
Posicionamiento aplicado: [...]

Devolveme el reporte completo:
1. SKUs por cada pricing_decision.
2. Revenue proyectado M13–M15 por familia (aplicá expected_volume_effect_pct,
   calculado como −elasticity_proxy × price_move_pct).
3. Margen proyectado M13–M15 por familia.
4. Margen% proyectado vs margen% histórico por familia.
5. Pricing leakage total capturado (estimado).
6. Índice de competitividad final por familia (precio nuevo / market_price_avg)
   vs target del posicionamiento.
7. Familias con mayor captura de margen.
8. Familias con mayor riesgo de pérdida de volumen.
9. SKUs Core con margen negativo aún sin resolver.
10. SKUs que no llegaron al target dentro del tope de ±10%.
11. Riesgos comerciales principales de la estrategia elegida.
12. Supuestos a validar:
    - Vigencia de precios de competencia.
    - Elasticity_proxy en contexto inflacionario: señal, no certeza.
    - Aproximación lineal del efecto en volumen (−elasticidad × Δprecio):
      razonable para movimientos moderados; el impacto real varía por SKU y
      contexto de mercado.
    - SKUs con margen negativo: ¿problema de precio o de estructura de costos?
      No asumir que subir precio lo resuelve.

Compará before vs after (precios actuales vs nueva arquitectura).
Presentá como proyección, no como resultado garantizado.
Cerrá con "Respuesta para plataforma" en 5 bloques:
1) Distribución de decisiones
2) Posicionamiento y arquitectura
3) Impacto estimado
4) Decisiones a revisar
5) Supuestos a validar`;

const promptExtendedRule = `Sos un consultor de pricing. Usá 03_BASE_SKUS, 06_PORTFOLIO
y 07_PRICING ya completada con la regla original.

Diseñé una nueva regla de pricing con estos tres componentes:

1. Target: [definí tu target de price_index_vs_market por familia
   o por tipo de SKU — puede ser distinto al original]
2. Límite operativo: [definí tu tope de movimiento por período
   — puede ser distinto al ±10% original]
3. Excepciones: [definí qué casos pisan tu regla y qué acción
   toman — podés mantener las originales, modificarlas o agregar nuevas]

Ejecutá mi regla sobre el portfolio y devolveme:
1. Distribución de decisiones con mi regla vs la regla original.
2. Revenue y margen proyectado M13–M15: mi regla vs la original.
3. Dónde mi regla genera mejores resultados y dónde peores.
4. Qué casos borde mi regla no cubre bien — SKUs donde el resultado
   es cuestionable o inconsistente.
5. Una recomendación: ¿qué componente de mi regla ajustarías y por qué?

No inventes datos. Presentá el impacto como proyección estimada.`;

const positioningOptions = [
  "Más barato que mercado",
  "Igual mercado",
  "Premium",
  "Mixto (definido por tipo de SKU)"
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
    posSelectivos
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
      <div className="caseMeta">
        <div><span>Grupo</span><strong>{group.name}</strong></div>
        <div><span>Estado</span><strong>{checkpointStatus === "submitted" ? "Enviado" : "Borrador"}</strong></div>
        <div><span>Workbook</span><strong>NEXUS_RETAIL_LAB01_EJ02_v4</strong></div>
        <div><span>Tiempo estimado</span><strong>~50 min</strong></div>
      </div>

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
                Nivel de sensibilidad al precio asignado por categoría, con cuatro valores posibles: <strong>0.2</strong> (muy baja), <strong>0.4</strong> (baja), <strong>0.8</strong> (media) y <strong>2.0</strong> (alta). Usala siempre en combinación con el índice de competitividad y el margen — nunca como única variable para decidir una suba. En el trabajo real con datos propios, esta variable requeriría deflactar precios por inflación antes de calcularla; ese ajuste metodológico es parte de lo que harías en tu empresa. En este portfolio: 61% baja, 33% media, 6% alta.
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
                Estimación del impacto en volumen derivada de la elasticidad: −elasticity_proxy × price_move_pct. Si un SKU tiene elasticidad 0.4 y subís el precio 5%, el volumen esperado cae 2%. Si la elasticidad es 2.0, cae 10%. Es una aproximación lineal razonable para movimientos moderados de precio — la IA podría refinarla si se lo pedís, pero para comparar impactos entre SKUs de forma consistente alcanza. En este ejercicio esta columna la completa la IA, no una fórmula: parte del trabajo es verificar que el cálculo sea correcto.
              </p>
            </div>
          </div>

          <div className="exampleBox" style={{ marginTop: 14 }}>
            <strong>La desambiguación sobre &quot;Premium&quot;:</strong> en la clase se usó Premium como categoría de sensibilidad (producto con baja elasticidad, cliente que prioriza valor). Acá Premium también es una opción de <em>posicionamiento competitivo</em> (precio por encima del mercado). Son conceptos distintos. Un producto sensible al precio no puede sostener posicionamiento premium aunque sea de alta gama. Usá la elasticidad proxy y el índice de competitividad para decidir qué posicionamiento es sostenible para cada familia.
          </div>
        </section>

        <section className="card">
          <div className="eyebrow">El rol de la IA en este ejercicio</div>
          <h3>Cuatro roles, en orden</h3>
          <p className="muted">
            La IA no define la estrategia. A lo largo del ejercicio va cambiando de rol:
          </p>
          <ul className="simpleList">
            <li>
              <strong>Generadora de instrumentos (Parte B, meta-prompting):</strong> la IA no solo analiza — también redacta el prompt con el que se le va a pedir el análisis. El equipo especifica el objetivo y revisa el resultado con criterio.
            </li>
            <li>
              <strong>Data Analyst (Parte B):</strong> interpreta las variables calculadas, detecta SKUs subvaluados o sobrevaluados, cuantifica el leakage y el potencial económico. Transforma datos en diagnóstico.
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
              <span className={styles.timeChip}>⏱ ~16 min</span>
            </div>
          </div>
        </div>

        <section className="card">
          <div className="eyebrow">Nuevo escalón · Meta-prompting</div>
          <h3>Esta vez no te damos el prompt: te damos la especificación</h3>
          <p className="muted">
            En el Ejercicio 0 ejecutaste un prompt provisto. En el Ejercicio 1 construiste uno propio a partir del resultado esperado. Este ejercicio sube un escalón: <strong>especificar y delegar</strong>. Cuando el análisis es complejo, escribir el prompt a mano deja de ser eficiente — es más rápido darle a la IA el objetivo, los datos disponibles y las restricciones, y pedirle que redacte el prompt. Eso se llama <strong>meta-prompting</strong>, y es cómo se trabaja con IA en análisis profesionales.
          </p>
          <div className={styles.whyBox} style={{ marginTop: 12 }}>
            <h3>La escalera del laboratorio</h3>
            <p>
              <strong>Ejecutar</strong> (Ej0) → <strong>Construir</strong> (Ej1) → <strong>Especificar</strong> (Ej2). Cada ejercicio sube un nivel de madurez en el trabajo con IA. La especificación es el nivel donde vas a operar en tu trabajo real: nadie redacta a mano un prompt de diagnóstico de 40 líneas — se lo especifica y después se revisa con criterio.
            </p>
          </div>
        </section>

        <section className="card">
          <div className="eyebrow">Paso 1 · Generá el prompt de lectura por familias</div>
          <h3>El meta-prompt</h3>
          <p className="muted">
            Corré este meta-prompt en tu IA personal. La salida no es el análisis: es <strong>el prompt</strong> que después vas a usar para el análisis. La estructura del meta-prompt (objetivo, datos disponibles, contexto, requisitos) es una plantilla reutilizable para cualquier análisis en tu trabajo.
          </p>
          <div className="promptSingle">
            <div className="promptSingleHeader">
              <span className="statusPill info">Meta-prompt provisto</span>
              <CopyButton text={metaPrompt1} />
            </div>
            <pre>{metaPrompt1}</pre>
          </div>
        </section>

        <section className="card">
          <div className="eyebrow">Paso 2 · Revisá el prompt generado antes de correrlo</div>
          <h3>El criterio lo ponés vos</h3>
          <p className="muted">
            La IA te devolvió un prompt. Antes de ejecutarlo, revisalo con la anatomía que aprendiste en el Ejercicio 1 — rol, contexto, tarea, restricciones. Este checklist es el control de calidad:
          </p>
          <ul className="simpleList">
            <li>¿Asigna un <strong>rol</strong> claro (analista senior de pricing)?</li>
            <li>¿Nombra las <strong>hojas reales</strong> del workbook (03_BASE_SKUS, 06_PORTFOLIO, 07_PRICING)?</li>
            <li>¿Pide el <strong>chequeo inflacionario primero</strong>, antes de la lectura?</li>
            <li>¿<strong>Prohíbe</strong> recomendar precios y modificar 06_PORTFOLIO?</li>
            <li>¿Define el <strong>formato de salida</strong> (lectura por familia + 5 bullets)?</li>
          </ul>
          <p className="muted" style={{ marginTop: 12 }}>
            Si le falta algo, agregáselo a mano antes de correrlo — ese ajuste también es parte del trabajo. Cuando esté completo, ejecutalo en tu IA personal y seguí con la lectura del resultado.
          </p>

          <details className="promptReveal" style={{ marginTop: 14 }}>
            <summary>
              <span>Prompt de referencia · Lectura por familias</span>
              <span className="muted" style={{ fontWeight: 700, fontSize: 13 }}>
                Si el generado salió flojo o vas corto de tiempo ▾
              </span>
            </summary>
            <div>
              <div className="promptSingleHeader" style={{ padding: "12px 16px" }}>
                <span className="statusPill warning">Red de seguridad</span>
                <CopyButton text={prompt1} />
              </div>
              <pre style={{ background: "#14211b", color: "#eff8f1", fontFamily: "SFMono-Regular, Consolas, monospace", fontSize: 13, lineHeight: 1.55, margin: 0, overflowX: "auto", padding: 16, whiteSpace: "pre-wrap" }}>
                {prompt1}
              </pre>
            </div>
          </details>
        </section>

        <section className="card">
          <div className="eyebrow">Después del Prompt 1</div>
          <h3>Con los datos leídos, formá una hipótesis</h3>
          <p className="muted">
            Ahora que el equipo tiene la lectura por familias, puede formarse una primera intuición antes de ir al diagnóstico cuantitativo. Registrala acá — después del Prompt 2 van a poder contrastarla con la evidencia.
          </p>
          <div className={styles.formRow4} style={{ marginTop: 6 }}>
            <div className="formField">
              <label className="formLabel" htmlFor="hypo1">
                ¿Qué familia tiene mayor oportunidad de capturar margen con un ajuste de precio?
              </label>
              <textarea
                id="hypo1"
                className={styles.miniTextarea}
                placeholder="Familia ___ porque el diagnóstico muestra ___ (señal: price_index / margen / elasticidad)."
                value={hypo1}
                onChange={(e) => setHypo1(e.target.value)}
              />
            </div>
            <div className="formField">
              <label className="formLabel" htmlFor="hypo2">
                ¿Qué familia sería más riesgosa de tocar?
              </label>
              <textarea
                id="hypo2"
                className={styles.miniTextarea}
                placeholder="Familia ___ porque ___ (señal: elasticidad alta / sobrevaluada / márgenes ajustados)."
                value={hypo2}
                onChange={(e) => setHypo2(e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="card">
          <div className="eyebrow">Prompt 2 · Diagnóstico cuantitativo</div>
          <h3>Construir la evidencia para elegir estrategia</h3>
          <p className="muted">
            Con la lectura por familias como base, ahora se cuantifica el problema. El objetivo es tener números concretos para decidir: dónde hay margen para capturar, dónde hay riesgo de perder volumen, cuánto vale económicamente mover precios.
          </p>

          <div className={styles.targetBox} style={{ marginTop: 6 }}>
            <h3>Resultado esperado</h3>
            <ul className="simpleList">
              <li>Tabla resumen por familia con posición competitiva, sensibilidad y potencial.</li>
              <li>Lista de SKUs críticos con diagnóstico individual.</li>
              <li>Cuantificación del potencial económico total.</li>
              <li>5 bullets ejecutivos para decidir posicionamiento.</li>
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
            <h3>Contrastá con tu hipótesis</h3>
            <p className="muted" style={{ margin: 0 }}>
              ¿El diagnóstico confirma o contradice lo que el equipo anotó después del Prompt 1? Ese contraste — intuición vs evidencia — es el insight real de esta etapa.
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
          <p className="muted">
            El posicionamiento puede ser distinto por familia. Si elegís &quot;Mixto&quot;, el Prompt 3 le pedirá a la IA que defina el criterio por tipo de SKU dentro de esa familia.
          </p>
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
          </div>

          <div className={styles.whyBox} style={{ marginTop: 16 }}>
            <h3>Referencia de margen del portfolio</h3>
            <p>
              El margen promedio de los SKUs <strong>Core</strong> en este portfolio es <strong>~43%</strong>. El de <strong>Review</strong> es ~30%. Estos valores son la referencia para calibrar si una decisión de pricing mejora, mantiene o resigna margen respecto de la base actual. No hace falta definir un margen objetivo como número: la IA lo usa como contexto cuando lo incluís en el Prompt 3.
            </p>
          </div>

          <div className={styles.whyBox} style={{ marginTop: 16 }}>
            <h3>La regla de traducción · Del posicionamiento al precio</h3>
            <p>
              Elegir un posicionamiento no alcanza: hace falta una regla explícita que lo traduzca a precios. En este ejercicio la regla tiene tres líneas:
            </p>
            <ul className="simpleList">
              <li>
                Cada posicionamiento define un <strong>target de índice de competitividad</strong>: Más barato que mercado = 0.95 · Igual mercado = 1.00 · Premium = 1.05. Si elegiste Mixto, el target se define por tipo de SKU dentro de la familia.
              </li>
              <li>
                Cada SKU se mueve lo necesario para llegar al target de su familia, con un <strong>tope de ±10%</strong> de movimiento. Nadie pega saltos de 20% de una — si un SKU necesita más que el tope para llegar al target, queda marcado como caso a revisar.
              </li>
              <li>
                Las <strong>excepciones pisan la regla</strong>: margen negativo → Revisar competitividad · Eliminar → Liquidación · elasticidad 2.0 → no subir precio sin evidencia adicional.
              </li>
            </ul>
            <p style={{ marginBottom: 0 }}>
              Esta es la arquitectura de precios: tres líneas que un gerente comercial entiende en 30 segundos. La decisión del equipo es el posicionamiento; la regla ejecuta.
            </p>
          </div>
        </section>

        <section className="card">
          <div className="eyebrow">Prompt 3 · Arquitectura de precios</div>
          <h3>La IA simula el impacto y propone las reglas</h3>
          <p className="muted">
            Con el posicionamiento elegido, la IA construye la arquitectura: las reglas que van a guiar la decisión SKU por SKU. Antes de bajar a ese nivel, el equipo valida que el criterio tenga sentido.
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
          <h3>El efecto en volumen sale de la elasticidad</h3>
          <p className="muted">
            En 07_PRICING hay dos columnas nuevas que trabajan juntas:
          </p>
          <ul className="simpleList">
            <li>
              <strong>pricing_decision</strong> describe qué le pasa al precio: Subir precio / Bajar precio / Mantener precio / Liquidación / Revisar competitividad. Es la acción ejecutada.
            </li>
            <li>
              <strong>positioning_rule</strong> explica por qué: Premium / Igual mercado / Más barato / Excepción: Eliminar / Excepción: margen negativo / Excepción: elasticidad alta. Es el origen de la decisión — si viene de la arquitectura de precios definida en la Parte C o de una excepción que pisa la regla.
            </li>
          </ul>
          <p className="muted">
            Leer las dos columnas juntas responde: ¿qué pasa con el precio y por qué? Una fila que dice Mantener precio + Excepción: elasticidad alta comunica algo completamente distinto a Mantener precio + Igual mercado.
          </p>
          <p className="muted" style={{ marginBottom: 0 }}>
            <code>expected_volume_effect_pct</code> se calcula como −elasticity_proxy × price_move_pct. En esta versión del workbook la columna no tiene fórmula: la completa la IA y el equipo la audita.
          </p>
        </section>

        <section className="card">
          <div className="eyebrow">Anatomía de una regla</div>
          <h3>Una regla bien definida es lo que hace posible delegar</h3>
          <p className="muted">
            En tu trabajo real, definir reglas de negocio ejecutables va a ser una de tus tareas centrales al trabajar con IA. Una regla de pricing ejecutable tiene tres componentes:
          </p>
          <ul className="simpleList">
            <li>
              <strong>Target medible</strong> — ¿a dónde quiero llegar? En este ejercicio: el índice de competitividad objetivo por posicionamiento (0.95 / 1.00 / 1.05). Sin un target numérico, la regla es una expresión de deseo.
            </li>
            <li>
              <strong>Límite operativo</strong> — ¿cuánto me puedo mover por período? Acá: tope de ±10%. El límite protege al negocio de la propia regla — nadie pega saltos de 20% de una, aunque el target lo pida.
            </li>
            <li>
              <strong>Excepciones explícitas</strong> — ¿qué casos pisan la regla? Margen negativo, SKUs a eliminar, elasticidad alta. Las excepciones son la diferencia entre una regla robusta y una que rompe cosas en los bordes.
            </li>
          </ul>
          <p className="muted" style={{ marginBottom: 0 }}>
            Si falta cualquiera de los tres componentes, la regla no se puede delegar — ni a un analista junior ni a una IA. Fijate que el Prompt 4 no es otra cosa que esta regla escrita de forma ejecutable: <strong>una regla bien especificada ES un prompt</strong>.
          </p>
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
              Antes de cerrar esta parte, elegí un SKU con suba de precio recomendada y hacé la cuenta a mano: price_move_pct × (−elasticity_proxy) = expected_volume_effect_pct. Verificá que el margen adicional capturado compense el volumen perdido, y que el precio resultante no supere el target de la familia. Chequeá también que <code>positioning_rule</code> sea consistente con el posicionamiento elegido para esa familia — si el SKU es Core SELECTIVOS y elegiste Premium, <code>positioning_rule</code> debe decir Premium, no Igual mercado. Si no cierra, marcalo en la columna <code>risk</code>.
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

          <details className="promptReveal" style={{ marginTop: 12 }}>
            <summary>
              <span>Ejercicio extendido · Diseñá tu propia regla</span>
              <span className="muted" style={{ fontWeight: 700, fontSize: 13 }}>
                Para completar fuera de clase ▾
              </span>
            </summary>
            <div>
              <p className="muted" style={{ padding: "12px 16px 0" }}>
                En clase ejecutaste una regla que te dimos hecha. En tu empresa, la regla la vas a tener que definir vos. Este ejercicio te hace recorrer ese camino completo: diseñar la regla, delegar su ejecución a la IA, y comparar el impacto contra la regla original.
              </p>
              <div className="promptSingleHeader" style={{ padding: "12px 16px" }}>
                <span className="statusPill warning">Ejercicio extendido</span>
                <CopyButton text={promptExtendedRule} />
              </div>
              <pre style={{ background: "#14211b", color: "#eff8f1", fontFamily: "SFMono-Regular, Consolas, monospace", fontSize: 13, lineHeight: 1.55, margin: 0, overflowX: "auto", padding: 16, whiteSpace: "pre-wrap" }}>
                {promptExtendedRule}
              </pre>
              <p className="muted" style={{ padding: "0 16px 16px", margin: 0 }}>
                El punto 4 es el más valioso: las reglas se aprenden en los bordes. Una regla que funciona en el 95% de los casos y rompe el 5% restante puede destruir más valor del que crea — y ese 5% solo se descubre ejecutando.
              </p>
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
                className={styles.miniTextarea}
                placeholder="Cuántos SKUs por decisión (Aplicar regla / Mantener precio / Revisar competitividad / Liquidación) y en qué familias se concentra cada una."
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
