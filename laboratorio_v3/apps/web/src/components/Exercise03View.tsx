"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, Save, Send } from "lucide-react";
import { AppShell } from "./AppShell";
import { getLabRepository } from "../lib/repositories/labRepository";
import { LAB01_EXERCISE_WORKBOOKS } from "../lib/constants";
import type { Group } from "../types/lab";
import type { Session } from "../lib/repositories/labRepository.types";
import styles from "./Exercise03View.module.css";

const workbookFileName = LAB01_EXERCISE_WORKBOOKS["ex-03"];

const promptDetection = `Sos un analista de demanda para una cadena de retail de salud y belleza en Argentina.
Tenés acceso a las hojas 03_SEÑALES_EXTERNAS y 04_DATASET_VENTAS del workbook.

Tu tarea:
1. Para cada uno de los 10 productos en 04_DATASET_VENTAS, describí su patrón:
   estacionalidad (si existe), tendencia (creciente/decreciente/estable) y
   cualquier anomalía — pico o caída que no siga el patrón general.
2. Correlacioná las tres series de 03_SEÑALES_EXTERNAS (Búsqueda Roja, Azul,
   Verde) con los productos del dataset. Decime a qué producto corresponde
   cada una y qué evidencia numérica lo sostiene.
3. Correlacioná la serie de temperatura con los productos sensibles al clima.
   Señalá específicamente qué pasa en los meses de las dos olas de calor
   fuera de temporada.
4. Cruzá el log de movimientos de competencia con el dataset: ¿qué producto
   se ve afectado por cada evento, y en qué dirección?
5. Cerrá con los dos hallazgos más sorprendentes — patrones que no eran
   obvios mirando solo el total de ventas por producto.

No inventes relaciones que los datos no sostienen. Marcá con ⚠ cualquier
correlación que te parezca débil o casual.`;

const promptForecast = `Sos un sistema de forecast comercial para una cadena de retail de salud y
belleza en Argentina. Tenés:
— Serie de ventas mensuales de [producto] (hoja 04_DATASET_VENTAS)
— Stock disponible actual: [X unidades] (hoja 05_STOCK_Y_FORECAST)
— Señales de contexto: temperatura, tendencia de búsquedas, movimientos de
  precio de competencia (hoja 03_SEÑALES_EXTERNAS)

Tu tarea:
1. Detectá estacionalidad, tendencia y anomalías en la serie histórica.
2. Generá un forecast semanal para los próximos 90 días (13 semanas), con
   nivel de confianza para cada semana.
3. Con el stock actual, proyectá semana a semana cuándo se produce un
   quiebre si no hay reposición.
4. Indicá qué señales externas moverían este forecast hacia arriba o hacia
   abajo, y en qué magnitud aproximada.
5. Documentá el método exacto que usaste — fórmulas, parámetros, supuestos —
   de forma que el cálculo sea reproducible por otra persona con los mismos
   datos. No me des solo el número: mostrame el camino.
6. Cerrá con una alerta ejecutiva de una línea: ¿cuál es el mayor riesgo de
   este producto en los próximos 90 días?`;

const promptPerturbation = `Al forecast que ya construiste para [producto] en la Parte D, sumale este dato:

El equipo tomó una decisión de precio conocida — no es una señal de mercado:
- Decisión: [Liquidación / Premium]
- price_move_pct: [-20% / +10%]
- elasticity_proxy: [0.8 / 0.4]
- Efecto de volumen esperado: −elasticity_proxy × price_move_pct

Tratá este movimiento como una perturbación estructural conocida del sistema,
separada de la tendencia y la estacionalidad histórica — no la confundas con
un cambio de demanda espontáneo del mercado.

Recalculá el forecast semanal a 90 días incorporando este efecto desde la
semana 1, y explicá cómo cambia respecto del forecast original de la Parte D.`;

const searchRojaHeights = [
  35, 31, 19, 10, 5, 4, 4, 5, 8, 13, 23, 28, 100, 94, 63, 31, 2, 2, 2, 2, 8, 13, 22, 31, 34, 34, 22, 11, 6, 4, 4, 5, 8, 13, 23, 32
];

const searchAzulHeights = [
  86, 70, 42, 18, 9, 8, 8, 11, 16, 32, 56, 78, 96, 83, 44, 19, 10, 8, 8, 11, 20, 36, 59, 89, 100, 91, 53, 20, 10, 9, 8, 13, 22, 41, 69, 99
];

const searchVerdeHeights = [
  26, 26, 38, 59, 77, 92, 87, 77, 52, 32, 25, 27, 25, 25, 39, 62, 82, 100, 94, 80, 53, 38, 26, 24, 28, 26, 40, 65, 79, 93, 87, 77, 54, 36, 27, 25
];

const temperaturaHeights = [
  82, 87, 75, 65, 52, 40, 39, 44, 52, 61, 73, 84, 93, 85, 78, 62, 71, 43, 30, 39, 45, 56, 71, 86, 89, 87, 80, 68, 50, 45, 59, 41, 48, 58, 70, 82
];

const forecastTableRows = [
  ["Repelente de insectos", "+45% vs. año anterior", "Ajustado", "Semana 6", "🔴 Riesgo de quiebre"],
  ["Protector solar FPS 50", "+30% vs. año anterior", "Amplio", "Sin quiebre", "✅ OK"],
  ["Vitamina C efervescente", "Estable", "—", "Sin quiebre", "✅ OK"],
  ["…", "…", "…", "…", "…"],
  ["Protector solar FPS 30", "−20% vs. año anterior", "Sobrestock", "Sin quiebre", "⚠️ Riesgo de sobrestock"]
];

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
        setTimeout(() => setCopied(false), 2000);
      }}
      type="button"
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  );
}

function BarChart({ heights, variant }: { heights: number[]; variant: "roja" | "azul" | "verde" | "temp" }) {
  const chartClass =
    variant === "roja"
      ? styles.barChartRoja
      : variant === "azul"
        ? styles.barChartAzul
        : variant === "verde"
          ? styles.barChartVerde
          : styles.barChartTemp;

  return (
    <div className={`${styles.barChart} ${chartClass}`}>
      {heights.map((height, index) => (
        <div className={styles.bar} key={index} style={{ height: `${height}%` }} />
      ))}
    </div>
  );
}

export function Exercise03View({
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

  const [signalSurprise, setSignalSurprise] = useState("");
  const [productUncertainty, setProductUncertainty] = useState("");
  const [forecastProcess, setForecastProcess] = useState("");

  const fieldValues = {
    signal_surprise: signalSurprise,
    product_uncertainty: productUncertainty,
    forecast_process: forecastProcess
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
          exerciseId: "ex-03",
          exerciseVersion: 1
        });
        if (cancelled) return;

        if (submission) {
          setCheckpointStatus(submission.status);
          setSubmittedAt(submission.submittedAt ?? undefined);

          const responses = submission.responsesJson as Record<string, string>;
          setSignalSurprise(responses.signal_surprise ?? "");
          setProductUncertainty(responses.product_uncertainty ?? "");
          setForecastProcess(responses.forecast_process ?? "");
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

  function validate(): string[] {
    const missing: string[] = [];
    if (!signalSurprise.trim()) missing.push("Señal externa que te sorprendió");
    if (!productUncertainty.trim()) missing.push("Producto con mayor incertidumbre");
    if (!forecastProcess.trim()) missing.push("Proceso de forecast en tu empresa");
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
        exerciseId: "ex-03",
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
      setErrors(new Set(["signal_surprise", "product_uncertainty", "forecast_process"]));
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
        exerciseId: "ex-03",
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
        <h1>Ejercicio 3: Forecast Engine</h1>
        <p className={styles.heroLead}>
          El forecast no arranca en un modelo: arranca en las señales que decidís mirar. En este ejercicio la IA detecta patrones y construye un forecast reproducible; el equipo decide qué señales pesan y quién es dueño de esa decisión.
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
            <div className={styles.metaCardValue}>NEXUS_RETAIL_LAB01_EJ03</div>
          </div>
          <div className={styles.metaCard}>
            <div className={styles.metaCardKey}>Tiempo estimado</div>
            <div className={styles.metaCardValue}>~40 min</div>
          </div>
        </div>

        <div className={styles.workbookBox}>
          <div>
            <div className={styles.workbookTitle}>Workbook del ejercicio</div>
            <div className={styles.workbookDesc}>
              Este archivo es el punto de partida: señales externas, dataset de 10 productos y la hoja de trabajo para el forecast reproducible. Trabajalo con tu IA personal y guardá la síntesis en la plataforma.
            </div>
          </div>
          <a className={styles.btn} href={`/templates/${workbookFileName}`} download>
            Descargar workbook
          </a>
        </div>

        <div className={styles.chain}>
          <div className={styles.chainStep}>
            Negocio
            <br />
            Ejercicio 0
          </div>
          <span className={styles.chainArrow}>→</span>
          <div className={styles.chainStep}>
            Familias / Portfolio
            <br />
            Ejercicio 1
          </div>
          <span className={styles.chainArrow}>→</span>
          <div className={styles.chainStep}>
            Pricing
            <br />
            Ejercicio 2
          </div>
          <span className={styles.chainArrow}>→</span>
          <div className={`${styles.chainStep} ${styles.chainStepHere}`}>
            Forecast
            <br />
            Ejercicio 3 · acá
          </div>
          <span className={styles.chainArrow}>→</span>
          <div className={styles.chainStep}>
            Inventario
            <br />
            Ejercicio 4
          </div>
        </div>
      </div>

      <div className={styles.noticeBox}>
        <div className={styles.noticeIcon}>📎</div>
        <div>
          <div className={styles.noticeTitle}>Antes de arrancar: este workbook es nuevo</div>
          <p>
            No es continuación del workbook de Pricing ni un recorte del portfolio de 8.000 SKUs. Es un archivo aparte, armado especialmente para este ejercicio con 10 productos elegidos a propósito — pocos, para que puedan ver los patrones a simple vista y con su IA, sin perderse en el volumen. Descarguen este workbook aunque ya hayan trabajado con el anterior.
          </p>
        </div>
      </div>

      {/* PARTE A */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.stepMark}>A</div>
          <div>
            <div className={styles.sectionTitle}>El problema y las señales</div>
            <div className={styles.sectionSub}>Reencuadre — antes de ver el dataset de ventas</div>
          </div>
          <div className={styles.timer}>⏱ ~8 min</div>
        </div>

        <p className={styles.body}>
          Un forecast basado únicamente en el histórico de ventas describe el pasado. Un forecast útil incorpora señales que todavía no aparecen en esas ventas — búsquedas, clima, movimientos de la competencia. La IA puede leer esas señales en segundos; el trabajo del equipo es saber cuáles pedirle.
        </p>

        <div className={styles.tensionGrid}>
          <div className={styles.tensionCard}>
            <h4>Histórico vs. señal</h4>
            <p>El histórico te dice qué pasó. La señal te dice qué está por pasar. Ninguna de las dos alcanza sola.</p>
          </div>
          <div className={styles.tensionCard}>
            <h4>Anomalía vs. patrón</h4>
            <p>No todo pico es estacionalidad y no toda caída es tendencia. Separar una cosa de la otra es el primer trabajo del forecast.</p>
          </div>
          <div className={styles.tensionCard}>
            <h4>Confianza vs. reproducibilidad</h4>
            <p>Un número sin método no sirve para decidir. Si no podés repetirlo, no podés confiar en él.</p>
          </div>
        </div>

        <div className={styles.closingNote}>
          <p>
            <b>¿Para qué sirve esto?</b> El método real de forecast con variables externas funciona así: generás una hipótesis de qué señal podría explicar la demanda, y la testeás contra el histórico para confirmar si correlaciona de verdad — se agrega clima, una promoción, lo que sea, y se coteja para atrás. Si correlaciona, se queda; si no, se descarta. Antes de armar el prompt de forecast, practiquen ese primer paso — generar la hipótesis — con estas tres señales.
          </p>
        </div>

        <hr className={styles.divider} />

        <div className={styles.calloutTitle}>Señales externas — sin dataset de ventas todavía</div>
        <p className={styles.body}>
          Las tres series de abajo corresponden a 3 de los 10 productos que van a encontrar en la hoja <b>04_DATASET_VENTAS</b> del workbook. Todavía no sabemos a cuáles — eso lo van a confirmar recién en la Parte C, con su IA. Antes de ver los productos: ¿qué producto de una cadena de salud y belleza esperarías que se mueva con cada señal? Debatan en grupo 2 minutos.
        </p>

        <div className={styles.signalBlock}>
          <div className={styles.signalLabel}>
            <span className={`${styles.dot} ${styles.dotRoja}`} />
            Búsqueda Roja — índice de tendencia de búsqueda (0–100), 36 meses
          </div>
          <BarChart heights={searchRojaHeights} variant="roja" />
          <div className={styles.axisLabels}>
            <span>M01</span>
            <span>M12</span>
            <span>M24</span>
            <span>M36</span>
          </div>
        </div>

        <div className={styles.signalBlock}>
          <div className={styles.signalLabel}>
            <span className={`${styles.dot} ${styles.dotAzul}`} />
            Búsqueda Azul — índice de tendencia de búsqueda (0–100), 36 meses
          </div>
          <BarChart heights={searchAzulHeights} variant="azul" />
          <div className={styles.axisLabels}>
            <span>M01</span>
            <span>M12</span>
            <span>M24</span>
            <span>M36</span>
          </div>
        </div>

        <div className={styles.signalBlock}>
          <div className={styles.signalLabel}>
            <span className={`${styles.dot} ${styles.dotVerde}`} />
            Búsqueda Verde — índice de tendencia de búsqueda (0–100), 36 meses
          </div>
          <BarChart heights={searchVerdeHeights} variant="verde" />
          <div className={styles.axisLabels}>
            <span>M01</span>
            <span>M12</span>
            <span>M24</span>
            <span>M36</span>
          </div>
        </div>

        <div className={styles.signalBlock}>
          <div className={styles.signalLabel}>🌡️ Temperatura promedio mensual — Buenos Aires (°C), 36 meses</div>
          <BarChart heights={temperaturaHeights} variant="temp" />
          <div className={styles.axisLabels}>
            <span>M01</span>
            <span>M12</span>
            <span>M24</span>
            <span>M36</span>
          </div>
          <p className={styles.body} style={{ marginTop: 10, fontSize: 12.5, color: "var(--muted)" }}>
            Hay dos olas de calor fuera de temporada en la serie — identificalas por el salto respecto del mes equivalente de otros años.
          </p>
        </div>

        <div className={styles.calloutTitle} style={{ marginTop: 20 }}>
          Log de movimientos de competencia
        </div>
        <div className={styles.logList}>
          <div className={styles.logItem}>
            <span className={styles.logMonth}>M14</span>
            Rotura de stock generalizada en la competencia para repelentes de insectos.
          </div>
          <div className={styles.logItem}>
            <span className={styles.logMonth}>M20</span>
            Competidor lanza promoción 2x1 en protector solar de menor FPS.
          </div>
          <div className={styles.logItem}>
            <span className={styles.logMonth}>M31</span>
            Competidor baja 20% el precio de lista en una línea de cuidado capilar.
          </div>
        </div>

        <div className={styles.debateBox} style={{ marginTop: 22 }}>
          <div className={styles.debateQuestion}>
            ¿Qué producto del portfolio explica cada señal? Escriban su hipótesis en grupo — la van a confirmar más adelante con el dataset y su IA.
          </div>
        </div>
      </section>

      {/* PARTE B */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.stepMark}>B</div>
          <div>
            <div className={styles.sectionTitle}>Qué es un forecast</div>
            <div className={styles.sectionSub}>El piso conceptual antes de pedírselo a la IA</div>
          </div>
          <div className={styles.timer}>⏱ ~4 min</div>
        </div>

        <p className={styles.body}>
          Un forecast clásico toma el promedio de los períodos anteriores, lo ajusta por estación, y proyecta eso hacia adelante — es básicamente lo que hace un promedio móvil en Excel. Funciona bien cuando el mundo se parece al pasado. El problema es que se mueve lento: cuando la demanda real cambia de rumbo, el forecast clásico tarda varios períodos en darse cuenta, porque está mirando por el espejo retrovisor.
        </p>

        <div className={styles.compareGrid}>
          <div className={`${styles.compareCard} ${styles.compareCardClassic}`}>
            <h4>📉 Forecast clásico (promedio móvil)</h4>
            <p>Promedia lo último que pasó y lo proyecta. Reacciona con rezago ante cambios de tendencia. Es lo que la mayoría aprendimos a hacer a mano, por familia, una vez al mes.</p>
          </div>
          <div className={`${styles.compareCard} ${styles.compareCardAi}`}>
            <h4>📈 Forecast con IA</h4>
            <p>Cruza el histórico con señales en tiempo real — búsquedas, clima, competencia — y ajusta más rápido. No adivina mejor: mira más variables a la vez de las que una persona puede sostener a mano.</p>
          </div>
        </div>

        <div className={styles.calloutTitle} style={{ marginTop: 18 }}>
          La escalera de madurez
        </div>
        <div className={styles.ladder}>
          <div className={styles.ladderStep}>
            <div className={styles.ladderStepNumber}>1</div>
            <div className={styles.ladderStepTitle}>Capitán</div>
            <div className={styles.ladderStepDesc}>Decisión por experiencia e intuición</div>
          </div>
          <span className={styles.ladderArrow}>→</span>
          <div className={styles.ladderStep}>
            <div className={styles.ladderStepNumber}>2</div>
            <div className={styles.ladderStepTitle}>Excel</div>
            <div className={styles.ladderStepDesc}>Datos históricos, análisis manual</div>
          </div>
          <span className={styles.ladderArrow}>→</span>
          <div className={styles.ladderStep}>
            <div className={styles.ladderStepNumber}>3</div>
            <div className={styles.ladderStepTitle}>BI</div>
            <div className={styles.ladderStepDesc}>Reportes y dashboards del pasado</div>
          </div>
          <span className={styles.ladderArrow}>→</span>
          <div className={`${styles.ladderStep} ${styles.ladderStepCurrent}`}>
            <div className={styles.ladderStepNumber}>4</div>
            <div className={styles.ladderStepTitle}>IA</div>
            <div className={styles.ladderStepDesc}>Predicción en tiempo real, acá estamos</div>
          </div>
          <span className={styles.ladderArrow}>→</span>
          <div className={styles.ladderStep}>
            <div className={styles.ladderStepNumber}>5</div>
            <div className={styles.ladderStepTitle}>Empresa Aumentada</div>
            <div className={styles.ladderStepDesc}>Decisiones anticipadas</div>
          </div>
        </div>

        <div className={styles.calloutTitle} style={{ marginTop: 18 }}>
          Las señales que explican la demanda
        </div>
        <p className={styles.body}>
          La demanda no depende solo de lo que pasa afuera. También depende de las decisiones que la propia empresa toma — precio, promociones, surtido, stock. Un forecast completo tiene que poder incorporar los dos tipos de señal.
        </p>
        <div className={styles.frameworkGrid}>
          <div className={`${styles.frameworkCol} ${styles.frameworkColControlled}`}>
            <h4>🎛️ Señales que se controlan (internas)</h4>
            <ul>
              <li>
                <b>Precio</b> — impacto directo en volumen y mix
              </li>
              <li>
                <b>Promociones</b> — generan picos o caídas
              </li>
              <li>
                <b>Surtido</b> — disponibilidad y variedad
              </li>
              <li>
                <b>Stock</b> — habilita o limita la venta
              </li>
            </ul>
          </div>
          <div className={`${styles.frameworkCol} ${styles.frameworkColObserved}`}>
            <h4>🌐 Señales que se observan (externas)</h4>
            <ul>
              <li>
                <b>Inflación</b> — poder de compra
              </li>
              <li>
                <b>Clima</b> — patrones de consumo
              </li>
              <li>
                <b>Competencia</b> — precios, surtido, promociones
              </li>
              <li>
                <b>Estacionalidad</b> — fechas, eventos, ciclos
              </li>
            </ul>
          </div>
        </div>
        <p className={styles.body}>
          Este ejercicio arranca por las señales que se observan — son las que hoy, en general, monitoreamos peor. Las señales que se controlan, empezando por el precio, vuelven a aparecer más adelante en la Parte F.
        </p>

        <div className={styles.calloutTitle} style={{ marginTop: 18 }}>
          Por qué esto ya no se hace por familia, una vez al mes
        </div>
        <p className={styles.body}>
          Cuando muchos de ustedes estudiaron esto en la facultad, el forecast se armaba por familia de producto, a mano, con una corrida mensual. Hoy una operación de e-commerce grande puede correr forecast de miles de SKUs por día — no porque haya más gente haciendo cuentas, sino porque el cálculo se automatizó y se puede repetir todas las veces que haga falta.
        </p>
        <div className={styles.scaleStat}>
          <div className={styles.scaleStatItem}>
            <div className={styles.scaleStatNum}>1 / mes</div>
            <div className={styles.scaleStatLbl}>Forecast manual por familia</div>
          </div>
          <div className={styles.scaleStatItem}>
            <div className={styles.scaleStatNum}>→</div>
            <div className={styles.scaleStatLbl} />
          </div>
          <div className={styles.scaleStatItem}>
            <div className={styles.scaleStatNum}>1000s / día</div>
            <div className={styles.scaleStatLbl}>Forecast automatizado por SKU</div>
          </div>
        </div>
        <p className={styles.body}>
          Eso es lo que van a ver en la Parte D de este ejercicio: el mismo forecast que hagan a mano para 3 productos, corrido automáticamente para los 10.000 SKUs del portfolio, todas las semanas.
        </p>
      </section>

      {/* PARTE C */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.stepMark}>C</div>
          <div>
            <div className={styles.sectionTitle}>Detectá lo que el Excel no te dice</div>
            <div className={styles.sectionSub}>Correlación de señales + detección de estacionalidad y anomalías</div>
          </div>
          <div className={styles.timer}>⏱ ~8 min</div>
        </div>

        <p className={styles.body}>
          Ahora sí: el dataset completo está en la hoja <b>04_DATASET_VENTAS</b> del workbook — 10 productos de salud y belleza, con nombre real, entre 12 y 36 meses de historia cada uno. Usá tu IA para confirmar o refutar la hipótesis que armaste en la Parte A.
        </p>

        <div className={styles.promptLabel}>
          <span className={styles.promptName}>Prompt · Detección y correlación</span>
          <span className={styles.copyTag}>Copiar y pegar en tu IA</span>
          <CopyButton text={promptDetection} />
        </div>
        <div className={styles.promptBox}>{promptDetection}</div>

        <div className={styles.calloutTitle} style={{ marginTop: 20 }}>
          Antes de seguir
        </div>
        <div className={styles.checklist}>
          <div className={styles.checkItem}>
            <span className={styles.checkBox} />
            ¿Coincide lo que la IA encontró con la hipótesis del grupo en la Parte A?
          </div>
          <div className={styles.checkItem}>
            <span className={styles.checkBox} />
            ¿Hay algún producto cuyo patrón te sorprendió?
          </div>
          <div className={styles.checkItem}>
            <span className={styles.checkBox} />
            ¿Identificaron los dos meses de ola de calor fuera de temporada?
          </div>
        </div>
      </section>

      {/* PARTE D */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.stepMark}>D</div>
          <div>
            <div className={styles.sectionTitle}>El forecast inteligente y reproducible</div>
            <div className={styles.sectionSub}>Forecast semanal a 90 días, con detección de quiebre de stock</div>
          </div>
          <div className={styles.timer}>⏱ ~10 min</div>
        </div>

        <p className={styles.body}>
          Para tres productos con stock disponible, construyan un forecast semanal a 90 días y la proyección de cuándo se produce un quiebre si no hay reposición. Noventa días con ventana semanal es el horizonte donde un negocio real puede accionar — pedir reposición, ajustar una promoción, avisar a compras. El punto 5 del prompt es el más importante: un forecast que no podés reproducir no sirve para decidir una compra.
        </p>

        <div className={styles.stockGrid}>
          <div className={styles.stockCard}>
            <h4>Repelente de insectos</h4>
            <div className={styles.stockRow}>
              <span>Último mes (M36)</span>
              <b>2.603 u.</b>
            </div>
            <div className={styles.stockRow}>
              <span>Stock actual</span>
              <b>3.200 u.</b>
            </div>
            <span className={`${styles.tag} ${styles.tagTight}`}>Ajustado entrando a temporada alta</span>
          </div>
          <div className={styles.stockCard}>
            <h4>Protector solar FPS 50</h4>
            <div className={styles.stockRow}>
              <span>Último mes (M36)</span>
              <b>2.261 u.</b>
            </div>
            <div className={styles.stockRow}>
              <span>Stock actual</span>
              <b>9.500 u.</b>
            </div>
            <span className={`${styles.tag} ${styles.tagOk}`}>Stock amplio, situación cómoda</span>
          </div>
          <div className={styles.stockCard}>
            <h4>Protector solar FPS 30</h4>
            <div className={styles.stockRow}>
              <span>Último mes (M36)</span>
              <b>942 u.</b>
            </div>
            <div className={styles.stockRow}>
              <span>Stock actual</span>
              <b>7.800 u.</b>
            </div>
            <span className={`${styles.tag} ${styles.tagOver}`}>Sobrestock — tendencia decreciente</span>
          </div>
        </div>

        <div className={styles.promptLabel}>
          <span className={styles.promptName}>Prompt · Forecast reproducible + quiebre proyectado</span>
          <span className={styles.copyTag}>Corré una vez por producto</span>
          <CopyButton text={promptForecast} />
        </div>
        <div className={styles.promptBox}>{promptForecast}</div>

        <p className={styles.body} style={{ marginTop: 16 }}>
          Volcá el resultado en la hoja <b>05_STOCK_Y_FORECAST</b> del workbook — celdas amarillas. Guardá el forecast semanal y la alerta ejecutiva de cada producto.
        </p>

        <div className={styles.calloutTitle} style={{ marginTop: 20 }}>
          Así se ve a escala completa
        </div>
        <p className={styles.body}>
          Esto que están construyendo a mano para 3 productos, un sistema automatizado lo corre todas las semanas para los 10.000 SKUs del portfolio — con el mismo método, documentado y reproducible.
        </p>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Forecast 90 días</th>
              <th>Stock actual</th>
              <th>Quiebre proyectado</th>
              <th>Alerta</th>
            </tr>
          </thead>
          <tbody>
            {forecastTableRows.map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* PARTE E */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.stepMark}>E</div>
          <div>
            <div className={styles.sectionTitle}>¿A quién le creés?</div>
            <div className={styles.sectionSub}>Trade-off y gobernanza del forecast</div>
          </div>
          <div className={styles.timer}>⏱ ~7 min</div>
        </div>

        <div className={styles.debateBox}>
          <div className={styles.debateQuestion}>
            Tu modelo dice que el Repelente va a crecer 45% este verano. Pero el histórico de los últimos dos años está distorsionado por un evento excepcional. ¿Le creés al algoritmo o lo overrideás con tu juicio? ¿Y quién en tu organización tiene la autoridad para tomar esa decisión?
          </div>
        </div>
        <p className={styles.body} style={{ marginTop: 14 }}>
          No hay una respuesta correcta. El objetivo es que el equipo sienta que la gobernanza del forecast pesa tanto como el modelo mismo — la misma tensión de <i>&quot;Gobernanza antes que Algoritmo&quot;</i> de la clase.
        </p>
      </section>

      {/* PARTE F */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.stepMark}>F</div>
          <div>
            <div className={styles.sectionTitle}>Cuando vos mismo movés la demanda</div>
            <div className={styles.sectionSub}>El forecast también tiene que digerir tus propias decisiones</div>
          </div>
          <div className={styles.timer}>⏱ ~6 min</div>
        </div>

        <p className={styles.body}>
          Hasta acá el forecast solo miró señales del mercado. Pero si en un ejercicio anterior ustedes movieron el precio de un producto, esa decisión también mueve la demanda — y el modelo no puede tratarla como si fuera una señal orgánica del mercado. Si lo hace, va a confundir su propia decisión con un cambio de tendencia espontáneo.
        </p>
        <p className={styles.body}>
          La forma correcta de resolverlo no es pedirle a la IA que lo adivine: es decírselo explícitamente. Tomemos dos productos y apliquemos una decisión de precio, con el mismo lenguaje del Ejercicio 2 de Pricing:
        </p>

        <div className={styles.pricingMoveGrid}>
          <div className={styles.moveCard}>
            <h4>Protector solar FPS 30</h4>
            <div className={styles.moveRow}>
              <span>Decisión</span>
              <b>Liquidación</b>
            </div>
            <div className={styles.moveRow}>
              <span>price_move_pct</span>
              <b>−20%</b>
            </div>
            <div className={styles.moveRow}>
              <span>elasticity_proxy</span>
              <b>0.8</b>
            </div>
            <div className={styles.moveRow}>
              <span>Efecto de volumen esperado</span>
              <b>−0.8 × (−0.20) = +16%</b>
            </div>
            <span className={`${styles.tag} ${styles.tagLiq}`}>Ya venía en tendencia decreciente</span>
          </div>
          <div className={styles.moveCard}>
            <h4>Protector solar FPS 50</h4>
            <div className={styles.moveRow}>
              <span>Decisión</span>
              <b>Premium</b>
            </div>
            <div className={styles.moveRow}>
              <span>price_move_pct</span>
              <b>+10%</b>
            </div>
            <div className={styles.moveRow}>
              <span>elasticity_proxy</span>
              <b>0.4</b>
            </div>
            <div className={styles.moveRow}>
              <span>Efecto de volumen esperado</span>
              <b>−0.4 × 0.10 = −4%</b>
            </div>
            <span className={`${styles.tag} ${styles.tagPrem}`}>Producto en crecimiento, margen defendible</span>
          </div>
        </div>

        <div className={styles.promptLabel}>
          <span className={styles.promptName}>Prompt · Forecast con perturbación de precio conocida</span>
          <span className={styles.copyTag}>Corré para FPS 30 y FPS 50</span>
          <CopyButton text={promptPerturbation} />
        </div>
        <div className={styles.promptBox}>{promptPerturbation}</div>

        <div className={styles.closingNote}>
          <p>
            Esto que hicimos acá fue una sola corrida, con un cambio de precio ya conocido de antemano. En una empresa real esto no es un evento — es un proceso: cada semana entra la venta real, se compara contra lo que el forecast esperaba, y si la diferencia es mayor a lo normal, ese es el momento de recalibrar. No se espera al cierre del mes para descubrir que el forecast estaba mal — se lo ve venir semana a semana.
          </p>
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
          <div className={`${styles.formField} ${errors.has("signal_surprise") ? styles.formFieldError : ""}`}>
            <label>
              1. ¿Qué señal externa te sorprendió más y por qué no la estabas considerando antes? <span style={{ color: "var(--danger)" }}>*</span>
            </label>
            <textarea
              onChange={(event) => {
                setSignalSurprise(event.target.value);
                setErrors((current) => {
                  const next = new Set(current);
                  next.delete("signal_surprise");
                  return next;
                });
              }}
              placeholder="Escribí la síntesis del equipo…"
              value={signalSurprise}
            />
            {errors.has("signal_surprise") ? <span className={styles.errorText}>Este campo es obligatorio.</span> : null}
          </div>
          <div className={`${styles.formField} ${errors.has("product_uncertainty") ? styles.formFieldError : ""}`}>
            <label>
              2. De los tres productos analizados, ¿cuál te genera más incertidumbre en el forecast y qué harías para reducirla? <span style={{ color: "var(--danger)" }}>*</span>
            </label>
            <textarea
              onChange={(event) => {
                setProductUncertainty(event.target.value);
                setErrors((current) => {
                  const next = new Set(current);
                  next.delete("product_uncertainty");
                  return next;
                });
              }}
              placeholder="Escribí la síntesis del equipo…"
              value={productUncertainty}
            />
            {errors.has("product_uncertainty") ? <span className={styles.errorText}>Este campo es obligatorio.</span> : null}
          </div>
          <div className={`${styles.formField} ${errors.has("forecast_process") ? styles.formFieldError : ""}`}>
            <label>
              3. ¿Cómo es el proceso de forecast en tu empresa hoy? ¿Quién es dueño? ¿Qué cambiarías después de este ejercicio? <span style={{ color: "var(--danger)" }}>*</span>
            </label>
            <textarea
              onChange={(event) => {
                setForecastProcess(event.target.value);
                setErrors((current) => {
                  const next = new Set(current);
                  next.delete("forecast_process");
                  return next;
                });
              }}
              placeholder="Escribí la síntesis del equipo…"
              value={forecastProcess}
            />
            {errors.has("forecast_process") ? <span className={styles.errorText}>Este campo es obligatorio.</span> : null}
          </div>
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

      <div className={styles.footerNote}>NEXUS Retail Labs · Laboratorio 1 · Ejercicio 3 de 5</div>
    </AppShell>
  );
}
