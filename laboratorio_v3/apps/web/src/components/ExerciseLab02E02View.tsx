"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, Save, Send } from "lucide-react";
import { AppShell } from "./AppShell";
import { getLabRepository } from "../lib/repositories/labRepository";
import { LAB02_EXERCISE_WORKBOOKS } from "../lib/constants";
import {
  archetypesTable,
  checkpointQuestions,
  nextBestActionLogic,
  promptNextBestAction,
  promptObjetivo,
  promptProyeccion,
  promptTurno1,
  promptTurno2,
  promptTurno3,
  scoreboardSegments
} from "../lib/lab02Ex02Content";
import type { Group } from "../types/lab";
import type { Session } from "../lib/repositories/labRepository.types";
import styles from "./ExerciseLab02E01View.module.css";
import extraStyles from "./ExerciseLab02E02View.module.css";

const workbookFileName = LAB02_EXERCISE_WORKBOOKS["lab02-ex02"] ?? "NEXUS_LAB02_EJ02_BASE.xlsx";

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

export function ExerciseLab02E02View({
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

  const [resumenA, setResumenA] = useState("");
  const [objetivoSecundario, setObjetivoSecundario] = useState("");
  const [tablaParteB, setTablaParteB] = useState("");
  const [versionElegida, setVersionElegida] = useState("");
  const [auditoriaParteC, setAuditoriaParteC] = useState("");
  const [resultadoParteD, setResultadoParteD] = useState("");
  const [checkpoint1, setCheckpoint1] = useState("");
  const [checkpoint2, setCheckpoint2] = useState("");
  const [checkpoint3, setCheckpoint3] = useState("");
  const [checkpoint4, setCheckpoint4] = useState("");

  const fieldValues = useMemo(() => ({
    resumen_a: resumenA,
    objetivo_secundario: objetivoSecundario,
    tabla_parte_b: tablaParteB,
    version_elegida: versionElegida,
    auditoria_parte_c: auditoriaParteC,
    resultado_parte_d: resultadoParteD,
    checkpoint_1: checkpoint1,
    checkpoint_2: checkpoint2,
    checkpoint_3: checkpoint3,
    checkpoint_4: checkpoint4
  }), [
    resumenA,
    objetivoSecundario,
    tablaParteB,
    versionElegida,
    auditoriaParteC,
    resultadoParteD,
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
          exerciseId: "lab02-ex02",
          exerciseVersion: 1
        });
        if (cancelled) return;

        if (submission) {
          setCheckpointStatus(submission.status);
          setSubmittedAt(submission.submittedAt ?? undefined);

          const responses = submission.responsesJson as Record<string, string>;
          setResumenA(responses.resumen_a ?? "");
          setObjetivoSecundario(responses.objetivo_secundario ?? "");
          setTablaParteB(responses.tabla_parte_b ?? "");
          setVersionElegida(responses.version_elegida ?? "");
          setAuditoriaParteC(responses.auditoria_parte_c ?? "");
          setResultadoParteD(responses.resultado_parte_d ?? "");
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
        exerciseId: "lab02-ex02",
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
        exerciseId: "lab02-ex02",
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
        exerciseId: "lab02-ex02",
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

  return (
    <AppShell>
      <div className={styles.hero}>
        <div className={styles.heroEyebrow}>Customer Profitability Copilot</div>
        <h1>Ejercicio 2: De la Segmentación a la Acción Comercial</h1>
        <p className={styles.heroLead}>
          Nexus ya sabe cuánto vale cada cliente. La pregunta ahora es otra: con presupuesto limitado, ¿dónde y cómo actuar? Van a elegir un objetivo, decidir la Next Best Action de cada segmento, y bajar todo eso a mensajes individuales generados automáticamente para 100 clientes reales.
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
            <div className={styles.metaCardValue}>NEXUS_LAB02_EJ02</div>
          </div>
          <div className={styles.metaCard}>
            <div className={styles.metaCardKey}>Tiempo estimado</div>
            <div className={styles.metaCardValue}>~55 min</div>
          </div>
        </div>

        <div className={styles.workbookBox}>
          <div>
            <div className={styles.workbookTitle}>📎 Workbook del ejercicio</div>
            <div className={styles.workbookDesc}>
              1.000 clientes reales de Nexus, con segmento, CLV y arquetipo ya resueltos. Súbanlo a la conversación con su IA antes del primer prompt — no calcula nada, y la hoja 05_MENSAJES_PERSONALIZADOS está lista para que la IA la complete directamente.
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
          <div className={styles.noticeTitle}>Antes de arrancar: carguen el workbook en la conversación con su IA</div>
          <p>
            Este ejercicio parte de una base ya segmentada y valorizada — no van a volver a calcular RFM ni CLV. <strong>Descarguen NEXUS_LAB02_EJ02_BASE.xlsx y súbanlo como archivo al inicio de la conversación con su IA</strong> (Copilot, ChatGPT, Claude, etc.), antes del primer prompt. Todos los prompts de este ejercicio asumen que el workbook ya está cargado — van a referenciar hojas por nombre (01_SCOREBOARD_SEGMENTOS, 02_ARQUETIPOS, 04_MUESTRA_100) en vez de pedirles que peguen tablas a mano.
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
            <h3>La IA analiza y recomienda. La decisión es humana</h3>
            <p>En cada paso de este ejercicio — qué objetivo, qué cliente, qué producto, en qué momento, por qué canal, con qué incentivo — la IA hace el análisis, pero nadie delega la decisión final.</p>
          </div>
          <div className={styles.tensionCard}>
            <h3>El mejor cupón no es el de mayor descuento</h3>
            <p>Es el que genera el mayor retorno incremental con el incentivo mínimo efectivo. Regalar margen no es lo mismo que invertirlo bien.</p>
          </div>
          <div className={`${styles.tensionCard} ${styles.tensionCardDesafio}`}>
            <h3>🎯 El desafío — pide la Dirección Comercial</h3>
            <p>Presupuesto limitado. Un objetivo priorizado, una Next Best Action por segmento, y contenido personalizado generado automáticamente para una muestra real de clientes — no una regla igual para todos.</p>
            <span className={styles.tensionCardFact}>100 clientes, 100 mensajes distintos — no 1 plantilla</span>
          </div>
        </div>
      </section>

      {/* CONTEXTO / SCOREBOARD */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.stepMark}>📊</div>
          <div>
            <div className={styles.sectionTitle}>Contexto — Scoreboard de segmentos</div>
            <div className={styles.sectionSub}>Dato dado, ya resuelto en el workbook</div>
          </div>
        </div>
        <div className={styles.bodyTxt}>
          <p>Con presupuesto comercial limitado, perseguir todo a la vez diluye el impacto. Pídanle a la IA que compare el impacto potencial de distintos objetivos contra esta base específica, y elijan <strong>uno</strong> con esa comparación como sustento.</p>
        </div>
        <div className={styles.scoreboardGrid}>
          {scoreboardSegments.map((item) => (
            <div className={styles.scoreboardField} key={item.segment}>
              <label>{item.segment}</label>
              <div className={extraStyles.val}>{item.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PARTE A */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.stepMark}>A</div>
          <div>
            <div className={styles.sectionTitle}>Elegir el objetivo comercial</div>
            <div className={styles.sectionSub}>Con presupuesto limitado, hay que priorizar</div>
          </div>
          <div className={styles.timer}>⏱ ~8 min</div>
        </div>
        <div className={styles.bodyTxt}>
          <p>Con presupuesto comercial limitado, perseguir todo a la vez diluye el impacto. Pídanle a la IA que compare el impacto potencial de distintos objetivos contra esta base específica, y elijan <strong>uno</strong> con esa comparación como sustento.</p>
        </div>

        <div className={styles.promptLabel}>
          <span className={styles.promptName}>Prompt · Elegir el objetivo</span>
          <CopyButton text={promptObjetivo} />
        </div>
        <div className={styles.promptBox}>{promptObjetivo}</div>

        <div className={styles.formGrid}>
          <div className={styles.formField}>
            <label>Objetivo priorizado y justificación</label>
            <textarea
              onChange={(event) => setResumenA(event.target.value)}
              placeholder="¿Qué objetivo eligieron y por qué, con los números del análisis como sustento?"
              value={resumenA}
            />
          </div>
          <div className={styles.formField}>
            <label>Opcional — objetivo secundario</label>
            <textarea
              onChange={(event) => setObjetivoSecundario(event.target.value)}
              placeholder="¿Qué objetivo secundario emergería como consecuencia de tu elección principal, aunque no lo hayas buscado directamente?"
              value={objetivoSecundario}
            />
          </div>
        </div>
      </section>

      {/* PARTE B */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.stepMark}>B</div>
          <div>
            <div className={styles.sectionTitle}>Next Best Action por segmento</div>
            <div className={styles.sectionSub}>&quot;No hacer nada&quot; también es una decisión</div>
          </div>
          <div className={styles.timer}>⏱ ~10 min</div>
        </div>
        <div className={styles.bodyTxt}>
          <p>Cada segmento necesita una jugada distinta, no la misma promo repartida. Esta es la lógica que la IA tiene que aplicar:</p>
        </div>
        <div className={styles.categoryGrid}>
          {nextBestActionLogic.map((item) => (
            <div className={styles.categoryCard} key={item.action}>
              <h4>{item.action}</h4>
              <p>{item.description}</p>
            </div>
          ))}
        </div>

        <div className={styles.promptLabel}>
          <span className={styles.promptName}>Prompt · Next Best Action</span>
          <CopyButton text={promptNextBestAction} />
        </div>
        <div className={styles.promptBox}>{promptNextBestAction}</div>

        <div className={styles.formGrid}>
          <div className={styles.formField}>
            <label>Tabla completada — segmento | acción de la IA | ¿coincide con la lógica? | acepto o ajusto y por qué</label>
            <textarea
              onChange={(event) => setTablaParteB(event.target.value)}
              placeholder="Peguen o resuman la tabla de las 4 decisiones..."
              value={tablaParteB}
            />
          </div>
        </div>
      </section>

      {/* PARTE C */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.stepMark}>C</div>
          <div>
            <div className={styles.sectionTitle}>Generación automática de contenido personalizado</div>
            <div className={styles.sectionSub}>De segmento a cliente — un mensaje distinto por persona, no una plantilla</div>
          </div>
          <div className={styles.timer}>⏱ ~20 min</div>
        </div>
        <div className={styles.bodyTxt}>
          <p>La automatización con GenAI tiene dos capas separadas. La IA predictiva decide el incentivo. La IA generativa lo comunica, adaptado a cada cliente — eso es lo que permite generar contenido personalizado a escala, imposible de sostener a mano para cientos de personas.</p>
        </div>

        <div className={styles.promptLabel}>
          <span className={styles.promptName}>Los 6 arquetipos de Nexus (dato dado — hoja 02_ARQUETIPOS del workbook)</span>
        </div>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Cluster</th>
              <th>Descripción</th>
              <th>Canal preferido</th>
              <th>Tono</th>
            </tr>
          </thead>
          <tbody>
            {archetypesTable.map((row) => (
              <tr key={row.cluster}>
                <td className={styles.name}>{row.cluster}</td>
                <td>{row.description}</td>
                <td>{row.canal}</td>
                <td>{row.tono}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.ladder}>
          <div className={styles.ladderStep}>
            <div className={styles.ladderStepNumber}>TURNO 1</div>
            <div className={styles.ladderStepTitle}>La IA propone, ustedes eligen</div>
            <div className={styles.ladderStepDesc}>3 versiones de mensaje para un cliente de ejemplo. No redactan — eligen o combinan.</div>
          </div>
          <div className={styles.ladderArrow}>→</div>
          <div className={styles.ladderStep}>
            <div className={styles.ladderStepNumber}>TURNO 2</div>
            <div className={styles.ladderStepTitle}>Fijar el brief de tono</div>
            <div className={styles.ladderStepDesc}>Del mensaje elegido, la IA destila un brief reusable de 4-5 bullets.</div>
          </div>
          <div className={styles.ladderArrow}>→</div>
          <div className={styles.ladderStep}>
            <div className={styles.ladderStepNumber}>TURNO 3</div>
            <div className={styles.ladderStepTitle}>Implementación individual</div>
            <div className={styles.ladderStepDesc}>El brief se aplica a los 100 clientes reales — un incentivo y un copy por persona.</div>
          </div>
        </div>

        <div className={`${extraStyles.exampleBox} ${styles.bodyTxt}`}>
          <strong>Cliente de ejemplo (arquetipo Cuidado Consciente)</strong> — Femenino, ~42 años. Dermocosmética, recencia 45 días, frecuencia 1,8/mes, ticket $38.500, margen 42%, 30% de compras con promoción.
        </div>

        <div className={styles.promptLabel}>
          <span className={styles.promptName}>Turno 1 · La IA propone, ustedes eligen</span>
          <CopyButton text={promptTurno1} />
        </div>
        <div className={styles.promptBox}>{promptTurno1}</div>
        <div className={styles.formField} style={{ marginTop: 16 }}>
          <label>Versión elegida o combinada (no redactada de cero)</label>
          <textarea
            onChange={(event) => setVersionElegida(event.target.value)}
            placeholder='Ej: &quot;la versión 2 pero con la oferta concreta de la versión 1&quot;, &quot;la 3 sin el signo de exclamación&quot;...'
            value={versionElegida}
          />
        </div>

        <div className={styles.promptLabel}>
          <span className={styles.promptName}>Turno 2 · Fijar el brief de tono</span>
          <CopyButton text={promptTurno2} />
        </div>
        <div className={styles.promptBox}>{promptTurno2}</div>

        <div className={styles.promptLabel}>
          <span className={styles.promptName}>Turno 3 · Implementación individual sobre los 100 clientes reales</span>
          <CopyButton text={promptTurno3} />
        </div>
        <div className={styles.promptBox}>{promptTurno3}</div>

        <div className={styles.formGrid}>
          <div className={styles.formField}>
            <label>Auditoría — elijan 4-5 clientes de clusters distintos en 05_MENSAJES_PERSONALIZADOS</label>
            <textarea
              onChange={(event) => setAuditoriaParteC(event.target.value)}
              placeholder="¿El tono realmente cambia según el cluster, o es la misma plantilla con el nombre del cluster pegado encima? ¿La justificación de cada fila explica algo real del cliente, o es genérica?"
              value={auditoriaParteC}
            />
          </div>
        </div>
      </section>

      {/* PARTE D */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.stepMark}>D</div>
          <div>
            <div className={styles.sectionTitle}>Proyección de retorno</div>
            <div className={styles.sectionSub}>Ponerle precio a la jugada</div>
          </div>
          <div className={styles.timer}>⏱ ~8 min</div>
        </div>
        <div className={styles.promptLabel}>
          <span className={styles.promptName}>Prompt · Proyección de retorno</span>
          <CopyButton text={promptProyeccion} />
        </div>
        <div className={styles.promptBox}>{promptProyeccion}</div>

        <div className={styles.formGrid}>
          <div className={styles.formField}>
            <label>Resultado de la proyección</label>
            <textarea
              onChange={(event) => setResultadoParteD(event.target.value)}
              placeholder="Conversión esperada, CLV incremental, costo y ROI..."
              value={resultadoParteD}
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

      <div className={styles.footerNote}>NEXUS Retail Labs · Laboratorio 2 · Ejercicio 2</div>
    </AppShell>
  );
}
