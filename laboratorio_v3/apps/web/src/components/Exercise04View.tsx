"use client";

import { ExerciseHeader } from "./labs/ExerciseHeader";
import { PromptBlock } from "./labs/PromptBlock";
import { CheckpointForm } from "./labs/CheckpointForm";
import { ExerciseWorkbookDownloadCard } from "./ExerciseWorkbookDownloadCard";
import type { Group } from "../types/lab";

type Exercise04ViewProps = {
  group: Group;
  stateVersion: string;
};

export function Exercise04View({ group, stateVersion }: Exercise04ViewProps) {
  return (
    <ExerciseHeader
      eyebrow="AI Revenue & Inventory Copilot"
      title="Ejercicio 4: Inventory & Working Capital Optimization"
      subtitle="Optimizar capital de trabajo minimizando riesgo de quiebres."
      groupName={group.name}
      checkpointStatus="borrador"
    >
      <ExerciseWorkbookDownloadCard exerciseId="ex-04" />

      <section className="card" style={{ background: "rgba(15, 107, 93, 0.06)", borderColor: "var(--brand)" }}>
        <div className="eyebrow" style={{ color: "var(--brand-strong)" }}>Memoria del laboratorio</div>
        <h2>El workbook sostiene el recorrido</h2>
        <p className="muted">
          La plataforma acompaña el análisis y registra la síntesis del equipo. La optimización de inventario se trabaja en el workbook, principalmente en la hoja <strong>08_INVENTARIO</strong>. El checkpoint guarda el DDI objetivo, la lógica de cobertura, el capital liberado y los riesgos que el equipo defendería frente a dirección.
        </p>
      </section>

      <section className="card">
        <div className="eyebrow">Objetivo</div>
        <h2>Qué estás resolviendo</h2>
        <p className="muted">
          Hasta ahora el equipo definió portfolio, pricing y forecast. Ahora el desafío es traducir esa proyección en decisiones de inventario y capital de trabajo.
        </p>
        <p className="muted">
          Un inventario más bajo libera capital, pero puede aumentar el riesgo de quiebre. Un inventario más alto protege ventas, pero inmoviliza caja. En este ejercicio vas a definir DDI objetivo, stock objetivo, capital requerido, capital liberado y riesgo de quiebre por SKU.
        </p>
        <p className="muted">
          El objetivo no es bajar inventario de forma indiscriminada. Es construir una política de cobertura que respete el rol de cada SKU, el forecast de demanda y la presión sobre capital de trabajo.
        </p>
        <div className="grid two">
          <div className="panel">
            <h3>Hojas principales</h3>
            <p className="muted">08_INVENTARIO</p>
          </div>
          <div className="panel">
            <h3>Hojas de apoyo</h3>
            <p className="muted">03_BASE_SKUS, 06_PORTFOLIO, 09_PRICING, 07_FORECAST_90_DIAS</p>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="eyebrow">Conceptos clave</div>
        <div className="factGrid">
          <article className="factCard">
            <h3>DDI actual</h3>
            <p>Indica cuántos días de demanda cubre el stock disponible. Un DDI alto puede inmovilizar capital; un DDI bajo puede aumentar riesgo de quiebre.</p>
          </article>
          <article className="factCard">
            <h3>DDI objetivo</h3>
            <p>Es la cobertura que el equipo decide alcanzar según demanda, criticidad, portfolio y riesgo de servicio.</p>
          </article>
          <article className="factCard">
            <h3>Stock de seguridad</h3>
            <p>Inventario adicional para absorber variaciones de demanda, lead time o ejecución comercial.</p>
          </article>
          <article className="factCard">
            <h3>Capital liberado</h3>
            <p>Valor económico que se podría liberar al reducir exceso de inventario sin comprometer ventas críticas.</p>
          </article>
          <article className="factCard">
            <h3>Riesgo de quiebre</h3>
            <p>Probabilidad o severidad esperada de quedarse sin stock frente al forecast de demanda.</p>
          </article>
        </div>
      </section>

      <section className="card" style={{ background: "rgba(15, 107, 93, 0.06)", borderColor: "var(--brand)" }}>
        <div className="eyebrow" style={{ color: "var(--brand-strong)" }}>Parte A</div>
        <h2>Exploración por familias</h2>
        <p className="muted">
          Antes de completar SKU por SKU, analizá el inventario a nivel de familias. El objetivo es detectar dónde se concentra el capital de trabajo, qué familias tienen DDI elevado, dónde hay riesgo de quiebre y qué productos deberían protegerse por su rol en el portfolio.
        </p>
        <p className="muted">
          No arranques reduciendo stock SKU por SKU sin mirar el negocio. Primero entendé qué familias explican el capital, cuáles tienen exceso y cuáles tienen riesgo operativo.
        </p>
      </section>

      <PromptBlock
        eyebrow="Prompt 1"
        title="Lectura inicial por familias"
        helperText="Usá este prompt para que la IA entienda la situación actual de inventario, DDI y capital de trabajo antes de recomendar acciones SKU por SKU."
        prompt={`Usando el workbook del Laboratorio 1, trabajá con estas hojas:

* 03_BASE_SKUS: fuente histórica de ventas, inventario actual, valor de inventario y DDI actual.
* 06_PORTFOLIO: decisiones de portfolio ya completadas.
* 07_FORECAST_90_DIAS: forecast de unidades M13-M15 ya completado.
* 08_INVENTARIO: hoja de trabajo del ejercicio de inventario.

Podés usar 09_PRICING sólo si necesitás entender si una decisión de precio puede afectar demanda o margen, pero no modifiques pricing.

No inventes nombres de hojas.
No cambies las decisiones ya tomadas en 06_PORTFOLIO, 09_PRICING o 07_FORECAST_90_DIAS.
No completes todavía 08_INVENTARIO SKU por SKU.

Quiero que actúes como analista senior de inventory management y working capital.

Antes de definir DDI objetivo, analizá el negocio por familias.

Devolveme:

1. Qué familias concentran mayor capital de trabajo actual.
2. Qué familias tienen mayor DDI actual.
3. Qué familias tienen menor DDI actual y posible riesgo de quiebre.
4. Qué familias concentran más SKUs CORE, REVIEW o ELIMINAR.
5. Qué familias tienen mayor demanda proyectada según 07_FORECAST_90_DIAS.
6. Qué familias tienen exceso de stock frente al forecast de 90 días.
7. Qué familias podrían liberar capital sin alto riesgo.
8. Qué familias deberían proteger cobertura por riesgo comercial.
9. Qué familias tienen mayor tensión entre liberar capital y evitar quiebres.
10. Qué inconsistencias aparecen entre portfolio, forecast e inventario.

Devolveme una tabla ejecutiva por familia con:

* family
* capital de trabajo actual
* DDI actual promedio o ponderado
* forecast units 90 días
* stock actual
* cantidad de SKUs CORE
* cantidad de SKUs REVIEW
* cantidad de SKUs ELIMINAR
* exceso o déficit de stock
* riesgo preliminar de quiebre
* oportunidad preliminar de liberar capital
* recomendación preliminar

No completes todavía todos los SKUs.
Primero quiero una lectura ejecutiva por familia.
Separá datos observados, cálculos y supuestos.`}
      />

      <section className="card" style={{ background: "rgba(191, 111, 40, 0.06)", borderColor: "var(--accent)" }}>
        <div className="eyebrow" style={{ color: "var(--accent)" }}>Parte B</div>
        <h2>Diagnóstico cuantitativo de inventario</h2>
        <p className="muted">
          Antes de elegir un DDI objetivo, el equipo necesita cuantificar la situación actual. No alcanza con decir que hay “mucho stock” o “poco stock”. Hay que estimar cuánto capital está inmovilizado, qué cobertura real tiene el negocio, qué SKUs podrían liberar capital y qué SKUs podrían generar quiebres.
        </p>
        <p className="muted">
          El objetivo de esta etapa es construir evidencia para responder: cuál es el DDI actual; cuánto capital de trabajo está inmovilizado; dónde hay exceso de inventario; dónde hay riesgo de quiebre; cuánto capital podría liberarse; qué parte del capital no debería tocarse por riesgo comercial.
        </p>
      </section>

      <section className="card">
        <div className="factGrid">
          <article className="factCard">
            <h3>Capital de trabajo actual</h3>
            <p>Valor del inventario actual. Permite saber cuánto dinero está inmovilizado en stock.</p>
          </article>
          <article className="factCard">
            <h3>DDI ponderado</h3>
            <p>Días de inventario calculados considerando demanda o valor. Evita que SKUs chicos distorsionen la lectura.</p>
          </article>
          <article className="factCard">
            <h3>Stock gap</h3>
            <p>Diferencia entre stock actual y stock objetivo estimado. Puede indicar exceso, déficit o cobertura adecuada.</p>
          </article>
          <article className="factCard">
            <h3>Riesgo de quiebre</h3>
            <p>Riesgo de que el stock no alcance para cubrir demanda proyectada, especialmente en SKUs CORE o familias estratégicas.</p>
          </article>
        </div>
      </section>

      <PromptBlock
        eyebrow="Prompt 2"
        title="Diagnóstico cuantitativo de DDI, capital y riesgo"
        helperText="Usá este prompt para que la IA calcule la situación actual y prepare evidencia antes de elegir DDI objetivo."
        prompt={`Usando el workbook del Laboratorio 1, trabajá con estas hojas:

* 03_BASE_SKUS
* 06_PORTFOLIO
* 07_FORECAST_90_DIAS
* 08_INVENTARIO

No uses hojas inexistentes.
No modifiques el forecast ni las decisiones de portfolio.
No completes todavía 08_INVENTARIO SKU por SKU.

Quiero que actúes como analista senior de working capital.

Objetivo:
Construir un diagnóstico cuantitativo de inventario antes de definir DDI objetivo.

Calculá o estimá, según los datos disponibles:

1. DDI actual por SKU.
2. DDI actual por familia.
3. DDI actual total ponderado.
4. Capital de trabajo actual por SKU.
5. Capital de trabajo actual por familia.
6. Capital de trabajo total.
7. Demanda proyectada 90 días según forecast.
8. Stock actual vs demanda proyectada.
9. Exceso de stock.
10. Déficit de stock.
11. SKUs con riesgo de quiebre.
12. SKUs con capital inmovilizado potencialmente liberable.

Definiciones sugeridas:

DDI actual:
current_stock / demanda diaria esperada.
La demanda diaria esperada puede estimarse como forecast_units_90d / 90.

Stock objetivo preliminar:
demanda diaria esperada * DDI objetivo preliminar.

Stock gap:
current_stock - stock objetivo preliminar.
Si es positivo, hay exceso potencial.
Si es negativo, hay déficit potencial.

Capital liberable preliminar:
stock excedente * costo unitario o valor unitario de inventario.
Si no hay costo unitario directo en 08_INVENTARIO, buscar referencia en 03_BASE_SKUS.

Riesgo de quiebre:
Clasificar como Alto / Medio / Bajo considerando:

* DDI actual bajo.
* forecast alto.
* SKU CORE.
* baja cobertura relativa.
* riesgo de perder revenue o margen.

Devolveme primero una tabla ejecutiva por familia con:

* family
* capital de trabajo actual
* DDI actual ponderado
* forecast units 90 días
* stock actual
* stock objetivo preliminar
* exceso de stock
* déficit de stock
* capital liberable preliminar
* SKUs con riesgo de quiebre
* riesgo operativo
* recomendación preliminar

Después devolveme una tabla de SKUs críticos con:

* sku_id
* sku_name
* family
* portfolio_decision
* forecast_units_90d
* current_stock
* current_inventory_value
* ddi_current
* exceso o déficit
* capital liberable estimado
* stockout_risk
* recomendación preliminar

Finalmente respondé:

1. DDI actual total o ponderado.
2. Capital de trabajo actual total.
3. Qué familias explican más capital inmovilizado.
4. Qué familias explican mayor riesgo de quiebre.
5. Qué SKUs CORE requieren protección.
6. Qué SKUs REVIEW requieren ajuste prudente.
7. Qué SKUs ELIMINAR pueden liberar capital.
8. Cuánto capital potencialmente podría liberarse.
9. Qué supuestos deberíamos validar antes de elegir DDI objetivo.

No completes todavía 08_INVENTARIO.
Esta etapa es diagnóstico.
Separá datos calculados de supuestos.
Si una métrica no puede calcularse con los datos disponibles, aclaralo y proponé un proxy razonable.

Cierre obligatorio:
Terminá con una sección llamada “Lectura para definir DDI objetivo” con 5 bullets ejecutivos.`}
      />

      <section className="card" style={{ background: "rgba(15, 107, 93, 0.06)", borderColor: "var(--brand)" }}>
        <div className="eyebrow" style={{ color: "var(--brand-strong)" }}>Parte C</div>
        <h2>Definir DDI objetivo y cobertura</h2>
        <p className="muted">
          Ahora el equipo debe elegir qué DDI objetivo quiere alcanzar. La IA puede recomendar, pero la decisión final es del equipo.
        </p>
        <p className="muted">
          El DDI objetivo no debería ser igual para todos los SKUs. Un SKU CORE con alta demanda necesita más protección que un SKU ELIMINAR. Un SKU REVIEW puede requerir cobertura intermedia. La política de cobertura debe conectar forecast, portfolio, capital y riesgo de quiebre.
        </p>
      </section>

      <section className="card">
        <div className="factGrid">
          <article className="factCard">
            <h3>Política prudente</h3>
            <p>Protege servicio y minimiza quiebres. Conviene cuando hay muchos SKUs CORE, alta demanda proyectada, riesgo alto de quiebre o incertidumbre en forecast. Efecto típico: menor capital liberado, menor riesgo de quiebre, mayor inventario requerido.</p>
          </article>
          <article className="factCard">
            <h3>Política balanceada</h3>
            <p>Libera capital sin comprometer SKUs críticos. Conviene cuando el forecast es razonablemente confiable, hay exceso en algunas familias y se puede diferenciar cobertura por rol de SKU. Efecto típico: capital liberado moderado, riesgo controlado, cobertura diferenciada.</p>
          </article>
          <article className="factCard">
            <h3>Política agresiva</h3>
            <p>Maximiza liberación de capital. Conviene cuando hay sobrestock fuerte, muchos SKUs ELIMINAR o REVIEW, y el objetivo financiero pesa más que servicio. Efecto típico: mayor capital liberado, mayor riesgo de quiebre, requiere monitoreo estricto.</p>
          </article>
        </div>
      </section>

      <section className="card">
        <div className="eyebrow">Variables ajustables</div>
        <div className="grid two">
          <div className="panel">
            <h3>DDI objetivo</h3>
            <p className="muted">Días de inventario deseados para el negocio o por tipo de SKU.</p>
          </div>
          <div className="panel">
            <h3>Cobertura objetivo</h3>
            <p className="muted">Nivel de protección de stock que se quiere mantener según criticidad y demanda.</p>
          </div>
        </div>
      </section>

      <PromptBlock
        eyebrow="Prompt 3"
        title="Definir DDI objetivo y política de cobertura"
        helperText="Usá este prompt para que la IA proponga políticas de cobertura y ayude a elegir el DDI objetivo antes de completar SKU por SKU."
        prompt={`Usando el diagnóstico cuantitativo de inventario, ayudame a definir una política de DDI objetivo y cobertura.

Trabajá con estas hojas:

* 03_BASE_SKUS
* 06_PORTFOLIO
* 07_FORECAST_90_DIAS
* 08_INVENTARIO

No completes todavía 08_INVENTARIO SKU por SKU.
Primero quiero definir la política.

El equipo debe elegir una política principal o mixta:

A. Prudente
B. Balanceada
C. Agresiva

También debe definir:

* DDI objetivo general.
* DDI objetivo para SKUs CORE.
* DDI objetivo para SKUs REVIEW.
* DDI objetivo para SKUs ELIMINAR.
* Cobertura objetivo por familia si corresponde.
* Nivel aceptable de riesgo de quiebre.

Devolveme:

1. DDI actual total o ponderado.
2. Capital de trabajo actual.
3. DDI objetivo recomendado.
4. DDI objetivo sugerido para CORE.
5. DDI objetivo sugerido para REVIEW.
6. DDI objetivo sugerido para ELIMINAR.
7. Familias donde conviene una política prudente.
8. Familias donde conviene una política balanceada.
9. Familias donde puede aplicarse una política agresiva.
10. Capital liberable estimado bajo cada política.
11. Riesgo de quiebre esperado bajo cada política.
12. Trade-offs entre capital, servicio y margen.

Compará tres alternativas:

* Política Prudente
* Política Balanceada
* Política Agresiva

Para cada alternativa, devolvé una tabla con:

* política
* DDI objetivo general
* DDI objetivo CORE
* DDI objetivo REVIEW
* DDI objetivo ELIMINAR
* capital requerido
* capital liberado
* SKUs en riesgo de quiebre
* familias críticas
* riesgo operativo
* recomendación

Después recomendá una política y explicá por qué.

No presentes la recomendación como óptimo matemático perfecto.
Separá cálculos de supuestos.

Cierre obligatorio:
Terminá con una sección llamada “Decisión recomendada de DDI objetivo” con 5 bullets ejecutivos.`}
      />

      <section className="card" style={{ background: "rgba(191, 111, 40, 0.06)", borderColor: "var(--accent)" }}>
        <div className="eyebrow" style={{ color: "var(--accent)" }}>Parte D</div>
        <h2>Completar 08_INVENTARIO SKU por SKU</h2>
        <p className="muted">
          Una vez elegidos el DDI objetivo y la política de cobertura, el equipo debe completar 08_INVENTARIO por SKU. La decisión debe traducirse en stock objetivo, stock gap, capital liberado, riesgo de quiebre y acción de inventario.
        </p>
        <p className="muted">
          La lógica debe respetar el rol del SKU: CORE protege cobertura; REVIEW ajusta de forma prudente; ELIMINAR libera capital o liquida. SKUs con alto forecast evitan quiebres; SKUs con bajo forecast y alto stock liberan capital.
        </p>
      </section>

      <PromptBlock
        eyebrow="Prompt 4"
        title="Completar 08_INVENTARIO SKU por SKU"
        helperText="Usá este prompt para que la IA complete o proponga los campos de inventario por SKU usando la política elegida."
        prompt={`Usando el workbook del Laboratorio 1, trabajá con estas hojas:

* 03_BASE_SKUS: inventario actual, costos, ventas históricas y DDI actual.
* 06_PORTFOLIO: decisiones de portfolio ya completadas.
* 07_FORECAST_90_DIAS: forecast de demanda M13-M15.
* 08_INVENTARIO: hoja que hay que completar.

La política elegida por el equipo es:
[Prudente / Balanceada / Agresiva / Mixta por familia]

DDI objetivo general:
[describir]

DDI objetivo CORE:
[describir]

DDI objetivo REVIEW:
[describir]

DDI objetivo ELIMINAR:
[describir]

Cobertura objetivo:
[describir]

Objetivo:
Completar o proponer valores para 08_INVENTARIO.

Columnas a completar o revisar:

* ddi_target
* target_stock
* stock_gap
* inventory_action
* capital_released
* stockout_risk
* rationale
* ai_comment

Reglas de negocio:

1. Si portfolio_decision es CORE:
   * proteger disponibilidad.
   * evitar reducir inventario por debajo de la cobertura objetivo.
   * marcar stockout_risk como Alto si el DDI queda bajo frente al forecast.
   * no liberar capital si compromete ventas críticas.

2. Si portfolio_decision es REVIEW:
   * aplicar ajuste prudente.
   * reducir exceso si existe.
   * mantener cobertura razonable si el forecast sostiene demanda.
   * marcar supuestos en rationale.

3. Si portfolio_decision es ELIMINAR:
   * priorizar liquidación, reducción de stock o no reposición.
   * liberar capital cuando sea posible.
   * no construir stock objetivo alto salvo justificación.

4. Si forecast_units_90d es alto:
   * evitar target_stock demasiado bajo.
   * revisar riesgo de quiebre.

5. Si current_stock es muy superior al stock objetivo:
   * proponer liberar capital, liquidar, reducir compras o no reponer.

6. Si current_stock es inferior al stock objetivo:
   * proponer reponer o proteger cobertura.
   * capital_released no debería ser positivo.

7. target_stock:
   * estimar como demanda diaria esperada * ddi_target.
   * demanda diaria esperada = forecast_units_90d / 90.

8. stock_gap:
   * current_stock - target_stock.
   * positivo indica exceso potencial.
   * negativo indica déficit.

9. capital_released:
   * si hay exceso, estimar valor económico liberable.
   * si no hay exceso, usar 0 o aclarar capital requerido.

10. stockout_risk:
    * clasificar como Alto / Medio / Bajo.
    * considerar DDI, forecast, portfolio_decision y criticidad comercial.

11. inventory_action:
    * mantener cobertura
    * reducir compras
    * liquidar excedente
    * no reponer
    * reponer stock
    * monitorear
    * revisar manualmente

Importante:

* No inventes datos.
* Si una columna ya tiene fórmula válida, no la reemplaces innecesariamente.
* Si no podés editar el archivo directamente, devolveme una tabla lista para copiar en 08_INVENTARIO.
* Respetá sku_id.
* En rationale explicá el criterio de negocio.
* En ai_comment dejá una explicación breve.
* No cambies las decisiones de 06_PORTFOLIO ni el forecast de 07_FORECAST_90_DIAS.
* No uses hojas inexistentes.
* Separá datos de supuestos.`}
      />

      <section className="card" style={{ background: "rgba(15, 107, 93, 0.06)", borderColor: "var(--brand)" }}>
        <div className="eyebrow" style={{ color: "var(--brand-strong)" }}>Parte E</div>
        <h2>Reporte y síntesis ejecutiva</h2>
        <p className="muted">
          Una vez completada la hoja 08_INVENTARIO, el equipo debe resumir el impacto. La plataforma no necesita toda la tabla, sino la síntesis ejecutiva: DDI objetivo, capital liberado, stock de seguridad, riesgo de quiebre y decisiones que requieren validación.
        </p>
      </section>

      <PromptBlock
        eyebrow="Prompt 5"
        title="Reporte final de inventario y capital de trabajo"
        helperText="Usá este prompt para que la IA resuma el resultado de la optimización y lo traduzca en una lectura ejecutiva."
        prompt={`Usá la hoja 08_INVENTARIO ya completada como fuente principal. Si necesitás contexto, cruzá contra:

* 03_BASE_SKUS
* 06_PORTFOLIO
* 07_FORECAST_90_DIAS
* 09_PRICING

La política elegida fue:
[Prudente / Balanceada / Agresiva / Mixta]

El DDI objetivo fue:
[describir]

Devolveme:

1. DDI actual total o ponderado.
2. DDI objetivo recomendado o elegido.
3. Capital de trabajo actual.
4. Capital requerido luego de la optimización.
5. Capital liberado total.
6. Stock de seguridad recomendado.
7. Cantidad de SKUs con riesgo de quiebre Alto, Medio y Bajo.
8. Familias que más capital liberan.
9. Familias con mayor riesgo de quiebre.
10. SKUs CORE que requieren protección.
11. SKUs REVIEW que requieren seguimiento.
12. SKUs ELIMINAR que liberan capital.
13. Impacto esperado en EBITDA.
14. Decisiones que requieren validación operativa.
15. Métricas que deberían monitorearse durante los próximos 90 días.

Variables para Executive Scoreboard:

* Capital trabajo.
* DDI.
* EBITDA.

No presentes la optimización como resultado garantizado.
Hablá de proyección, política, exposición y supuestos.
Separá datos calculados de hipótesis.
Marcá cualquier inconsistencia o dato faltante.

Cerrá con una sección llamada “Respuesta para plataforma” usando exactamente estos bloques:

1. DDI objetivo elegido
2. Política de cobertura
3. Capital liberado estimado
4. Riesgo de quiebre
5. Decisiones a revisar antes de ejecutar`}
      />

      <section className="card">
        <div className="eyebrow">Output esperado</div>
        <h2>Qué completar en el workbook</h2>
        <ul className="simpleList">
          <li>08_INVENTARIO completa.</li>
          <li>ddi_target completo.</li>
          <li>target_stock completo o validado.</li>
          <li>stock_gap completo o validado.</li>
          <li>inventory_action completa.</li>
          <li>capital_released calculado o validado.</li>
          <li>stockout_risk clasificado.</li>
          <li>rationale y ai_comment completos.</li>
        </ul>
      </section>

      <section className="card">
        <div className="eyebrow">Checkpoint</div>
        <h2>Guardá la síntesis del Ejercicio 4</h2>
        <p className="muted">
          No copies toda la respuesta de la IA. Guardá la síntesis del DDI objetivo, la política de cobertura, el capital liberado y los riesgos que revisarías antes de ejecutar.
        </p>

        <CheckpointForm
          exerciseId="ex-04"
          exerciseVersion={1}
          fields={[
            {
              id: "ddi_target_decision",
              label: "1. DDI objetivo elegido",
              type: "textarea",
              placeholder: "Indicá el DDI objetivo elegido y explicá por qué tiene sentido para el negocio.",
              required: true
            },
            {
              id: "coverage_policy",
              label: "2. Política de cobertura",
              type: "textarea",
              placeholder: "Describí si eligieron una política prudente, balanceada, agresiva o mixta por familia/SKU.",
              required: true
            },
            {
              id: "capital_released_summary",
              label: "3. Capital liberado estimado",
              type: "textarea",
              placeholder: "Resumí cuánto capital de trabajo se libera, en qué familias se concentra y qué supuestos sostienen el cálculo.",
              required: true
            },
            {
              id: "stockout_risk_summary",
              label: "4. Riesgo de quiebre",
              type: "textarea",
              placeholder: "Explicá qué familias o SKUs quedan con mayor riesgo de quiebre y cómo deberían monitorearse.",
              required: true
            },
            {
              id: "decisions_to_review",
              label: "5. Decisiones a revisar antes de ejecutar",
              type: "textarea",
              placeholder: "Identificá SKUs críticos, familias sensibles, supuestos de demanda, restricciones operativas o decisiones que requieren validación comercial/logística.",
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
