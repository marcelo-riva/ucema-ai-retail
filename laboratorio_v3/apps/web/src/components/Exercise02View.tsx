"use client";

import { Check, Copy, Download } from "lucide-react";
import { useState } from "react";
import { ExerciseCheckpointForm } from "./ExerciseCheckpointForm";
import { ExerciseStepLayout } from "./ExerciseStepLayout";
import type { Group, LabCheckpoint } from "../types/lab";
import { LAB01_EJ02_WORKBOOK_FILENAME } from "../lib/constants";

const prompts = [
  {
    title: "Prompt 1 — Explorar pricing por familia",
    body: `Actuá como un analista senior de pricing retail.

Estoy trabajando en el Ejercicio 2 de Pricing Optimization. Usá el workbook del Ejercicio 2 y enfocá el análisis en las hojas:

- 01_BASE_SKUS
- 05_DECISIONES_PORTFOLIO
- 02_HISTORICO_PRECIOS_VOLUMEN
- 03_COMPETIDORES
- 06_PRICING_DECISIONS

Primero analizá la situación por familia o categoría.

Para cada familia, resumí:
1. Revenue actual.
2. Margen actual.
3. Volumen actual.
4. Precio promedio propio.
5. Precio promedio de competidores.
6. Índice de competitividad.
7. Elasticidad proxy promedio.
8. Cantidad de SKUs Core, Review y Eliminar.
9. SKUs potencialmente subvaluados.
10. SKUs potencialmente sobrevaluados.
11. Riesgo de pérdida de volumen.
12. Oportunidad de pricing leakage.

Después clasificá cada familia en una de estas estrategias:
- Capturar margen.
- Defender volumen.
- Igualar mercado.
- Liquidar stock.
- Revisar caso por caso.

Devolveme:
- Una tabla resumen por familia.
- Las 5 conclusiones ejecutivas más importantes.
- Las familias que deberían priorizarse en la decisión de pricing.`
  },
  {
    title: "Prompt 2 — Detectar SKUs subvaluados y sobrevaluados",
    body: `Actuá como especialista en pricing optimization.

Usá el workbook del Ejercicio 2 y combiná:
- Precios históricos.
- Volúmenes históricos.
- Costos unitarios.
- Precios de competidores.
- Elasticidad proxy.
- Clasificación de portfolio: Core, Review o Eliminar.

Quiero que identifiques SKUs en cuatro grupos:

1. SKUs subvaluados:
Productos cuyo precio propio parece bajo frente al mercado, con margen mejorable y riesgo controlado de pérdida de volumen.

2. SKUs sobrevaluados:
Productos cuyo precio propio parece alto frente al mercado y pueden estar perdiendo competitividad o volumen.

3. SKUs para mantener precio:
Productos donde el precio actual parece razonable por competitividad, elasticidad o rol estratégico.

4. SKUs para liquidar:
Productos clasificados como Eliminar o con baja conveniencia estratégica, donde puede tener sentido bajar precio para acelerar salida.

Para cada SKU, indicá:
- SKU.
- Familia.
- Clasificación de portfolio.
- Precio actual.
- Precio competidor.
- Índice de competitividad.
- Margen actual.
- Elasticidad proxy.
- Recomendación preliminar.
- Riesgo principal.
- Rationale.

No tomes decisiones automáticas. Usá la elasticidad como señal direccional y explicá los casos dudosos.`
  },
  {
    title: "Prompt 3 — Definir estrategia competitiva",
    body: `Actuá como Pricing Manager.

A partir del análisis anterior, ayudame a definir una estrategia de pricing para el próximo período.

Quiero evaluar tres posicionamientos:

A. Más barato que mercado.
B. Igual mercado.
C. Premium.

Para cada posicionamiento, estimá conceptualmente:
- Qué tipo de SKUs deberían subir precio.
- Qué tipo de SKUs deberían bajar precio.
- Qué tipo de SKUs deberían mantener precio.
- Qué familias deberían tener excepciones.
- Qué impacto esperaría en revenue.
- Qué impacto esperaría en margen.
- Qué impacto esperaría en competitividad.
- Qué riesgos tendría en volumen.

Después recomendá una estrategia principal y justificá por qué.

Importante:
La recomendación debe estar conectada con la clasificación del Ejercicio 1:
- Core.
- Review.
- Eliminar.

No quiero una recomendación genérica. Quiero criterios concretos para completar la hoja 06_PRICING_DECISIONS.`
  },
  {
    title: "Prompt 4 — Completar decisiones por SKU",
    body: `Actuá como analista senior de pricing y ayudame a completar la hoja 06_PRICING_DECISIONS del workbook del Ejercicio 2.

Para cada SKU, recomendá:
- Precio recomendado.
- Tipo de decisión de pricing.
- Posicionamiento competitivo.
- Efecto esperado en volumen.
- Efecto esperado en revenue.
- Efecto esperado en margen.
- Efecto esperado en competitividad.
- Rationale.
- Riesgo principal.
- Nivel de confianza.

Usá estos criterios:

1. SKUs Core:
Priorizar captura de margen si están subvaluados y tienen elasticidad baja o media.
Mantener precio si son sensibles o cumplen rol de entrada.
Evitar liquidaciones salvo casos excepcionales.

2. SKUs Review:
Aplicar ajustes selectivos.
Subir precio solo si hay evidencia clara.
Bajar precio si están sobrevaluados, pierden competitividad o tienen exceso de stock.
Marcar casos dudosos para revisión.

3. SKUs Eliminar:
Priorizar liquidación o salida ordenada.
Aceptar menor margen si ayuda a liberar capital de trabajo.
Evitar construir estrategia de largo plazo sobre estos SKUs.

4. Familias estratégicas:
Respetar el posicionamiento elegido para cada familia.
No tomar decisiones que rompan la arquitectura de precios.

Devolveme una tabla lista para trasladar a 06_PRICING_DECISIONS, con una fila por SKU.`
  },
  {
    title: "Prompt 5 — Recalcular impacto del escenario",
    body: `Actuá como analista financiero de pricing.

Con los precios recomendados en 06_PRICING_DECISIONS, recalculá el escenario proyectado.

Necesito estimar:
1. Volumen esperado.
2. Revenue proyectado.
3. Margen proyectado.
4. Índice de competitividad proyectado.
5. Variación versus situación actual.
6. Principales ganadores y perdedores.
7. Riesgos del escenario.

Usá elasticidad proxy para estimar impacto de cambios de precio, pero tratala como aproximación.

Separá el análisis en:
- Total del ejercicio.
- Por familia.
- Por clasificación de portfolio: Core, Review y Eliminar.
- Top SKUs con mayor impacto positivo.
- Top SKUs con mayor riesgo.

Finalmente, generá una conclusión ejecutiva:
¿El escenario mejora margen sin destruir competitividad?`
  },
  {
    title: "Prompt 6 — Auditar la recomendación final",
    body: `Actuá como comité ejecutivo de pricing, comercial y finanzas.

Revisá críticamente la propuesta de precios del Ejercicio 2.

Buscá:
1. SKUs con subas demasiado agresivas.
2. SKUs sensibles donde podríamos perder volumen.
3. SKUs Core que quedaron mal posicionados frente al mercado.
4. SKUs Eliminar que no tienen una lógica clara de liquidación.
5. Familias donde la arquitectura de precios quedó inconsistente.
6. Casos donde la elasticidad parece poco confiable.
7. Decisiones que requieren validación comercial antes de ejecutar.

Devolveme:
- Lista de alertas.
- Ajustes sugeridos.
- Decisiones que mantendrías.
- Decisiones que cambiarías.
- Preguntas para discutir con negocio.
- Recomendación final de aprobación o revisión.`
  }
];

const concepts = [
  {
    term: "Elasticidad proxy",
    definition: "La elasticidad proxy es una señal direccional de sensibilidad precio-volumen. Ayuda a estimar si un cambio de precio podría afectar el volumen, pero no debe interpretarse como una verdad estadística perfecta. Puede estar afectada por promociones, estacionalidad, quiebres, competencia o cambios de mix."
  },
  {
    term: "Índice de competitividad",
    definition: "Compara el precio propio contra el precio de mercado o competidores. Un SKU puede estar barato, alineado o caro frente al mercado. La decisión no debe ser automática: a veces conviene ser más barato, a veces igualar mercado y a veces sostener una posición premium."
  },
  {
    term: "Pricing leakage",
    definition: "Es margen potencial que se pierde por vender por debajo del precio que el producto podría sostener. Suele aparecer en SKUs Core, con buena rotación, baja sensibilidad y precio inferior al benchmark competitivo."
  },
  {
    term: "Arquitectura de precios",
    definition: "No alcanza con cambiar precios SKU por SKU. La arquitectura de precios ordena la relación entre productos, familias, roles y posicionamiento competitivo. Una buena recomendación debe ser coherente dentro de cada familia."
  },
  {
    term: "Liquidación",
    definition: "Para SKUs clasificados como Eliminar, el precio puede usarse como herramienta táctica para acelerar salida, liberar stock y reducir capital inmovilizado. En estos casos, el objetivo no siempre es maximizar margen unitario."
  }
];

const positioning = [
  {
    key: "cheaper",
    title: "A. Más barato que mercado",
    description: "Busca sostener competitividad y proteger volumen. Conviene en categorías sensibles al precio, SKUs de entrada, familias con alta presión competitiva o productos donde perder volumen sería más costoso que capturar margen.",
    implications: [
      "Mejor competitividad.",
      "Menor margen unitario.",
      "Menor riesgo de pérdida de volumen.",
      "Menor captura de pricing leakage."
    ]
  },
  {
    key: "aligned",
    title: "B. Igual mercado",
    description: "Busca equilibrar margen y competitividad. Conviene cuando el producto no necesita ser el más barato, pero tampoco tiene argumentos suficientes para sostener un diferencial premium.",
    implications: [
      "Mejora moderada de margen.",
      "Riesgo comercial controlado.",
      "Posición competitiva razonable.",
      "Estrategia balanceada."
    ]
  },
  {
    key: "premium",
    title: "C. Premium",
    description: "Busca capturar margen sosteniendo precio superior al mercado. Conviene en SKUs Core, con baja sensibilidad, buena rotación, diferenciación o rol estratégico.",
    implications: [
      "Mayor margen unitario.",
      "Mayor riesgo de pérdida de volumen.",
      "Menor competitividad en precio.",
      "Necesidad de justificar el diferencial."
    ]
  }
];

const variables = [
  {
    title: "Posicionamiento competitivo",
    description: "Definí si la estrategia será más barata que mercado, igual mercado, premium o mixta por familia."
  },
  {
    title: "Margen objetivo",
    description: "Definí si buscás sostener margen, mejorar margen en SKUs Core, resignar margen para liquidar o equilibrar margen y volumen."
  },
  {
    title: "Categorías estratégicas",
    description: "Identificá qué familias merecen tratamiento especial por revenue, margen, sensibilidad, presión competitiva, exceso de stock o rol comercial."
  }
];

const explorationQuestions = [
  "¿Qué familias están baratas, alineadas o caras frente al mercado?",
  "¿Qué familias tienen mayor pricing leakage?",
  "¿Dónde la elasticidad sugiere riesgo de pérdida de volumen?",
  "¿Qué familias concentran SKUs Core?",
  "¿Qué familias concentran SKUs Eliminar?",
  "¿Dónde conviene capturar margen?",
  "¿Dónde conviene defender volumen?",
  "¿Dónde conviene liquidar stock?",
  "¿Qué familias requieren revisión manual?"
];

const mainSheets = ["06_PRICING_DECISIONS"];
const supportSheets = ["01_BASE_SKUS", "05_DECISIONES_PORTFOLIO", "02_HISTORICO_PRECIOS_VOLUMEN", "03_COMPETIDORES"];

function PromptCard({ title, body }: { title: string; body: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <details className="promptCard">
      <summary>
        <span>{title}</span>
        <button
          aria-label={copied ? "Copiado" : "Copiar prompt"}
          className="iconButton"
          onClick={(event) => {
            event.preventDefault();
            copy();
          }}
          type="button"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </summary>
      <pre>{body}</pre>
    </details>
  );
}

export function Exercise02View({
  group,
  stateVersion,
  checkpoint,
  onSave,
  onSubmit
}: {
  group: Group;
  stateVersion: string;
  checkpoint: LabCheckpoint | null;
  onSave: (payload: { fields: Record<string, string>; confirmations: Record<string, boolean>; workbookName?: string; reportName?: string }) => Promise<void>;
  onSubmit: (payload: { fields: Record<string, string>; confirmations: Record<string, boolean>; workbookName?: string; reportName?: string; requiredFields: string[]; requiredConfirmations: string[] }) => Promise<void>;
}) {
  const fieldLabels = [
    { key: "estrategia", label: "1. Estrategia de pricing elegida", placeholder: "Explicá si la estrategia fue más barata que mercado, igual mercado, premium o mixta por familia." },
    { key: "criterios", label: "2. Criterios usados", placeholder: "Explicá qué reglas usaron para subir, bajar, mantener, liquidar o revisar SKUs." },
    { key: "impacto", label: "3. Impacto esperado", placeholder: "Resumí el impacto esperado en revenue, margen, volumen y competitividad." },
    { key: "riesgos", label: "4. Riesgos y validaciones", placeholder: "Identificá SKUs sensibles, familias riesgosas, supuestos débiles o decisiones que requieren validación comercial." }
  ];

  const requiredFields = fieldLabels.map((field) => field.key);

  const confirmations = [
    { key: "completedPricing", label: "Completé 06_PRICING_DECISIONS." },
    { key: "definedStrategy", label: "Definí una estrategia de pricing por familia o general." },
    { key: "reviewedSkus", label: "Revisé SKUs subvaluados y sobrevaluados." },
    { key: "elasticityAsSignal", label: "Usé elasticidad proxy como señal, no como verdad absoluta." },
    { key: "identifiedRisks", label: "Identifiqué riesgos y decisiones a validar." }
  ];

  return (
    <ExerciseStepLayout
      eyebrow="AI Revenue & Inventory Copilot"
      title="Ejercicio 2: Pricing Optimization"
      subtitle="Definir una arquitectura de precios que capture margen sin destruir volumen ni competitividad."
      meta={[
        { label: "Grupo", value: group.name },
        { label: "Estado", value: stateVersion },
        { label: "Workbook", value: "Ejercicio 2" },
        { label: "Checkpoint", value: checkpoint?.status ?? "Pendiente" }
      ]}
    >
      <section className="panel">
        <div className="eyebrow">Memoria del laboratorio</div>
        <h3>El workbook sostiene el recorrido</h3>
        <p className="muted">
          La plataforma acompaña el ejercicio, pero el análisis vive en el workbook. Para este ejercicio vas a trabajar con un workbook específico de Pricing Optimization, preparado con los datos necesarios para analizar precios, volumen, costos y competencia.
        </p>
        <p className="muted" style={{ marginTop: 10, marginBottom: 0 }}>
          Este workbook parte de la lógica del Ejercicio 1, pero ya viene preparado para resolver el Ejercicio 2 sin depender de que el alumno haya completado manualmente el archivo anterior.
        </p>
      </section>

      <section className="card">
        <div className="eyebrow">Workbook del Ejercicio 2</div>
        <h2>Descargar workbook de Pricing Optimization</h2>
        <p className="muted">
          Este archivo contiene las hojas necesarias para resolver el Ejercicio 2. Incluye información histórica de precios, volumen, costos unitarios, precios de competidores y clasificación previa del portfolio.
        </p>
        <p className="muted">
          Usá este workbook como base de trabajo. La IA personal te va a ayudar a analizar señales, construir recomendaciones y completar las decisiones de pricing.
        </p>
        <a className="button primary" href={`/templates/${LAB01_EJ02_WORKBOOK_FILENAME}`} download>
          <Download size={17} /> Descargar workbook del Ejercicio 2
        </a>
      </section>

      <section className="card">
        <div className="eyebrow">Contexto</div>
        <h2>Qué estás resolviendo</h2>
        <p className="muted">
          Después de clasificar el portfolio en el Ejercicio 1, el equipo debe definir una arquitectura de precios para los próximos meses. Algunos SKUs pueden estar subvaluados, otros pueden estar sobrevaluados, algunos deben proteger volumen y otros pueden requerir liquidación por su rol dentro del portfolio.
        </p>
        <p className="muted">
          El desafío no es simplemente subir precios. El desafío es decidir dónde capturar margen, dónde defender competitividad, dónde mantener posición y dónde usar precio como herramienta táctica para acelerar salida de productos.
        </p>
      </section>

      <section className="card">
        <div className="eyebrow">Workbook</div>
        <h2>Hojas que vas a usar</h2>
        <div className="grid two">
          <div className="panel">
            <h3>Hoja principal</h3>
            <p className="muted">
              <strong>{mainSheets[0]}</strong> — hoja donde se completa la decisión de pricing por SKU: precio recomendado, tipo de decisión, impacto esperado, rationale, riesgo y confianza.
            </p>
          </div>
          <div className="panel">
            <h3>Hojas de apoyo</h3>
            <p className="muted">
              {supportSheets.join(", ")}
            </p>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="eyebrow">Conceptos clave</div>
        <h2>Cómo pensar la decisión de pricing</h2>
        <div className="grid two">
          {concepts.map((concept) => (
            <div className="panel" key={concept.term}>
              <h3>{concept.term}</h3>
              <p className="muted">{concept.definition}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="eyebrow">Exploración</div>
        <h2>Primero mirá el problema por familia</h2>
        <p className="muted">
          Antes de decidir SKU por SKU, analizá las familias o categorías. El objetivo es entender dónde hay oportunidad de margen, dónde hay riesgo de volumen y dónde la posición competitiva necesita corrección.
        </p>
        <div className="questionGrid">
          {explorationQuestions.map((question) => (
            <div className="questionItem" key={question}>{question}</div>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="eyebrow">Estrategia</div>
        <h2>Elegí un posicionamiento competitivo</h2>
        <p className="muted">
          Antes de completar las decisiones de precio, elegí una estrategia principal. Puede ser una estrategia general o una combinación por familia, pero debe estar justificada.
        </p>
        <div className="criterionGrid">
          {positioning.map((position) => (
            <article className="criterionCard" key={position.key}>
              <div className="criterionHeader">
                <h3>{position.title}</h3>
              </div>
              <p className="muted">{position.description}</p>
              <div className="criterionBlock">
                <strong>Implicancias</strong>
                <ul className="simpleList">
                  {position.implications.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="eyebrow">Variables de decisión</div>
        <h2>Qué variables vas a ajustar</h2>
        <div className="criterionGrid">
          {variables.map((variable) => (
            <article className="criterionCard" key={variable.title}>
              <div className="criterionHeader">
                <h3>{variable.title}</h3>
              </div>
              <p className="muted">{variable.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="eyebrow">Prompts para IA personal</div>
        <h2>Usá IA para analizar; el equipo decide</h2>
        <p className="muted">
          Copiá estos prompts en tu IA personal junto con el workbook del Ejercicio 2. La IA te ayuda a ordenar señales, calcular escenarios y detectar riesgos, pero la decisión final debe ser defendible por el equipo.
        </p>
        <div className="promptGrid">
          {prompts.map((prompt) => (
            <PromptCard body={prompt.body} key={prompt.title} title={prompt.title} />
          ))}
        </div>
      </section>

      <section className="card">
        <div className="eyebrow">Output esperado</div>
        <h2>Qué tenés que completar</h2>
        <p className="muted">
          Al finalizar el ejercicio, el workbook debe reflejar una propuesta defendible de pricing por SKU y por familia.
        </p>
        <div className="panel">
          <h3>Obligatorio</h3>
          <ul className="simpleList">
            <li>Completar la hoja 06_PRICING_DECISIONS.</li>
            <li>Definir precio recomendado por SKU.</li>
            <li>Indicar tipo de decisión: subir, bajar, mantener, liquidar o revisar.</li>
            <li>Explicar rationale de cada decisión.</li>
            <li>Identificar riesgo principal.</li>
            <li>Indicar nivel de confianza.</li>
            <li>Resumir impacto esperado en revenue, margen y competitividad.</li>
          </ul>
        </div>
        <div className="panel">
          <h3>Opcional</h3>
          <ul className="simpleList">
            <li>Adjuntar reporte generado con IA.</li>
            <li>Adjuntar análisis adicional por familia.</li>
            <li>Adjuntar escenarios alternativos de posicionamiento.</li>
          </ul>
        </div>
      </section>

      <section className="card">
        <div className="eyebrow">Checkpoint</div>
        <h2>Subir checkpoint del Ejercicio 2</h2>
        <p className="muted">
          Subí tu workbook actualizado de Pricing Optimization para registrar el avance del ejercicio. Si la plataforma falla, continuá trabajando en el Excel.
        </p>

        <ExerciseCheckpointForm
          checkpoint={checkpoint}
          confirmations={confirmations}
          fieldLabels={fieldLabels}
          onSave={onSave}
          onSubmit={onSubmit}
          requiredFields={requiredFields}
          title="Subir checkpoint del Ejercicio 2"
        />
      </section>

      <section className="card">
        <div className="eyebrow">Criterio de evaluación</div>
        <h2>Qué hace buena una recomendación de pricing</h2>
        <p className="muted">
          Una buena entrega no es la que más sube precios. Una buena entrega es la que demuestra criterio para equilibrar margen, volumen, competitividad y rol del SKU dentro del portfolio.
        </p>
        <p className="muted">
          Debe evaluarse si el equipo:
        </p>
        <ul className="simpleList">
          <li>Entendió diferencias entre familias.</li>
          <li>Usó elasticidad como señal y no como verdad absoluta.</li>
          <li>Diferenció decisiones para Core, Review y Eliminar.</li>
          <li>Detectó pricing leakage.</li>
          <li>Evitó romper la arquitectura de precios.</li>
          <li>Justificó excepciones.</li>
          <li>Identificó riesgos comerciales.</li>
          <li>Pudo defender el escenario recomendado.</li>
        </ul>
        <p className="muted">
          La IA ayuda a calcular y ordenar señales, pero la decisión final debe ser defendible por el equipo.
        </p>
      </section>
    </ExerciseStepLayout>
  );
}
