"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Save, Send } from "lucide-react";
import { AppShell } from "./AppShell";
import { getLabRepository } from "../lib/repositories/labRepository";
import { LAB01_EXERCISE_WORKBOOKS } from "../lib/constants";
import {
  checkpointFields,
  inventorySubgroups,
  postureOptions,
  promptDiagnostico,
  promptDdiOptimo,
  promptPortfolio,
  safetyStockBands
} from "../lib/lab01Ex04Content";
import type { Group } from "../types/lab";
import type { Session } from "../lib/repositories/labRepository.types";
import styles from "./Exercise04View.module.css";

const workbookFileName = LAB01_EXERCISE_WORKBOOKS["ex-04"];

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

export function Exercise04View({
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

  const [posturas, setPosturas] = useState<Record<string, string>>({});
  const [resumenB, setResumenB] = useState("");
  const [resumenC, setResumenC] = useState("");
  const [resumenE, setResumenE] = useState("");
  const [checkpoint1, setCheckpoint1] = useState("");
  const [checkpoint2, setCheckpoint2] = useState("");
  const [checkpoint3, setCheckpoint3] = useState("");

  const fieldValues = {
    ...posturas,
    resumen_b: resumenB,
    resumen_c: resumenC,
    resumen_e: resumenE,
    checkpoint_1: checkpoint1,
    checkpoint_2: checkpoint2,
    checkpoint_3: checkpoint3
  };

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const currentSession = await repo.getSession();
      if (cancelled) return;
      setSession(currentSession);

      if (currentSession?.groupId) {
        const submission = await repo.getSubmission({
          groupId: currentSession.groupId,
          exerciseId: "ex-04",
          exerciseVersion: 1
        });
        if (cancelled) return;

        if (submission) {
          setCheckpointStatus(submission.status);
          setSubmittedAt(submission.submittedAt ?? undefined);

          const responses = submission.responsesJson as Record<string, string>;
          const loadedPosturas: Record<string, string> = {};
          inventorySubgroups.forEach((subgroup, index) => {
            const value = responses[`postura_${index}`];
            if (value) loadedPosturas[`postura_${index}`] = value;
          });
          setPosturas(loadedPosturas);
          setResumenB(responses.resumen_b ?? "");
          setResumenC(responses.resumen_c ?? "");
          setResumenE(responses.resumen_e ?? "");
          setCheckpoint1(responses.checkpoint_1 ?? "");
          setCheckpoint2(responses.checkpoint_2 ?? "");
          setCheckpoint3(responses.checkpoint_3 ?? "");
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
    if (Object.keys(posturas).length === 0) return;

    const timeout = setTimeout(() => {
      repo.saveSubmission({
        groupId,
        exerciseId: "ex-04",
        exerciseVersion: 1,
        responsesJson: { ...posturas }
      }).catch((error) => {
        setMessages((current) => [
          ...current,
          { type: "error", text: `No se pudo guardar la postura: ${String(error)}` }
        ]);
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [posturas, session, repo]);

  useEffect(() => {
    const hasSuccess = messages.some((m) => m.type === "success");
    if (hasSuccess && successRef.current) {
      successRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [messages]);

  function validate(): string[] {
    const missing: string[] = [];
    if (!checkpoint1.trim()) missing.push(checkpointFields[0].label);
    if (!checkpoint2.trim()) missing.push(checkpointFields[1].label);
    if (!checkpoint3.trim()) missing.push(checkpointFields[2].label);
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
        exerciseId: "ex-04",
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
      setErrors(new Set(["checkpoint_1", "checkpoint_2", "checkpoint_3"]));
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
        exerciseId: "ex-04",
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
        <div className={styles.heroEyebrow}>AI Revenue &amp; Inventory Copilot</div>
        <h1>Ejercicio 4: Inventory Optimization</h1>
        <p className={styles.heroLead}>
          El inventario no es un problema de depósito: es una decisión de capital. Van a definir cuánto stock sostener por subgrupo — y a auditar, no solo aceptar, lo que un copiloto de IA les recomiende.
        </p>

        <div className={styles.metaRow}>
          <div className={styles.metaCard}>
            <div className={styles.metaCardKey}>Grupo</div>
            <div className={styles.metaCardValue}>{group.name}</div>
          </div>
          <div className={styles.metaCard}>
            <div className={styles.metaCardKey}>Estado</div>
            <div className={styles.metaCardValue}>
              <span className={`${styles.badge} ${styles.badgeWarn}`}>{statusLabel}</span>
            </div>
          </div>
          <div className={styles.metaCard}>
            <div className={styles.metaCardKey}>Workbook</div>
            <div className={styles.metaCardValue}>NEXUS_RETAIL_LAB01_EJ04</div>
          </div>
          <div className={styles.metaCard}>
            <div className={styles.metaCardKey}>Tiempo estimado</div>
            <div className={styles.metaCardValue}>~45 min</div>
          </div>
        </div>

        <div className={styles.workbookBox}>
          <div>
            <div className={styles.workbookTitle}>📎 Workbook del ejercicio</div>
            <div className={styles.workbookDesc}>
              8 subgrupos elegidos a propósito. No calcula nada: es memoria de datos y de resultados. Toda fórmula vive en los prompts.
            </div>
          </div>
          <a className={styles.btn} href={`/templates/${workbookFileName}`} download>
            ⬇ Descargar workbook
          </a>
        </div>

        <div className={styles.chain}>
          <div className={styles.chainStep}>Negocio · Ej. 0</div>
          <span className={styles.chainArrow}>→</span>
          <div className={styles.chainStep}>Portfolio · Ej. 1</div>
          <span className={styles.chainArrow}>→</span>
          <div className={styles.chainStep}>Pricing · Ej. 2</div>
          <span className={styles.chainArrow}>→</span>
          <div className={styles.chainStep}>Forecast · Ej. 3</div>
          <span className={styles.chainArrow}>→</span>
          <div className={`${styles.chainStep} ${styles.chainStepHere}`}>Inventario · Ej. 4 · acá</div>
        </div>
      </div>

      <div className={styles.noticeBox}>
        <div className={styles.noticeIcon}>📎</div>
        <div>
          <div className={styles.noticeTitle}>Antes de arrancar: este workbook es nuevo</div>
          <p>
            8 subgrupos elegidos a propósito -- pocos, para ver los patrones a simple vista y con su IA, sin perderse en el volumen. El Excel no calcula nada: descarguen las celdas amarillas con lo que su IA les devuelva.
          </p>
        </div>
      </div>

      {/* PISO CONCEPTUAL */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.stepMark}>i</div>
          <div>
            <div className={styles.sectionTitle}>Piso conceptual</div>
            <div className={styles.sectionSub}>Antes de tocar el dataset</div>
          </div>
          <div className={styles.timer}>⏱ ~5 min</div>
        </div>
        <div className={styles.tensionGrid}>
          <div className={styles.tensionCard}>
            <h4>Inventario Óptimo = Cobertura + Protección</h4>
            <p>El stock que sostienen cubre la demanda esperada, más un stock de seguridad que protege contra la incertidumbre de esa demanda. A mayor variabilidad, mayor protección necesaria.</p>
          </div>
          <div className={styles.tensionCard}>
            <h4>Forecast ≠ Variabilidad</h4>
            <p>El Ejercicio 3 les dio el promedio esperado. Ese promedio puede estar acertado y aun así la venta real saltar mucho semana a semana alrededor de él -- eso dimensiona el buffer.</p>
          </div>
          <div className={styles.tensionCard}>
            <h4>La tensión de fondo</h4>
            <p>Cada día de cobertura de más cuesta capital inmovilizado. Cada día de menos arriesga un quiebre. El óptimo no maximiza ningún extremo: minimiza la suma de los dos costos.</p>
          </div>
          <div className={`${styles.tensionCard} ${styles.tensionCardDesafio}`}>
            <h4>🎯 El desafío -- pide el Comité de Finanzas</h4>
            <p>Liberar ≥15% del capital de trabajo en 90 días, para financiar 3 tiendas nuevas -- sin poner en riesgo la cobertura de ningún subgrupo CORE.</p>
            <span className={styles.tensionCardFact}>Costo de capital: 3% mensual</span>
          </div>
        </div>
      </section>

      {/* PARTE A */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.stepMark}>A</div>
          <div>
            <div className={styles.sectionTitle}>Postura de riesgo por subgrupo</div>
            <div className={styles.sectionSub}>Decisión cualitativa, sin ver el diagnóstico todavía</div>
          </div>
          <div className={styles.timer}>⏱ ~6 min</div>
        </div>
        <div className={styles.bodyTxt}>
          <p>
            Para cada subgrupo tienen dos datos, sin ningún número de ventas ni de capital: el <b>margen</b> y la <b>criticidad de quiebre</b>. Con eso y el costo de capital del 3% mensual, elijan una postura y anótenla en <code>04_POSTURA_INICIAL</code> del Excel.
          </p>
          <p>
            <i>Ejemplo de razonamiento: &quot;Fragancias Premium tiene margen alto pero criticidad de quiebre baja -- postergable -- así que recorto sin miedo: lo que pierdo en riesgo de quiebre es menos que lo que gano liberando capital al 3% mensual.&quot;</i>
          </p>
        </div>
        <div className={styles.stockGrid}>
          {inventorySubgroups.map((subgroup, index) => (
            <div className={styles.stockCard} key={subgroup.name}>
              <h4>{subgroup.name}</h4>
              <div className={styles.stockRow}>
                <span>Margen</span>
                <b>{subgroup.margin}</b>
              </div>
              <div className={styles.stockRow}>
                <span>Criticidad</span>
                <b>{subgroup.criticality}</b>
              </div>
              <div className={styles.posturaRow}>
                {postureOptions.map((option) => {
                  const isActive = posturas[`postura_${index}`] === option.key;
                  const optionClass =
                    option.style === "ok"
                      ? styles.tagOk
                      : option.style === "tight"
                        ? styles.tagTight
                        : styles.tagOver;
                  return (
                    <span
                      className={`${styles.tag} ${optionClass} ${isActive ? styles.active : ""}`}
                      key={option.key}
                      onClick={() => {
                        setPosturas((current) => ({ ...current, [`postura_${index}`]: option.key }));
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      {option.label}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PARTE B */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.stepMark}>B</div>
          <div>
            <div className={styles.sectionTitle}>El dato real y el diagnóstico</div>
            <div className={styles.sectionSub}>Detección con IA a partir de datos crudos</div>
          </div>
          <div className={styles.timer}>⏱ ~10 min</div>
        </div>
        <div className={styles.bodyTxt}>
          <p>
            El dataset completo está en <code>03_SUBGRUPOS</code>: 12 meses de historia, precio, costo, lead time, canal, stock actual, portfolio, margen y criticidad -- todo dato crudo, nada calculado.
          </p>
          <p>
            <b>Importante:</b> el DDI mínimo de seguridad = 1.5× el lead time -- el piso de cobertura para sobrevivir un ciclo y medio de reposición. Y el % de stock de seguridad es un <b>rango</b>, no un número único -- la Parte C decide dónde pararse dentro de ese rango.
          </p>
        </div>

        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Perfil</th>
              <th>Coef. variación</th>
              <th>% Stock Seguridad</th>
            </tr>
          </thead>
          <tbody>
            {safetyStockBands.map((band) => (
              <tr key={band.profile}>
                <td className={styles.name}>{band.profile}</td>
                <td>{band.coefficient}</td>
                <td>{band.range}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.promptLabel}>
          <span className={styles.promptName}>Prompt · Diagnóstico</span>
          <CopyButton text={promptDiagnostico} />
        </div>
        <div className={styles.promptBox}>{promptDiagnostico}</div>

        <div className={`${styles.formField} ${errors.has("resumen_b") ? styles.formFieldError : ""}`} style={{ marginTop: 16 }}>
          <label>Resumen para la plataforma (2-3 líneas): con el diagnóstico ya completo en su Excel, ¿en qué subgrupo la postura de la Parte A no coincidió con el dato real, y por qué?</label>
          <textarea
            onChange={(event) => {
              setResumenB(event.target.value);
              setErrors((current) => {
                const next = new Set(current);
                next.delete("resumen_b");
                return next;
              });
            }}
            placeholder="Escriban su respuesta..."
            value={resumenB}
          />
        </div>
      </section>

      {/* PARTE C */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.stepMark}>C</div>
          <div>
            <div className={styles.sectionTitle}>El DDI óptimo, en dos pasos</div>
            <div className={styles.sectionSub}>Variabilidad fija el rango. Costo decide la posición.</div>
          </div>
          <div className={styles.timer}>⏱ ~12 min</div>
        </div>

        <div className={styles.ladder}>
          <div className={styles.ladderStep}>
            <div className={styles.ladderStepNumber}>PASO 1 -- ¿QUÉ RANGO ME PERMITO?</div>
            <div className={styles.ladderStepTitle}>La variabilidad fija el rango</div>
            <div className={styles.ladderStepDesc}>
              Cada subgrupo cae en una banda del cuadro de arriba según su coeficiente de variación. Ejemplo: si un subgrupo es &quot;Volátil&quot;, su stock de seguridad tiene que estar entre 30% y 40% del inventario objetivo -- ni menos, ni más. Ese rango no se negocia.
            </div>
          </div>
          <span className={styles.ladderArrow}>→</span>
          <div className={styles.ladderStep}>
            <div className={styles.ladderStepNumber}>PASO 2 -- ¿DÓNDE, DENTRO DE ESE RANGO?</div>
            <div className={styles.ladderStepTitle}>El costo decide la posición</div>
            <div className={styles.ladderStepDesc}>
              Siguiendo el ejemplo: entre 30% y 40, ¿van con 30 o con 40? Si guardar esos días extra de stock cuesta (en capital inmovilizado al 3% mensual) más de lo que arriesgan perdiendo en un quiebre, eligen 30% -- el piso, menos capital atado. Si el quiebre les sale más caro que ese costo, eligen 40% -- el techo, más protección.
            </div>
          </div>
        </div>

        <div className={styles.promptLabel}>
          <span className={styles.promptName}>Prompt · DDI óptimo (dos pasos)</span>
          <CopyButton text={promptDdiOptimo} />
        </div>
        <div className={styles.promptBox}>{promptDdiOptimo}</div>

        <div className={`${styles.formField} ${errors.has("resumen_c") ? styles.formFieldError : ""}`} style={{ marginTop: 16 }}>
          <label>Resumen para la plataforma (2-3 líneas): con el plan ya completo en su Excel, ¿llegaron al 15%? ¿Qué subgrupo aportó más capital liberado?</label>
          <textarea
            onChange={(event) => {
              setResumenC(event.target.value);
              setErrors((current) => {
                const next = new Set(current);
                next.delete("resumen_c");
                return next;
              });
            }}
            placeholder="Escriban su respuesta..."
            value={resumenC}
          />
        </div>
      </section>

      {/* PARTE D */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.stepMark}>D</div>
          <div>
            <div className={styles.sectionTitle}>Auditá la recomendación</div>
            <div className={styles.sectionSub}>Protección Solar entra a temporada alta ahora</div>
          </div>
          <div className={styles.timer}>⏱ ~6 min</div>
        </div>

        <div className={styles.debateBox}>
          <div className={styles.debateQuestion}>Hoy es fin de invierno (M09).</div>
          <p>
            Protección Solar y Repelentes de Insectos están a semanas de su pico de demanda del año -- revisen <span className={styles.debateFact}>vol_m10, vol_m11, vol_m12</span> en 03_SUBGRUPOS para confirmarlo con sus propios ojos.
          </p>
          <p>
            Si en la Parte C la IA priorizó liberar capital en Protección Solar porque &quot;fuera de temporada&quot; el costo de capital le ganaba al costo de quiebre, esa lectura ya no aplica: la criticidad de quiebre sube fuerte en las próximas semanas.
          </p>
        </div>

        <div className={styles.bodyTxt} style={{ marginTop: 16 }}>
          <p>
            <b>Consigna:</b> revisen puntualmente la recomendación de Protección Solar. ¿La sostienen, la overridean manualmente, o le piden a la IA que recalcule con la estacionalidad como restricción explícita? No hay respuesta correcta -- se evalúa el razonamiento. Documenten la decisión en el checkpoint.
          </p>
        </div>
      </section>

      {/* PARTE E */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.stepMark}>E</div>
          <div>
            <div className={styles.sectionTitle}>Cuando la decisión de portfolio ya está tomada</div>
            <div className={styles.sectionSub}>El plan tiene que digerir lo que ya decidieron en el Ejercicio 1</div>
          </div>
          <div className={styles.timer}>⏱ ~6 min</div>
        </div>

        <div className={`${styles.noticeBox} ${styles.noticeDanger}`}>
          <div className={styles.noticeIcon}>⚠️</div>
          <div>
            <div className={styles.noticeTitle}>Dos decisiones que se contradicen -- a propósito</div>
            <p>
              En la Parte A, Medicamentos Bajo Receta probablemente les quedó con criticidad de quiebre alta -- eso empuja a protegerlo, no a recortarlo. Pero en el Ejercicio 1 ya lo clasificaron REVIEW, y un REVIEW es candidato a achicar. Son dos señales opuestas sobre el mismo subgrupo: la variabilidad dice &quot;cuidalo&quot;, el portfolio dice &quot;recortalo&quot;.
            </p>
            <p style={{ marginTop: 8 }}>
              <b>La regla para esta parte: cuando las dos chocan, gana la decisión de portfolio</b> -- porque ya fue tomada por el equipo con más contexto estratégico que un cálculo estadístico. Achíquenlo igual, y dejen registrado qué riesgo aceptan al hacerlo.
            </p>
          </div>
        </div>

        <div className={styles.bodyTxt} style={{ marginTop: 16 }}>
          <p>
            Medicamentos Bajo Receta y Fragancias Premium:{" "}
            <span className={`${styles.tag} ${styles.tagOver} ${styles.tagReadOnly} ${styles.portfolioTag}`}>REVIEW</span>.
            Protección Solar, Repelentes, Vitaminas y Suplementos, Nutrición Infantil y Farmacia OTC:{" "}
            <span className={`${styles.tag} ${styles.tagOk} ${styles.tagReadOnly} ${styles.portfolioTag}`}>CORE</span>.
          </p>
        </div>

        <div className={styles.promptLabel}>
          <span className={styles.promptName}>Prompt · Plan final ajustado por portfolio</span>
          <CopyButton text={promptPortfolio} />
        </div>
        <div className={styles.promptBox}>{promptPortfolio}</div>

        <div className={`${styles.formField} ${errors.has("resumen_e") ? styles.formFieldError : ""}`} style={{ marginTop: 16 }}>
          <label>Resumen para la plataforma (2-3 líneas): con el plan final ya completo en su Excel, ¿qué riesgo comercial o regulatorio aceptaron al priorizar los REVIEW?</label>
          <textarea
            onChange={(event) => {
              setResumenE(event.target.value);
              setErrors((current) => {
                const next = new Set(current);
                next.delete("resumen_e");
                return next;
              });
            }}
            placeholder="Escriban su respuesta..."
            value={resumenE}
          />
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
          {checkpointFields.map((field) => {
            const value =
              field.id === "checkpoint_1"
                ? checkpoint1
                : field.id === "checkpoint_2"
                  ? checkpoint2
                  : checkpoint3;
            const setter =
              field.id === "checkpoint_1"
                ? setCheckpoint1
                : field.id === "checkpoint_2"
                  ? setCheckpoint2
                  : setCheckpoint3;

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
                  message.type === "error" ? styles.messageError : message.type === "success" ? styles.messageSuccess : styles.messageInfo
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

      <div className={styles.footerNote}>NEXUS Retail Labs · Laboratorio 1 · Ejercicio 4 de 5</div>
    </AppShell>
  );
}
