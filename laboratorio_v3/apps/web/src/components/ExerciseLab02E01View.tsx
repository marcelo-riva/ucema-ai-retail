"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, Save, Send } from "lucide-react";
import { AppShell } from "./AppShell";
import { getLabRepository } from "../lib/repositories/labRepository";
import { LAB02_EXERCISE_WORKBOOKS } from "../lib/constants";
import {
  checkpointQuestions,
  healthOptions,
  initialClients,
  portfolioCategories,
  promptArquetipos,
  promptCalidadCartera,
  promptClustering,
  promptRfm,
  promptSegmentacionFinal,
  scoreboardVariables,
  segmentCollapseTable
} from "../lib/lab02Ex01Content";
import type { Group } from "../types/lab";
import type { Session } from "../lib/repositories/labRepository.types";
import styles from "./ExerciseLab02E01View.module.css";

const workbookFileName = LAB02_EXERCISE_WORKBOOKS["lab02-ex01"] ?? "NEXUS_LAB02_EJ01_SEGMENTACION.xlsx";

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
      className={styles.copyButton}
      onClick={async () => {
        await copyToClipboard(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      type="button"
    >
      {copied ? <><Check size={14} /> Copiado ✓</> : <><Copy size={14} /> Copiar</>}
    </button>
  );
}

export function ExerciseLab02E01View({
  group,
  stateVersion: _stateVersion,
  checkpoint: _checkpoint,
  onSave: _onSave,
  onSubmit: _onSubmit
}: {
  group: Group;
  stateVersion: string;
  checkpoint: unknown;
  onSave?: (payload: { fields: Record<string, string>; confirmations: Record<string, boolean>; workbookName?: string; reportName?: string }) => Promise<void>;
  onSubmit?: (payload: { fields: Record<string, string>; confirmations: Record<string, boolean>; workbookName?: string; reportName?: string; requiredFields: string[]; requiredConfirmations: string[] }) => Promise<void>;
}) {
  const repo = getLabRepository();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [checkpointStatus, setCheckpointStatus] = useState<string>("borrador");
  const [submittedAt, setSubmittedAt] = useState<string | undefined>();
  const successRef = useRef<HTMLDivElement | null>(null);

  const [rankings, setRankings] = useState<Record<string, string>>({});
  const [categoryClassifications, setCategoryClassifications] = useState<Record<string, string>>({});
  const [categoryJustifications, setCategoryJustifications] = useState<Record<string, string>>({});
  const [primerCategory, setPrimerCategory] = useState("");
  const [ultimaCategory, setUltimaCategory] = useState("");
  const [resumenB, setResumenB] = useState("");
  const [resumenC, setResumenC] = useState("");
  const [resumenD, setResumenD] = useState("");
  const [resumenE, setResumenE] = useState("");
  const [scoreboardValues, setScoreboardValues] = useState<Record<string, string>>({});
  const [arquetipoResumen, setArquetipoResumen] = useState("");
  const [auditoriaCluster, setAuditoriaCluster] = useState("");
  const [checkpoint1, setCheckpoint1] = useState("");
  const [checkpoint2, setCheckpoint2] = useState("");
  const [checkpoint3, setCheckpoint3] = useState("");
  const [checkpoint4, setCheckpoint4] = useState("");

  const fieldValues = useMemo(() => ({
    ...rankings,
    ...categoryClassifications,
    ...categoryJustifications,
    primer_category: primerCategory,
    ultima_category: ultimaCategory,
    resumen_b: resumenB,
    resumen_c: resumenC,
    resumen_d: resumenD,
    resumen_e: resumenE,
    ...scoreboardValues,
    arquetipo_resumen: arquetipoResumen,
    auditoria_cluster: auditoriaCluster,
    checkpoint_1: checkpoint1,
    checkpoint_2: checkpoint2,
    checkpoint_3: checkpoint3,
    checkpoint_4: checkpoint4
  }), [
    rankings,
    categoryClassifications,
    categoryJustifications,
    primerCategory,
    ultimaCategory,
    resumenB,
    resumenC,
    resumenD,
    resumenE,
    scoreboardValues,
    arquetipoResumen,
    auditoriaCluster,
    checkpoint1,
    checkpoint2,
    checkpoint3,
    checkpoint4
  ]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const currentSession = await repo.getSession();
      if (cancelled) return;
      setSession(currentSession);

      if (currentSession?.groupId) {
        const submission = await repo.getSubmission({
          groupId: currentSession.groupId,
          exerciseId: "lab02-ex01",
          exerciseVersion: 1
        });
        if (cancelled) return;

        if (submission) {
          setCheckpointStatus(submission.status);
          setSubmittedAt(submission.submittedAt ?? undefined);

          const responses = submission.responsesJson as Record<string, string>;
          const loadedRankings: Record<string, string> = {};
          initialClients.forEach((client) => {
            const value = responses[`rank_${client.id}`];
            if (value) loadedRankings[`rank_${client.id}`] = value;
          });
          setRankings(loadedRankings);

          const loadedClassifications: Record<string, string> = {};
          const loadedJustifications: Record<string, string> = {};
          portfolioCategories.forEach((category) => {
            const key = category.toLowerCase().replace(/[^a-z0-9]/g, "_");
            const classification = responses[`classification_${key}`];
            const justification = responses[`justification_${key}`];
            if (classification) loadedClassifications[`classification_${key}`] = classification;
            if (justification) loadedJustifications[`justification_${key}`] = justification;
          });
          setCategoryClassifications(loadedClassifications);
          setCategoryJustifications(loadedJustifications);

          setPrimerCategory(responses.primer_category ?? "");
          setUltimaCategory(responses.ultima_category ?? "");
          setResumenB(responses.resumen_b ?? "");
          setResumenC(responses.resumen_c ?? "");
          setResumenD(responses.resumen_d ?? "");
          setResumenE(responses.resumen_e ?? "");

          const loadedScoreboard: Record<string, string> = {};
          scoreboardVariables.forEach((variable) => {
            const value = responses[variable.key];
            if (value) loadedScoreboard[variable.key] = value;
          });
          setScoreboardValues(loadedScoreboard);

          setArquetipoResumen(responses.arquetipo_resumen ?? "");
          setAuditoriaCluster(responses.auditoria_cluster ?? "");
          setCheckpoint1(responses.checkpoint_1 ?? "");
          setCheckpoint2(responses.checkpoint_2 ?? "");
          setCheckpoint3(responses.checkpoint_3 ?? "");
          setCheckpoint4(responses.checkpoint_4 ?? "");
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [repo]);

  useEffect(() => {
    const groupId = session?.groupId;
    if (!groupId) return;

    const timeout = setTimeout(() => {
      repo.saveSubmission({
        groupId,
        exerciseId: "lab02-ex01",
        exerciseVersion: 1,
        responsesJson: { ...fieldValues }
      }).catch((error) => {
        setMessages((current) => [
          ...current,
          { type: "error", text: `No se pudo guardar el borrador: ${String(error)}` }
        ]);
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [fieldValues, session, repo]);

  useEffect(() => {
    const hasSuccess = messages.some((m) => m.type === "success");
    if (hasSuccess && successRef.current) {
      successRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [messages]);

  function validate(): string[] {
    const missing: string[] = [];
    if (!checkpoint1.trim()) missing.push(checkpointQuestions[0].label);
    if (!checkpoint2.trim()) missing.push(checkpointQuestions[1].label);
    if (!checkpoint3.trim()) missing.push(checkpointQuestions[2].label);
    if (!checkpoint4.trim()) missing.push(checkpointQuestions[3].label);
    return missing;
  }

  async function handleSaveDraft() {
    if (!session?.groupId) {
      setMessages([{ type: "error", text: "Iniciá sesión como grupo para guardar el borrador." }]);
      return;
    }

    setLoading(true);
    setMessages([]);
    setErrors(new Set());

    try {
      await repo.saveSubmission({
        groupId: session.groupId,
        exerciseId: "lab02-ex01",
        exerciseVersion: 1,
        responsesJson: fieldValues,
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

    const missing = validate();
    if (missing.length > 0) {
      setErrors(new Set(["checkpoint_1", "checkpoint_2", "checkpoint_3", "checkpoint_4"]));
      setMessages([{ type: "error", text: `Faltan campos obligatorios: ${missing.join(", ")}.` }]);
      return;
    }

    setLoading(true);
    setErrors(new Set());
    setMessages([]);

    try {
      const now = new Date().toISOString();
      await repo.submitSubmission({
        groupId: session.groupId,
        exerciseId: "lab02-ex01",
        exerciseVersion: 1,
        responsesJson: fieldValues
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

  const statusLabel = checkpointStatus === "submitted" ? "Enviado" : "Borrador";

  const selectedRanks = Object.values(rankings).filter(Boolean);
  const duplicateRanks = selectedRanks.filter((value, index, arr) => arr.indexOf(value) !== index);
  const hasDuplicateRanks = duplicateRanks.length > 0;

  function setRanking(clientId: string, value: string) {
    setRankings((current) => ({ ...current, [`rank_${clientId}`]: value }));
  }

  function setClassification(category: string, value: string) {
    const key = category.toLowerCase().replace(/[^a-z0-9]/g, "_");
    setCategoryClassifications((current) => ({ ...current, [`classification_${key}`]: value }));
  }

  function setJustification(category: string, value: string) {
    const key = category.toLowerCase().replace(/[^a-z0-9]/g, "_");
    setCategoryJustifications((current) => ({ ...current, [`justification_${key}`]: value }));
  }

  function setScoreboardValue(key: string, value: string) {
    setScoreboardValues((current) => ({ ...current, [key]: value }));
  }

  return (
    <AppShell>
      <div className={styles.hero}>
        <div className={styles.heroEyebrow}>Customer Profitability Copilot</div>
        <h1>Ejercicio 1: Customer Segmentation</h1>
        <p className={styles.heroLead}>
          Nexus trata igual a un cliente que compró una vez que a uno que compra todos los meses. Van a construir el CLV, el Churn Score y la segmentación que hoy no existen — y a decidir, con datos reales, a quién priorizar primero.
        </p>

        <div className={styles.metaRow}>
          <div className={styles.metaCard}>
            <div className={styles.metaCardKey}>Grupo</div>
            <div className={styles.metaCardValue}>{group.name}</div>
          </div>
          <div className={styles.metaCard}>
            <div className={styles.metaCardKey}>Estado</div>
            <div className={styles.metaCardValue}>
              <span className={styles.statusPill}>{statusLabel}</span>
            </div>
          </div>
          <div className={styles.metaCard}>
            <div className={styles.metaCardKey}>Workbook</div>
            <div className={styles.metaCardValue}>NEXUS_LAB02_EJ01</div>
          </div>
          <div className={styles.metaCard}>
            <div className={styles.metaCardKey}>Tiempo estimado</div>
            <div className={styles.metaCardValue}>~50 min</div>
          </div>
        </div>

        <div className={styles.workbookBox}>
          <div>
            <div className={styles.workbookTitle}>📎 Workbook del ejercicio</div>
            <div className={styles.workbookDesc}>
              10.000 clientes reales de Nexus, línea por línea. No calcula nada: descarguen las celdas amarillas con lo que su IA les devuelva.
            </div>
          </div>
          <a className={styles.btn} href={`/templates/${workbookFileName}`} download>
            ⬇ Descargar workbook
          </a>
        </div>
      </div>

      <div className={styles.noticeBox}>
        <div className={styles.noticeIcon}>📎</div>
        <div>
          <div className={styles.noticeTitle}>Antes de arrancar: este workbook es nuevo</div>
          <p>
            10.000 clientes línea por línea, igual que una bajada real de CRM. El Excel no calcula nada: toda fórmula vive en los prompts que le den a su IA. Los cortes de la matriz RFM tampoco vienen dados — eso es trabajo de la Parte B, no un dato de referencia.
          </p>
        </div>
      </div>

      {/* PISO CONCEPTUAL */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.stepMark}>i</div>
          <div>
            <div className={styles.sectionTitle}>Piso conceptual</div>
            <div className={styles.sectionSub}>Antes de tocar la base</div>
          </div>
          <div className={styles.timer}>⏱ ~5 min</div>
        </div>
        <div className={styles.tensionGrid}>
          <div className={styles.tensionCard}>
            <h3>Valor del cliente = R + F + M</h3>
            <p>Recencia, Frecuencia y Monetary son las tres preguntas del mapa. Ninguna sola alcanza para decidir dónde invertir.</p>
          </div>
          <div className={styles.tensionCard}>
            <h3>Ticket ≠ Margen</h3>
            <p>El ticket promedio dice cuánto factura un cliente. El margen acumulado dice cuánto le queda a Nexus. No es el mismo número — a veces ni se parecen.</p>
          </div>
          <div className={`${styles.tensionCard} ${styles.tensionCardDesafio}`}>
            <h3>🎯 El desafío — pide la Dirección Comercial</h3>
            <p>Diagnóstico completo de la base y una segmentación final por tipo de cliente, antes de decidir dónde invertir el próximo presupuesto de fidelización. Tratar a todos los clientes igual reparte presupuesto donde no rinde.</p>
            <span className={styles.tensionCardFact}>Adquirir cliente nuevo: 4x el costo de retener uno existente</span>
          </div>
        </div>
      </section>

      {/* PARTE A */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.stepMark}>A</div>
          <div>
            <div className={styles.sectionTitle}>Postura inicial sobre 4 clientes reales</div>
            <div className={styles.sectionSub}>Decisión cualitativa, sin ver el diagnóstico todavía</div>
          </div>
          <div className={styles.timer}>⏱ ~6 min</div>
        </div>
        <div className={styles.bodyTxt}>
          <p>
            Estos 4 clientes salieron de la base real de <strong>03_CLIENTES</strong> — elegidos a propósito porque su ticket, recencia o frecuencia pueden inducir a un juicio equivocado. Sin ver margen ni CLV todavía,{" "}
            <strong>ordénenlos de 1 (más prioritario) a 4 (menos prioritario)</strong> y anoten el orden en <strong>04_POSTURA_INICIAL</strong> del Excel.
          </p>
          <p>
            <em>Ejemplo de razonamiento:</em> &quot;El cliente de ticket $124.044 parece el más valioso a simple vista, pero compra hace 175 días y el 62% de sus compras fueron con promoción — puede que ya se esté yendo, y con poco margen real.&quot;
          </p>
        </div>
        <div className={styles.stockGrid}>
          {initialClients.map((client) => {
            const rank = rankings[`rank_${client.id}`] ?? "";
            const isDuplicate = rank !== "" && duplicateRanks.includes(rank);
            return (
              <div className={styles.stockCard} key={client.id}>
                <div className={styles.cardId}>CLIENTE {client.id}</div>
                <h4>{client.label}</h4>
                <div className={styles.stockRow}>
                  <span>Ticket promedio</span>
                  <b>{client.ticket}</b>
                </div>
                <div className={styles.stockRow}>
                  <span>Recencia</span>
                  <b>{client.recency}</b>
                </div>
                <div className={styles.stockRow}>
                  <span>Frecuencia mensual</span>
                  <b>{client.frequency}</b>
                </div>
                <div className={styles.stockRow}>
                  <span>% compras con promoción</span>
                  <b>{client.promoPct}</b>
                </div>
                <div className={styles.rankRow}>
                  <label>Prioridad</label>
                  <select
                    className={`${styles.rankSelect} ${isDuplicate ? styles.rankSelectDuplicate : ""}`}
                    onChange={(event) => setRanking(client.id, event.target.value)}
                    value={rank}
                  >
                    <option value="">—</option>
                    <option value="1">1 (más prioritario)</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4 (menos prioritario)</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
        <div className={`${styles.rankWarning} ${hasDuplicateRanks ? styles.rankWarningVisible : ""}`}>
          Hay dos clientes con la misma prioridad — revisen el orden antes de pasar a la Parte B.
        </div>
      </section>

      {/* PARTE B */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.stepMark}>B</div>
          <div>
            <div className={styles.sectionTitle}>Calidad de cartera por categoría</div>
            <div className={styles.sectionSub}>Un criterio de negocio, no una fórmula</div>
          </div>
          <div className={styles.timer}>⏱ ~8 min</div>
        </div>
        <div className={styles.bodyTxt}>
          <p>
            La IA arma la tabla fría de las 8 categorías de Nexus: cantidad de clientes, margen bruto promedio, dependencia promocional promedio y margen acumulado total. <strong>Ustedes clasifican</strong> cada categoría en <strong>Sana / Vigilar / Frágil</strong> — acá no hay fórmula que resuelva la clasificación, es criterio.
          </p>
          <p>
            Guía: <strong>Sana</strong> — margen sólido, no depende de la promoción. <strong>Vigilar</strong> — el margen está bien hoy, pero la dependencia promocional es alta o viene creciendo. <strong>Frágil</strong> — margen bajo y/o el volumen se sostiene casi todo con descuento: el negocio real es más débil de lo que aparenta.
          </p>
          <p>
            El gancho: dos categorías pueden tener un margen parecido y significar cosas opuestas — una lo logra con precio de lista, la otra lo logra regalando descuento y todavía así le alcanza. Esa distinción es la que tienen que ver, no calcular.
          </p>
        </div>

        <div className={styles.promptLabel}>
          <span className={styles.promptName}>Prompt · Calidad de cartera</span>
          <CopyButton text={promptCalidadCartera} />
        </div>
        <div className={styles.promptBox}>{promptCalidadCartera}</div>

        <div className={styles.categoryGrid}>
          {portfolioCategories.map((category) => {
            const key = category.toLowerCase().replace(/[^a-z0-9]/g, "_");
            const classification = categoryClassifications[`classification_${key}`] ?? "";
            const justification = categoryJustifications[`justification_${key}`] ?? "";
            return (
              <div className={styles.categoryCard} key={category}>
                <div className={styles.categoryHeader}>
                  <h4>{category}</h4>
                  <select
                    className={styles.categorySelect}
                    onChange={(event) => setClassification(category, event.target.value)}
                    value={classification}
                  >
                    <option value="">— Clasificación —</option>
                    {healthOptions.map((option) => (
                      <option key={option.key} value={option.key}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formField}>
                  <label>Justificación</label>
                  <textarea
                    onChange={(event) => setJustification(category, event.target.value)}
                    placeholder="¿Por qué Sana, Vigilar o Frágil?"
                    value={justification}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formField}>
            <label>Primera categoría que sacarían de las promociones</label>
            <input
              onChange={(event) => setPrimerCategory(event.target.value)}
              placeholder="Escriban su respuesta..."
              type="text"
              value={primerCategory}
            />
          </div>
          <div className={styles.formField}>
            <label>Última categoría que tocarían</label>
            <input
              onChange={(event) => setUltimaCategory(event.target.value)}
              placeholder="Escriban su respuesta..."
              type="text"
              value={ultimaCategory}
            />
          </div>
          <div className={styles.formField}>
            <label>Resumen para la plataforma (2-3 líneas)</label>
            <textarea
              onChange={(event) => setResumenB(event.target.value)}
              placeholder="Si el mes que viene tuvieran que sacar una categoría de las promociones, ¿cuál elegirían primero -- y cuál es la última que tocarían? (documenten la clasificación completa en 05_CALIDAD_CARTERA)"
              value={resumenB}
            />
          </div>
        </div>
      </section>

      {/* PARTE C */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.stepMark}>C</div>
          <div>
            <div className={styles.sectionTitle}>Cortes y diagnóstico RFM</div>
            <div className={styles.sectionSub}>Sin cortes dados — Churn Ratio calculado cliente por cliente</div>
          </div>
          <div className={styles.timer}>⏱ ~12 min</div>
        </div>
        <div className={styles.bodyTxt}>
          <p>
            Acá no hay tabla de referencia para los cortes de Alta/Media/Baja: la IA tiene que analizar la distribución real de Recencia, Frecuencia y Ticket en <strong>03_CLIENTES</strong> y proponer sus propios cortes, documentando la lógica — eso es lo que completan en &quot;Criterio usado&quot; de <strong>06_DIAGNOSTICO_RFM</strong>, no solo el número.
          </p>
          <p>
            <strong>El riesgo de fuga no sale de una tabla:</strong> cada cliente marca, con su propio historial, cada cuánto suele comprar (30 / frecuencia mensual = Recencia Esperada). Si la Recencia real la duplica o triplica, algo cambió. El Churn Ratio (Recencia real / Recencia Esperada) se calcula cliente por cliente, y lo que se pega en el Excel es el promedio por celda -- no una categoría fija asignada de antemano.
          </p>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>
            Para ir más lejos: con más datos, la IA podría estimar el Churn Ratio con un intervalo de confianza en vez de un promedio simple. No hace falta para este ejercicio.
          </p>
        </div>

        <div className={styles.promptLabel}>
          <span className={styles.promptName}>Prompt · Cortes y diagnóstico RFM</span>
          <CopyButton text={promptRfm} />
        </div>
        <div className={styles.promptBox}>{promptRfm}</div>

        <div className={styles.formField} style={{ marginTop: 16 }}>
          <label>Resumen para la plataforma (2-3 líneas)</label>
          <textarea
            onChange={(event) => setResumenC(event.target.value)}
            placeholder="Con el diagnóstico ya completo: ¿en qué cliente de la Parte A su orden de prioridad no coincidió con el dato real?"
            value={resumenC}
          />
        </div>
      </section>

      {/* PARTE D */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.stepMark}>D</div>
          <div>
            <div className={styles.sectionTitle}>Segmentación final y Executive Scoreboard</div>
            <div className={styles.sectionSub}>De 9 celdas a 4 segmentos accionables</div>
          </div>
          <div className={styles.timer}>⏱ ~6 min</div>
        </div>
        <div className={styles.bodyTxt}>
          <p>
            <strong>Para qué sirve esta nueva clasificación:</strong> 9 celdas describen bien el comportamiento, pero son demasiadas para construir una jugada distinta para cada una -- ninguna empresa arma 9 estrategias de fidelización en paralelo. Colapsar a 4 segmentos es lo que convierte el diagnóstico analítico en algo que se puede presupuestar y ejecutar: cada segmento final tiene que poder responderse con una sola pregunta -- ¿protejo, recupero, desarrollo o dejo estar?
          </p>
          <p>
            Colapsen las 9 celdas de la Parte C a 4 segmentos finales con esta regla, y consoliden las variables del Executive Scoreboard. <strong>La estrategia específica para cada segmento no se completa acá</strong> -- se discute en el checkpoint, con lo que encontraron.
          </p>
        </div>

        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Segmento final</th>
              <th>Celdas RFM que agrupa</th>
              <th>Lógica</th>
            </tr>
          </thead>
          <tbody>
            {segmentCollapseTable.map((row) => (
              <tr key={row.segment}>
                <td className={styles.name}>{row.segment}</td>
                <td>{row.cells}</td>
                <td>{row.logic}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.promptLabel}>
          <span className={styles.promptName}>Prompt · Segmentación final y Scoreboard</span>
          <CopyButton text={promptSegmentacionFinal} />
        </div>
        <div className={styles.promptBox}>{promptSegmentacionFinal}</div>

        <div className={styles.scoreboardGrid}>
          {scoreboardVariables.map((variable) => (
            <div className={styles.scoreboardField} key={variable.key}>
              <label>{variable.label}</label>
              <input
                onChange={(event) => setScoreboardValue(variable.key, event.target.value)}
                placeholder="0"
                type="text"
                value={scoreboardValues[variable.key] ?? ""}
              />
            </div>
          ))}
        </div>

        <div className={styles.formField} style={{ marginTop: 16 }}>
          <label>Resumen para la plataforma (2-3 líneas)</label>
          <textarea
            onChange={(event) => setResumenD(event.target.value)}
            placeholder="Con la segmentación ya completa: ¿qué % del CLV total está concentrado en VIP, y los sorprendió ese número?"
            value={resumenD}
          />
        </div>
      </section>

      {/* PARTE E */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.stepMark}>E</div>
          <div>
            <div className={styles.sectionTitle}>Arquetipos: clustering + traducción de negocio</div>
            <div className={styles.sectionSub}>Una lente distinta de RFM — quién es el cliente, no cuánto vale</div>
          </div>
          <div className={styles.timer}>⏱ ~12 min</div>
        </div>
        <div className={styles.bodyTxt}>
          <p>
            RFM mide valor. Arquetipos describe <strong>quién es</strong> el cliente — un mismo arquetipo puede tener clientes VIP y clientes Oportunistas adentro, y está bien que así sea. No hace falta cruzarlos.
          </p>
        </div>

        <div className={styles.ladder}>
          <div className={styles.ladderStep}>
            <div className={styles.ladderStepNumber}>PASO 1 — FRÍO</div>
            <div className={styles.ladderStepTitle}>El clustering fija los grupos</div>
            <div className={styles.ladderStepDesc}>
              Género, Zona, Canal Online y el mix de las 8 categorías. Entre 4 y 6 clusters — la cantidad que separe grupos genuinamente distintos, no un número fijo. Sin nombres todavía: solo números.
            </div>
          </div>
          <div className={styles.ladderArrow}>→</div>
          <div className={styles.ladderStep}>
            <div className={styles.ladderStepNumber}>PASO 2 — NEGOCIO</div>
            <div className={styles.ladderStepTitle}>El criterio traduce el cluster a arquetipo</div>
            <div className={styles.ladderStepDesc}>
              Con la tabla fría, nombre, descripción, regla de comunicación y un momento WOW por cluster — apoyados en los números del Paso 1, no en una intuición genérica.
            </div>
          </div>
        </div>

        <p className={styles.bodyTxt} style={{ marginTop: 6 }}>
          <strong>Por qué esto es repetible en su propia empresa:</strong> el método (clustering + traducción de negocio) no depende de que sea una farmacia. Cualquiera con datos demográficos básicos y algo de mix de categoría o comportamiento de compra puede correr el mismo Paso 1 + Paso 2 con sus propios campos.
        </p>

        <div className={styles.promptLabel}>
          <span className={styles.promptName}>Prompt · Paso 1 — Clustering</span>
          <CopyButton text={promptClustering} />
        </div>
        <div className={styles.promptBox}>{promptClustering}</div>

        <div className={styles.promptLabel}>
          <span className={styles.promptName}>Prompt · Paso 2 — Traducción a arquetipo</span>
          <CopyButton text={promptArquetipos} />
        </div>
        <div className={styles.promptBox}>{promptArquetipos}</div>

        <div className={styles.formGrid}>
          <div className={styles.formField}>
            <label>Resumen del Paso 1 + Paso 2</label>
            <textarea
              onChange={(event) => setArquetipoResumen(event.target.value)}
              placeholder="Resumen de los arquetipos que propuso la IA..."
              value={arquetipoResumen}
            />
          </div>
          <div className={styles.formField}>
            <label>Auditoría: elija un cluster y verifíquenlo</label>
            <textarea
              onChange={(event) => setAuditoriaCluster(event.target.value)}
              placeholder="¿El arquetipo y el momento WOW que propuso la IA calzan con los números fríos del Paso 1, o suenan genéricos? ¿Qué cambiarían?"
              value={auditoriaCluster}
            />
          </div>
          <div className={styles.formField}>
            <label>Resumen para la plataforma (2-3 líneas)</label>
            <textarea
              onChange={(event) => setResumenE(event.target.value)}
              placeholder="Elijan un cluster y audítenlo: ¿el arquetipo y el momento WOW que propuso la IA calzan con los números fríos del Paso 1, o suenan genéricos? ¿Qué cambiarían?"
              value={resumenE}
            />
          </div>
        </div>
      </section>

      {/* CHECKPOINT */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.stepMark}>✓</div>
          <div>
            <div className={styles.sectionTitle}>Checkpoint</div>
            <div className={styles.sectionSub}>Guardá la síntesis, no el output completo de la IA</div>
          </div>
        </div>

        <div className={styles.formGrid}>
          {checkpointQuestions.map((field) => {
            const value =
              field.id === "checkpoint_1" ? checkpoint1
                : field.id === "checkpoint_2" ? checkpoint2
                  : field.id === "checkpoint_3" ? checkpoint3
                    : checkpoint4;
            const setter =
              field.id === "checkpoint_1" ? setCheckpoint1
                : field.id === "checkpoint_2" ? setCheckpoint2
                  : field.id === "checkpoint_3" ? setCheckpoint3
                    : setCheckpoint4;
            return (
              <div className={`${styles.formField} ${errors.has(field.id) ? styles.formFieldError : ""}`} key={field.id}>
                <label>{field.label}</label>
                <textarea
                  onChange={(event) => {
                    setter(event.target.value);
                    setErrors((current) => {
                      const next = new Set(current);
                      next.delete(field.id);
                      return next;
                    });
                  }}
                  placeholder="Escriban su respuesta..."
                  value={value}
                />
                {errors.has(field.id) ? <span className={styles.errorText}>Este campo es obligatorio.</span> : null}
              </div>
            );
          })}
        </div>

        {messages.length > 0 ? (
          <div className={styles.messageList} ref={successRef}>
            {messages.map((message, index) => (
              <div
                className={`${styles.message} ${
                  message.type === "error" ? styles.messageError : message.type === "success" ? styles.messageSuccess : ""
                }`}
                key={`${message.type}-${index}`}
              >
                {message.text}
              </div>
            ))}
          </div>
        ) : null}

        <div className={styles.formActions}>
          <button className={`${styles.btn} ${styles.btnSecondary}`} disabled={loading} onClick={handleSaveDraft} type="button">
            <Save size={17} /> Guardar borrador
          </button>
          <button className={styles.btn} disabled={loading} onClick={handleSubmit} type="button">
            <Send size={17} /> Enviar checkpoint
          </button>
        </div>
        <div className={styles.formNote}>Modo local: el borrador y el checkpoint se guardan en este dispositivo.</div>
      </section>

      <div className={styles.footerNote}>NEXUS Retail Labs · Laboratorio 2 · Ejercicio 1</div>
    </AppShell>
  );
}
