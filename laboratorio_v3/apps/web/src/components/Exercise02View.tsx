"use client";

import { Download } from "lucide-react";
import { ExerciseHeader } from "./labs/ExerciseHeader";
import { PromptBlock } from "./labs/PromptBlock";
import { CriteriaGrid } from "./labs/CriteriaGrid";
import { MetricList } from "./labs/MetricList";
import { CheckpointForm } from "./labs/CheckpointForm";
import type { Group, LabCheckpoint } from "../types/lab";
import { LAB01_EJ02_WORKBOOK_FILENAME } from "../lib/constants";

const prompt1 = `Usando el workbook del Ejercicio 2, analizá estas hojas:

- 03_BASE_SKUS: fuente base de SKUs, precios históricos, costos, volúmenes, competencia, margen, cobertura y elasticidad.
- 06_PORTFOLIO: clasificación previa del portfolio.
- 09_PRICING: hoja principal de decisiones de pricing.

No uses 07_FORECAST_90_DIAS. Esa hoja corresponde a una etapa posterior de proyección y actualmente funciona como base con repetición del mes 12 en los meses 13, 14 y 15.

Quiero que actúes como analista senior de pricing retail. Antes de recomendar precios SKU por SKU, ayudame a entender el problema por familias o categorías.

Usá especialmente estas variables:

De 03_BASE_SKUS:
- family
- department
- pvp_m01 a pvp_m12
- cost_m01 a cost_m12
- vol_m01 a vol_m12
- revenue_12m_calc
- gross_margin_12m
- gross_margin_pct
- avg_price_12m
- avg_cost_12m
- current_stock
- current_inventory_value
- ddi_current
- market_price_avg
- price_index_vs_market
- elasticity_proxy
- market_coverage_pct

De 06_PORTFOLIO:
- decision_portfolio
- action_90_days
- priority
- commercial_risk

De 09_PRICING:
- portfolio_decision
- current_price_m12
- avg_price_12m
- current_cost_m12
- avg_cost_12m
- gross_margin_pct
- elasticity_proxy
- market_price_avg
- price_index_vs_market

Devolveme:

1. Qué familias concentran revenue.
2. Qué familias concentran margen.
3. Qué familias tienen mayor volumen.
4. Qué familias muestran mayor sensibilidad precio-volumen o elasticidad proxy.
5. Qué familias están baratas, alineadas o caras frente al mercado.
6. Qué familias tienen mayor pricing leakage potencial.
7. Qué familias tienen mayor riesgo de pérdida de volumen si subimos precios.
8. Qué familias concentran SKUs Core, Review y Eliminar.
9. Qué familias podrían capturar margen.
10. Qué familias deberían defender volumen o competitividad.
11. Qué familias podrían usar precio como herramienta de liquidación o salida.
12. Qué tensiones aparecen entre margen, volumen, competitividad, inventario y rol de portfolio.

No completes todavía la recomendación SKU por SKU. Primero quiero entender el negocio por familias y las señales más importantes.`;

const prompt2 = `Usando el análisis por familias del Prompt 1 y el workbook del Ejercicio 2, ayudame a definir una estrategia de pricing.

Trabajá especialmente con estas hojas:

- 03_BASE_SKUS
- 06_PORTFOLIO
- 09_PRICING

No uses 07_FORECAST_90_DIAS para proyectar impacto. En este momento la estrategia debe evaluarse de forma direccional, no como forecast cerrado.

Quiero evaluar tres caminos posibles:

1. Capturar margen.
2. Defender volumen / competitividad.
3. Liquidar o acelerar salida.

Para cada camino, explicá:

1. Qué objetivo prioriza.
2. Qué tipo de familias deberían entrar en ese camino.
3. Qué tipo de SKUs deberían subir precio.
4. Qué tipo de SKUs deberían bajar precio.
5. Qué tipo de SKUs deberían mantener precio.
6. Qué tipo de SKUs deberían usar precio promocional, liquidar o revisar.
7. Qué impacto potencial podría tener en revenue.
8. Qué impacto potencial podría tener en margen.
9. Qué impacto potencial podría tener en volumen.
10. Qué impacto potencial podría tener en competitividad.
11. Qué pricing leakage podría capturarse o dejarse sin capturar.
12. Qué riesgos debería revisar el equipo antes de ejecutar.

Después recomendá una estrategia principal o una estrategia mixta por familia.

Importante:
- No quiero una recomendación genérica.
- Conectá la recomendación con la clasificación de portfolio de 06_PORTFOLIO: Core, Review y Eliminar.
- Usá elasticity_proxy y price_index_vs_market como señales, no como verdades absolutas.
- Separá hallazgos basados en datos de hipótesis.
- No completes todavía la decisión final SKU por SKU.`;

const prompt3 = `Usando el workbook del Ejercicio 2, trabajá con estas hojas:

- 03_BASE_SKUS: fuente base de SKUs, precios, costos, volúmenes, competencia, margen y elasticidad.
- 06_PORTFOLIO: clasificación previa del portfolio.
- 09_PRICING: hoja principal que debés completar.

No modifiques 03_BASE_SKUS ni 06_PORTFOLIO.
No uses 07_FORECAST_90_DIAS.
La recomendación debe completarse o proponerse en 09_PRICING.

Estrategia elegida por el equipo:
[Estrategia principal o mixta por familia]

Quiero que actúes como analista senior de pricing. El objetivo es completar una propuesta defendible de pricing por SKU.

En 09_PRICING, completá o proponé valores para estas columnas:

- pricing_decision: usar una de estas opciones: Mantener precio / Subir precio / Bajar precio / Precio promocional / Liquidación.
- price_m13
- price_m14
- price_m15
- expected_volume_effect_pct
- rationale
- risk
- ai_comment
- team_comment: dejar vacío salvo que el equipo quiera corregir o desafiar la recomendación.

Usá como insumos las columnas ya disponibles en 09_PRICING:

- sku_id
- sku_name
- family
- department
- portfolio_decision
- current_price_m12
- avg_price_12m
- current_cost_m12
- avg_cost_12m
- gross_margin_pct
- elasticity_proxy
- market_price_avg
- price_index_vs_market

Usá también 03_BASE_SKUS si necesitás ver históricos de precio, costo, volumen, stock, capital inmovilizado, DDI, cobertura o tendencia.

Criterios de decisión:

1. SKUs Core:
Priorizar captura de margen si están subvaluados, tienen margen mejorable y elasticidad baja o media.
Mantener precio si son sensibles o cumplen rol de entrada.
Defender competitividad si perder volumen sería más costoso que capturar margen.
Evitar liquidaciones salvo casos excepcionales.

2. SKUs Review:
Aplicar ajustes selectivos.
Subir precio solo si hay evidencia clara de pricing leakage.
Bajar precio si están sobrevaluados, pierden competitividad o muestran riesgo de caída de volumen.
Usar precio promocional si conviene testear reacción del mercado.
Marcar decisión conservadora o revisar si los datos son contradictorios.

3. SKUs Eliminar:
Priorizar liquidación o salida ordenada.
Aceptar menor margen unitario si ayuda a liberar capital o rotar stock.
Evitar construir una estrategia de precio de largo plazo sobre estos SKUs.

4. Arquitectura de precios:
No tomes decisiones que rompan la lógica interna de precios dentro de una familia.
Si un SKU queda más caro o más barato que otro SKU comparable sin justificación, marcá alerta.
Si la recomendación genera una inconsistencia de arquitectura, explicala.

Reglas para pricing_decision:

- Mantener precio: cuando el precio actual parece razonable, el riesgo de volumen es alto o no hay evidencia suficiente para cambiar.
- Subir precio: cuando hay pricing leakage, precio por debajo del mercado, margen mejorable y riesgo controlado de volumen.
- Bajar precio: cuando el SKU está sobrevaluado, pierde competitividad o tiene riesgo de caída de volumen.
- Precio promocional: cuando conviene una acción táctica temporal sin cambiar la arquitectura base.
- Liquidación: cuando el SKU es Eliminar, tiene stock/capital inmovilizado y el objetivo es acelerar salida.

Importante:
- No inventes datos.
- No uses elasticidad como verdad exacta.
- Si no podés calcular precio recomendado con precisión, proponé un rango o un ajuste prudente.
- Separá datos calculados de supuestos.
- Priorizá explicación comercial por sobre falsa precisión matemática.
- No completes decisiones agresivas sin explicar riesgo de volumen, margen o competitividad.
- No cambies la estructura del workbook.

Si podés editar el archivo, completá 09_PRICING.
Si no podés editarlo, devolveme una tabla lista para copiar a 09_PRICING, respetando sku_id y las columnas solicitadas.`;

const prompt4 = `Usá la propuesta de pricing completada en 09_PRICING como fuente principal.

Si necesitás datos históricos o variables base, cruzá contra 03_BASE_SKUS.
Si necesitás clasificación de portfolio, cruzá contra 06_PORTFOLIO.

No uses 07_FORECAST_90_DIAS para proyectar impacto, salvo indicación explícita del docente. En este ejercicio, el impacto esperado debe estimarse de manera conceptual o direccional a partir de las decisiones de pricing, elasticidad proxy, margen, volumen, competitividad y rol de portfolio.

Devolveme:

1. Estrategia de pricing elegida: general o mixta por familia.
2. Cantidad de SKUs con recomendación de Subir precio.
3. Cantidad de SKUs con recomendación de Bajar precio.
4. Cantidad de SKUs con recomendación de Mantener precio.
5. Cantidad de SKUs con recomendación de Precio promocional.
6. Cantidad de SKUs con recomendación de Liquidación.
7. Resumen por familia o categoría.
8. Resumen por clasificación de portfolio: Core, Review y Eliminar.
9. Revenue actual asociado a cada tipo de decisión.
10. Margen actual asociado a cada tipo de decisión.
11. Impacto esperado direccional en revenue.
12. Impacto esperado direccional en margen.
13. Impacto esperado direccional en volumen.
14. Impacto esperado direccional en competitividad.
15. Pricing leakage potencial capturado.
16. Pricing leakage que queda sin capturar.
17. SKUs o familias con mayor riesgo de pérdida de volumen.
18. SKUs o familias donde la recomendación puede romper arquitectura de precios.
19. Decisiones que deberían revisarse manualmente antes de ejecutar.
20. Datos o supuestos que habría que validar.

Importante:
- No presentes el impacto como resultado financiero garantizado.
- Hablá de impacto esperado, exposición o estimación.
- Separá datos calculados de supuestos.
- Usá elasticity_proxy como aproximación.
- No ocultes riesgos comerciales.
- Si no podés calcular una métrica, aclaralo.

Cerrá con un resumen ejecutivo de 5 bullets sobre la recomendación.

Después cerrá tu respuesta con una sección llamada "Respuesta para plataforma" usando exactamente estos 4 bloques:

1. Estrategia de pricing elegida
2. Impacto esperado en el negocio
3. Decisiones a revisar antes de ejecutar
4. Datos o supuestos a validar`;

const concepts = [
  {
    term: "Elasticidad por SKU",
    definition: "La elasticidad por SKU es una señal de sensibilidad precio-volumen. Ayuda a estimar si un cambio de precio podría afectar el volumen. En este laboratorio debe usarse como señal direccional, no como verdad estadística perfecta."
  },
  {
    term: "Elasticidad por categoría",
    definition: "La elasticidad por categoría ayuda a entender qué familias son más sensibles a cambios de precio. Una categoría sensible requiere más cuidado al subir precios; una categoría menos sensible puede ofrecer oportunidades de captura de margen."
  },
  {
    term: "Índice de competitividad",
    definition: "Compara el precio propio contra el mercado o competidores. Un SKU puede estar barato, alineado o caro. La decisión no debe ser automática: a veces conviene estar por debajo del mercado, a veces igualar y a veces sostener una posición premium."
  },
  {
    term: "Pricing leakage",
    definition: "Es margen potencial que se pierde por vender por debajo del precio que el producto podría sostener. Suele aparecer en SKUs con buena rotación, margen mejorable, baja sensibilidad y precio inferior al benchmark competitivo."
  },
  {
    term: "Arquitectura de precios",
    definition: "Una arquitectura de precios ordena la relación entre productos, familias, roles y posicionamiento competitivo. La recomendación no debe romper la lógica de precios dentro de una familia."
  },
  {
    term: "Precio como herramienta táctica",
    definition: "En SKUs candidatos a salida o liquidación, el precio puede usarse para acelerar rotación y liberar capital. En esos casos, el objetivo no siempre es maximizar margen unitario."
  }
];

const conceptItems = concepts.map((concept) => ({
  id: concept.term,
  title: concept.term,
  description: "",
  blocks: [{ title: "Definición", content: concept.definition }]
}));

const metrics = [
  "Precio actual.",
  "Precio histórico.",
  "Volumen histórico.",
  "Costo unitario.",
  "Margen bruto.",
  "Margen porcentual.",
  "Precio de competidores.",
  "Índice de competitividad.",
  "Elasticidad proxy por SKU.",
  "Elasticidad proxy por familia.",
  "Clasificación de portfolio: Core, Review, Eliminar.",
  "Stock o capital inmovilizado si está disponible.",
  "Pricing leakage estimado.",
  "Riesgo de pérdida de volumen.",
  "Impacto esperado en revenue.",
  "Impacto esperado en margen."
];

const strategies = [
  {
    key: "margin",
    title: "Capturar margen",
    subtitle: "Mejorar margen aprovechando SKUs subvaluados o con baja sensibilidad.",
    when: [
      "SKUs Core.",
      "SKUs con precio por debajo del mercado.",
      "SKUs con elasticidad baja o media.",
      "SKUs con buen volumen y margen mejorable.",
      "Familias donde el diferencial competitivo permite sostener precio."
    ],
    risk: "Perder volumen o competitividad si el aumento es demasiado agresivo."
  },
  {
    key: "volume",
    title: "Defender volumen / competitividad",
    subtitle: "Proteger volumen, share o posición competitiva.",
    when: [
      "Familias sensibles al precio.",
      "SKUs de entrada.",
      "SKUs con presión competitiva alta.",
      "SKUs Core con riesgo de perder volumen.",
      "SKUs donde el precio propio está por encima del mercado."
    ],
    risk: "Resignar margen o dejar pricing leakage sin capturar."
  },
  {
    key: "exit",
    title: "Liquidar o acelerar salida",
    subtitle: "Usar precio como herramienta táctica para liberar stock o acelerar salida.",
    when: [
      "SKUs clasificados como Eliminar.",
      "SKUs con baja rotación.",
      "SKUs con stock o capital inmovilizado.",
      "SKUs sobrevaluados sin justificación.",
      "Productos donde no conviene construir una estrategia de largo plazo."
    ],
    risk: "Deteriorar margen unitario o afectar percepción de precio si se aplica en productos estratégicos."
  }
];

const strategyItems = strategies.map((strategy) => ({
  id: strategy.key,
  title: strategy.title,
  subtitle: strategy.subtitle,
  description: "",
  blocks: [
    { title: "Cuándo usarlo", items: strategy.when },
    { title: "Riesgo", content: strategy.risk }
  ]
}));

const portfolioRules = [
  {
    key: "core",
    title: "SKUs Core",
    description: "Productos a proteger, sostener o potenciar. En pricing, no se trata solo de subir precio: hay que cuidar margen, volumen y posición competitiva.",
    actions: [
      "Capturar margen si están subvaluados y el riesgo de volumen es controlado.",
      "Mantener o ajustar con prudencia si son sensibles al precio.",
      "Defender competitividad si cumplen rol de entrada o sostienen volumen.",
      "Evitar liquidaciones salvo casos excepcionales."
    ]
  },
  {
    key: "review",
    title: "SKUs Review",
    description: "Productos con señales mixtas. Requieren ajustes selectivos y validación antes de tomar decisiones agresivas.",
    actions: [
      "Subir solo si hay evidencia clara de leakage y riesgo controlado.",
      "Bajar si están sobrevaluados, pierden competitividad o muestran caída de volumen.",
      "Usar precio promocional si conviene testear reacción del mercado.",
      "Marcar como revisar cuando los datos sean contradictorios."
    ]
  },
  {
    key: "eliminate",
    title: "SKUs Eliminar",
    description: "Productos candidatos a salida controlada, liquidación o no reposición. El precio puede usarse como herramienta táctica.",
    actions: [
      "Considerar baja de precio, precio promocional o liquidación si hay stock/capital inmovilizado.",
      "No construir estrategia de largo plazo sobre estos SKUs.",
      "Cuidar que la liquidación no rompa la arquitectura de precios de la familia.",
      "Explicitar el riesgo de margen y percepción de precio."
    ]
  }
];

const portfolioRuleItems = portfolioRules.map((rule) => ({
  id: rule.key,
  title: rule.title,
  description: rule.description,
  blocks: [{ title: "Acciones típicas", items: rule.actions }]
}));

const evaluationItems = [
  { id: "1", title: "Entiende diferencias entre familias." },
  { id: "2", title: "Usa elasticidad como señal y no como verdad absoluta." },
  { id: "3", title: "Diferencia decisiones para Core, Review y Eliminar." },
  { id: "4", title: "Detecta pricing leakage." },
  { id: "5", title: "Evita romper la arquitectura de precios." },
  { id: "6", title: "Justifica excepciones." },
  { id: "7", title: "Identifica riesgos comerciales." },
  { id: "8", title: "Puede defender la estrategia recomendada." }
];

export function Exercise02View({
  group,
  stateVersion,
  checkpoint,
  onSave: _onSave,
  onSubmit: _onSubmit
}: {
  group: Group;
  stateVersion: string;
  checkpoint: LabCheckpoint | null;
  onSave: (payload: { fields: Record<string, string>; confirmations: Record<string, boolean>; workbookName?: string; reportName?: string }) => Promise<void>;
  onSubmit: (payload: { fields: Record<string, string>; confirmations: Record<string, boolean>; workbookName?: string; reportName?: string; requiredFields: string[]; requiredConfirmations: string[] }) => Promise<void>;
}) {
  const checkpointStatus = checkpoint?.status ?? "Pendiente";

  return (
    <ExerciseHeader
      eyebrow="AI Revenue & Inventory Copilot"
      title="Ejercicio 2: Pricing Optimization"
      subtitle="Definir una arquitectura de precios que capture margen sin destruir volumen ni competitividad."
      groupName={group.name}
      stateVersion={stateVersion}
      workbookLabel="Ejercicio 2"
      checkpointStatus={checkpointStatus}
    >
      <section className="panel">
        <div className="eyebrow">Memoria del laboratorio</div>
        <h3>El workbook sostiene el recorrido</h3>
        <p className="muted">
          La plataforma acompaña el ejercicio, pero el análisis vive en el workbook. Para este ejercicio vas a trabajar con un workbook específico de Pricing Optimization, preparado con los datos necesarios para analizar precios, volumen, costos y competencia.
        </p>
        <p className="muted" style={{ marginTop: 10, marginBottom: 0 }}>
          Este workbook parte de una resolución base del Ejercicio 1 para que todos los equipos trabajen sobre un punto de partida común. Tu decisión del Ejercicio 1 puede diferir, y esa diferencia puede usarse como discusión, pero no bloquea el avance del laboratorio.
        </p>
      </section>

      <section className="card">
        <div className="eyebrow">Workbook del Ejercicio 2</div>
        <h2>Descargar workbook de Pricing Optimization</h2>
        <p className="muted">
          Descargá el workbook preparado para el Ejercicio 2. El archivo contiene la información necesaria para analizar precios históricos, volumen, costos unitarios, precios de competidores y clasificación previa del portfolio.
        </p>
        <p className="muted">
          No necesitás modificar la estructura del archivo. Usalo como base de trabajo junto con tu IA personal.
        </p>
        <a className="button primary" href={`/templates/${LAB01_EJ02_WORKBOOK_FILENAME}`} download>
          <Download size={17} /> Descargar workbook del Ejercicio 2
        </a>
      </section>

      <section className="card">
        <div className="eyebrow">Workbook</div>
        <h2>Hojas que vas a usar</h2>
        <div className="grid two">
          <div className="panel">
            <h3>03_BASE_SKUS</h3>
            <p className="muted">
              Fuente base de SKUs, precios históricos, costos, volúmenes, competencia, margen, cobertura, elasticidad, inventario y DDI.
            </p>
          </div>
          <div className="panel">
            <h3>06_PORTFOLIO</h3>
            <p className="muted">
              Clasificación previa del portfolio: Core, Review o Eliminar. Sirve para que la decisión de pricing respete el rol de cada SKU.
            </p>
          </div>
          <div className="panel">
            <h3>09_PRICING</h3>
            <p className="muted">
              Hoja principal del Ejercicio 2. Ahí se completa la decisión de pricing por SKU: decisión, precios recomendados para los próximos meses, impacto esperado, rationale, riesgo y comentarios.
            </p>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="eyebrow">Objetivo</div>
        <h2>Qué estás resolviendo</h2>
        <p className="muted">
          Después de clasificar el portfolio en el Ejercicio 1, el equipo debe definir una arquitectura de precios para los próximos meses.
        </p>
        <p className="muted">
          El desafío no es simplemente subir precios. El desafío es decidir dónde capturar margen, dónde defender competitividad, dónde proteger volumen y dónde usar precio como herramienta táctica para acelerar la salida de productos.
        </p>
        <p className="muted">
          La IA te va a ayudar a ordenar señales, detectar oportunidades y construir una recomendación. La decisión final debe ser defendible por el equipo.
        </p>
      </section>

      <section className="card" style={{ background: "rgba(15, 107, 93, 0.06)", borderColor: "var(--brand)" }}>
        <div className="eyebrow" style={{ color: "var(--brand-strong)" }}>Parte A</div>
        <h2>Entender la lógica de Pricing Optimization</h2>
        <p className="muted">
          Antes de pedirle a la IA que recomiende precios, revisá cómo pensar una decisión de pricing. Un cambio de precio afecta margen, volumen, competitividad, arquitectura de precios y rol del SKU dentro del portfolio.
        </p>
        <p className="muted">
          No alcanza con mirar si un producto está barato o caro contra mercado. Hay que combinar elasticidad, margen, volumen, costo, presión competitiva y rol del SKU.
        </p>
      </section>

      <CriteriaGrid
        eyebrow="Conceptos"
        title="Cómo pensar la decisión de pricing"
        items={conceptItems}
      />

      <MetricList
        eyebrow="Métricas"
        title="Métricas que ayudan a decidir"
        intro="Para recomendar precios, mirá señales combinadas. No decidas usando una sola variable aislada."
        items={metrics}
      />

      <PromptBlock
        eyebrow="Prompt 1"
        title="Lectura por familias"
        helperText="Usá este prompt para que tu IA personal entienda primero el problema por familia o categoría. Todavía no le pidas completar precios SKU por SKU."
        prompt={prompt1}
      />

      <section className="card" style={{ background: "rgba(191, 111, 40, 0.06)", borderColor: "var(--accent)" }}>
        <div className="eyebrow" style={{ color: "var(--accent)" }}>Parte B</div>
        <h2>Definir estrategia de pricing</h2>
        <p className="muted">
          Antes de completar decisiones SKU por SKU, el equipo debe definir una lógica de pricing. La IA puede proponer una estrategia, pero la decisión es del equipo.
        </p>
        <p className="muted">
          La estrategia elegida define cómo se resuelven los trade-offs entre margen, volumen y competitividad.
        </p>
      </section>

      <CriteriaGrid
        eyebrow="Criterios estratégicos"
        title="Criterios estratégicos de pricing"
        items={strategyItems}
      />

      <PromptBlock
        eyebrow="Prompt 2"
        title="Definir estrategia de pricing"
        helperText="Usá este prompt para que la IA compare caminos estratégicos y recomiende una lógica general o mixta por familia antes de completar precios SKU por SKU."
        prompt={prompt2}
      />

      <section className="card" style={{ background: "rgba(15, 107, 93, 0.06)", borderColor: "var(--brand)" }}>
        <div className="eyebrow" style={{ color: "var(--brand-strong)" }}>Parte C</div>
        <h2>Aplicar la estrategia SKU por SKU</h2>
        <p className="muted">
          Ahora usá la estrategia elegida para completar la recomendación de pricing por SKU en 09_PRICING. La IA debe traducir la estrategia en decisiones concretas: subir precio, bajar precio, mantener precio, precio promocional o liquidación.
        </p>
        <p className="muted">
          La recomendación debe respetar el rol del SKU dentro del portfolio y la arquitectura de precios de cada familia.
        </p>
      </section>

      <CriteriaGrid
        eyebrow="Reglas por rol"
        title="Reglas de decisión por rol de portfolio"
        items={portfolioRuleItems}
      />

      <PromptBlock
        eyebrow="Prompt 3"
        title="Completar decisiones de pricing"
        helperText="Usá este prompt para que la IA complete o proponga completar 09_PRICING, usando la estrategia elegida y las señales de 03_BASE_SKUS y 06_PORTFOLIO."
        prompt={prompt3}
      />

      <section className="card" style={{ background: "rgba(191, 111, 40, 0.06)", borderColor: "var(--accent)" }}>
        <div className="eyebrow" style={{ color: "var(--accent)" }}>Parte D</div>
        <h2>Reportar impacto y riesgos</h2>
        <p className="muted">
          Después de completar la propuesta de pricing, usá la IA para resumir el impacto esperado. El objetivo no es prometer un resultado financiero exacto, sino mostrar trade-offs, exposición y riesgos.
        </p>
        <p className="muted">
          En este ejercicio no vamos a usar todavía la hoja de forecast. El impacto debe leerse de manera direccional a partir de las decisiones de pricing, elasticidad proxy, margen, volumen, competitividad y rol de portfolio.
        </p>
      </section>

      <PromptBlock
        eyebrow="Prompt 4"
        title="Reporte final"
        helperText="Usá este prompt para que la IA resuma la recomendación de pricing, el impacto esperado y los riesgos comerciales, usando 09_PRICING como fuente principal."
        prompt={prompt4}
      />

      <section className="card">
        <div className="eyebrow">Síntesis final</div>
        <h2>Guardá la síntesis del impacto</h2>
        <p className="muted">
          No copies toda la respuesta de la IA ni toda la tabla del Excel. Guardá la síntesis de la estrategia elegida, el impacto esperado y las decisiones que revisarías antes de ejecutar.
        </p>

        <CheckpointForm
          exerciseId="ex-02"
          exerciseVersion={1}
          fields={[
            {
              id: "estrategia",
              label: "1. Estrategia de pricing elegida",
              type: "textarea",
              placeholder: "Ejemplo: capturar margen, defender volumen, liquidar o estrategia mixta por familia; explicar por qué.",
              required: true
            },
            {
              id: "impacto",
              label: "2. Impacto esperado en el negocio",
              type: "textarea",
              placeholder: "Ejemplo: impacto esperado en revenue, margen, volumen, competitividad y pricing leakage capturado.",
              required: true
            },
            {
              id: "decisionesRevisar",
              label: "3. Decisiones a revisar antes de ejecutar",
              type: "textarea",
              placeholder: "Ejemplo: SKUs con subas agresivas, familias sensibles, productos Core con riesgo de volumen, SKUs Eliminar con liquidación dudosa o inconsistencias de arquitectura.",
              required: true
            },
            {
              id: "datosValidar",
              label: "4. Datos o supuestos a validar",
              type: "textarea",
              placeholder: "Ejemplo: elasticidad proxy, precios de competidores, costos unitarios, vigencia de promociones, disponibilidad de stock, sustitutos y supuestos de reacción del mercado.",
              required: true
            }
          ]}
          requiresWorkbookUpload
          saveLabel="Guardar checkpoint"
          submitLabel="Subir checkpoint del workbook"
        />
      </section>

      <MetricList
        eyebrow="Criterio de evaluación"
        title="Qué hace buena una recomendación de pricing"
        intro="Una buena entrega no es la que más sube precios. Una buena entrega es la que demuestra criterio para equilibrar margen, volumen, competitividad y rol del SKU dentro del portfolio."
        items={evaluationItems.map((item) => item.title)}
      />
    </ExerciseHeader>
  );
}
