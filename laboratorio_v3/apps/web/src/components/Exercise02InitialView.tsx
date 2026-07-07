"use client";

import { ExerciseHeader } from "./labs/ExerciseHeader";
import { PromptBlock } from "./labs/PromptBlock";
import { CheckpointForm } from "./labs/CheckpointForm";
import { ExerciseWorkbookDownloadCard } from "./ExerciseWorkbookDownloadCard";
import type { Group } from "../types/lab";

type Exercise02InitialViewProps = {
  group: Group;
  stateVersion: string;
};

export function Exercise02InitialView({ group, stateVersion }: Exercise02InitialViewProps) {
  return (
    <ExerciseHeader
      eyebrow="AI Revenue & Inventory Copilot"
      title="Ejercicio 2: Pricing Optimization"
      subtitle="Definir una arquitectura de precios que maximice margen manteniendo posicionamiento competitivo."
      groupName={group.name}
      checkpointStatus="borrador"
    >
      <ExerciseWorkbookDownloadCard exerciseId="ex02" />

      <section className="card">
        <div className="eyebrow">Objetivo</div>
        <h2>Qué estás resolviendo</h2>
        <p className="muted">
          En este ejercicio vas a definir una arquitectura de precios para los próximos meses.
        </p>
        <p className="muted">
          El desafío es equilibrar tres objetivos: capturar margen, defender volumen y mantener la posición competitiva, sin romper la lógica de precios dentro de cada familia.
        </p>
        <p className="muted">
          La decisión operativa por SKU queda en el workbook. La síntesis del impacto, los riesgos y la estrategia elegida quedan en la plataforma.
        </p>
      </section>

      <section className="card" style={{ background: "rgba(15, 107, 93, 0.06)", borderColor: "var(--brand)" }}>
        <div className="eyebrow" style={{ color: "var(--brand-strong)" }}>Parte A</div>
        <h2>Lectura por familias</h2>
        <p className="muted">
          Antes de recomendar precios SKU por SKU, entendé cómo se comportan las familias y SKUs en términos de precio, costo, volumen, margen y competitividad.
        </p>
      </section>

      <PromptBlock
        eyebrow="Prompt 1"
        title="Lectura por familias"
        helperText="Usá este prompt para que tu IA personal explore la base de precios, costos, volúmenes y competencia por familia. No recomiendes ajustes todavía."
        prompt="Analizá 03_BASE_SKUS, 06_PORTFOLIO y 09_PRICING para entender el problema por familias antes de recomendar precios SKU por SKU. No uses 07_FORECAST_90_DIAS."
      />

      <section className="card" style={{ background: "rgba(191, 111, 40, 0.06)", borderColor: "var(--accent)" }}>
        <div className="eyebrow" style={{ color: "var(--accent)" }}>Parte B</div>
        <h2>Diagnóstico cuantitativo de pricing</h2>
        <p className="muted">
          Antes de elegir una estrategia de precios, el equipo necesita cuantificar el problema. No alcanza con decir que una familia “parece cara” o “parece barata”. Hay que estimar elasticidad, comparar precios contra competidores, detectar SKUs subvaluados o sobrevaluados y estimar el potencial económico de mover precios.
        </p>
        <p className="muted">
          El objetivo de esta etapa es construir evidencia para responder: dónde hay oportunidad de capturar margen; dónde hay riesgo de perder volumen; qué SKUs están desalineados frente al mercado; qué familias permiten una estrategia premium; qué familias requieren defender competitividad; cuánto valor económico está en juego.
        </p>
      </section>

      <section className="card">
        <div className="factGrid">
          <article className="factCard">
            <h3>Elasticidad proxy</h3>
            <p>Mide cómo cambió el volumen cuando cambió el precio. No es una elasticidad econométrica perfecta, pero ayuda a distinguir SKUs sensibles de SKUs más defendibles.</p>
          </article>
          <article className="factCard">
            <h3>Índice de competitividad</h3>
            <p>Compara el precio propio contra el precio competidor o mercado. Un índice mayor a 1 indica precio por encima del mercado; menor a 1 indica precio por debajo.</p>
          </article>
          <article className="factCard">
            <h3>Pricing leakage</h3>
            <p>Valor económico potencialmente perdido por vender por debajo de una referencia defendible de mercado o margen.</p>
          </article>
          <article className="factCard">
            <h3>Potencial económico</h3>
            <p>Impacto estimado de corregir precios, considerando margen, volumen esperado y competitividad.</p>
          </article>
        </div>
      </section>

      <PromptBlock
        eyebrow="Prompt 2"
        title="Diagnóstico cuantitativo de pricing"
        helperText="Usá este prompt para que la IA calcule elasticidad proxy, competitividad, sub/sobrevaluación y leakage antes de elegir la estrategia de precios."
        prompt={`Usando el workbook del Laboratorio 1, trabajá con estas hojas:

* 03_BASE_SKUS: fuente de históricos de precios, volumen, costos, margen y precios competidores si están disponibles.
* 06_PORTFOLIO: clasificación de portfolio ya completada.
* 09_PRICING: hoja de trabajo del ejercicio de pricing.

No uses 07_FORECAST_90_DIAS.
No inventes nombres de hojas.
No cambies las decisiones de portfolio ya tomadas.

Quiero que actúes como analista senior de pricing.

Objetivo:
Construir un diagnóstico cuantitativo antes de definir la estrategia de precios.

Calculá o estimá, según los datos disponibles:

1. Elasticidad proxy por SKU.
2. Elasticidad proxy por familia o categoría.
3. Índice de competitividad por SKU.
4. Índice de competitividad por familia.
5. SKUs subvaluados.
6. SKUs sobrevaluados.
7. Pricing leakage.
8. Potencial económico de corrección de precios.
9. Riesgo de pérdida de volumen por suba de precio.
10. Oportunidad de capturar margen sin perder competitividad.

Definiciones sugeridas:

Elasticidad proxy:
Si hay histórico suficiente de precio y volumen, estimá cómo varió el volumen ante cambios de precio.
No la presentes como elasticidad econométrica exacta.
Clasificá sensibilidad como:
* Alta
* Media
* Baja

Índice de competitividad:
precio_actual / precio_competidor o precio_actual / precio_mercado.
Si el índice es menor a 1, el SKU está por debajo del mercado.
Si el índice es cercano a 1, está alineado.
Si el índice es mayor a 1, está por encima del mercado.

SKUs subvaluados:
SKUs con precio por debajo del mercado o referencia competitiva, margen mejorable y riesgo razonable de volumen.

SKUs sobrevaluados:
SKUs con precio por encima del mercado, riesgo competitivo, caída de volumen o margen que no compensa la pérdida potencial de demanda.

Pricing leakage:
Valor económico potencialmente perdido por vender por debajo de una referencia defendible o por no capturar margen donde la sensibilidad parece baja.

Devolveme primero una tabla ejecutiva por familia con:

* family
* revenue actual
* margen actual
* volumen actual
* índice de competitividad promedio
* elasticidad proxy promedio
* cantidad de SKUs subvaluados
* cantidad de SKUs sobrevaluados
* pricing leakage estimado
* potencial económico estimado
* riesgo de volumen
* recomendación preliminar

Después devolveme una tabla de SKUs críticos con:

* sku_id
* sku_name
* family
* portfolio_decision
* precio actual
* precio competidor o referencia de mercado
* índice de competitividad
* margen actual
* elasticidad proxy
* diagnóstico: subvaluado / alineado / sobrevaluado
* oportunidad o riesgo
* recomendación preliminar

Finalmente respondé:

1. Cuántos SKUs subvaluados identificaste.
2. Cuántos SKUs sobrevaluados identificaste.
3. Cuál es el potencial económico estimado.
4. Qué familias tienen mayor oportunidad de capturar margen.
5. Qué familias tienen mayor riesgo competitivo.
6. Qué familias podrían sostener una estrategia premium.
7. Qué familias deberían mantener precio igual mercado.
8. Qué familias deberían defender precio más barato que mercado.
9. Qué supuestos deberíamos validar antes de decidir.

No completes todavía 09_PRICING.
Esta etapa es diagnóstico.
Separá datos calculados de supuestos.
Si una métrica no puede calcularse con los datos disponibles, aclaralo y proponé un proxy razonable.

Cierre obligatorio:
Terminá con una sección llamada “Lectura para decidir posicionamiento” con 5 bullets ejecutivos.`}
      />

      <section className="card" style={{ background: "rgba(15, 107, 93, 0.06)", borderColor: "var(--brand)" }}>
        <div className="eyebrow" style={{ color: "var(--brand-strong)" }}>Parte C</div>
        <h2>Definir posicionamiento y arquitectura de precios</h2>
        <p className="muted">
          Ahora que el equipo ya tiene evidencia de elasticidad, competitividad, leakage y potencial económico, debe elegir un posicionamiento competitivo.
        </p>
      </section>

      <section className="card">
        <div className="factGrid">
          <article className="factCard">
            <h3>A. Más barato que mercado</h3>
            <p>Conviene cuando la categoría es sensible, hay alta elasticidad, fuerte competencia o el objetivo es defender volumen.</p>
          </article>
          <article className="factCard">
            <h3>B. Igual mercado</h3>
            <p>Conviene cuando el objetivo es mantener competitividad sin resignar margen innecesariamente.</p>
          </article>
          <article className="factCard">
            <h3>C. Premium</h3>
            <p>Conviene cuando hay baja sensibilidad, margen defendible, buena propuesta de valor o SKUs/familias con fortaleza comercial.</p>
          </article>
        </div>
      </section>

      <section className="card">
        <div className="eyebrow">Variables ajustables</div>
        <div className="grid two">
          <div className="panel">
            <h3>Posicionamiento competitivo</h3>
            <p className="muted">Decisión por familia o por tipo de SKU: más barato, igual o premium.</p>
          </div>
          <div className="panel">
            <h3>Margen objetivo</h3>
            <p className="muted">Mínimo o target de margen que se busca defender o alcanzar con la arquitectura.</p>
          </div>
          <div className="panel">
            <h3>Categorías estratégicas</h3>
            <p className="muted">Familias que no deberían perder competitividad, aunque signifique resignar algo de margen.</p>
          </div>
        </div>
      </section>

      <PromptBlock
        eyebrow="Prompt 3"
        title="Definir posicionamiento y arquitectura de precios"
        helperText="Usá este prompt para que la IA proponga una arquitectura de precios según el posicionamiento elegido y el diagnóstico cuantitativo."
        prompt={`Usando el diagnóstico cuantitativo de pricing, ayudame a definir una arquitectura de precios para el negocio.

El equipo debe elegir un posicionamiento competitivo principal o mixto:

A. Más barato que mercado
B. Igual mercado
C. Premium

También debe definir:

* margen objetivo
* categorías estratégicas
* familias donde se acepta mayor riesgo
* familias donde se debe defender volumen
* familias donde se debe capturar margen

Devolveme:

1. Qué posicionamiento recomendarías por familia.
2. Qué familias deberían estar más baratas que mercado y por qué.
3. Qué familias deberían estar alineadas a mercado y por qué.
4. Qué familias podrían sostener un posicionamiento premium y por qué.
5. Qué margen objetivo sugerís por familia o tipo de SKU.
6. Qué categorías son estratégicas y no deberían perder competitividad.
7. Qué SKUs CORE deberían protegerse.
8. Qué SKUs REVIEW requieren prueba o validación.
9. Qué SKUs ELIMINAR pueden usar pricing de salida, liquidación o no reposición.
10. Qué trade-offs aparecen entre margen, volumen y competitividad.

Después proponé una arquitectura de precios con:

* regla de posicionamiento por familia
* regla para SKUs CORE
* regla para SKUs REVIEW
* regla para SKUs ELIMINAR
* regla de margen mínimo
* regla de competitividad máxima o mínima
* riesgos a monitorear

No completes todavía 09_PRICING SKU por SKU.
Primero quiero la arquitectura y el criterio de decisión.

No uses 07_FORECAST_90_DIAS.
No inventes nombres de hojas.`}
      />

      <section className="card" style={{ background: "rgba(191, 111, 40, 0.06)", borderColor: "var(--accent)" }}>
        <div className="eyebrow" style={{ color: "var(--accent)" }}>Parte D</div>
        <h2>Completar decisiones de pricing</h2>
        <p className="muted">
          Aplicá la arquitectura de precios al nivel de SKU. La decisión debe ser concreta: subir precio, bajar precio, mantener precio, precio promocional o liquidación.
        </p>
      </section>

      <PromptBlock
        eyebrow="Prompt 4"
        title="Completar decisiones de pricing SKU por SKU"
        helperText="Usá este prompt para que la IA complete la propuesta de pricing en la hoja 09_PRICING, respetando la arquitectura de precios y el posicionamiento elegido."
        prompt={`Usando el workbook del Laboratorio 1, trabajá con:

* 03_BASE_SKUS
* 06_PORTFOLIO
* 09_PRICING

No uses 07_FORECAST_90_DIAS.

El posicionamiento elegido por el equipo es:
[Más barato que mercado / Igual mercado / Premium / Mixto por familia]

Margen objetivo:
[describir]

Categorías estratégicas:
[describir]

Completá o proponé completar 09_PRICING con una recomendación por SKU.

La recomendación debe incluir:

* precio recomendado
* decisión de pricing: subir / bajar / mantener / promocionar / liquidar
* posicionamiento competitivo
* margen esperado
* volumen esperado direccional
* revenue esperado direccional
* impacto en competitividad
* rationale
* riesgo comercial
* ai_comment
* team_comment vacío

Reglas:

1. No recomendar subas agresivas en SKUs de alta elasticidad sin advertir riesgo.
2. No recomendar precios premium si el SKU está sobrevaluado y pierde volumen.
3. No bajar precio si destruye margen y no hay hipótesis clara de recuperación de volumen.
4. Proteger SKUs CORE.
5. Ser prudente con SKUs REVIEW.
6. Para SKUs ELIMINAR, considerar liquidación, no reposición o pricing de salida.
7. Respetar arquitectura de precios dentro de familia.
8. Evitar inconsistencias como productos sustitutos con precios invertidos sin explicación.

Si no podés editar el archivo, devolvé una tabla lista para copiar en 09_PRICING respetando sku_id.

Separá datos observados de supuestos.
Mostrá el impacto esperado: volumen esperado, revenue y margen, e índice de competitividad.`}
      />

      <section className="card" style={{ background: "rgba(15, 107, 93, 0.06)", borderColor: "var(--brand)" }}>
        <div className="eyebrow" style={{ color: "var(--brand-strong)" }}>Parte E</div>
        <h2>Reporte final</h2>
        <p className="muted">
          Resumí la recomendación de pricing, el impacto esperado y los riesgos comerciales usando 09_PRICING como fuente principal.
        </p>
      </section>

      <PromptBlock
        eyebrow="Prompt 5"
        title="Reporte final"
        helperText="Usá este prompt para que la IA genere el resumen ejecutivo del Ejercicio 2 con los insumos que alimentan el scoreboard."
        prompt={`Usando 03_BASE_SKUS, 06_PORTFOLIO y 09_PRICING como fuente principal, resumí el Ejercicio 2 de Pricing Optimization.

No uses 07_FORECAST_90_DIAS.

Devolveme:

1. Cantidad de SKUs con suba, baja, mantener, promocionar y liquidar.
2. Revenue proyectado 90 días (M13-M15).
3. Margen proyectado 90 días (M13-M15).
4. Índice de competitividad promedio ponderado o por familia.
5. Familias con mayor captura de margen.
6. Familias con mayor riesgo de volumen.
7. SKUs críticos a revisar.
8. Impacto esperado en scoreboard:
   * Revenue proyectado
   * Margen proyectado
   * Índice competitividad
9. Riesgos comerciales principales.
10. Supuestos que deberían validarse antes de ejecutar.

Separá datos observados de supuestos.
No inventes datos.
Si una métrica no puede calcularse con los datos disponibles, aclaralo.`}
      />

      <section className="card">
        <div className="eyebrow">Checkpoint</div>
        <h2>Guardá la síntesis del Ejercicio 2</h2>
        <p className="muted">
          No copies toda la respuesta de la IA. Guardá la síntesis del diagnóstico, la estrategia elegida, el impacto esperado y los riesgos que revisarías antes de ejecutar.
        </p>

        <CheckpointForm
          exerciseId="ex02"
          exerciseVersion={1}
          fields={[
            {
              id: "pricing_diagnosis",
              label: "1. Diagnóstico de pricing",
              type: "textarea",
              placeholder: "Ejemplo: SKUs subvaluados y sobrevaluados, elasticidad por familia, leakage estimado y potencial económico.",
              required: true
            },
            {
              id: "pricing_strategy",
              label: "2. Posicionamiento y arquitectura de precios elegida",
              type: "textarea",
              placeholder: "Ejemplo: más barato, igual o premium por familia; margen objetivo; categorías estratégicas; reglas para CORE, REVIEW y ELIMINAR.",
              required: true
            },
            {
              id: "business_impact",
              label: "3. Impacto esperado en margen, revenue y competitividad",
              type: "textarea",
              placeholder: "Ejemplo: revenue proyectado, margen proyectado, índice de competitividad, volumen esperado y familias con mayor impacto.",
              required: true
            },
            {
              id: "risks_to_review",
              label: "4. Riesgos y decisiones a revisar",
              type: "textarea",
              placeholder: "Ejemplo: SKUs con subas agresivas, familias sensibles, riesgo de perder volumen o romper arquitectura de precios.",
              required: true
            },
            {
              id: "assumptions_to_validate",
              label: "5. Datos o supuestos a validar",
              type: "textarea",
              placeholder: "Ejemplo: elasticidad proxy, precios de competidores, costos, vigencia de promociones y supuestos de reacción del mercado.",
              required: true
            }
          ]}
          saveLabel="Guardar borrador"
          submitLabel="Enviar checkpoint"
        />
      </section>
    </ExerciseHeader>
  );
}
