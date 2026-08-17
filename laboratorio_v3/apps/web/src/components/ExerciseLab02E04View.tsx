"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Save, Send } from "lucide-react";
import { AppShell } from "./AppShell";
import { getLabRepository } from "../lib/repositories/labRepository";
import { LAB02_EXERCISE_WORKBOOKS } from "../lib/constants";
import type { Group } from "../types/lab";
import type { Session } from "../lib/repositories/labRepository.types";
import baseStyles from "./ExerciseLab02E01View.module.css";
import styles from "./ExerciseLab02Integrator.module.css";

const workbookFileName = LAB02_EXERCISE_WORKBOOKS["lab02-ex04"] ?? "NEXUS_CASO_INTEGRADOR.xlsx";

type Message = {
  type: "success" | "error" | "info";
  text: string;
};

const checkpointQuestions = [
  {
    id: "checkpoint_1",
    label: "1. ¿Cuál fue la acción de mayor impacto y qué supuesto la sostiene?"
  },
  {
    id: "checkpoint_2",
    label: "2. ¿Qué meta no alcanzaron y qué habría hecho falta para alcanzarla?"
  },
  {
    id: "checkpoint_3",
    label: "3. ¿Qué oportunidad descartaron y por qué?"
  },
  {
    id: "checkpoint_4",
    label: "4. ¿Qué número tuvieron que sacar del instrumento por no poder trazarlo hasta el archivo?"
  },
  {
    id: "checkpoint_5",
    label: "5. Vuelvan a las hipótesis del Ejercicio 3: ¿cuál se sostuvo y cuál no?"
  },
  {
    id: "checkpoint_6",
    label: "6. ¿Qué dato les hubiera cambiado el plan y no estaba en el archivo?"
  }
] as const;

const actionRows = [
  { id: "accion_1", num: 1 },
  { id: "accion_2", num: 2 },
  { id: "accion_3", num: 3 },
  { id: "accion_4", num: 4 },
  { id: "accion_5", num: 5 }
] as const;

const actionColumns = [
  { id: "nombre", header: "Acción" },
  { id: "eje", header: "Eje" },
  { id: "ebitda", header: "Impacto EBITDA" },
  { id: "caja", header: "Impacto caja" },
  { id: "restriccion", header: "Restricción que la limita" },
  { id: "supuesto", header: "Supuesto" }
] as const;

const scoreboardRows = [
  { id: "ebitda", indicator: "EBITDA acumulado 12m (ARS M)", baseline: "396", meta: "600" },
  { id: "capital", indicator: "Capital liberado de inventario (ARS M)", baseline: "0", meta: "350" },
  { id: "ingresos", indicator: "Ingresos por ventas 12m (ARS M)", baseline: "10.937", meta: "—" },
  { id: "margen", indicator: "Margen bruto % promedio", baseline: "28,4%", meta: "—" },
  { id: "caja", indicator: "Saldo de caja al mes 12 (ARS M)", baseline: "269", meta: "—" },
  { id: "inventario", indicator: "Días de inventario al mes 12", baseline: "76", meta: "—" },
  { id: "vip", indicator: "Facturación segmento VIP", baseline: "base 100", meta: "≥ 100" },
  { id: "skus", indicator: "SKUs discontinuados", baseline: "0", meta: "≤ 40" }
] as const;

export function ExerciseLab02E04View({
  group,
  stateVersion: _stateVersion,
  checkpoint: _checkpoint,
  onSave: _onSave,
  onSubmit: _onSubmit
}: {
  group: Group;
  stateVersion: string;
  checkpoint: unknown;
  onSave?: (payload: { fields: Record<string, string>; confirmations: Record<string, boolean> }) => Promise<void>;
  onSubmit?: (payload: { fields: Record<string, string>; confirmations: Record<string, boolean>; requiredFields: string[] }) => Promise<void>;
}) {
  const repo = getLabRepository();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [checkpointStatus, setCheckpointStatus] = useState<string>("borrador");
  const [submittedAt, setSubmittedAt] = useState<string | undefined>();
  const successRef = useRef<HTMLDivElement | null>(null);

  const [diagnostico, setDiagnostico] = useState("");
  const [acciones, setAcciones] = useState("");
  const [instrumento, setInstrumento] = useState("");
  const [checkpoint1, setCheckpoint1] = useState("");
  const [checkpoint2, setCheckpoint2] = useState("");
  const [checkpoint3, setCheckpoint3] = useState("");
  const [checkpoint4, setCheckpoint4] = useState("");
  const [checkpoint5, setCheckpoint5] = useState("");
  const [checkpoint6, setCheckpoint6] = useState("");
  const [actionCells, setActionCells] = useState<Record<string, string>>({});
  const [scoreCells, setScoreCells] = useState<Record<string, string>>({});

  const fieldValues = useMemo(
    () => ({
      ej04_diagnostico_cerrado: diagnostico,
      ej04_acciones: acciones,
      ej04_instrumento: instrumento,
      ej04_checkpoint_1: checkpoint1,
      ej04_checkpoint_2: checkpoint2,
      ej04_checkpoint_3: checkpoint3,
      ej04_checkpoint_4: checkpoint4,
      ej04_checkpoint_5: checkpoint5,
      ej04_checkpoint_6: checkpoint6,
      ...actionCells,
      ...scoreCells
    }),
    [
      diagnostico,
      acciones,
      instrumento,
      checkpoint1,
      checkpoint2,
      checkpoint3,
      checkpoint4,
      checkpoint5,
      checkpoint6,
      actionCells,
      scoreCells
    ]
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const currentSession = await repo.getSession();
      if (cancelled) return;
      setSession(currentSession);

      if (currentSession?.groupId) {
        const submission = await repo.getSubmission({
          groupId: currentSession.groupId,
          exerciseId: "lab02-ex04",
          exerciseVersion: 1
        });
        if (cancelled) return;

        if (submission) {
          setCheckpointStatus(submission.status);
          setSubmittedAt(submission.submittedAt ?? undefined);

          const responses = submission.responsesJson as Record<string, string>;
          setDiagnostico(responses.ej04_diagnostico_cerrado ?? "");
          setAcciones(responses.ej04_acciones ?? "");
          setInstrumento(responses.ej04_instrumento ?? "");
          setCheckpoint1(responses.ej04_checkpoint_1 ?? "");
          setCheckpoint2(responses.ej04_checkpoint_2 ?? "");
          setCheckpoint3(responses.ej04_checkpoint_3 ?? "");
          setCheckpoint4(responses.ej04_checkpoint_4 ?? "");
          setCheckpoint5(responses.ej04_checkpoint_5 ?? "");
          setCheckpoint6(responses.ej04_checkpoint_6 ?? "");

          const loadedActions: Record<string, string> = {};
          const loadedScores: Record<string, string> = {};
          Object.entries(responses).forEach(([key, value]) => {
            if (key.startsWith("ej04_accion_")) {
              loadedActions[key] = value;
            }
            if (key.startsWith("ej04_score_")) {
              loadedScores[key] = value;
            }
          });
          setActionCells(loadedActions);
          setScoreCells(loadedScores);
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
        exerciseId: "lab02-ex04",
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

  function actionCellKey(rowId: string, colId: string): string {
    return `ej04_accion_${rowId}_${colId}`;
  }

  function scoreCellKey(rowId: string, column: "proyeccion" | "supuesto"): string {
    return `ej04_score_${rowId}_${column}`;
  }

  function setActionCell(rowId: string, colId: string, value: string) {
    setActionCells((current) => ({ ...current, [actionCellKey(rowId, colId)]: value }));
  }

  function setScoreCell(rowId: string, column: "proyeccion" | "supuesto", value: string) {
    setScoreCells((current) => ({ ...current, [scoreCellKey(rowId, column)]: value }));
  }

  function validate(): string[] {
    const missing: string[] = [];
    if (!diagnostico.trim()) missing.push("Diagnóstico cerrado");
    if (!acciones.trim()) missing.push("Resumen de acciones");
    if (!instrumento.trim()) missing.push("Instrumento");

    actionRows.forEach((row) => {
      actionColumns.forEach((col) => {
        const key = actionCellKey(row.id, col.id);
        if (!actionCells[key]?.trim()) missing.push(`Acción ${row.num} · ${col.header}`);
      });
    });

    scoreboardRows.forEach((row) => {
      if (!scoreCells[scoreCellKey(row.id, "proyeccion")]?.trim()) {
        missing.push(`Scoreboard · ${row.indicator} · proyección`);
      }
      if (!scoreCells[scoreCellKey(row.id, "supuesto")]?.trim()) {
        missing.push(`Scoreboard · ${row.indicator} · supuesto`);
      }
    });

    checkpointQuestions.forEach((field) => {
      const value = fieldValues[field.id as keyof typeof fieldValues] as string;
      if (!value.trim()) missing.push(field.label);
    });

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
        exerciseId: "lab02-ex04",
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
      const nextErrors = new Set<string>([
        "ej04_diagnostico_cerrado",
        "ej04_acciones",
        "ej04_instrumento",
        ...checkpointQuestions.map((f) => f.id)
      ]);
      actionRows.forEach((row) => {
        actionColumns.forEach((col) => {
          const key = actionCellKey(row.id, col.id);
          if (!actionCells[key]?.trim()) nextErrors.add(key);
        });
      });
      scoreboardRows.forEach((row) => {
        if (!scoreCells[scoreCellKey(row.id, "proyeccion")]?.trim()) nextErrors.add(scoreCellKey(row.id, "proyeccion"));
        if (!scoreCells[scoreCellKey(row.id, "supuesto")]?.trim()) nextErrors.add(scoreCellKey(row.id, "supuesto"));
      });
      setErrors(nextErrors);
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
        exerciseId: "lab02-ex04",
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
      <div className={baseStyles.hero}>
        <div className={baseStyles.heroEyebrow}>Del Diagnóstico al Plan</div>
        <h1>Ejercicio 4: Integrador · Parte 2 — Plan y presentación</h1>
        <p className={baseStyles.heroLead}>
          El Comité no quiere un informe: quiere ver moverse los números y entender qué asumieron para moverlos. Van a cerrar el diagnóstico, elegir las acciones, proyectar el resultado a 12 meses y construir con IA un instrumento que sostenga la defensa frente a preguntas.
        </p>

        <div className={baseStyles.metaRow}>
          <div className={baseStyles.metaCard}>
            <div className={baseStyles.metaCardKey}>Grupo</div>
            <div className={baseStyles.metaCardValue}>{group.name}</div>
          </div>
          <div className={baseStyles.metaCard}>
            <div className={baseStyles.metaCardKey}>Estado</div>
            <div className={baseStyles.metaCardValue}>
              <span className={baseStyles.statusPill}>{statusLabel}</span>
            </div>
          </div>
          <div className={baseStyles.metaCard}>
            <div className={baseStyles.metaCardKey}>Workbook</div>
            <div className={baseStyles.metaCardValue}>NEXUS_CASO_INTEGRADOR</div>
          </div>
          <div className={baseStyles.metaCard}>
            <div className={baseStyles.metaCardKey}>Tiempo estimado</div>
            <div className={baseStyles.metaCardValue}>~60 min + 10 de presentación</div>
          </div>
        </div>

        <div className={baseStyles.workbookBox}>
          <div>
            <div className={baseStyles.workbookTitle}>📎 Workbook del ejercicio</div>
            <div className={baseStyles.workbookDesc}>
              El mismo archivo del Ejercicio 3. Vuelvan a descargarlo y subirlo: están arrancando una conversación de IA nueva y no recuerda nada del ejercicio anterior.
            </div>
          </div>
          <a className={baseStyles.btn} href={`/templates/${workbookFileName}`} download>
            ⬇ Descargar workbook
          </a>
        </div>
      </div>

      <div className={baseStyles.noticeBox}>
        <div className={baseStyles.noticeIcon}>📎</div>
        <div>
          <div className={baseStyles.noticeTitle}>Antes de arrancar: workbook + su ficha del Ejercicio 3</div>
          <p>
            Suban el workbook y, en el mismo mensaje, <strong>peguen su ficha de diagnóstico del Ejercicio 3</strong>. Es la forma más rápida de reconstruir el contexto sin volver a analizar desde cero.
          </p>
          <p>Este ejercicio tampoco trae prompts.</p>
        </div>
      </div>

      {/* PISO CONCEPTUAL */}
      <section className={baseStyles.section}>
        <div className={baseStyles.sectionHead}>
          <div className={baseStyles.stepMark}>i</div>
          <div>
            <div className={baseStyles.sectionTitle}>Piso conceptual</div>
            <div className={baseStyles.sectionSub}>Antes de proyectar nada</div>
          </div>
          <div className={baseStyles.timer}>⏱ ~3 min</div>
        </div>
        <div className={baseStyles.tensionGrid}>
          <div className={baseStyles.tensionCard}>
            <h3>El mejor plan no es el del número más grande</h3>
            <p>
              Un grupo que proyecta +120 M declarando el supuesto que lo sostiene entregó más que uno que proyecta +400 M sin decir de dónde sale. La magnitud es barata: la IA la produce a pedido. Lo caro es la trazabilidad.
            </p>
          </div>
          <div className={baseStyles.tensionCard}>
            <h3>Un instrumento que no está atado a datos es una animación</h3>
            <p>
              La IA construye en cinco minutos tableros preciosos con controles que mueven números que no salen de ningún lado. Si no pueden decir de qué celda del archivo sale un número, ese número no va.
            </p>
          </div>
          <div className={`${baseStyles.tensionCard} ${baseStyles.tensionCardDesafio}`}>
            <h3>🎯 El desafío — el mandato del Comité</h3>
            <p>
              Un plan que alcance las cuatro metas simultáneamente al cierre de los próximos 12 meses. No hace falta llegar a las cuatro ni cubrir los cuatro frentes: tres acciones bien fundamentadas valen más que diez enunciadas.
            </p>
          </div>
        </div>
      </section>

      {/* LAS CUATRO METAS */}
      <section className={baseStyles.section}>
        <div className={baseStyles.sectionHead}>
          <div className={baseStyles.stepMark}>📊</div>
          <div>
            <div className={baseStyles.sectionTitle}>Las cuatro metas</div>
            <div className={baseStyles.sectionSub}>Dato dado — así se mide el plan</div>
          </div>
        </div>
        <div className={styles.tableWrap}>
          <table className={baseStyles.dataTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>Meta</th>
                <th>Baseline</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>EBITDA acumulado ≥ ARS 600 M</td>
                <td className={baseStyles.name}>396</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Liberar ≥ ARS 350 M de capital inmovilizado en inventario</td>
                <td className={baseStyles.name}>0</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Ningún subgrupo CORE por debajo de 20 días de cobertura en ningún mes</td>
                <td className={baseStyles.name}>—</td>
              </tr>
              <tr>
                <td>4</td>
                <td>Facturación del segmento VIP igual o superior a la actual</td>
                <td className={baseStyles.name}>base 100</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* PARTE A */}
      <section className={baseStyles.section}>
        <div className={baseStyles.sectionHead}>
          <div className={baseStyles.stepMark}>A</div>
          <div>
            <div className={baseStyles.sectionTitle}>Cerrar el diagnóstico</div>
            <div className={baseStyles.sectionSub}>Cada grupo llegó a un lugar distinto; acá se empareja</div>
          </div>
          <div className={baseStyles.timer}>⏱ ~25 min</div>
        </div>
        <div className={baseStyles.bodyTxt}>
          <p>Dos tareas, en este orden:</p>
        </div>
        <div className={`${styles.axisGrid} ${styles.cols2}`}>
          <div className={styles.axisCard}>
            <div className={styles.axisNum}>Primero</div>
            <h3>Subir de nivel el hallazgo principal</h3>
            <p>
              Si quedó en nivel 1, cuantifíquenlo. Si quedó en nivel 2, denle un rango y busquen la restricción que lo limita. Un hallazgo en nivel 1 no se puede proyectar.
            </p>
          </div>
          <div className={styles.axisCard}>
            <div className={styles.axisNum}>Después</div>
            <h3>Sumar el eje que no miraron</h3>
            <p>El plan va a necesitar más de un frente. Elijan el segundo eje —el que más chance tenga de mover su número— y háganle al menos un nivel 1.</p>
          </div>
        </div>
        <div className={styles.calloutRule}>
          No estiren este bloque. El grupo que se queda perfeccionando el diagnóstico llega sin nada que mostrar: a los 25 minutos conviene pasar a propuestas, esté como esté.
        </div>
        <div
          className={`${styles.answerBox} ${errors.has("ej04_diagnostico_cerrado") ? baseStyles.formFieldError : ""}`}
        >
          <div className={styles.answerLabel}>Diagnóstico cerrado</div>
          <textarea
            onChange={(event) => {
              setDiagnostico(event.target.value);
              setErrors((current) => {
                const next = new Set(current);
                next.delete("ej04_diagnostico_cerrado");
                return next;
              });
            }}
            placeholder="Hallazgo principal en su nivel final · segundo eje y qué encontramos ahí"
            value={diagnostico}
          />
        </div>
      </section>

      {/* PARTE B */}
      <section className={baseStyles.section}>
        <div className={baseStyles.sectionHead}>
          <div className={baseStyles.stepMark}>B</div>
          <div>
            <div className={baseStyles.sectionTitle}>Las acciones</div>
            <div className={baseStyles.sectionSub}>Máximo cinco, ordenadas por impacto</div>
          </div>
          <div className={baseStyles.timer}>⏱ ~20 min</div>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.fillTable}>
            <thead>
              <tr>
                <th style={{ width: 32 }}>#</th>
                {actionColumns.map((col) => (
                  <th key={col.id}>{col.header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {actionRows.map((row) => (
                <tr key={row.id}>
                  <td>{row.num}</td>
                  {actionColumns.map((col) => {
                    const key = actionCellKey(row.id, col.id);
                    return (
                      <td
                        key={col.id}
                        className={`${styles.fillCell} ${errors.has(key) ? baseStyles.formFieldError : ""}`}
                      >
                        <input
                          onChange={(event) => setActionCell(row.id, col.id, event.target.value)}
                          placeholder=""
                          type="text"
                          value={actionCells[key] ?? ""}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={baseStyles.bodyTxt}>
          <p>Tres controles antes de cerrar la lista:</p>
        </div>
        <div className={styles.axisGrid}>
          <div className={styles.axisCard}>
            <h3>Revisen las restricciones acción por acción</h3>
            <p>Una acción que viola una restricción no es evaluable. Y hay al menos un costo del caso que la mayoría de los planes se olvida de descontar del EBITDA.</p>
          </div>
          <div className={styles.axisCard}>
            <h3>Chequeen las cuatro metas, no solo la que miran</h3>
            <p>Una acción puede mejorar una meta y romper otra. Es la lógica del Ejercicio 3 aplicada a decisiones en vez de a hallazgos.</p>
          </div>
          <div className={styles.axisCard}>
            <h3>Decidan qué NO hacer</h3>
            <p>Van a tener que defender una oportunidad que evaluaron y descartaron. Es la pregunta que más separa a los grupos.</p>
          </div>
        </div>
        <div className={`${styles.answerBox} ${errors.has("ej04_acciones") ? baseStyles.formFieldError : ""}`}>
          <div className={styles.answerLabel}>Nuestras acciones</div>
          <textarea
            onChange={(event) => {
              setAcciones(event.target.value);
              setErrors((current) => {
                const next = new Set(current);
                next.delete("ej04_acciones");
                return next;
              });
            }}
            placeholder="Una por línea, con impacto, restricción y supuesto"
            value={acciones}
          />
        </div>
      </section>

      {/* PARTE C */}
      <section className={baseStyles.section}>
        <div className={baseStyles.sectionHead}>
          <div className={baseStyles.stepMark}>C</div>
          <div>
            <div className={baseStyles.sectionTitle}>Scoreboard proyectado</div>
            <div className={baseStyles.sectionSub}>A 12 meses, contra el baseline</div>
          </div>
          <div className={baseStyles.timer}>⏱ ~10 min</div>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.fillTable}>
            <thead>
              <tr>
                <th>Indicador</th>
                <th>Baseline</th>
                <th>Su proyección</th>
                <th>Meta</th>
                <th>Supuesto clave</th>
              </tr>
            </thead>
            <tbody>
              {scoreboardRows.map((row) => {
                const proyeccionKey = scoreCellKey(row.id, "proyeccion");
                const supuestoKey = scoreCellKey(row.id, "supuesto");
                return (
                  <tr key={row.id}>
                    <td className={baseStyles.name}>{row.indicator}</td>
                    <td>{row.baseline}</td>
                    <td className={`${styles.fillCell} ${errors.has(proyeccionKey) ? baseStyles.formFieldError : ""}`}>
                      <input
                        onChange={(event) => setScoreCell(row.id, "proyeccion", event.target.value)}
                        type="text"
                        value={scoreCells[proyeccionKey] ?? ""}
                      />
                    </td>
                    <td>{row.meta}</td>
                    <td className={`${styles.fillCell} ${errors.has(supuestoKey) ? baseStyles.formFieldError : ""}`}>
                      <input
                        onChange={(event) => setScoreCell(row.id, "supuesto", event.target.value)}
                        type="text"
                        value={scoreCells[supuestoKey] ?? ""}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className={styles.calloutSoft}>
          La columna de supuesto es obligatoria en las filas que proyectaron. Es donde se evalúa la entrega.
        </div>
      </section>

      {/* PARTE D */}
      <section className={baseStyles.section}>
        <div className={baseStyles.sectionHead}>
          <div className={baseStyles.stepMark}>D</div>
          <div>
            <div className={baseStyles.sectionTitle}>El instrumento</div>
            <div className={baseStyles.sectionSub}>La herramienta con la que van a contestar las preguntas</div>
          </div>
          <div className={baseStyles.timer}>⏱ ~15 min</div>
        </div>
        <div className={baseStyles.bodyTxt}>
          <p>
            Construyan con IA una pieza visual que sostenga la presentación y la manejan ustedes en vivo desde su propia máquina. <strong>No es una decoración del informe.</strong>
          </p>
        </div>
        <div className={baseStyles.bodyTxt}>
          <h3 style={{ marginTop: 18, fontSize: 15 }}>Qué tiene que aparecer, en cualquier nivel</h3>
        </div>
        <ol className={styles.checkList}>
          <li>
            <strong>Las cuatro metas</strong> con el valor alcanzado y la distancia que falta. De un vistazo, cuál se cumple y cuál no.
          </li>
          <li>
            <strong>Las acciones</strong>, cada una con su impacto en EBITDA, su impacto en caja y su supuesto a la vista — no escondido en un tooltip.
          </li>
          <li>
            <strong>De dónde sale cada número.</strong> Una referencia mínima: qué hoja, qué SKUs, qué segmento.
          </li>
          <li>
            <strong>La oportunidad descartada.</strong> Lo que decidieron no hacer merece un lugar en pantalla, no una nota al pie.
          </li>
        </ol>
        <div className={baseStyles.bodyTxt}>
          <h3 style={{ marginTop: 22, fontSize: 15 }}>Los tres niveles</h3>
        </div>
        <div className={styles.levelGrid}>
          <div className={styles.levelCard}>
            <span className={styles.levelTag}>Nivel 1 · Tablero de una pantalla</span>
            <h3>Estático</h3>
            <p>
              Las cuatro metas con semáforo, la tabla de acciones y los supuestos. Sin interacción. Es una entrega completa y es el piso obligatorio: si el tiempo se les fue en el análisis, quédense acá y háganlo bien.
            </p>
          </div>
          <div className={styles.levelCard}>
            <span className={styles.levelTag}>Nivel 2 · Escenario armable</span>
            <h3>Cada acción se prende y se apaga</h3>
            <p>
              Las cuatro metas se recalculan. Permite mostrar el plan completo, el plan sin la acción más grande, y el plan mínimo que todavía cumple una meta. Requisito: cada acción tiene que tener su impacto cargado como número, no como texto.
            </p>
          </div>
          <div className={`${styles.levelCard} ${styles.l3}`}>
            <span className={styles.levelTag}>Nivel 3 · Supuestos manipulables</span>
            <h3>Se ve la incertidumbre, no solo la decisión</h3>
            <p>
              Los supuestos son editables —conversión, retención, recupero del stock liquidado— y el scoreboard se mueve con ellos, mostrando el rango entre piso y techo. Y el instrumento avisa cuando una restricción se rompe: más de 40 SKUs discontinuados, más de 60 precios modificados, un subgrupo CORE por debajo de 20 días, la facturación VIP debajo de 100.
            </p>
          </div>
        </div>
        <div className={styles.calloutSoft}>
          El nivel 3 es el que convierte la defensa en otra cosa. Cuando el Comité pregunte <em>&quot;¿y si la conversión es la mitad de lo que asumieron?&quot;</em>, ustedes lo mueven en pantalla en vez de responder que lo van a revisar.
        </div>
        <div className={styles.calloutRule}>
          <strong>La regla.</strong> Cualquier número que se mueva en pantalla tiene que poder rastrearse hasta una celda del archivo. Un control que altera un resultado sin un cálculo detrás es peor que no tenerlo: promete precisión que no existe. Si la IA les propone uno así, sáquenlo.
        </div>
        <div className={`${styles.answerBox} ${errors.has("ej04_instrumento") ? baseStyles.formFieldError : ""}`}>
          <div className={styles.answerLabel}>Nuestro instrumento</div>
          <textarea
            onChange={(event) => {
              setInstrumento(event.target.value);
              setErrors((current) => {
                const next = new Set(current);
                next.delete("ej04_instrumento");
                return next;
              });
            }}
            placeholder="Nivel alcanzado · qué muestra cada control · qué número dejamos afuera por no poder trazarlo"
            value={instrumento}
          />
        </div>
      </section>

      {/* PARTE E */}
      <section className={baseStyles.section}>
        <div className={baseStyles.sectionHead}>
          <div className={baseStyles.stepMark}>E</div>
          <div>
            <div className={baseStyles.sectionTitle}>La presentación</div>
            <div className={baseStyles.sectionSub}>10 minutos por grupo</div>
          </div>
        </div>
        <div className={baseStyles.bodyTxt}>
          <p>
            Prevean unos <strong>5 minutos de exposición y unos 5 de preguntas</strong>. Preparen las dos partes: la mitad de la nota está en cómo responden, no en cómo exponen.
          </p>
          <h3 style={{ marginTop: 18, fontSize: 15 }}>La exposición</h3>
          <p>Cinco momentos, aproximadamente un minuto cada uno.</p>
        </div>
        <ol className={styles.momentList}>
          <li>
            <h3>Dónde decidimos mirar</h3>
            <p>Qué eje eligieron y por qué ese. Sin recorrido del caso: el Comité conoce el caso.</p>
          </li>
          <li>
            <h3>El hallazgo que nos cambió la lectura</h3>
            <p>Uno solo, el más fuerte, con el dato que lo respalda. ¿Aparecía en las hipótesis iniciales?</p>
          </li>
          <li>
            <h3>Qué hacemos</h3>
            <p>Las acciones en orden de impacto, con el supuesto de cada una dicho en voz alta.</p>
          </li>
          <li>
            <h3>A dónde llegamos</h3>
            <p>El scoreboard contra las cuatro metas, incluida la que no alcanzaron. Un plan que reconoce que no llega es más creíble que uno que llega a las cuatro.</p>
          </li>
          <li>
            <h3>Qué decidimos no hacer</h3>
            <p>La oportunidad que evaluaron y descartaron, y por qué.</p>
          </li>
        </ol>
        <div className={baseStyles.bodyTxt}>
          <h3 style={{ marginTop: 22, fontSize: 15 }}>Las preguntas</h3>
          <p>Se responden con el instrumento en pantalla. Prepárense para preguntas de este tipo:</p>
        </div>
        <ol className={styles.checkList}>
          <li>¿De dónde sale ese número?</li>
          <li>¿Qué pasa si el supuesto se cumple a la mitad?</li>
          <li>¿Esta acción no rompe alguna de las otras metas?</li>
          <li>¿Qué restricción del caso les impidió hacer más?</li>
          <li>¿Por qué descartaron esa otra oportunidad?</li>
        </ol>
        <div className={baseStyles.bodyTxt}>
          <p style={{ marginTop: 10 }}>
            <em>Conviene que más de una persona del grupo pueda contestar y manejar el instrumento.</em>
          </p>
          <h3 style={{ marginTop: 22, fontSize: 15 }}>Errores que descuentan</h3>
        </div>
        <div className={styles.axisGrid}>
          <div className={styles.axisCard}>
            <h3>Contar el proceso en vez del resultado</h3>
            <p>Nadie necesita saber cuántos prompts hicieron.</p>
          </div>
          <div className={styles.axisCard}>
            <h3>Un número sin supuesto</h3>
            <p>La primera pregunta del Comité va a ser esa.</p>
          </div>
          <div className={styles.axisCard}>
            <h3>Un instrumento que nadie sabe manejar en vivo</h3>
            <p>Si lo armó una sola persona y nadie más lo entiende, no sirve.</p>
          </div>
          <div className={styles.axisCard}>
            <h3>Leer la pantalla</h3>
            <p>El instrumento acompaña, no reemplaza.</p>
          </div>
        </div>
      </section>

      {/* CHECKPOINT */}
      <section className={baseStyles.section}>
        <div className={baseStyles.sectionHead}>
          <div className={baseStyles.stepMark}>✓</div>
          <div>
            <div className={baseStyles.sectionTitle}>Checkpoint</div>
            <div className={baseStyles.sectionSub}>Guardá la síntesis, no el output completo de la IA</div>
          </div>
        </div>

        <ol className={styles.checkList}>
          <li>¿Cuál fue la acción de mayor impacto y qué supuesto la sostiene?</li>
          <li>¿Qué meta no alcanzaron y qué habría hecho falta para alcanzarla?</li>
          <li>¿Qué oportunidad descartaron y por qué?</li>
          <li>¿Qué número tuvieron que sacar del instrumento por no poder trazarlo hasta el archivo?</li>
          <li>Vuelvan a las hipótesis del Ejercicio 3: ¿cuál se sostuvo y cuál no?</li>
          <li>¿Qué dato les hubiera cambiado el plan y no estaba en el archivo?</li>
        </ol>

        <div className={baseStyles.formGrid}>
          {checkpointQuestions.map((field) => {
            const value =
              field.id === "checkpoint_1"
                ? checkpoint1
                : field.id === "checkpoint_2"
                  ? checkpoint2
                  : field.id === "checkpoint_3"
                    ? checkpoint3
                    : field.id === "checkpoint_4"
                      ? checkpoint4
                      : field.id === "checkpoint_5"
                        ? checkpoint5
                        : checkpoint6;
            const setter =
              field.id === "checkpoint_1"
                ? setCheckpoint1
                : field.id === "checkpoint_2"
                  ? setCheckpoint2
                  : field.id === "checkpoint_3"
                    ? setCheckpoint3
                    : field.id === "checkpoint_4"
                      ? setCheckpoint4
                      : field.id === "checkpoint_5"
                        ? setCheckpoint5
                        : setCheckpoint6;
            return (
              <div
                className={`${baseStyles.formField} ${errors.has(field.id) ? baseStyles.formFieldError : ""}`}
                key={field.id}
              >
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
                {errors.has(field.id) ? <span className={baseStyles.errorText}>Este campo es obligatorio.</span> : null}
              </div>
            );
          })}
        </div>

        {messages.length > 0 ? (
          <div className={baseStyles.messageList} ref={successRef}>
            {messages.map((message, index) => (
              <div
                className={`${baseStyles.message} ${
                  message.type === "error" ? baseStyles.messageError : message.type === "success" ? baseStyles.messageSuccess : ""
                }`}
                key={`${message.type}-${index}`}
              >
                {message.text}
              </div>
            ))}
          </div>
        ) : null}

        <div className={baseStyles.formActions}>
          <button className={`${baseStyles.btn} ${baseStyles.btnSecondary}`} disabled={loading} onClick={handleSaveDraft} type="button">
            <Save size={17} /> Guardar borrador
          </button>
          <button className={baseStyles.btn} disabled={loading} onClick={handleSubmit} type="button">
            <Send size={17} /> Enviar checkpoint
          </button>
        </div>
        <div className={baseStyles.formNote}>Modo local: el borrador y el checkpoint se guardan en este dispositivo.</div>
      </section>

      <div className={baseStyles.footerNote}>NEXUS Retail Labs · Laboratorio 2 · Ejercicio 4</div>
    </AppShell>
  );
}
