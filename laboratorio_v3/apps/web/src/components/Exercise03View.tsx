"use client";

import { ExerciseHeader } from "./labs/ExerciseHeader";
import { PromptBlock } from "./labs/PromptBlock";
import { CheckpointForm } from "./labs/CheckpointForm";
import { ExerciseWorkbookDownloadCard } from "./ExerciseWorkbookDownloadCard";
import type { Group } from "../types/lab";

type Exercise03ViewProps = {
  group: Group;
  stateVersion: string;
};

export function Exercise03View({ group, stateVersion }: Exercise03ViewProps) {
  return (
    <ExerciseHeader
      eyebrow="AI Revenue & Inventory Copilot"
      title="Ejercicio 3: Forecast Engine"
      subtitle="Proyectar resultados a 90 días a partir de las decisiones de portfolio y pricing."
      groupName={group.name}
      checkpointStatus="borrador"
    >
      <ExerciseWorkbookDownloadCard exerciseId="ex-03" />

      <section className="card" style={{ background: "rgba(15, 107, 93, 0.06)", borderColor: "var(--brand)" }}>
        <div className="eyebrow" style={{ color: "var(--brand-strong)" }}>Memoria del laboratorio</div>
        <h2>El workbook sostiene el recorrido</h2>
        <p className="muted">
          La plataforma acompaña el análisis y registra la síntesis del equipo. El forecast se trabaja en el workbook, principalmente en la hoja <strong>07_FORECAST_90_DIAS</strong>. El checkpoint guarda la decisión, los supuestos y los riesgos que el equipo defendería frente a dirección.
        </p>
      </section>

      <section className="card">
        <div className="eyebrow">Objetivo</div>
        <h2>Qué estás resolviendo</h2>
        <p className="muted">
          Hasta ahora el equipo definió qué productos sostener, revisar o eliminar y qué estrategia de precios aplicar. Ahora el desafío es proyectar qué pasa con revenue, volumen y margen en los próximos 90 días.
        </p>
        <p className="muted">
          Un forecast comercial no es una predicción exacta. Es una forma disciplinada de traducir decisiones en impacto esperado. En este ejercicio vas a construir un forecast base, comparar escenarios de mercado y completar una proyección por SKU en <strong>07_FORECAST_90_DIAS</strong>.
        </p>
        <p className="muted">
          El objetivo no es adivinar el futuro. Es explicitar supuestos, cuantificar exposición y entender cómo las decisiones de portfolio y pricing pueden impactar en ventas, volumen y margen.
        </p>
        <div className="grid two">
          <div className="panel">
            <h3>Hojas principales</h3>
            <p className="muted">07_FORECAST_90_DIAS</p>
          </div>
          <div className="panel">
            <h3>Hojas de apoyo</h3>
            <p className="muted">03_BASE_SKUS, 06_PORTFOLIO, 09_PRICING</p>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="eyebrow">Conceptos clave</div>
        <div className="factGrid">
          <article className="factCard">
            <h3>Baseline</h3>
            <p>Forecast base de continuidad antes de aplicar una lectura de escenario. Sirve como punto de comparación.</p>
          </article>
          <article className="factCard">
            <h3>Projected</h3>
            <p>Escenario proyectado después de incorporar decisiones de portfolio, pricing y supuestos de demanda.</p>
          </article>
          <article className="factCard">
            <h3>M13-M15</h3>
            <p>Próximos 90 días. El equipo debe completar unidades, precios, costos, stock, revenue y margen.</p>
          </article>
          <article className="factCard">
            <h3>Supuestos explícitos</h3>
            <p>Todo forecast depende de hipótesis. El equipo debe explicar qué mueve volumen, precio, margen y riesgo.</p>
          </article>
        </div>
      </section>

      <section className="card" style={{ background: "rgba(15, 107, 93, 0.06)", borderColor: "var(--brand)" }}>
        <div className="eyebrow" style={{ color: "var(--brand-strong)" }}>Parte A</div>
        <h2>Exploración por familias</h2>
        <p className="muted">
          Antes de completar SKU por SKU, analizá el forecast a nivel de familias. El objetivo es detectar dónde se concentra el revenue base, dónde está el margen proyectado, qué familias dependen más de decisiones de pricing y dónde hay mayor riesgo de sobreestimar demanda.
        </p>
      </section>

      <PromptBlock
        eyebrow="Prompt 1"
        title="Lectura inicial por familias"
        helperText="Usá este prompt para que la IA entienda el forecast base y detecte familias críticas antes de completar el escenario proyectado."
        prompt={`Usando el workbook del Laboratorio 1, trabajá con estas hojas:

* 03_BASE_SKUS: fuente histórica de ventas, unidades, precios, costos e inventario.
* 06_PORTFOLIO: decisiones de portfolio ya completadas.
* 09_PRICING: decisiones de pricing ya completadas.
* 07_FORECAST_90_DIAS: hoja de trabajo del forecast.

No inventes nombres de hojas.
No modifiques 03_BASE_SKUS.
No cambies las decisiones ya tomadas en 06_PORTFOLIO o 09_PRICING salvo que encuentres una inconsistencia evidente y la marques para revisión.

Quiero que actúes como analista senior de forecast comercial.

Antes de completar el forecast SKU por SKU, analizá el negocio por familias.

Devolveme:

1. Qué familias concentran mayor revenue histórico.
2. Qué familias concentran mayor margen histórico.
3. Qué familias tienen mayor volumen y podrían mover más el forecast.
4. Qué familias tienen más SKUs marcados como CORE, REVIEW o ELIMINAR en 06_PORTFOLIO.
5. Qué familias concentran más decisiones de pricing relevantes en 09_PRICING.
6. Qué familias podrían crecer, mantenerse o caer según las decisiones tomadas.
7. Qué familias tienen mayor riesgo de sobreestimar demanda.
8. Qué familias tienen mayor riesgo de subestimar demanda.
9. Qué familias deberían revisarse con más cuidado antes de completar M13-M15.
10. Qué tensiones aparecen entre portfolio, pricing, volumen, revenue y margen.

No completes todavía todos los SKUs.
Primero quiero una lectura ejecutiva por familia.
Separá datos observados, cálculos y supuestos.`}
      />

      <section className="card" style={{ background: "rgba(191, 111, 40, 0.06)", borderColor: "var(--accent)" }}>
        <div className="eyebrow" style={{ color: "var(--accent)" }}>Parte B</div>
        <h2>Escenarios de mercado</h2>
        <p className="muted">
          El forecast no debería depender de un único número. El equipo debe comparar escenarios para entender sensibilidad comercial. En este ejercicio se trabajan tres escenarios de mercado: Conservador, Base y Agresivo.
        </p>
      </section>

      <section className="card">
        <div className="factGrid">
          <article className="factCard">
            <h3>Conservador</h3>
            <p>Demanda débil o adopción lenta de decisiones comerciales. Menor crecimiento de unidades, mayor prudencia en revenue proyectado, menor margen esperado si cae volumen. Más foco en riesgo y validación.</p>
          </article>
          <article className="factCard">
            <h3>Base</h3>
            <p>Continuidad ajustada por decisiones de portfolio y pricing. Proyección cercana al baseline, ajuste moderado, margen consistente, riesgo medio.</p>
          </article>
          <article className="factCard">
            <h3>Agresivo</h3>
            <p>Demanda favorable o alta captura de valor. Mayor crecimiento de unidades o revenue, mejor margen esperado, mayor riesgo de sobreestimación, requiere justificar supuestos.</p>
          </article>
        </div>
      </section>

      <PromptBlock
        eyebrow="Prompt 2"
        title="Construir escenarios Conservador, Base y Agresivo"
        helperText="Usá este prompt para que la IA proponga escenarios de mercado y sus supuestos antes de que el equipo elija uno."
        prompt={`Usando el análisis por familias y las hojas 03_BASE_SKUS, 06_PORTFOLIO y 09_PRICING, construí tres escenarios de forecast para M13-M15:

No uses 07_FORECAST_90_DIAS en esta etapa.
La calibración numérica con baseline se hace en el Prompt 2B.

1. Conservador
2. Base
3. Agresivo

Definiciones:

Escenario Conservador:
Asume demanda más débil, respuesta más lenta a las decisiones comerciales, mayor riesgo competitivo o mayor sensibilidad negativa a cambios de precio. Debe evitar sobreestimar unidades, revenue y margen.

Escenario Base:
Asume continuidad razonable ajustada por las decisiones de portfolio y pricing. Es el escenario de referencia para defender ante dirección.

Escenario Agresivo:
Asume demanda favorable, buena captura de margen, menor elasticidad negativa y mayor capacidad de sostener volumen aun con decisiones de pricing.

Para cada escenario, devolveme:

1. Supuesto general de demanda.
2. Supuesto de crecimiento.
3. Cómo debería impactar en unidades M13-M15.
4. Cómo debería impactar en revenue M13-M15.
5. Cómo debería impactar en margen M13-M15.
6. Qué familias serían más beneficiadas.
7. Qué familias tendrían mayor riesgo.
8. Cómo debería tratar SKUs CORE.
9. Cómo debería tratar SKUs REVIEW.
10. Cómo debería tratar SKUs ELIMINAR.
11. Cómo debería incorporar decisiones de pricing.
12. Qué riesgos debería monitorear el equipo.

Después recomendá cuál escenario usar como base de trabajo y por qué.

No completes todavía todos los SKUs.
No presentes el forecast como certeza.
Separá datos observados de supuestos.`}
      />

      <section className="card" style={{ background: "rgba(191, 111, 40, 0.06)", borderColor: "var(--accent)" }}>
        <div className="eyebrow" style={{ color: "var(--accent)" }}>Parte B.2</div>
        <h2>Calibrar escenarios con números</h2>
        <p className="muted">
          Antes de elegir un escenario, el equipo necesita comparar el impacto económico de cada alternativa. Un escenario no es una etiqueta narrativa: es una hipótesis cuantificada sobre demanda, crecimiento, volumen, revenue y margen.
        </p>
        <p className="muted">
          La decisión debe apoyarse en una comparación clara entre forecast baseline, escenario Conservador, escenario Base y escenario Agresivo. El objetivo es entender cuánto cambia el resultado proyectado, qué familias explican la diferencia y qué riesgos aparecen si el equipo se equivoca con el supuesto de demanda.
        </p>
      </section>

      <section className="card">
        <div className="factGrid">
          <article className="factCard">
            <h3>Revenue 90 días</h3>
            <p>Venta proyectada total para M13, M14 y M15. Permite comparar el tamaño económico de cada escenario.</p>
          </article>
          <article className="factCard">
            <h3>Margen 90 días</h3>
            <p>Margen proyectado total para M13, M14 y M15. Permite evaluar si el escenario mejora rentabilidad o sólo empuja volumen.</p>
          </article>
          <article className="factCard">
            <h3>Volumen 90 días</h3>
            <p>Unidades proyectadas para M13, M14 y M15. Permite entender si el forecast depende de crecimiento real de demanda.</p>
          </article>
          <article className="factCard">
            <h3>Sensibilidad vs baseline</h3>
            <p>Diferencia porcentual contra el forecast base. Ayuda a detectar escenarios demasiado optimistas o demasiado conservadores.</p>
          </article>
        </div>
      </section>

      <PromptBlock
        eyebrow="Prompt 2B"
        title="Calibrar escenarios con cálculos comparativos"
        helperText="Usá este prompt para que la IA calcule una comparación cuantitativa entre baseline, Conservador, Base y Agresivo antes de elegir el escenario final."
        prompt={`Usando el workbook del Laboratorio 1, trabajá con estas hojas:

* 03_BASE_SKUS: datos históricos de SKUs.
* 06_PORTFOLIO: decisiones de portfolio ya completadas.
* 09_PRICING: decisiones de pricing ya completadas.
* 07_FORECAST_90_DIAS: hoja de trabajo del forecast.

Objetivo:
Antes de elegir el escenario final, quiero comparar cuantitativamente el forecast baseline contra tres escenarios posibles:

1. Conservador
2. Base
3. Agresivo

Primero calculá o estimá el forecast baseline para M13-M15 usando las columnas baseline de 07_FORECAST_90_DIAS:

* baseline_units_m13
* baseline_units_m14
* baseline_units_m15
* baseline_price_m13
* baseline_price_m14
* baseline_price_m15
* baseline_cost_m13
* baseline_cost_m14
* baseline_cost_m15

Calculá para baseline:

1. Revenue baseline M13, M14 y M15.
2. Revenue baseline total 90 días.
3. Margen baseline M13, M14 y M15.
4. Margen baseline total 90 días.
5. Volumen baseline M13, M14 y M15.
6. Volumen baseline total 90 días.

Después construí tres escenarios comparativos:

Escenario Conservador:

* Demanda más débil.
* Menor crecimiento de unidades.
* Mayor impacto negativo si hubo subas de precio.
* Salida más prudente de SKUs ELIMINAR.
* Mayor riesgo de revenue en familias sensibles.

Escenario Base:

* Continuidad ajustada por portfolio y pricing.
* Crecimiento moderado.
* Efecto pricing razonable.
* Salida ordenada de SKUs ELIMINAR.
* Proyección defendible como caso central.

Escenario Agresivo:

* Demanda favorable.
* Mayor captura de revenue y margen.
* Menor impacto negativo de subas de precio.
* Mejor desempeño de SKUs CORE.
* Mayor riesgo de sobreestimación.

Para cada escenario, devolveme una tabla comparativa con estas columnas:

* escenario
* supuesto de demanda
* supuesto de crecimiento
* volumen proyectado 90 días
* revenue proyectado 90 días
* margen proyectado 90 días
* variación de volumen vs baseline
* variación de revenue vs baseline
* variación de margen vs baseline
* familias que explican la diferencia
* riesgo principal
* nivel de confianza: Alto / Medio / Bajo

También devolveme una segunda tabla por familia con:

* family
* revenue baseline 90 días
* revenue conservador 90 días
* revenue base 90 días
* revenue agresivo 90 días
* margen baseline 90 días
* margen conservador 90 días
* margen base 90 días
* margen agresivo 90 días
* principal driver del cambio
* riesgo de sobreestimación
* riesgo de subestimación

Después respondé:

1. Qué escenario parece más defendible con los datos disponibles.
2. Qué escenario maximiza margen.
3. Qué escenario minimiza riesgo.
4. Qué escenario depende más de supuestos optimistas.
5. Qué familias deberían revisar manualmente antes de elegir.
6. Qué sensibilidad tiene el forecast frente a cambios de volumen.
7. Qué sensibilidad tiene el forecast frente a cambios de precio.
8. Qué escenario recomendarías como punto de partida y por qué.

Importante:

* No inventes datos.
* Si faltan columnas o no podés calcular una métrica, aclaralo.
* Separá cálculos de supuestos.
* No completes todavía 07_FORECAST_90_DIAS SKU por SKU.
* Esta etapa es sólo para elegir el escenario con mejor criterio.
* No presentes el forecast como certeza.
* Mostrá números en ARS y unidades cuando estén disponibles.
* Redondeá los montos en MM si mejora la lectura ejecutiva.

Cierre obligatorio:
Terminá con una sección llamada “Recomendación para elegir escenario” con 5 bullets ejecutivos.`}
      />

      <section className="card" style={{ background: "rgba(15, 107, 93, 0.06)", borderColor: "var(--brand)" }}>
        <div className="eyebrow" style={{ color: "var(--brand-strong)" }}>Parte C</div>
        <h2>Decisión de escenario y variables ajustables</h2>
        <p className="muted">
          El escenario elegido debe surgir de la comparación anterior. El equipo no debería elegir solamente por preferencia o apetito de riesgo, sino por la relación entre impacto económico, sensibilidad, confianza y riesgo de forecast.
        </p>
      </section>

      <section className="card">
        <div className="eyebrow">Criterios para elegir escenario</div>
        <ul className="simpleList">
          <li>Si el objetivo es defender un número prudente ante dirección, usar Conservador o Base.</li>
          <li>Si el objetivo es construir el caso más defendible, usar Base.</li>
          <li>Si el objetivo es mostrar upside comercial, usar Agresivo, pero explicitando riesgos.</li>
          <li>Si el margen mejora sólo por supuestos débiles de volumen, revisar antes de elegir.</li>
          <li>Si pocas familias explican casi todo el upside, validar esas familias manualmente.</li>
          <li>Si el escenario depende de subas de precio con elasticidad incierta, marcarlo como riesgo.</li>
        </ul>
      </section>

      <section className="card">
        <div className="factGrid">
          <article className="factCard">
            <h3>Escenario demanda</h3>
            <p>Define si la demanda esperada es débil, estable o favorable. Afecta principalmente projected_units_m13, projected_units_m14 y projected_units_m15.</p>
          </article>
          <article className="factCard">
            <h3>Escenario crecimiento</h3>
            <p>Define si el negocio proyecta caída, continuidad o expansión. Afecta la trayectoria M13-M15.</p>
          </article>
          <article className="factCard">
            <h3>Efecto pricing</h3>
            <p>Incorpora el efecto esperado de las decisiones tomadas en 09_PRICING sobre volumen, revenue y margen.</p>
          </article>
          <article className="factCard">
            <h3>Efecto portfolio</h3>
            <p>Incorpora si los SKUs CORE se sostienen, los REVIEW se moderan y los ELIMINAR salen progresivamente o reducen volumen.</p>
          </article>
        </div>
      </section>

      <PromptBlock
        eyebrow="Prompt 3"
        title="Completar 07_FORECAST_90_DIAS SKU por SKU"
        helperText="Usá este prompt para que la IA complete o proponga los campos de forecast por SKU usando el escenario elegido."
        prompt={`Usando el workbook del Laboratorio 1, trabajá con estas hojas:

* 03_BASE_SKUS: datos históricos de SKUs.
* 06_PORTFOLIO: decisiones de portfolio ya completadas.
* 09_PRICING: decisiones de pricing ya completadas.
* 07_FORECAST_90_DIAS: hoja que hay que completar.

El escenario elegido por el equipo es:
[Conservador / Base / Agresivo]

Supuesto de demanda:
[describir supuesto]

Supuesto de crecimiento:
[describir supuesto]

Objetivo:
Completar o proponer valores para 07_FORECAST_90_DIAS, proyectando M13, M14 y M15.

Columnas a completar o revisar:

* projected_units_m13
* projected_units_m14
* projected_units_m15
* projected_price_m13
* projected_price_m14
* projected_price_m15
* projected_cost_m13
* projected_cost_m14
* projected_cost_m15
* projected_stock_m13
* projected_stock_m14
* projected_stock_m15
* revenue_m13
* revenue_m14
* revenue_m15
* margin_m13
* margin_m14
* margin_m15
* scenario
* forecast_assumption
* ai_comment
* team_comment

Reglas de negocio:

1. Si portfolio_decision es CORE:
   * sostener el SKU como parte del forecast.
   * proyectar continuidad o crecimiento según escenario.
   * cuidar que pricing no destruya volumen sin justificación.

2. Si portfolio_decision es REVIEW:
   * aplicar una proyección más prudente.
   * marcar riesgos o supuestos en forecast_assumption.
   * evitar crecimiento agresivo salvo que haya evidencia.

3. Si portfolio_decision es ELIMINAR:
   * reflejar salida progresiva, liquidación o reducción de volumen.
   * no proyectar crecimiento normal salvo justificación comercial.
   * explicar si queda revenue residual por liquidación o transición.

4. Si pricing_decision implica subir precio:
   * considerar posible efecto negativo en unidades.
   * estimar si el margen compensa el menor volumen.
   * explicar el supuesto.

5. Si pricing_decision implica bajar precio o promoción:
   * considerar posible efecto positivo en unidades.
   * no asumir crecimiento ilimitado.
   * revisar impacto en margen.

6. Si pricing_decision es mantener:
   * usar baseline ajustado por escenario de demanda.

7. Revenue:
   * revenue_m13 = projected_units_m13 * projected_price_m13.
   * revenue_m14 = projected_units_m14 * projected_price_m14.
   * revenue_m15 = projected_units_m15 * projected_price_m15.

8. Margin:
   * margin_m13 = projected_units_m13 * (projected_price_m13 - projected_cost_m13).
   * margin_m14 = projected_units_m14 * (projected_price_m14 - projected_cost_m14).
   * margin_m15 = projected_units_m15 * (projected_price_m15 - projected_cost_m15).

Importante:

* No inventes datos.
* Si una columna ya tiene fórmula válida, no la reemplaces innecesariamente.
* Si no podés editar el archivo directamente, devolveme una tabla lista para copiar en 07_FORECAST_90_DIAS.
* Respetá sku_id.
* Marcá scenario con el escenario elegido.
* En forecast_assumption explicá el supuesto principal.
* En ai_comment dejá una explicación breve.
* team_comment debe quedar vacío salvo que el equipo quiera desafiar la recomendación.

No cambies las decisiones de 06_PORTFOLIO ni 09_PRICING.
No uses hojas inexistentes.
Separá datos de supuestos.`}
      />

      <section className="card" style={{ background: "rgba(191, 111, 40, 0.06)", borderColor: "var(--accent)" }}>
        <div className="eyebrow" style={{ color: "var(--accent)" }}>Parte D</div>
        <h2>Reporte y síntesis ejecutiva</h2>
        <p className="muted">
          Una vez completada la hoja 07_FORECAST_90_DIAS, el equipo debe resumir el impacto. La plataforma no necesita toda la tabla, sino la síntesis ejecutiva: escenario elegido, supuestos, revenue proyectado, margen proyectado, riesgos y decisiones que requieren validación.
        </p>
      </section>

      <PromptBlock
        eyebrow="Prompt 4"
        title="Reporte final del forecast"
        helperText="Usá este prompt para que la IA resuma el resultado del forecast y lo traduzca en una lectura ejecutiva."
        prompt={`Usá la hoja 07_FORECAST_90_DIAS ya completada como fuente principal del forecast. Si necesitás contexto de portfolio o pricing, cruzá contra:

* 06_PORTFOLIO
* 09_PRICING
* 03_BASE_SKUS

El escenario elegido fue:
[Conservador / Base / Agresivo]

Devolveme:

1. Revenue proyectado total 90 días.
2. Revenue proyectado por M13, M14 y M15.
3. Margen proyectado total 90 días.
4. Margen proyectado por M13, M14 y M15.
5. Volumen proyectado total 90 días.
6. Volumen proyectado por M13, M14 y M15.
7. Comparación contra baseline.
8. Familias que más explican el revenue proyectado.
9. Familias que más explican el margen proyectado.
10. Familias o SKUs con mayor riesgo de forecast.
11. Impacto de las decisiones de portfolio.
12. Impacto de las decisiones de pricing.
13. Qué parte del forecast depende de datos históricos.
14. Qué parte del forecast depende de supuestos.
15. Riesgos de sobreestimación.
16. Riesgos de subestimación.
17. Métricas que deberían monitorearse durante los próximos 90 días.
18. Decisiones que deberían revisarse antes de ejecutar.

Variables para Executive Scoreboard:

* Revenue Base.
* Margen Base.

No presentes el forecast como resultado garantizado.
Hablá de proyección, escenario, exposición y supuestos.
Separá datos calculados de hipótesis.
Marcá cualquier inconsistencia o dato faltante.

Cerrá con una sección llamada “Respuesta para plataforma” usando exactamente estos bloques:

1. Escenario elegido
2. Supuestos de demanda y crecimiento
3. Forecast proyectado 90 días
4. Impacto potencial en revenue y margen
5. Riesgos y decisiones a revisar`}
      />

      <section className="card">
        <div className="eyebrow">Output esperado</div>
        <h2>Qué completar en el workbook</h2>
        <ul className="simpleList">
          <li>07_FORECAST_90_DIAS completa.</li>
          <li>scenario y forecast_assumption completos.</li>
          <li>projected_units_m13, projected_units_m14, projected_units_m15 completos o validados.</li>
          <li>revenue_m13, revenue_m14, revenue_m15 calculados.</li>
          <li>margin_m13, margin_m14, margin_m15 calculados.</li>
        </ul>
      </section>

      <section className="card">
        <div className="eyebrow">Checkpoint</div>
        <h2>Guardá la síntesis del forecast</h2>
        <p className="muted">
          No copies toda la respuesta de la IA ni toda la tabla del Excel. Guardá la síntesis del escenario elegido, los supuestos, el impacto proyectado y los riesgos que revisarías antes de ejecutar.
        </p>

        <CheckpointForm
          exerciseId="ex-03"
          exerciseVersion={1}
          fields={[
            {
              id: "forecast_scenario",
              label: "1. Escenario elegido",
              type: "textarea",
              placeholder: "Conservador, Base o Agresivo. Explicá por qué el equipo eligió ese escenario.",
              required: true
            },
            {
              id: "demand_growth_assumptions",
              label: "2. Supuestos de demanda y crecimiento",
              type: "textarea",
              placeholder: "Explicá qué supuestos usaron para proyectar unidades M13-M15 y cómo incorporaron escenario de demanda y crecimiento.",
              required: true
            },
            {
              id: "forecast_projection_summary",
              label: "3. Forecast proyectado 90 días",
              type: "textarea",
              placeholder: "Resumí venta proyectada, volumen proyectado y margen proyectado para los próximos 90 días.",
              required: true
            },
            {
              id: "business_impact",
              label: "4. Impacto potencial en revenue y margen",
              type: "textarea",
              placeholder: "Explicá cómo impactan las decisiones de portfolio y pricing en revenue, margen y volumen proyectado.",
              required: true
            },
            {
              id: "risks_to_review",
              label: "5. Riesgos y decisiones a revisar",
              type: "textarea",
              placeholder: "Identificá riesgos del forecast, familias sensibles, SKUs críticos, supuestos débiles o decisiones que requieren validación comercial.",
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
