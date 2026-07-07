"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Save, Send } from "lucide-react";
import { ExerciseHeader } from "./labs/ExerciseHeader";
import { PromptBlock } from "./labs/PromptBlock";
import { WorkbookStatusCard } from "./WorkbookStatusCard";
import { ExerciseWorkbookDownloadCard } from "./ExerciseWorkbookDownloadCard";
import { getLabRepository } from "../lib/repositories/labRepository";
import type { Group, LabCheckpoint, SystemScoreboard } from "../types/lab";
import type { Session } from "../lib/repositories/labRepository.types";

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

const prompt2 = `Usando el análisis por familias de 03_BASE_SKUS, proponé tres escenarios potenciales de optimización de portfolio: Conservador, Balanceado y Agresivo.

Escenario Conservador: reduce destrucción de valor con bajo riesgo comercial. Solo elimina SKUs con señales muy claras (suspendidos, margen negativo o muy bajo, baja venta, baja rotación, alto DDI o capital inmovilizado sin aporte). Ante dudas, Review.

Escenario Balanceado: mejora eficiencia económica sin descuidar cobertura. Puede eliminar SKUs débiles y algunos Review cuando combinen bajo margen, baja rotación, alto DDI, tendencia negativa o capital inmovilizado relevante.

Escenario Agresivo: libera capital y simplifica más rápido. Puede eliminar más SKUs Review, sobre todo con alto capital inmovilizado, DDI alto, margen bajo, tendencia negativa o baja relevancia. Acepta más riesgo de revenue, margen, cobertura y leakage comercial.

Para cada escenario devolveme: objetivo que prioriza; qué tiende a mantener Core, dejar en Review y Eliminar; impacto potencial en cobertura, capital inmovilizado y margen generado; revenue y margen en riesgo; leakage comercial; riesgos a revisar; y qué escenario recomendarías como base y por qué.

No clasifiques todavía todos los SKUs. No presentes los impactos como predicciones exactas: presentalos como lectura estratégica y trade-offs.
Separá hallazgos basados en datos de hipótesis o supuestos.`;

const prompt3 = `Usando el workbook del Laboratorio 1, trabajá con estas hojas:
- 03_BASE_SKUS: fuente de datos del negocio (no la modifiques).
- 06_PORTFOLIO: hoja de trabajo para completar la propuesta.

Escenario elegido: [Conservador / Balanceado / Agresivo]
Prioridad estratégica: [Generación de caja / Rentabilidad / Crecimiento o cobertura]

Usá la prioridad como criterio dominante cuando haya tensiones:
- Caja: pesá más capital inmovilizado, DDI, stock, oportunidad de liquidación.
- Rentabilidad: pesá más margen bruto, margen %, contribución, destrucción de valor.
- Crecimiento/cobertura: pesá más cobertura, revenue, familias estratégicas, leakage.
No ignores las demás variables, pero explicá cómo influyó la prioridad elegida.

Actuá como analista de inteligencia comercial. Clasificá cada SKU como Core, Review o Eliminar según los criterios del ejercicio.

Reglas por escenario:
- Conservador: ante dudas, Review. Solo Eliminar con señales claras.
- Balanceado: decidí por el balance entre contribución, capital, margen, cobertura y riesgo.
- Agresivo: podés Eliminar en más casos, pero explicitá leakage y riesgo de cobertura.

Completá o proponé estas columnas de 06_PORTFOLIO:
- decision_portfolio, action_90_days, decision_reason, priority (Alta/Media/Baja),
  commercial_risk, ai_comment, team_comment (vacío salvo corrección del equipo).

Importante: no inventes datos; si una variable no es clara, aclaralo; no clasifiques con una sola variable; si el caso es dudoso, Review; separá datos de hipótesis;
priorizá la explicación comercial por sobre la precisión matemática aparente.
Si no podés editar el archivo, devolveme una tabla lista para copiar a 06_PORTFOLIO
respetando sku_id y las columnas solicitadas.`;

const prompt4short = `Usá 06_PORTFOLIO ya completada (cruzando contra 03_BASE_SKUS por sku_id).

Escenario elegido: [ ... ] · Prioridad: [ ... ]

Devolveme una síntesis breve, en el mismo orden en que el equipo la va a registrar:
1. Resumen de clasificación: cuántos SKUs quedaron Core / Review / Eliminar y en qué familias.
2. Escenario y prioridad elegidos, y por qué tienen sentido para este caso.
3. Impacto potencial: capital potencialmente liberable, cobertura final estimada,
   revenue y margen en riesgo, y leakage comercial (todo como exposición, no como
   resultado garantizado).
4. Decisiones a revisar manualmente antes de ejecutar.
5. Datos o supuestos a validar.

Hablá de impacto potencial, no de resultado garantizado. Separá datos de supuestos.
Si no podés calcular alguna métrica, aclaralo.`;

const prompt4full = `Usá 06_PORTFOLIO ya completada como fuente principal. Si necesitás revenue,
margen, stock, DDI, cobertura o familia, cruzá contra 03_BASE_SKUS por sku_id.

Escenario elegido: [ ... ] · Prioridad estratégica: [ ... ]

Devolveme:
1. Total de SKUs Core / Review / Eliminar.
2. SKUs por clasificación por familia.
3-7. Revenue, margen bruto, margen % (rango), stock y capital inmovilizado por clasificación.
8. Capital potencialmente liberable por SKUs a Eliminar.
9-10. Cobertura actual y cobertura final estimada.
11-12. Revenue y margen histórico de SKUs a Eliminar.
13-14. Margen positivo en riesgo y destrucción de valor evitable.
15. Leakage comercial estimado.
16-18. Familias donde se concentra Eliminar, Review y Core.
19-20. Riesgos comerciales y decisiones a revisar manualmente.

Compará Antes (sin decisión) vs Después (clasificado).
No presentes impacto como resultado financiero garantizado; hablá de impacto
potencial o exposición asociada. Si no podés calcular algo, aclaralo. Separá
datos de supuestos. No ocultes riesgos del escenario elegido.

Cerrá con un resumen ejecutivo de 5 bullets y una sección "Respuesta para
plataforma" con: 1) Resumen de clasificación 2) Escenario elegido 3) Impacto
potencial 4) Decisiones a revisar 5) Datos o supuestos a validar.`;

const criteria = [
  {
    key: "core",
    title: "Core",
    subtitle: "Proteger, sostener o potenciar",
    description: "Productos relevantes para el negocio que conviene cuidar o desarrollar.",
    when: [
      "Alta contribución a revenue o margen.",
      "Margen saludable y tendencia estable o positiva.",
      "Buena cobertura o relevancia dentro de una familia importante.",
      "Riesgo alto si se discontinúa."
    ],
    actions: [
      "Mantener disponibilidad y cuidar stock.",
      "Revisar pricing con prudencia.",
      "Priorizar abastecimiento; potenciar si crece la demanda."
    ]
  },
  {
    key: "review",
    title: "Review",
    subtitle: "Revisar antes de decidir",
    description: "Productos con señales mixtas que requieren análisis adicional.",
    when: [
      "Buen revenue pero margen bajo, o buen margen pero baja rotación.",
      "Stock alto, DDI elevado o capital inmovilizado relevante.",
      "Tendencia negativa o precio desalineado.",
      "Datos contradictorios o insuficientes."
    ],
    actions: [
      "Revisar precio y ajustar forecast.",
      "Validar con negocio; reducir compras.",
      "Realizar una prueba comercial."
    ]
  },
  {
    key: "eliminate",
    title: "Eliminar",
    subtitle: "Salida controlada o no reposición",
    description: "Candidatos a salir del portfolio activo. No implica retirar sin análisis.",
    when: [
      "Producto suspendido o margen negativo/muy bajo.",
      "Baja contribución, baja rotación, alto DDI.",
      "Capital inmovilizado sin justificación.",
      "Bajo riesgo comercial si se retira."
    ],
    actions: [
      "Liquidar stock; no reponer.",
      "Devolver a proveedor si corresponde.",
      "Promoción de salida; discontinuar del catálogo activo."
    ]
  }
];

const scenarios = [
  {
    key: "conservative",
    title: "Conservador",
    subtitle: "Reducir destrucción de valor, bajo riesgo",
    description: "Solo elimina cuando la evidencia es fuerte. Protege revenue, margen y cobertura.",
    eliminate: ["Suspendidos; margen negativo o muy bajo.", "Baja venta, baja rotación, alto DDI.", "Capital inmovilizado sin aporte relevante."],
    tradeoff: "Libera menos capital, pero reduce el riesgo de retirar productos relevantes."
  },
  {
    key: "balanced",
    title: "Balanceado",
    subtitle: "Eficiencia sin descuidar cobertura",
    description: "Combina liberación de capital, mejora de margen y cuidado del revenue. Es el escenario base.",
    eliminate: ["SKUs claramente débiles.", "Bajo margen combinado con baja rotación; DDI alto.", "Review con varias señales negativas combinadas."],
    tradeoff: "Libera más capital que el conservador, asumiendo cierto riesgo de revenue o cobertura."
  },
  {
    key: "aggressive",
    title: "Agresivo",
    subtitle: "Simplificar y liberar capital rápido",
    description: "Acepta mayor riesgo comercial para acelerar la salida de SKUs ineficientes o dudosos.",
    eliminate: ["Más SKUs Review.", "Alto capital inmovilizado; DDI alto.", "Margen bajo aun con venta; baja cobertura."],
    tradeoff: "Libera y simplifica más, con mayor pérdida potencial de revenue, margen y cobertura."
  }
];

const combinations = [
  { tag: "Conservador + Caja", text: "Libera capital, pero solo en casos muy claros." },
  { tag: "Balanceado + Rentabilidad", text: "Mejora margen sin desarmar demasiado el portfolio." },
  { tag: "Agresivo + Caja", text: "Acepta más riesgo comercial para liberar más capital." },
  { tag: "Conservador + Cobertura", text: "Protege más SKUs y deja más casos en Review." },
  { tag: "Agresivo + Rentabilidad", text: "Elimina SKUs de bajo margen aunque conserven algo de revenue." }
];

type Exercise01ViewProps = {
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

export function Exercise01View({
  group,
  stateVersion,
  scoreboard
}: Exercise01ViewProps) {
  const repo = getLabRepository();
  const isAmplify = useMemo(() => (process.env.NEXT_PUBLIC_DATA_MODE ?? "local") === "amplify", []);

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [checkpointStatus, setCheckpointStatus] = useState<string>("borrador");
  const [submittedAt, setSubmittedAt] = useState<string | undefined>();
  const successRef = useRef<HTMLDivElement | null>(null);

  // Intermediate fields persisted as draft.
  const [ownPrompt, setOwnPrompt] = useState("");
  const [scenarioGuess, setScenarioGuess] = useState("");
  const [scenarioSelection, setScenarioSelection] = useState("");
  const [prioritySelection, setPrioritySelection] = useState("");
  const [validatedSku, setValidatedSku] = useState("");

  // Final checkpoint fields.
  const [classificationSummary, setClassificationSummary] = useState("");
  const [selectedScenario, setSelectedScenario] = useState("");
  const [businessImpact, setBusinessImpact] = useState("");
  const [decisionsToReview, setDecisionsToReview] = useState("");
  const [assumptionsToValidate, setAssumptionsToValidate] = useState("");

  const intermediateFields = {
    ownPrompt,
    scenarioGuess,
    scenarioSelection,
    prioritySelection,
    validatedSku
  };

  const finalFields = {
    classification_summary: classificationSummary,
    selected_scenario: selectedScenario,
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
          exerciseId: "ex-01",
          exerciseVersion: 1
        });
        if (cancelled) return;

        if (submission) {
          setCheckpointStatus(submission.status);
          setSubmittedAt(submission.submittedAt ?? undefined);

          if (submission.responsesJson) {
            const r = submission.responsesJson as Record<string, string>;
            setOwnPrompt(r.ownPrompt ?? "");
            setScenarioGuess(r.scenarioGuess ?? "");
            setScenarioSelection(r.scenarioSelection ?? "");
            setPrioritySelection(r.prioritySelection ?? "");
            setValidatedSku(r.validatedSku ?? "");
            setClassificationSummary(r.classification_summary ?? "");
            setSelectedScenario(r.selected_scenario ?? "");
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
    if (!classificationSummary.trim()) missing.push("Resumen de clasificación");
    if (!selectedScenario.trim()) missing.push("Escenario y prioridad");
    if (!businessImpact.trim()) missing.push("Impacto potencial");
    if (!decisionsToReview.trim()) missing.push("Decisiones a revisar");
    if (!assumptionsToValidate.trim()) missing.push("Datos o supuestos a validar");
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
        exerciseId: "ex-01",
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
      setErrors(new Set(["classification_summary", "selected_scenario", "business_impact", "decisions_to_review", "assumptions_to_validate"]));
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
        exerciseId: "ex-01",
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
        title="Ejercicio 1: Del negocio al SKU"
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
      title="Ejercicio 1: Del negocio al SKU"
      subtitle="Una estrategia de portfolio no se define de forma intuitiva, producto por producto. Se construye descendiendo desde el negocio hasta el SKU, sin saltear pasos."
      groupName={group.name}
      checkpointStatus={checkpointStatus}
      submittedAt={submittedAt}
    >
      <ExerciseWorkbookDownloadCard exerciseId="ex-01" />

      <WorkbookStatusCard stateVersion={stateVersion} lastWorkbookName={scoreboard.lastWorkbookName} />

      {/* FUNNEL */}
      <section className="card">
        <div className="eyebrow">La idea que ordena todo</div>
        <h2>El embudo de decisión</h2>
        <p className="muted">
          El ejercicio completo es un solo movimiento: descender de lo general a lo particular sin omitir escalones. No es posible evaluar un SKU sin comprender antes su familia, ni decidir qué productos retirar sin haber definido cuánto riesgo comercial se está dispuesto a asumir. Cada parte del ejercicio corresponde a un escalón de este embudo.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            {[
              { label: "Negocio", part: "Parte A" },
              { label: "Familias", part: "Parte B" },
              { label: "Escenario", part: "Parte C · D" },
              { label: "SKU", part: "Parte E" },
              { label: "Impacto", part: "Parte E" }
            ].map((stage, index, arr) => (
              <div key={stage.label} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    flex: "0 0 auto",
                    background: "linear-gradient(135deg, rgba(15,107,93,.12), rgba(191,111,40,.08)), var(--surface)",
                    border: "1px solid var(--line)",
                    borderRadius: 8,
                    padding: "12px 16px",
                    fontWeight: 850,
                    color: "var(--brand-strong)",
                    minWidth: 132,
                    textAlign: "center"
                  }}
                >
                  {stage.label}
                  <small style={{ display: "block", color: "var(--muted)", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: ".06em", marginTop: 2 }}>
                    {stage.part}
                  </small>
                </div>
                {index < arr.length - 1 ? <span style={{ color: "var(--accent)", fontWeight: 850, fontSize: 20 }}>→</span> : null}
              </div>
            ))}
          </div>
        </div>
        <p className="muted" style={{ marginTop: 16, marginBottom: 0 }}>
          Conviene retener esta imagen. Ante cada respuesta de la IA, la pregunta de control es: <strong>¿en qué escalón del embudo estoy?</strong> Si se está clasificando SKUs sin haber leído primero las familias, corresponde retroceder.
        </p>
      </section>

      {/* PARTE A */}
      <section style={{ borderTop: "1px solid var(--line)", paddingTop: 24, marginTop: 24, display: "grid", gap: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <span
            style={{
              alignItems: "center",
              background: "var(--brand)",
              borderRadius: "999px",
              color: "#fff",
              display: "inline-flex",
              flex: "0 0 auto",
              fontWeight: 850,
              height: 34,
              justifyContent: "center",
              width: 34
            }}
          >
            A
          </span>
          <div>
            <span
              style={{
                display: "inline-block",
                background: "var(--surface-muted)",
                border: "1px solid var(--line)",
                borderRadius: "999px",
                color: "var(--brand-strong)",
                fontSize: 11,
                fontWeight: 850,
                letterSpacing: ".08em",
                padding: "4px 10px",
                textTransform: "uppercase"
              }}
            >
              Parte A
            </span>
            <h2 style={{ marginTop: 8, marginBottom: 4 }}>El problema y las variables en juego</h2>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginTop: 6 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "999px", padding: "4px 10px", fontSize: 12, fontWeight: 800, color: "var(--muted)" }}>
                ⏱ ~5 min
              </span>
            </div>
          </div>
        </div>

        <section className="card">
          <div className="eyebrow">Reencuadre</div>
          <h3>No se trata de ordenar una tabla</h3>
          <p className="muted">
            Un análisis de portfolio no consiste en ordenar productos del mejor al peor. Consiste en <strong>resolver tensiones que no tienen una respuesta única</strong>. Rara vez una decisión es limpia: el producto que más vende puede ser el que menos margen aporta; el más rentable puede tener el capital inmovilizado en depósito. Antes de observar métricas aisladas, es necesario comprender estas tensiones.
          </p>

          <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", marginTop: 6 }}>
            {[
              { vs: "Revenue vs Margen", title: "¿Vende mucho o aporta poco?", text: "Un SKU con revenue alto y margen bajo moviliza facturación, pero puede no estar generando valor. Alto volumen no equivale a buena contribución." },
              { vs: "Margen vs DDI", title: "¿Rentable pero inmovilizado?", text: "Un margen saludable pierde valor si el producto rota poco y mantiene capital inmovilizado. Un DDI elevado implica capital detenido, aunque el margen porcentual sea atractivo." },
              { vs: "Cobertura vs Rentabilidad", title: "¿Presencia o eficiencia?", text: "Sostener variedad para no perder clientes suele entrar en conflicto con concentrarse en lo más rentable. Difícilmente se optimicen ambas a la vez." }
            ].map((tension) => (
              <div
                key={tension.vs}
                style={{
                  background: "var(--surface-muted)",
                  border: "1px solid var(--line)",
                  borderLeft: "4px solid var(--accent)",
                  borderRadius: 8,
                  padding: 16
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    background: "rgba(191,111,40,.12)",
                    color: "var(--accent)",
                    fontWeight: 850,
                    fontSize: 11,
                    padding: "2px 8px",
                    borderRadius: "999px",
                    marginBottom: 8,
                    letterSpacing: ".04em"
                  }}
                >
                  {tension.vs}
                </span>
                <h3 style={{ fontSize: 15, color: "var(--brand-strong)", marginBottom: 6 }}>{tension.title}</h3>
                <p style={{ color: "var(--muted)", lineHeight: 1.45, margin: 0, fontSize: 14 }}>{tension.text}</p>
              </div>
            ))}
          </div>

          <p className="muted" style={{ marginTop: 16 }}>
            Las métricas —revenue, margen bruto, margen %, unidades, stock, DDI, capital inmovilizado, tendencia, estatus y cobertura— son los <strong>insumos</strong>. Las tensiones anteriores son lo que debe resolverse con ellos. Ninguna clasificación debe apoyarse en una sola variable aislada.
          </p>
        </section>

        <section className="card">
          <div className="eyebrow">De dónde surge la clasificación</div>
          <h2>Por qué Core, Review y Eliminar</h2>
          <p className="muted">
            La clasificación no es arbitraria. Proviene de la lógica de <strong>racionalización de portfolios</strong> y de la toma de decisiones bajo incertidumbre. Cuando los datos no alcanzan para una conclusión clara, forzar una decisión binaria —mantener o retirar— destruye valor: obliga a resolver casos ambiguos sin la información necesaria.
          </p>
          <div
            style={{
              background: "rgba(15,107,93,.06)",
              border: "1px solid rgba(15,107,93,.18)",
              borderRadius: 8,
              padding: 16,
              marginTop: 12
            }}
          >
            <h3 style={{ color: "var(--brand-strong)", fontSize: 14, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: ".04em" }}>
              La razón de las tres categorías
            </h3>
            <p style={{ color: "var(--ink)", lineHeight: 1.55, margin: 0 }}>
              Cada categoría se corresponde con una <strong>acción distinta</strong> y con un <strong>nivel de certeza distinto</strong>. Core reúne los casos donde la evidencia respalda proteger. Eliminar, los casos donde la evidencia respalda retirar. Y <strong>Review existe precisamente para no forzar una decisión sobre lo que aún no está claro</strong>: separa las decisiones firmes de las que requieren más análisis. Dos categorías serían insuficientes —empujarían a decidir de más—; más de tres agregarían complejidad sin aportar valor de decisión en esta etapa.
            </p>
          </div>

          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", marginTop: 6 }}>
            {criteria.map((criterion) => (
              <article
                key={criterion.key}
                style={{
                  background: "var(--surface-muted)",
                  border: "1px solid var(--line)",
                  borderRadius: 8,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  padding: 18
                }}
              >
                <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: 12 }}>
                  <h3 style={{ color: "var(--brand-strong)", fontSize: 20, margin: "0 0 4px" }}>{criterion.title}</h3>
                  <span style={{ color: "var(--accent)", fontSize: 13, fontWeight: 750 }}>{criterion.subtitle}</span>
                </div>
                <p className="muted" style={{ lineHeight: 1.45, margin: 0 }}>{criterion.description}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <strong style={{ color: "var(--ink)", fontSize: 13, fontWeight: 800 }}>Cuándo corresponde</strong>
                  <ul className="simpleList" style={{ margin: 0 }}>
                    {criterion.when.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <strong style={{ color: "var(--ink)", fontSize: 13, fontWeight: 800 }}>Acciones típicas</strong>
                  <ul className="simpleList" style={{ margin: 0 }}>
                    {criterion.actions.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>

      {/* PARTE B */}
      <section style={{ borderTop: "1px solid var(--line)", paddingTop: 24, marginTop: 24, display: "grid", gap: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <span
            style={{
              alignItems: "center",
              background: "var(--brand)",
              borderRadius: "999px",
              color: "#fff",
              display: "inline-flex",
              flex: "0 0 auto",
              fontWeight: 850,
              height: 34,
              justifyContent: "center",
              width: 34
            }}
          >
            B
          </span>
          <div>
            <span
              style={{
                display: "inline-block",
                background: "var(--surface-muted)",
                border: "1px solid var(--line)",
                borderRadius: "999px",
                color: "var(--brand-strong)",
                fontSize: 11,
                fontWeight: 850,
                letterSpacing: ".08em",
                padding: "4px 10px",
                textTransform: "uppercase"
              }}
            >
              Parte B
            </span>
            <h2 style={{ marginTop: 8, marginBottom: 4 }}>Cómo se piensa este análisis con IA</h2>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginTop: 6 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "999px", padding: "4px 10px", fontSize: 12, fontWeight: 800, color: "var(--muted)" }}>
                ⏱ ~12 min
              </span>
            </div>
          </div>
        </div>

        <section className="card">
          <div className="eyebrow">La lógica del embudo, explícita</div>
          <h3>Por qué el orden de trabajo determina la calidad del análisis</h3>
          <p className="muted">
            La IA procesa rápido, pero no tiene criterio de negocio propio: el marco de razonamiento lo aporta el equipo. Estas tres decisiones de método son las que sostienen la validez del análisis:
          </p>
          <ul className="simpleList">
            <li><strong>Primero las familias, después el SKU.</strong> No es posible evaluar si un producto es Core sin saber si su familia es motor del negocio o está en caída. El contexto de la familia le da sentido a la lectura del producto.</li>
            <li><strong>Explorar y clasificar son dos pasos distintos.</strong> Si se solicita clasificar antes de haber comprendido el negocio, la IA no corrige el error de origen: lo ordena prolijamente y lo hace parecer riguroso. Primero se entiende; después se decide.</li>
            <li><strong>El escenario se define antes de que la IA decida.</strong> La IA no posee apetito de riesgo; el equipo sí. El escenario es una decisión del equipo, no del modelo.</li>
          </ul>
          <div
            style={{
              background: "var(--surface-muted)",
              borderLeft: "4px solid var(--accent)",
              borderRadius: 8,
              color: "var(--ink)",
              lineHeight: 1.5,
              padding: 16,
              marginTop: 14
            }}
          >
            En síntesis: si se clasifica antes de entender, el resultado será un ordenamiento coherente de una lectura equivocada. El orden protege contra ese riesgo.
          </div>
        </section>

        <section className="card">
          <div className="eyebrow">Construir el prompt hacia un resultado</div>
          <h2>Qué resultado buscamos antes de escribir el prompt</h2>
          <p className="muted">
            En esta instancia el equipo todavía está explorando el negocio, de modo que no se pide anticipar qué dirá la data. Lo que sí puede definirse de antemano es <strong>qué resultado necesita producir la lectura por familias</strong>. Ese resultado es el objetivo; el prompt es el medio para alcanzarlo.
          </p>

          <div
            style={{
              background: "linear-gradient(135deg, rgba(15,107,93,.08), rgba(191,111,40,.05)), var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: 8,
              padding: 18
            }}
          >
            <h3 style={{ color: "var(--brand-strong)", fontSize: 15, margin: "0 0 10px", display: "flex", alignItems: "center", gap: 8 }}>
              Resultado esperado de la lectura por familias
            </h3>
            <p className="muted" style={{ margin: 0 }}>Un buen análisis por familias debería permitir responder:</p>
            <ul className="simpleList" style={{ marginTop: 8 }}>
              <li>Qué familias concentran el <strong>revenue</strong> y cuáles el <strong>margen bruto</strong>.</li>
              <li>Dónde se concentra el <strong>inventario inmovilizado</strong> y el capital detenido (DDI elevado).</li>
              <li>Qué familias presentan productos suspendidos, caída reciente o señales de riesgo.</li>
              <li>Qué familias tienen cobertura relevante y serían sensibles ante eliminaciones.</li>
              <li>Qué <strong>tensiones</strong> aparecen entre revenue, margen, inventario y cobertura.</li>
            </ul>
          </div>

          <p className="muted" style={{ marginTop: 16 }}>
            Con ese resultado como objetivo, redactá un prompt que se lo solicite a la IA. Definí qué rol le asignás, qué datos tiene disponibles (hoja <strong>03_BASE_SKUS</strong>), qué debe devolver y qué <strong>no</strong> debe hacer todavía (por ejemplo, no clasificar SKU por SKU).
          </p>

          <div className="formField" style={{ marginTop: 6 }}>
            <label className="formLabel" htmlFor="ownPrompt">
              Prompt del equipo
            </label>
            <textarea
              id="ownPrompt"
              placeholder="Actuá como analista de inteligencia comercial. Usando la hoja 03_BASE_SKUS del workbook, y sin clasificar todavía SKU por SKU, devolveme..."
              value={ownPrompt}
              onChange={(e) => setOwnPrompt(e.target.value)}
              style={{ minHeight: 150 }}
            />
          </div>

          <p className="muted" style={{ marginTop: 16 }}>
            Ejecutado el prompt del equipo y obtenido el resultado, <strong>recién entonces</strong> conviene abrir el prompt de referencia y compararlo con el propio.
          </p>

          <details className="promptReveal" style={{ border: "1px solid var(--line)", borderRadius: 8, background: "var(--surface-muted)", overflow: "hidden", marginTop: 8 }}>
            <summary style={{ alignItems: "center", cursor: "pointer", display: "flex", fontWeight: 850, justifyContent: "space-between", listStyle: "none", padding: "14px 16px", color: "var(--brand-strong)", gap: 12 }}>
              <span>Prompt de referencia · Lectura por familias</span>
              <span className="muted" style={{ fontWeight: 700, fontSize: 13 }}>Abrir después de ejecutar el propio ▾</span>
            </summary>
            <div>
              <div className="promptSingleHeader" style={{ padding: "12px 16px" }}>
                <span className="statusPill info">Comparar, no copiar</span>
                <button
                  className="iconButton"
                  title="Copiar"
                  type="button"
                  onClick={() => copyToClipboard(prompt1)}
                  aria-label="Copiar prompt de referencia"
                >
                  ⧉
                </button>
              </div>
              <pre style={{ background: "#14211b", color: "#eff8f1", fontFamily: "SFMono-Regular, Consolas, monospace", fontSize: 13, lineHeight: 1.55, margin: 0, overflowX: "auto", padding: 16, whiteSpace: "pre-wrap" }}>
                {prompt1}
              </pre>
            </div>
          </details>

          <div
            style={{
              background: "rgba(191,111,40,.08)",
              border: "1px solid rgba(191,111,40,.25)",
              borderRadius: 8,
              color: "#7a4214",
              lineHeight: 1.5,
              padding: 16,
              marginTop: 16
            }}
          >
            <strong>La comparación es el aprendizaje.</strong> ¿El prompt propio alcanzó el resultado esperado? ¿Qué elemento faltó incorporar —una restricción, una variable, el pedido de citar la hoja de origen? El objetivo no es memorizar un prompt, sino comprender cómo construir uno para un problema equivalente en el trabajo real.
          </div>

          <div
            style={{
              background: "rgba(255,255,255,.72)",
              border: "1px solid var(--line)",
              borderRadius: 8,
              padding: 18,
              marginTop: 16
            }}
          >
            <h3 style={{ color: "var(--brand-strong)", fontSize: 15, margin: "0 0 10px" }}>Validar siempre</h3>
            <ul className="simpleList" style={{ marginTop: 0 }}>
              <li>Solicitar a la IA que indique en qué hoja o columna se basa cada afirmación.</li>
              <li>Ante cualquier dato dudoso, contrastarlo contra el workbook antes de avanzar.</li>
            </ul>
          </div>
        </section>
      </section>

      {/* PARTE C */}
      <section style={{ borderTop: "1px solid var(--line)", paddingTop: 24, marginTop: 24, display: "grid", gap: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <span
            style={{
              alignItems: "center",
              background: "var(--brand)",
              borderRadius: "999px",
              color: "#fff",
              display: "inline-flex",
              flex: "0 0 auto",
              fontWeight: 850,
              height: 34,
              justifyContent: "center",
              width: 34
            }}
          >
            C
          </span>
          <div>
            <span
              style={{
                display: "inline-block",
                background: "var(--surface-muted)",
                border: "1px solid var(--line)",
                borderRadius: "999px",
                color: "var(--brand-strong)",
                fontSize: 11,
                fontWeight: 850,
                letterSpacing: ".08em",
                padding: "4px 10px",
                textTransform: "uppercase"
              }}
            >
              Parte C
            </span>
            <h2 style={{ marginTop: 8, marginBottom: 4 }}>Explorar y armar escenarios</h2>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginTop: 6 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "999px", padding: "4px 10px", fontSize: 12, fontWeight: 800, color: "var(--muted)" }}>
                ⏱ ~8 min
              </span>
            </div>
          </div>
        </div>

        <section className="card">
          <div className="eyebrow">Por qué escenarios</div>
          <h3>Un escenario expresa el apetito de riesgo del negocio</h3>
          <p className="muted">
            Los escenarios no son tres respuestas correctas distintas. Son tres formas de expresar cuánto riesgo comercial está dispuesto a asumir el negocio. No modifican los datos: modifican el criterio de decisión. El mismo SKU dudoso puede quedar en Review bajo un criterio conservador y en Eliminar bajo uno agresivo.
          </p>
          <div
            style={{
              background: "rgba(15,107,93,.06)",
              border: "1px solid rgba(15,107,93,.18)",
              borderRadius: 8,
              padding: 16,
              marginTop: 12
            }}
          >
            <h3 style={{ color: "var(--brand-strong)", fontSize: 14, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: ".04em" }}>
              Por qué tiene sentido plantear escenarios
            </h3>
            <p style={{ color: "var(--ink)", lineHeight: 1.55, margin: 0 }}>
              Trabajar con escenarios es una herramienta de planificación estratégica <strong>independiente de la IA</strong>: existe porque una decisión de portfolio depende del objetivo del negocio y de su tolerancia al riesgo, y eso es un juicio, no un cálculo. Los datos no indican cuán agresiva debe ser la decisión; esa es una definición del negocio, y conviene hacerla explícita antes de decidir.
            </p>
            <p style={{ color: "var(--ink)", lineHeight: 1.55, margin: "10px 0 0" }}>
              Al trabajar <strong>con IA</strong>, además, el escenario cumple una función de control. El modelo optimiza hacia el criterio que se le entregue. Si no se le explicita el apetito de riesgo, la IA adoptará uno de forma implícita, y el equipo no sabrá cuál. Definir el escenario es la manera de conservar el control del criterio, en lugar de delegarlo silenciosamente en el modelo.
            </p>
          </div>

          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", marginTop: 6 }}>
            {scenarios.map((scenario) => (
              <article
                key={scenario.key}
                style={{
                  background: "var(--surface-muted)",
                  border: "1px solid var(--line)",
                  borderRadius: 8,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  padding: 18
                }}
              >
                <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: 12 }}>
                  <h3 style={{ color: "var(--brand-strong)", fontSize: 20, margin: "0 0 4px" }}>{scenario.title}</h3>
                  <span style={{ color: "var(--accent)", fontSize: 13, fontWeight: 750 }}>{scenario.subtitle}</span>
                </div>
                <p className="muted" style={{ lineHeight: 1.45, margin: 0 }}>{scenario.description}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <strong style={{ color: "var(--ink)", fontSize: 13, fontWeight: 800 }}>Tiende a eliminar</strong>
                  <ul className="simpleList" style={{ margin: 0 }}>
                    {scenario.eliminate.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <strong style={{ color: "var(--ink)", fontSize: 13, fontWeight: 800 }}>Trade-off</strong>
                  <p className="muted" style={{ lineHeight: 1.45, margin: 0 }}>{scenario.tradeoff}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="eyebrow">Cómo se mide el impacto de un escenario</div>
          <h3>Un escenario no es solo un criterio: tiene consecuencias que hay que ver cuantificadas</h3>
          <p className="muted">
            Para comparar escenarios de forma seria, no alcanza con la intención de cada uno. Hace falta ver el impacto que cada uno produciría. Por eso, al explorar escenarios, la IA debe devolver estas variables de impacto —son las que permiten comparar trade-offs con evidencia y no con intuición:
          </p>
          <ul className="simpleList" style={{ marginTop: 0 }}>
            <li><strong>Cobertura actual vs cobertura final estimada</strong> — cuánta presencia comercial se conservaría. Es exposición potencial, no una predicción exacta.</li>
            <li><strong>Capital inmovilizado vs capital potencialmente liberable</strong> — cuánto capital dormido podría liberarse. No es caja garantizada.</li>
            <li><strong>Revenue en riesgo y margen en riesgo</strong> — la facturación y el margen histórico asociados a los SKUs candidatos a salida.</li>
          </ul>
          <div
            style={{
              background: "var(--surface-muted)",
              borderLeft: "4px solid var(--accent)",
              borderRadius: 8,
              color: "var(--ink)",
              lineHeight: 1.5,
              padding: 16,
              marginTop: 14
            }}
          >
            <strong>Leakage comercial —</strong> el concepto que más suele malinterpretarse. Es la pérdida potencial de valor comercial al eliminar SKUs que <em>todavía</em> aportaban revenue, margen, cobertura o valor estratégico. Ejemplo: se retira un producto de bajo margen para simplificar, pero era el que hacía ingresar al cliente a la categoría y, de paso, comprar los Core. Ese valor que se pierde por arrastre es el leakage.
          </div>
        </section>

        <section className="card">
          <div className="eyebrow">Antes de ejecutar el Prompt 2</div>
          <h3>Anticipar qué escenario conviene a este negocio</h3>
          <p className="muted">
            Con la lectura por familias ya realizada, el equipo cuenta con datos suficientes para formar una hipótesis: ¿qué escenario parece convenir a <em>este</em> negocio y por qué? Conviene registrarlo antes de consultar a la IA, para luego contrastar esa hipótesis con el análisis de trade-offs que devuelva el Prompt 2.
          </p>
          <div className="formField" style={{ marginTop: 6 }}>
            <textarea
              className="miniTextarea"
              placeholder="El equipo estima que conviene un escenario ___ porque las familias motor son ___ y el riesgo principal identificado es ___."
              value={scenarioGuess}
              onChange={(e) => setScenarioGuess(e.target.value)}
              style={{ minHeight: 96 }}
            />
          </div>

          <details className="promptReveal" style={{ border: "1px solid var(--line)", borderRadius: 8, background: "var(--surface-muted)", overflow: "hidden", marginTop: 14 }}>
            <summary style={{ alignItems: "center", cursor: "pointer", display: "flex", fontWeight: 850, justifyContent: "space-between", listStyle: "none", padding: "14px 16px", color: "var(--brand-strong)", gap: 12 }}>
              <span>Prompt 2 · Explorar escenarios y trade-offs</span>
              <span className="muted" style={{ fontWeight: 700, fontSize: 13 }}>Abrir después de anticipar ▾</span>
            </summary>
            <div>
              <div className="promptSingleHeader" style={{ padding: "12px 16px" }}>
                <span className="statusPill info">Trade-offs, no predicciones</span>
                <button
                  className="iconButton"
                  title="Copiar"
                  type="button"
                  onClick={() => copyToClipboard(prompt2)}
                  aria-label="Copiar prompt 2"
                >
                  ⧉
                </button>
              </div>
              <pre style={{ background: "#14211b", color: "#eff8f1", fontFamily: "SFMono-Regular, Consolas, monospace", fontSize: 13, lineHeight: 1.55, margin: 0, overflowX: "auto", padding: 16, whiteSpace: "pre-wrap" }}>
                {prompt2}
              </pre>
            </div>
          </details>
        </section>
      </section>

      {/* PARTE D */}
      <section style={{ borderTop: "1px solid var(--line)", paddingTop: 24, marginTop: 24, display: "grid", gap: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <span
            style={{
              alignItems: "center",
              background: "var(--brand)",
              borderRadius: "999px",
              color: "#fff",
              display: "inline-flex",
              flex: "0 0 auto",
              fontWeight: 850,
              height: 34,
              justifyContent: "center",
              width: 34
            }}
          >
            D
          </span>
          <div>
            <span
              style={{
                display: "inline-block",
                background: "var(--surface-muted)",
                border: "1px solid var(--line)",
                borderRadius: "999px",
                color: "var(--brand-strong)",
                fontSize: 11,
                fontWeight: 850,
                letterSpacing: ".08em",
                padding: "4px 10px",
                textTransform: "uppercase"
              }}
            >
              Parte D
            </span>
            <h2 style={{ marginTop: 8, marginBottom: 4 }}>Elegir escenario y prioridad estratégica</h2>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginTop: 6 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "999px", padding: "4px 10px", fontSize: 12, fontWeight: 800, color: "var(--muted)" }}>
                ⏱ ~7 min
              </span>
            </div>
          </div>
        </div>

        <section className="card">
          <div className="eyebrow">La decisión es del equipo</div>
          <h3>Dos ejes, una decisión</h3>
          <p className="muted">
            La IA puede recomendar, pero la definición corresponde al equipo. El <strong>escenario</strong> establece el nivel de agresividad; la <strong>prioridad estratégica</strong> determina qué variable pesa más cuando aparecen trade-offs.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 6 }}>
            <div className="formField">
              <label className="formLabel" htmlFor="scenarioSel">
                Escenario
              </label>
              <select id="scenarioSel" value={scenarioSelection} onChange={(e) => setScenarioSelection(e.target.value)}>
                <option value="">Seleccionar…</option>
                <option value="Conservador">Conservador</option>
                <option value="Balanceado">Balanceado</option>
                <option value="Agresivo">Agresivo</option>
              </select>
            </div>
            <div className="formField">
              <label className="formLabel" htmlFor="prioritySel">
                Prioridad estratégica
              </label>
              <select id="prioritySel" value={prioritySelection} onChange={(e) => setPrioritySelection(e.target.value)}>
                <option value="">Seleccionar…</option>
                <option value="Generación de caja">Generación de caja</option>
                <option value="Rentabilidad">Rentabilidad</option>
                <option value="Crecimiento o cobertura">Crecimiento o cobertura</option>
              </select>
            </div>
          </div>

          <h3 style={{ marginTop: 20 }}>Cómo se combinan</h3>
          <div className="tableWrap">
            <table>
              <thead>
                <tr>
                  <th>Combinación</th>
                  <th>Qué busca</th>
                </tr>
              </thead>
              <tbody>
                {combinations.map((combination) => (
                  <tr key={combination.tag}>
                    <td><strong>{combination.tag}</strong></td>
                    <td>{combination.text}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="muted" style={{ marginTop: 14, marginBottom: 0 }}>
            Regla de referencia: el escenario indica <em>cuán prudente</em> es la recomendación; la prioridad indica <em>qué variable prevalece</em> cuando dos señales se contradicen.
          </p>
        </section>
      </section>

      {/* PARTE E */}
      <section style={{ borderTop: "1px solid var(--line)", paddingTop: 24, marginTop: 24, display: "grid", gap: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <span
            style={{
              alignItems: "center",
              background: "var(--brand)",
              borderRadius: "999px",
              color: "#fff",
              display: "inline-flex",
              flex: "0 0 auto",
              fontWeight: 850,
              height: 34,
              justifyContent: "center",
              width: 34
            }}
          >
            E
          </span>
          <div>
            <span
              style={{
                display: "inline-block",
                background: "var(--surface-muted)",
                border: "1px solid var(--line)",
                borderRadius: "999px",
                color: "var(--brand-strong)",
                fontSize: 11,
                fontWeight: 850,
                letterSpacing: ".08em",
                padding: "4px 10px",
                textTransform: "uppercase"
              }}
            >
              Parte E
            </span>
            <h2 style={{ marginTop: 8, marginBottom: 4 }}>Bajar a SKU y medir impacto</h2>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginTop: 6 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "999px", padding: "4px 10px", fontSize: 12, fontWeight: 800, color: "var(--muted)" }}>
                ⏱ ~10 min
              </span>
            </div>
          </div>
        </div>

        <section className="card">
          <div className="eyebrow">Prompt 3 · Clasificar SKU por SKU</div>
          <h3>Aplicar el escenario y la prioridad a 06_PORTFOLIO</h3>
          <p className="muted">
            Este es el último escalón del embudo. La IA completa la hoja 06_PORTFOLIO con el escenario y la prioridad definidos en la Parte D. Reemplazá los campos entre corchetes con la elección del equipo.
          </p>
          <div className="promptSingle" style={{ background: "var(--surface-muted)", border: "1px solid var(--line)", borderRadius: 8, marginTop: 8, overflow: "hidden" }}>
            <div className="promptSingleHeader">
              <span className="statusPill info">06_PORTFOLIO</span>
              <button
                className="iconButton"
                title="Copiar"
                type="button"
                onClick={() => copyToClipboard(prompt3)}
                aria-label="Copiar prompt 3"
              >
                ⧉
              </button>
            </div>
            <pre style={{ background: "#14211b", color: "#eff8f1", fontFamily: "SFMono-Regular, Consolas, monospace", fontSize: 13, lineHeight: 1.55, margin: 0, overflowX: "auto", padding: 16, whiteSpace: "pre-wrap" }}>
              {prompt3}
            </pre>
          </div>
        </section>

        <section className="card">
          <div className="eyebrow">Un control antes de cerrar</div>
          <h3>Validar una clasificación contra los datos</h3>
          <p className="muted">
            No se pide todavía discutir el criterio de la IA —eso corresponde a etapas más avanzadas—, sino reforzar el hábito de <strong>verificar</strong>. Elegí un SKU que la IA haya clasificado como <strong>Eliminar</strong> y comprobá que la razón que da (columna <code>decision_reason</code>) se apoya en datos reales del workbook: ¿el margen, el DDI o el estatus que menciona coinciden con 03_BASE_SKUS? Es una verificación, no una defensa: alcanza con confirmar que la recomendación está fundada en la evidencia.
          </p>
          <div className="formField" style={{ marginTop: 6 }}>
            <label className="formLabel" htmlFor="validateSku">
              SKU verificado
            </label>
            <textarea
              id="validateSku"
              className="miniTextarea"
              placeholder="SKU ___, clasificado Eliminar. La razón indicada es ___. Verifiqué contra 03_BASE_SKUS: los datos ___ (coinciden / no coinciden)."
              value={validatedSku}
              onChange={(e) => setValidatedSku(e.target.value)}
              style={{ minHeight: 96 }}
            />
          </div>
        </section>

        <section className="card">
          <div className="eyebrow">Prompt 4 · Reporte de impacto</div>
          <h3>Producir la síntesis que alimenta el checkpoint</h3>
          <p className="muted">
            El paso final no agrega una nueva decisión: sintetiza el impacto de lo ya clasificado. Para la clase se acota a lo que un tomador de decisiones necesita para decidir —cuántos SKUs salen, cuánto capital podría liberarse y qué riesgos asume el escenario—; la versión extendida de 20 puntos queda como referencia para completar fuera de clase. <strong>La salida de este prompt es exactamente lo que se carga en el checkpoint</strong>, de modo que no hace falta recopilar los datos a mano.
          </p>
          <div className="promptSingle" style={{ background: "var(--surface-muted)", border: "1px solid var(--line)", borderRadius: 8, marginTop: 8, overflow: "hidden" }}>
            <div className="promptSingleHeader">
              <span className="statusPill success">Versión de clase</span>
              <button
                className="iconButton"
                title="Copiar"
                type="button"
                onClick={() => copyToClipboard(prompt4short)}
                aria-label="Copiar prompt 4 versión clase"
              >
                ⧉
              </button>
            </div>
            <pre style={{ background: "#14211b", color: "#eff8f1", fontFamily: "SFMono-Regular, Consolas, monospace", fontSize: 13, lineHeight: 1.55, margin: 0, overflowX: "auto", padding: 16, whiteSpace: "pre-wrap" }}>
              {prompt4short}
            </pre>
          </div>

          <details className="promptReveal" style={{ border: "1px solid var(--line)", borderRadius: 8, background: "var(--surface-muted)", overflow: "hidden", marginTop: 14 }}>
            <summary style={{ alignItems: "center", cursor: "pointer", display: "flex", fontWeight: 850, justifyContent: "space-between", listStyle: "none", padding: "14px 16px", color: "var(--brand-strong)", gap: 12 }}>
              <span>Prompt 4 extendido · 20 puntos (referencia)</span>
              <span className="muted" style={{ fontWeight: 700, fontSize: 13 }}>Para completar fuera de clase ▾</span>
            </summary>
            <div>
              <div className="promptSingleHeader" style={{ padding: "12px 16px" }}>
                <span className="statusPill warning">Entregable extendido</span>
                <button
                  className="iconButton"
                  title="Copiar"
                  type="button"
                  onClick={() => copyToClipboard(prompt4full)}
                  aria-label="Copiar prompt 4 extendido"
                >
                  ⧉
                </button>
              </div>
              <pre style={{ background: "#14211b", color: "#eff8f1", fontFamily: "SFMono-Regular, Consolas, monospace", fontSize: 13, lineHeight: 1.55, margin: 0, overflowX: "auto", padding: 16, whiteSpace: "pre-wrap" }}>
                {prompt4full}
              </pre>
            </div>
          </details>
        </section>

        {/* CHECKPOINT */}
        <section className="card" style={{ background: "rgba(191,111,40,.06)" }}>
          <div className="eyebrow">Checkpoint</div>
          <h2>Guardar la síntesis, no el output completo</h2>
          <p className="muted">
            No corresponde copiar toda la respuesta de la IA ni la tabla completa del Excel. Se guarda la síntesis del equipo. Los cinco campos siguen el mismo orden que la salida del Prompt 4, de modo que basta con trasladar cada bloque.
          </p>
          <p
            style={{
              fontSize: 13,
              color: "var(--brand-strong)",
              fontWeight: 750,
              background: "rgba(15,107,93,.08)",
              borderRadius: 8,
              padding: "8px 12px",
              display: "inline-block"
            }}
          >
            Estos cinco valores provienen directamente del reporte del paso anterior (Prompt 4).
          </p>

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

          <div className="grid" style={{ marginTop: 6 }}>
            <div className={`formField ${errors.has("classification_summary") ? "error" : ""}`}>
              <label className="formLabel">
                1. Resumen de clasificación <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <textarea
                className="miniTextarea"
                placeholder="Cuántos SKUs Core/Review/Eliminar y en qué familias se concentran."
                value={classificationSummary}
                onChange={(e) => {
                  setClassificationSummary(e.target.value);
                  setErrors((prev) => {
                    const next = new Set(prev);
                    next.delete("classification_summary");
                    return next;
                  });
                }}
                style={{ minHeight: 96 }}
              />
              {errors.has("classification_summary") ? <span className="errorText">Este campo es obligatorio.</span> : null}
            </div>
            <div className={`formField ${errors.has("selected_scenario") ? "error" : ""}`}>
              <label className="formLabel">
                2. Escenario y prioridad elegidos <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <textarea
                className="miniTextarea"
                placeholder="Qué escenario y prioridad, y por qué tienen sentido para este caso."
                value={selectedScenario}
                onChange={(e) => {
                  setSelectedScenario(e.target.value);
                  setErrors((prev) => {
                    const next = new Set(prev);
                    next.delete("selected_scenario");
                    return next;
                  });
                }}
                style={{ minHeight: 96 }}
              />
              {errors.has("selected_scenario") ? <span className="errorText">Este campo es obligatorio.</span> : null}
            </div>
            <div className={`formField ${errors.has("business_impact") ? "error" : ""}`}>
              <label className="formLabel">
                3. Impacto potencial en el negocio <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <textarea
                className="miniTextarea"
                placeholder="Capital liberable, cobertura final, revenue/margen en riesgo, leakage."
                value={businessImpact}
                onChange={(e) => {
                  setBusinessImpact(e.target.value);
                  setErrors((prev) => {
                    const next = new Set(prev);
                    next.delete("business_impact");
                    return next;
                  });
                }}
                style={{ minHeight: 96 }}
              />
              {errors.has("business_impact") ? <span className="errorText">Este campo es obligatorio.</span> : null}
            </div>
            <div className={`formField ${errors.has("decisions_to_review") ? "error" : ""}`}>
              <label className="formLabel">
                4. Decisiones a revisar antes de ejecutar <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <textarea
                className="miniTextarea"
                placeholder="Casos dudosos, SKUs críticos, familias sensibles, productos de alto revenue."
                value={decisionsToReview}
                onChange={(e) => {
                  setDecisionsToReview(e.target.value);
                  setErrors((prev) => {
                    const next = new Set(prev);
                    next.delete("decisions_to_review");
                    return next;
                  });
                }}
                style={{ minHeight: 96 }}
              />
              {errors.has("decisions_to_review") ? <span className="errorText">Este campo es obligatorio.</span> : null}
            </div>
            <div className={`formField ${errors.has("assumptions_to_validate") ? "error" : ""}`}>
              <label className="formLabel">
                5. Datos o supuestos a validar <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <textarea
                className="miniTextarea"
                placeholder="Recupero de inventario, calidad de cobertura, vigencia de precios, sustitutos, reglas de la IA."
                value={assumptionsToValidate}
                onChange={(e) => {
                  setAssumptionsToValidate(e.target.value);
                  setErrors((prev) => {
                    const next = new Set(prev);
                    next.delete("assumptions_to_validate");
                    return next;
                  });
                }}
                style={{ minHeight: 96 }}
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
