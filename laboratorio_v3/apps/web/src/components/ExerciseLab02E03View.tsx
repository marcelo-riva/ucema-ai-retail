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

const workbookFileName = LAB02_EXERCISE_WORKBOOKS["lab02-ex03"] ?? "NEXUS_CASO_INTEGRADOR.xlsx";

type Message = {
  type: "success" | "error" | "info";
  text: string;
};

const checkpointQuestions = [
  {
    id: "checkpoint_1",
    label: "1. Las hipótesis de la Parte A, tal como las escribieron."
  },
  {
    id: "checkpoint_2",
    label: "2. Los hallazgos: qué encontraron · sobre qué eje · en qué nivel quedó · cuánto vale y con qué supuesto."
  },
  {
    id: "checkpoint_3",
    label: "3. ¿Qué hallazgo se les cayó o quedó en duda al mirar otro eje?"
  },
  {
    id: "checkpoint_4",
    label: "4. ¿Qué hipótesis de la Parte A no encontraron por ningún lado?"
  },
  {
    id: "checkpoint_5",
    label: "5. ¿Qué se quedaron con ganas de mirar?"
  }
] as const;

export function ExerciseLab02E03View({
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

  const [hipotesis, setHipotesis] = useState("");
  const [ejeHallazgos, setEjeHallazgos] = useState("");
  const [pruebaCruzada, setPruebaCruzada] = useState("");
  const [hallazgoCierre, setHallazgoCierre] = useState("");
  const [checkpoint1, setCheckpoint1] = useState("");
  const [checkpoint2, setCheckpoint2] = useState("");
  const [checkpoint3, setCheckpoint3] = useState("");
  const [checkpoint4, setCheckpoint4] = useState("");
  const [checkpoint5, setCheckpoint5] = useState("");

  const fieldValues = useMemo(
    () => ({
      ej03_hipotesis_iniciales: hipotesis,
      ej03_eje_hallazgos: ejeHallazgos,
      ej03_prueba_cruzada: pruebaCruzada,
      ej03_hallazgo_cierre: hallazgoCierre,
      ej03_checkpoint_1: checkpoint1,
      ej03_checkpoint_2: checkpoint2,
      ej03_checkpoint_3: checkpoint3,
      ej03_checkpoint_4: checkpoint4,
      ej03_checkpoint_5: checkpoint5
    }),
    [
      hipotesis,
      ejeHallazgos,
      pruebaCruzada,
      hallazgoCierre,
      checkpoint1,
      checkpoint2,
      checkpoint3,
      checkpoint4,
      checkpoint5
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
          exerciseId: "lab02-ex03",
          exerciseVersion: 1
        });
        if (cancelled) return;

        if (submission) {
          setCheckpointStatus(submission.status);
          setSubmittedAt(submission.submittedAt ?? undefined);

          const responses = submission.responsesJson as Record<string, string>;
          setHipotesis(responses.ej03_hipotesis_iniciales ?? "");
          setEjeHallazgos(responses.ej03_eje_hallazgos ?? "");
          setPruebaCruzada(responses.ej03_prueba_cruzada ?? "");
          setHallazgoCierre(responses.ej03_hallazgo_cierre ?? "");
          setCheckpoint1(responses.ej03_checkpoint_1 ?? "");
          setCheckpoint2(responses.ej03_checkpoint_2 ?? "");
          setCheckpoint3(responses.ej03_checkpoint_3 ?? "");
          setCheckpoint4(responses.ej03_checkpoint_4 ?? "");
          setCheckpoint5(responses.ej03_checkpoint_5 ?? "");
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
        exerciseId: "lab02-ex03",
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
    if (!hipotesis.trim()) missing.push("Hipótesis iniciales");
    if (!ejeHallazgos.trim()) missing.push("Eje elegido y hallazgos");
    if (!pruebaCruzada.trim()) missing.push("Prueba cruzada");
    if (!hallazgoCierre.trim()) missing.push("Hallazgo más grande y eje de riesgo");
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
        exerciseId: "lab02-ex03",
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
      setErrors(
        new Set([
          "ej03_hipotesis_iniciales",
          "ej03_eje_hallazgos",
          "ej03_prueba_cruzada",
          "ej03_hallazgo_cierre",
          ...checkpointQuestions.map((f) => f.id)
        ])
      );
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
        exerciseId: "lab02-ex03",
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
        <div className={baseStyles.heroEyebrow}>Diagnóstico Multieje</div>
        <h1>Ejercicio 3: Integrador · Parte 1 — Diagnóstico</h1>
        <p className={baseStyles.heroLead}>
          Nexus tiene un problema de rentabilidad y un problema de capital al mismo tiempo, y 300 SKUs, 40.000 clientes y 24 meses de resultado para entenderlos. Van a apostar primero, analizar un eje después, y descubrir al final que ningún eje se sostiene solo.
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
            <div className={baseStyles.metaCardValue}>~60 min</div>
          </div>
        </div>

        <div className={baseStyles.workbookBox}>
          <div>
            <div className={baseStyles.workbookTitle}>📎 Workbook del ejercicio</div>
            <div className={baseStyles.workbookDesc}>
              Toda la información disponible sobre Nexus: resultado mensual, 300 SKUs, demanda mes a mes, panel de 200 clientes y las restricciones del caso. No tiene fórmulas: margen, días de inventario, índice de precio y valor del cliente hay que construirlos.
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
          <div className={baseStyles.noticeTitle}>Antes de arrancar: carguen el workbook en la conversación con su IA</div>
          <p>
            Descarguen <strong>NEXUS_CASO_INTEGRADOR.xlsx</strong> y súbanlo completo como archivo al inicio de la conversación con su IA (Copilot, ChatGPT, Claude, etc.), antes del primer prompt.
          </p>
          <p>
            <strong>Este ejercicio no trae prompts.</strong> El método es de ustedes: qué le piden a la IA, en qué orden, y cómo verifican lo que devuelve es parte de lo que se evalúa.
          </p>
        </div>
      </div>

      {/* PISO CONCEPTUAL */}
      <section className={baseStyles.section}>
        <div className={baseStyles.sectionHead}>
          <div className={baseStyles.stepMark}>i</div>
          <div>
            <div className={baseStyles.sectionTitle}>Piso conceptual</div>
            <div className={baseStyles.sectionSub}>Antes de tocar la base</div>
          </div>
          <div className={baseStyles.timer}>⏱ ~3 min</div>
        </div>
        <div className={baseStyles.tensionGrid}>
          <div className={baseStyles.tensionCard}>
            <h3>Un número sin supuesto es una opinión con decimales</h3>
            <p>
              La IA va a devolver cifras precisas y bien redactadas para cualquier cosa que le pidan. Lo que convierte una cifra en un hallazgo es la frase que dice de dónde sale y qué está asumiendo.
            </p>
          </div>
          <div className={baseStyles.tensionCard}>
            <h3>El negocio no está organizado por áreas, aunque la empresa sí lo esté</h3>
            <p>
              Comercial mira precio, supply mira stock, marketing mira clientes. Cada uno con razón y con su número. Los efectos de una decisión aparecen en el eje de al lado, donde nadie está mirando.
            </p>
          </div>
          <div className={`${baseStyles.tensionCard} ${baseStyles.tensionCardDesafio}`}>
            <h3>🎯 El desafío — pide el Comité</h3>
            <p>
              Un diagnóstico de dónde está el problema y dónde está la oportunidad. No un plan todavía: el plan es el Ejercicio 4. Hoy hay que encontrar y cuantificar. Tres hallazgos con número y con supuesto valen más que quince oportunidades enunciadas.
            </p>
          </div>
        </div>
      </section>

      {/* CONTEXTO */}
      <section className={baseStyles.section}>
        <div className={baseStyles.sectionHead}>
          <div className={baseStyles.stepMark}>📊</div>
          <div>
            <div className={baseStyles.sectionTitle}>Contexto — la situación de Nexus</div>
            <div className={baseStyles.sectionSub}>Dato dado, no hay que calcularlo</div>
          </div>
        </div>
        <div className={baseStyles.bodyTxt}>
          <p>
            Cadena de farmacia y cuidado personal: 34 locales en AMBA, venta online propia, 300 SKUs activos, unos 40.000 clientes identificados por el programa de fidelidad.
          </p>
        </div>
        <div className={baseStyles.stockGrid}>
          <div className={baseStyles.stockCard}>
            <div className={baseStyles.cardId}>Facturación anual</div>
            <div className={baseStyles.name}>ARS 10.900 M</div>
          </div>
          <div className={baseStyles.stockCard}>
            <div className={baseStyles.cardId}>EBITDA últimos 12m</div>
            <div className={baseStyles.name}>ARS 468 M · 4,3%</div>
          </div>
          <div className={baseStyles.stockCard}>
            <div className={baseStyles.cardId}>EBITDA proyectado 12m</div>
            <div className={baseStyles.name}>ARS 396 M · 3,6%</div>
          </div>
          <div className={baseStyles.stockCard}>
            <div className={baseStyles.cardId}>Inventario inmovilizado</div>
            <div className={baseStyles.name}>ARS 1.637 M · 76 días</div>
          </div>
          <div className={baseStyles.stockCard}>
            <div className={baseStyles.cardId}>Caja proyectada</div>
            <div className={baseStyles.name}>380 → 269 M</div>
          </div>
          <div className={baseStyles.stockCard}>
            <div className={baseStyles.cardId}>Inversión aprobada</div>
            <div className={baseStyles.name}>ARS 600 M · sin deuda</div>
          </div>
        </div>
        <div className={styles.calloutSoft}>
          <strong>📈 Panel de apertura</strong> — cuatro panorámicas del negocio: el resultado mes a mes, las ocho categorías del surtido, el inventario y los segmentos de clientes. Se navega con las flechas o las teclas 1 a 4.
          <br />
          <em>Muestran dónde está parada la plata. No dicen qué hacer con ella.</em>
          <div style={{ marginTop: 10 }}>
            <a
              className={`${baseStyles.btn} ${baseStyles.btnSecondary}`}
              href="/assets/NEXUS_PANEL_APERTURA.html"
              rel="noopener noreferrer"
              target="_blank"
            >
              Abrir el panel
            </a>
          </div>
        </div>
      </section>

      {/* PARTE A */}
      <section className={baseStyles.section}>
        <div className={baseStyles.sectionHead}>
          <div className={baseStyles.stepMark}>A</div>
          <div>
            <div className={baseStyles.sectionTitle}>Apostar antes de mirar</div>
            <div className={baseStyles.sectionSub}>Todavía sin abrir las hojas de datos</div>
          </div>
          <div className={baseStyles.timer}>⏱ ~12 min</div>
        </div>
        <div className={baseStyles.bodyTxt}>
          <p>
            Con el caso, las restricciones y el panel de apertura, el grupo escribe tres o cuatro hipótesis. No son adivinanzas: hay suficiente en pantalla para fundamentar cada una.
          </p>
        </div>
        <div className={styles.questionBox}>
          <div className={styles.questionLabel}>Las preguntas a responder</div>
          <ul>
            <li>¿Dónde creemos que se está yendo la rentabilidad?</li>
            <li>¿Dónde creemos que está la plata que se puede recuperar?</li>
            <li>¿Qué esperamos encontrar cuando abramos el detalle?</li>
          </ul>
        </div>
        <div className={baseStyles.bodyTxt}>
          <p>Guárdenlas: al final del ejercicio se vuelven a leer. La distancia entre lo que apostaron y lo que encontraron es parte de lo que se evalúa.</p>
        </div>
        <div
          className={`${styles.answerBox} ${errors.has("ej03_hipotesis_iniciales") ? baseStyles.formFieldError : ""}`}
        >
          <div className={styles.answerLabel}>Nuestras hipótesis iniciales</div>
          <textarea
            onChange={(event) => {
              setHipotesis(event.target.value);
              setErrors((current) => {
                const next = new Set(current);
                next.delete("ej03_hipotesis_iniciales");
                return next;
              });
            }}
            placeholder="3 o 4, una por línea, con el fundamento en media línea"
            value={hipotesis}
          />
        </div>
      </section>

      {/* PARTE B */}
      <section className={baseStyles.section}>
        <div className={baseStyles.sectionHead}>
          <div className={baseStyles.stepMark}>B</div>
          <div>
            <div className={baseStyles.sectionTitle}>Un eje por vez</div>
            <div className={baseStyles.sectionSub}>Eligen uno y lo trabajan hasta el fondo</div>
          </div>
          <div className={baseStyles.timer}>⏱ ~25 min</div>
        </div>
        <div className={baseStyles.bodyTxt}>
          <p>
            Ahora sí abren el archivo. Con una regla: <strong>eligen un solo eje y lo trabajan hasta el fondo.</strong> Uno. No cuatro superficiales.
          </p>
        </div>
        <div className={`${styles.axisGrid} ${styles.cols2}`}>
          <div className={styles.axisCard}>
            <div className={styles.axisNum}>Eje 1</div>
            <h3>Rentabilidad del surtido y precio</h3>
            <p>
              Qué deja cada producto y cuánto pesa. A qué distancia estamos del precio de mercado y en qué productos. Dónde se puede mover precio y dónde no. Qué asume el cálculo sobre la reacción de la demanda si se sube. Qué SKUs no justifican el espacio que ocupan.
            </p>
          </div>
          <div className={styles.axisCard}>
            <div className={styles.axisNum}>Eje 2</div>
            <h3>Inventario y abastecimiento</h3>
            <p>
              Cuántos días de mercadería hay de cada cosa y cuánto capital representan. Qué tiene stock para meses y qué se queda sin. Cuánto capital se libera bajando la cobertura y hasta dónde se puede bajar sin riesgo. Qué impone el proveedor sobre lo que se puede hacer.
            </p>
          </div>
          <div className={styles.axisCard}>
            <div className={styles.axisNum}>Eje 3</div>
            <h3>Resultado económico</h3>
            <p>
              Por qué el EBITDA cae de 468 a 396 si la facturación crece. Qué línea de costos crece más rápido que las ventas. Cómo se comporta el año mes a mes y en qué meses se hace la diferencia. Cuándo se tensiona la caja.
            </p>
          </div>
          <div className={styles.axisCard}>
            <div className={styles.axisNum}>Eje 4</div>
            <h3>Clientes</h3>
            <p>
              Cuánto vale cada segmento y de qué está hecho ese valor. Qué compra cada tipo de cliente y qué no compra. Qué separa a un cliente que se queda de uno que se está yendo. Cuánta facturación depende de cuántos clientes.
            </p>
          </div>
        </div>

        <div className={baseStyles.bodyTxt}>
          <h3 style={{ marginTop: 22, fontSize: 15 }}>La pregunta a responder</h3>
          <p>
            <strong>¿Cuánto puede mejorar Nexus trabajando solamente sobre este eje?</strong> Se responde en tres niveles. Empiecen por el primero y sigan hasta donde el tiempo les dé.
          </p>
        </div>
        <div className={baseStyles.ladder}>
          <div className={baseStyles.ladderStep}>
            <div className={baseStyles.ladderStepNumber}>Nivel 1</div>
            <div className={baseStyles.ladderStepTitle}>Localizar</div>
            <div className={baseStyles.ladderStepDesc}>
              Dónde está la oportunidad, sobre qué productos, meses o clientes concretos. <em>&quot;22 SKUs con más de un año de cobertura, concentrados en dos subgrupos.&quot;</em>
            </div>
          </div>
          <div className={baseStyles.ladderArrow}>→</div>
          <div className={baseStyles.ladderStep}>
            <div className={baseStyles.ladderStepNumber}>Nivel 2</div>
            <div className={baseStyles.ladderStepTitle}>Cuantificar</div>
            <div className={baseStyles.ladderStepDesc}>
              Cuánto vale en ARS millones y con qué supuesto. <em>&quot;~75 M de caja, asumiendo que se recupera el 70% del costo del stock.&quot;</em>
            </div>
          </div>
          <div className={baseStyles.ladderArrow}>→</div>
          <div className={baseStyles.ladderStep}>
            <div className={baseStyles.ladderStepNumber}>Nivel 3</div>
            <div className={baseStyles.ladderStepTitle}>Poner a prueba</div>
            <div className={baseStyles.ladderStepDesc}>
              Piso y techo si el supuesto se cumple a medias, y qué restricción del caso impide capturarla entera. <em>&quot;Entre 45 y 75 M; el tope de SKUs discontinuables limita el alcance.&quot;</em>
            </div>
          </div>
        </div>
        <div className={styles.calloutSoft}>
          Casi ningún grupo va a llegar al nivel 3 en los tres hallazgos. Está bien: <strong>un hallazgo en nivel 3 vale más que tres en nivel 1.</strong> Para el nivel 3 conviene abrir la hoja de restricciones — hay topes de cuántos productos se pueden discontinuar, cuánto se puede mover un precio y sobre cuántos, y cuánto presupuesto de campaña hay.
        </div>
        <div className={baseStyles.bodyTxt}>
          <p style={{ marginTop: 12 }}>Elegir el eje es una decisión, no un trámite. Dejen anotado por qué eligieron ese.</p>
        </div>
        <div
          className={`${styles.answerBox} ${errors.has("ej03_eje_hallazgos") ? baseStyles.formFieldError : ""}`}
        >
          <div className={styles.answerLabel}>Eje elegido, por qué, y nuestros hallazgos</div>
          <textarea
            onChange={(event) => {
              setEjeHallazgos(event.target.value);
              setErrors((current) => {
                const next = new Set(current);
                next.delete("ej03_eje_hallazgos");
                return next;
              });
            }}
            placeholder="Un hallazgo por línea: qué encontramos · nivel alcanzado · cuánto vale · qué supuesto lo sostiene"
            value={ejeHallazgos}
          />
        </div>
      </section>

      {/* PARTE C */}
      <section className={baseStyles.section}>
        <div className={baseStyles.sectionHead}>
          <div className={baseStyles.stepMark}>C</div>
          <div>
            <div className={baseStyles.sectionTitle}>Dos ejes a la vez</div>
            <div className={baseStyles.sectionSub}>Los efectos no aparecen donde se tomó la decisión</div>
          </div>
          <div className={baseStyles.timer}>⏱ ~15 min</div>
        </div>
        <div className={baseStyles.bodyTxt}>
          <p>
            Todo lo anterior es cómo decide una empresa organizada por áreas. Hay cuatro maneras típicas en que un eje interfiere con otro. <strong>Busquen al menos una en su análisis.</strong>
          </p>
        </div>
        <div className={styles.tableWrap}>
          <table className={baseStyles.dataTable}>
            <thead>
              <tr>
                <th>Mecanismo</th>
                <th>Qué pasa</th>
                <th>La pregunta que lo destapa</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={baseStyles.name}>
                  <strong>Consecuencia cruzada</strong>
                </td>
                <td>La decisión mejora mi eje y empeora otro</td>
                <td>Podar surtido mejora el margen, ¿pero qué pasa con quien compraba eso?</td>
              </tr>
              <tr>
                <td className={baseStyles.name}>
                  <strong>Indicador contaminado</strong>
                </td>
                <td>El número parece medir mi eje pero está afectado por otro</td>
                <td>Si un producto no estuvo disponible, ¿qué mide su venta histórica? ¿Y qué proyecta un forecast construido sobre esa historia?</td>
              </tr>
              <tr>
                <td className={baseStyles.name}>
                  <strong>Promedio que tapa</strong>
                </td>
                <td>Mi indicador es un promedio anual y el fenómeno es de algunos meses</td>
                <td>¿Cuánto de lo que parece excedente es preparación para un pico?</td>
              </tr>
              <tr>
                <td className={baseStyles.name}>
                  <strong>Ranking que se da vuelta</strong>
                </td>
                <td>Ordené por una variable y el orden cambia al agregar una segunda</td>
                <td>¿Quién queda primero si ordeno por ticket, y quién si ordeno por lo que deja en el año?</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.calloutRule}>
          <strong>Tomen su hallazgo más grande y sométanlo a esto.</strong> Si sobrevive, queda más fuerte que antes. Si no sobrevive, ese es el resultado más valioso del ejercicio.
        </div>
        <div
          className={`${styles.answerBox} ${errors.has("ej03_prueba_cruzada") ? baseStyles.formFieldError : ""}`}
        >
          <div className={styles.answerLabel}>Qué pusimos a prueba y qué encontramos</div>
          <textarea
            onChange={(event) => {
              setPruebaCruzada(event.target.value);
              setErrors((current) => {
                const next = new Set(current);
                next.delete("ej03_prueba_cruzada");
                return next;
              });
            }}
            placeholder="Qué hallazgo · con qué eje lo cruzamos · qué pasó"
            value={pruebaCruzada}
          />
        </div>
      </section>

      {/* PARTE D */}
      <section className={baseStyles.section}>
        <div className={baseStyles.sectionHead}>
          <div className={baseStyles.stepMark}>D</div>
          <div>
            <div className={baseStyles.sectionTitle}>Cerrar y guardar</div>
            <div className={baseStyles.sectionSub}>La ficha es el punto de partida del Ejercicio 4</div>
          </div>
          <div className={baseStyles.timer}>⏱ ~5 min</div>
        </div>
        <div className={baseStyles.bodyTxt}>
          <p>Antes de terminar, el grupo deja escrita una sola línea:</p>
        </div>
        <div className={styles.questionBox}>
          <div className={styles.questionLabel}>La línea de cierre</div>
          <p style={{ margin: 0 }}>
            <strong>¿Cuál es nuestro hallazgo más grande, y qué eje podría darlo vuelta?</strong>
          </p>
        </div>
        <div className={baseStyles.bodyTxt}>
          <p>Si ya lo cruzaron, anoten qué encontraron. Si no llegaron, anoten de qué sospechan y por qué. Las dos respuestas valen.</p>
        </div>
        <div
          className={`${styles.answerBox} ${errors.has("ej03_hallazgo_cierre") ? baseStyles.formFieldError : ""}`}
        >
          <div className={styles.answerLabel}>Nuestro hallazgo más grande y su eje de riesgo</div>
          <textarea
            onChange={(event) => {
              setHallazgoCierre(event.target.value);
              setErrors((current) => {
                const next = new Set(current);
                next.delete("ej03_hallazgo_cierre");
                return next;
              });
            }}
            placeholder="Una línea"
            value={hallazgoCierre}
          />
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
          <li>Las hipótesis de la Parte A, tal como las escribieron.</li>
          <li>Los hallazgos: qué encontraron · sobre qué eje · en qué nivel quedó · cuánto vale y con qué supuesto.</li>
          <li>¿Qué hallazgo se les cayó o quedó en duda al mirar otro eje?</li>
          <li>¿Qué hipótesis de la Parte A no encontraron por ningún lado?</li>
          <li>¿Qué se quedaron con ganas de mirar?</li>
        </ol>
        <div className={styles.calloutSoft} style={{ marginTop: 16 }}>
          Guarden esta ficha también por fuera de la plataforma: el Ejercicio 4 arranca con otra conversación de IA y sin contexto.
        </div>

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
                      : checkpoint5;
            const setter =
              field.id === "checkpoint_1"
                ? setCheckpoint1
                : field.id === "checkpoint_2"
                  ? setCheckpoint2
                  : field.id === "checkpoint_3"
                    ? setCheckpoint3
                    : field.id === "checkpoint_4"
                      ? setCheckpoint4
                      : setCheckpoint5;
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

      <div className={baseStyles.noticeBox}>
        <div className={baseStyles.noticeIcon}>⚠️</div>
        <div>
          <div className={baseStyles.noticeTitle}>Una advertencia y un permiso</div>
          <p>
            Pedirle a la IA <em>&quot;analizá todo y decime qué optimizo&quot;</em> devuelve una lista de oportunidades plausibles y bien redactadas. Varias de las más grandes no resisten un segundo cruce de datos.
          </p>
          <p style={{ margin: 0 }}>Y no hace falta terminar: un diagnóstico incompleto pero cruzado vale más que uno completo de un solo eje.</p>
        </div>
      </div>

      <div className={baseStyles.footerNote}>NEXUS Retail Labs · Laboratorio 2 · Ejercicio 3</div>
    </AppShell>
  );
}
