# Revisión de contenido pedagógico y navegación — NEXUS Retail Labs

Documento generado a partir de la revisión del código fuente del frontend de la plataforma NEXUS Retail Labs.

- Ruta del proyecto: `/Users/naranjax/code/personal/ucema-ai-retail/laboratorio_v3/apps/web/src`
- Fecha de revisión: Junio 2026

---

# 1. Laboratorio 1 — AI Revenue & Inventory Copilot

## 1.1 Ejercicio 0 — Entender el negocio y explorar la base

### Título y subtítulo

- **Título:** Ejercicio 0: Entender el negocio y explorar la base
- **Subtítulo:** Antes de decidir qué productos mantener, ajustar o retirar, necesitás entender cómo está compuesto el negocio.

### Objetivo

En este ejercicio el equipo usa su AI personal para explorar una base de SKUs y construir una primera lectura comercial. Todavía no se busca definir una estrategia final: se busca detectar patrones, alertas y buenas preguntas para seguir investigando.

### Hojas principales y de apoyo

- **Hojas principales:** `03_BASE_SKUS`
- **Hojas de apoyo:** `00_INSTRUCCIONES`, `01_CASO_NEGOCIO`, `02_DICCIONARIO_DATOS`

### Conceptos clave

- **Revenue:** Ventas valorizadas.
- **Margen:** Diferencia entre venta y costo.
- **DDI:** Días de inventario disponible.
- **Capital inmovilizado:** Dinero atrapado en stock.
- **Tendencia:** Evolución mensual de una variable.

### Estructura de secciones / prompts

1. **Paso 1:** Mirá rápido el workbook (reconocer hojas, columnas y variables).
2. **Paso 2:** Usá tu AI personal para explorar la base de SKUs.
3. **Paso 3:** Guardá la síntesis del equipo.

### Prompt completo

```text
Subí el workbook y analizá principalmente la hoja de SKUs.

Quiero que actúes como analista de inteligencia comercial. El objetivo es explorar la base para entender el negocio antes de definir una estrategia comercial.

Primero identificá qué hojas y columnas relevantes tiene el archivo. Luego analizá la hoja de SKUs y devolveme:

1. Qué categorías o familias concentran mayor revenue.
2. Qué categorías o familias concentran mayor margen.
3. Dónde aparece más stock, DDI o capital inmovilizado.
4. Qué productos o categorías muestran caída reciente.
5. Qué productos tienen margen bajo o negativo.
6. Qué señales parecen relevantes para pensar decisiones de portfolio, pricing, inventario o forecast.
7. Qué preguntas debería investigar el equipo antes de tomar decisiones.

Importante:

* No inventes datos.
* Si no encontrás una columna o variable, aclaralo.
* Separá hallazgos basados en datos de hipótesis.
* No propongas todavía una estrategia final.
* Cerrá con una lista de 5 hallazgos principales y 3 preguntas críticas para seguir investigando.
```

### Qué mirar rápido en el workbook

- Qué hojas hay.
- Cuál es la hoja de SKUs.
- Qué variables comerciales aparecen.
- Qué representa cada fila.

### Tips para validar la respuesta de la IA

- Pedile a la IA que indique en qué hoja o columna se basa.
- Si algo suena raro, contrastalo contra el workbook.
- Antes de avanzar, chequeá 2 o 3 afirmaciones importantes.

### Checkpoint fields

| ID | Label | Placeholder |
|---|---|---|
| `hallazgos` | 5 hallazgos principales sobre el negocio | Listá cinco hallazgos concretos de la exploración. |
| `preguntas` | 3 preguntas que conviene investigar antes de decidir | ¿Qué debería investigar el equipo antes de tomar decisiones? |
| `alerta` | 1 alerta sobre los datos o la interpretación de la IA | ¿Qué limitación, duda o señal de cautela encontraron? |

### Requeridos para cerrar el ejercicio

- Síntesis del equipo guardada en plataforma.

---

## 1.2 Ejercicio 1 — Portfolio Optimization

### Título y subtítulo

- **Título:** Ejercicio 1: Portfolio Optimization
- **Subtítulo:** Clasificar SKUs como Core, Review o Eliminar bajo un escenario y una prioridad estratégica.

### Objetivo

Definir una primera estrategia de portfolio. No se define producto por producto a ojo: primero se entiende el negocio por familias o categorías, luego se exploran escenarios estratégicos, se elige una prioridad de negocio y se aplica el criterio SKU por SKU en el workbook. La decisión operativa queda en Excel; la síntesis del impacto, los riesgos y la decisión estratégica quedan en la plataforma.

### Hojas principales y de apoyo

- **Hojas principales:** `06_PORTFOLIO`
- **Hojas de apoyo:** `03_BASE_SKUS`, `04_EXPLORACION`, `05_DIAGNOSTICO_INICIAL`, `11_SCOREBOARD_ALUMNO`

### Conceptos clave

- **Core:** Producto a proteger, sostener o potenciar.
- **Review:** Producto que requiere revisión antes de decidir.
- **Eliminar:** Candidato a salida controlada, liquidación o no reposición.
- **Revenue en riesgo:** Ventas que podrían perderse si se retiran productos.
- **Capital inmovilizado:** Dinero atrapado en stock.

### Métricas que ayudan a decidir

- Revenue total.
- Margen bruto total.
- Margen porcentual.
- Unidades vendidas.
- Stock actual.
- DDI.
- Capital inmovilizado.
- Tendencia reciente.
- Estatus activo o suspendido.
- Cobertura de mercado.
- Precio vs mercado, si está disponible.
- Elasticidad proxy, si está disponible.

### Criterios de decisión de portfolio

#### Core — Proteger, sostener o potenciar

**Cuándo usarlo:**

- Alta contribución a revenue.
- Alta contribución a margen.
- Margen saludable.
- Tendencia estable o positiva.
- Buena cobertura de mercado.
- Relevancia dentro de una familia importante.
- Riesgo alto si se discontinúa.

**Acciones típicas:**

- Mantener disponibilidad.
- Cuidar stock.
- Revisar pricing con prudencia.
- Priorizar abastecimiento.
- Potenciar si la demanda crece.

#### Review — Revisar antes de decidir

**Cuándo usarlo:**

- Buen revenue pero margen bajo.
- Buen margen pero baja rotación.
- Stock alto.
- DDI elevado.
- Capital inmovilizado relevante.
- Tendencia negativa.
- Precio desalineado.
- Cobertura relevante pero eficiencia económica dudosa.
- Datos contradictorios o insuficientes.

**Acciones típicas:**

- Revisar precio.
- Ajustar forecast.
- Validar con negocio.
- Reducir compras.
- Hacer prueba comercial.

#### Eliminar — Salida controlada, liquidación o no reposición

**Cuándo usarlo:**

- Producto suspendido.
- Margen negativo o muy bajo.
- Baja contribución a revenue.
- Baja contribución a margen.
- Baja rotación.
- Tendencia negativa.
- Alto DDI.
- Alto capital inmovilizado sin justificación.
- Bajo riesgo comercial si se retira.
- Baja cobertura o baja relevancia dentro de la familia.

**Acciones típicas:**

- Liquidar stock.
- No reponer.
- Devolver a proveedor si aplica.
- Promoción de salida.
- Discontinuar del catálogo activo.

### Escenarios de optimización

#### Escenario Conservador

- **Objetivo:** Reducir destrucción de valor con bajo riesgo comercial.
- **Lógica:** Solo recomienda eliminar SKUs donde la evidencia es fuerte. Prioriza proteger revenue, margen existente y cobertura de mercado.
- **Tendería a eliminar:** SKUs suspendidos, con margen negativo o muy bajo, con baja venta, baja rotación, alto DDI, capital inmovilizado sin aporte relevante, o bajo riesgo comercial si salen.
- **Tendería a mantener:** SKUs con buen revenue aunque tengan problemas de margen, con buena cobertura, con valor estratégico dentro de una familia, donde hay dudas de datos, o cuya salida podría generar leakage comercial.
- **Trade-off:** Libera menos caja y simplifica menos el portfolio, pero reduce el riesgo de eliminar productos comercialmente relevantes.

#### Escenario Balanceado

- **Objetivo:** Mejorar eficiencia económica sin descuidar demasiado la cobertura comercial.
- **Lógica:** Combina liberación de capital, mejora de margen y cuidado de revenue. Es el escenario base para discutir una primera decisión de portfolio.
- **Tendería a eliminar:** SKUs claramente débiles, con bajo margen y baja rotación, con DDI alto, con capital inmovilizado relevante y baja contribución, con tendencia negativa, o SKUs Review donde se combinan varias señales negativas.
- **Tendería a mantener:** SKUs con buen margen, con buen revenue, relevantes para familias estratégicas, con cobertura importante, o con leakage comercial medio o alto.
- **Trade-off:** Libera más caja que el escenario conservador y mejora la eficiencia del portfolio, pero asume cierto riesgo de revenue, margen o cobertura.

#### Escenario Agresivo

- **Objetivo:** Simplificar el portfolio y liberar capital rápidamente.
- **Lógica:** Acepta mayor riesgo comercial para acelerar la salida de SKUs ineficientes, dudosos o con alto capital inmovilizado.
- **Tendería a eliminar:** SKUs débiles, más SKUs Review, con alto capital inmovilizado, con DDI alto, con margen bajo aunque todavía vendan, con tendencia negativa, con baja cobertura, o con baja relevancia relativa dentro de su familia.
- **Tendería a mantener:** Core claros, con alto revenue, con alto margen, con cobertura crítica, o cuya eliminación generaría leakage comercial alto.
- **Trade-off:** Libera más caja y simplifica más el portfolio, pero puede generar mayor pérdida de revenue, margen, cobertura y leakage comercial.

### Prioridades estratégicas

#### Generación de caja

- **Conviene elegirla cuando:** El negocio necesita mejorar liquidez, reducir inventario excedente o acelerar la salida de productos con baja rotación.
- **Prestá especial atención a:** Capital inmovilizado, stock actual, DDI elevado, baja rotación, productos suspendidos, SKUs con bajo aporte económico relativo, oportunidad de liquidación o no reposición.
- **Riesgo principal:** Liberar caja a costa de perder algo de cobertura, revenue o margen futuro.

#### Rentabilidad

- **Conviene elegirla cuando:** El negocio necesita proteger margen, reducir productos que destruyen valor o concentrarse en SKUs con mejor contribución.
- **Prestá especial atención a:** Margen bruto generado, margen porcentual, SKUs con margen negativo o muy bajo, revenue con baja contribución económica, productos que venden pero aportan poco margen, relación entre margen, stock y rotación, riesgo de sostener productos que ocupan capital sin generar valor suficiente.
- **Riesgo principal:** Mejorar margen, pero afectar revenue, cobertura o presencia comercial si se eliminan productos relevantes para el cliente.

#### Crecimiento o cobertura

- **Conviene elegirla cuando:** El negocio está priorizando expansión, defensa de mercado, disponibilidad o cobertura de categorías estratégicas.
- **Prestá especial atención a:** Cobertura de mercado, revenue actual, familias estratégicas, SKUs que sostienen variedad o profundidad de oferta, riesgo de perder clientes por discontinuar productos relevantes, sustitutos disponibles dentro del portfolio, leakage comercial por eliminar productos con valor de cobertura.
- **Riesgo principal:** Sostener cobertura a costa de mantener capital inmovilizado, baja rotación o menor rentabilidad.

### Variables de impacto que deben aparecer en el análisis

- **Cobertura actual:** Nivel de cobertura del portfolio antes de tomar decisiones de eliminación.
- **Cobertura final estimada:** Nivel de cobertura esperado si se ejecuta el escenario. No debe interpretarse como predicción exacta, sino como exposición o riesgo potencial.
- **Capital inmovilizado:** Valor de inventario asociado a los SKUs actuales.
- **Capital potencialmente liberable:** Valor de inventario asociado a los SKUs candidatos a eliminación, liquidación o no reposición. No significa caja garantizada. Es capital que podría liberarse parcial o progresivamente.
- **Margen generado:** Margen histórico asociado a los SKUs o familias analizadas.
- **Revenue en riesgo:** Revenue histórico asociado a SKUs candidatos a eliminación. No significa que todo ese revenue se pierda, pero sí que queda expuesto por la decisión.
- **Margen en riesgo:** Margen histórico positivo asociado a SKUs candidatos a eliminación.
- **Leakage comercial:** Pérdida potencial de valor comercial por eliminar SKUs que todavía tenían revenue, margen, cobertura o valor estratégico.

### Estructura de secciones / prompts

- **Parte A:** Entender el criterio de portfolio.
- **Parte B:** Explorar escenarios estratégicos.
- **Parte C:** Elegir escenario y prioridad estratégica.
- **Parte D:** Aplicar el criterio y resumir impacto.

### Prompt 1 — Lectura por familias

```text
Usando el workbook del Laboratorio 1, analizá la hoja 03_BASE_SKUS.

Quiero que actúes como analista de inteligencia comercial. Antes de clasificar producto por producto, ayudame a entender el portfolio por familias o categorías.

Devolveme:

1. Qué familias concentran revenue.
2. Qué familias concentran margen bruto.
3. Qué familias tienen mayor stock, DDI o capital inmovilizado.
4. Qué familias tienen más productos suspendidos o con baja rotación.
5. Qué familias muestran caída reciente, margen bajo o señales de riesgo.
6. Qué familias tienen buena cobertura de mercado y podrían ser sensibles si se eliminan productos.
7. Qué señales deberían influir en la decisión de portfolio.
8. Qué tensiones aparecen entre revenue, margen, inventario, cobertura y riesgo comercial.

No completes todavía la clasificación SKU por SKU. Primero quiero entender el negocio por familias y las señales más importantes.
```

### Prompt 2 — Explorar escenarios potenciales

```text
Usando el análisis por familias de 03_BASE_SKUS, proponé tres escenarios potenciales de optimización de portfolio:

1. Escenario Conservador
2. Escenario Balanceado
3. Escenario Agresivo

Usá estas definiciones:

Escenario Conservador:
Busca reducir destrucción de valor con bajo riesgo comercial. Solo recomienda eliminar SKUs con señales muy claras: suspendidos, margen negativo o muy bajo, baja venta, baja rotación, alto DDI o capital inmovilizado sin aporte relevante. Si hay dudas, el SKU debería quedar en Review.

Escenario Balanceado:
Busca mejorar eficiencia económica sin descuidar demasiado la cobertura. Puede recomendar eliminar SKUs débiles y algunos SKUs Review cuando combinen bajo margen, baja rotación, alto DDI, baja tendencia o capital inmovilizado relevante. Es el escenario base para discutir una primera decisión.

Escenario Agresivo:
Busca liberar capital y simplificar el portfolio más rápido. Puede recomendar eliminar más SKUs Review, especialmente si tienen alto capital inmovilizado, DDI alto, margen bajo, tendencia negativa o baja relevancia comercial. Acepta mayor riesgo de revenue, margen, cobertura y leakage comercial.

Para cada escenario, devolveme:

1. Qué objetivo prioriza.
2. Qué tipo de SKUs tendería a mantener como Core.
3. Qué tipo de SKUs tendería a dejar en Review.
4. Qué tipo de SKUs tendería a Eliminar.
5. Qué impacto potencial podría tener sobre cobertura.
6. Qué impacto potencial podría tener sobre capital inmovilizado.
7. Qué impacto potencial podría tener sobre margen generado.
8. Qué revenue podría quedar en riesgo.
9. Qué margen podría quedar en riesgo.
10. Qué leakage comercial podría generar.
11. Qué riesgos debería revisar el equipo antes de ejecutar.
12. Qué escenario recomendarías como base para clasificar SKU por SKU y por qué.

No clasifiques todavía todos los SKUs.
No presentes los impactos como predicciones exactas.
Presentalos como lectura estratégica y trade-offs potenciales.
Separá hallazgos basados en datos de hipótesis o supuestos.
```

### Prompt 3 — Completar decisiones SKU por SKU

```text
Usando el workbook del Laboratorio 1, trabajá con estas hojas:

- 03_BASE_SKUS: usala como fuente de datos del negocio.
- 06_PORTFOLIO: usala como hoja de trabajo para completar la propuesta de portfolio.

No modifiques la hoja 03_BASE_SKUS. La clasificación debe completarse o proponerse en 06_PORTFOLIO.

Antes de clasificar, usá como criterio estratégico el escenario elegido por el equipo:

Escenario elegido: [Conservador / Balanceado / Agresivo]
Prioridad estratégica: [Generación de caja / Rentabilidad / Crecimiento o cobertura]

Usá la prioridad estratégica como criterio dominante cuando haya tensiones entre variables:

- Si la prioridad es Generación de caja, pesá más capital inmovilizado, DDI, stock actual y oportunidad de liquidación/no reposición.
- Si la prioridad es Rentabilidad, pesá más margen bruto, margen porcentual, contribución económica y destrucción de valor.
- Si la prioridad es Crecimiento o cobertura, pesá más cobertura de mercado, revenue, familias estratégicas, disponibilidad y riesgo de leakage comercial.

No ignores las demás variables, pero explicá cómo la prioridad elegida influyó en la clasificación.

Quiero que actúes como analista de inteligencia comercial. El objetivo es construir una primera estrategia de portfolio y completar una propuesta por SKU.

Clasificá cada SKU usando estas categorías:

Core:
Producto a proteger, sostener o potenciar. Usalo para SKUs activos con alta contribución a revenue o margen, tendencia estable o positiva, margen saludable, buena cobertura, relevancia comercial o riesgo alto si se discontinuaran.

Review:
Producto que requiere revisión antes de decidir. Usalo para SKUs con señales mixtas: buen revenue pero margen bajo, buen margen pero baja rotación, stock alto, DDI elevado, caída reciente, precio desalineado, cobertura relevante, datos contradictorios o dudas comerciales.

Eliminar:
Producto candidato a salida controlada, liquidación o no reposición. Usalo para SKUs suspendidos o con baja contribución, margen bajo o negativo, tendencia negativa, baja rotación, alto capital inmovilizado sin justificación o bajo riesgo comercial si se retiran.

Aplicá estas reglas según el escenario elegido:

- Si el escenario elegido es Conservador, ante dudas marcá Review. Solo recomendá Eliminar cuando las señales sean claras.
- Si el escenario elegido es Balanceado, decidí según el balance entre contribución económica, capital inmovilizado, margen, cobertura y riesgo comercial.
- Si el escenario elegido es Agresivo, podés recomendar Eliminar en más casos, pero debés explicitar el leakage comercial y el riesgo de cobertura.

Completá o proponé valores para estas columnas de 06_PORTFOLIO:

- decision_portfolio: Core / Review / Eliminar.
- action_90_days: acción recomendada para los próximos 90 días.
- decision_reason: razón principal de la clasificación.
- priority: Alta / Media / Baja.
- commercial_risk: principal riesgo comercial.
- ai_comment: comentario breve que explique la lógica de la recomendación.
- team_comment: dejar vacío salvo que el equipo quiera corregir o desafiar la recomendación.

Criterio para priority:

- Alta: requiere acción rápida por alto impacto, alto riesgo, alto capital inmovilizado, riesgo de quiebre, leakage comercial o decisión crítica.
- Media: relevante, pero no urgente o de impacto moderado.
- Baja: bajo impacto, bajo riesgo o baja urgencia.

Importante:
- No inventes datos.
- Si una variable no existe o no es clara, aclaralo.
- No clasifiques usando una sola variable aislada.
- Si el caso es dudoso, marcá Review.
- Separá hallazgos basados en datos de hipótesis.
- Priorizá la explicación comercial por sobre la aparente precisión matemática.
- Aclará cuando una recomendación dependa del escenario elegido.

Si no podés editar el archivo directamente, devolveme una tabla lista para copiar a 06_PORTFOLIO, respetando sku_id y las columnas solicitadas.
```

### Prompt 4 — Reporte final

```text
Usá la hoja 06_PORTFOLIO ya completada como fuente principal para resumir cómo quedó el portfolio. Si necesitás revenue, margen, stock, DDI, cobertura o familia, cruzalo contra 03_BASE_SKUS usando sku_id.

El escenario elegido fue:

Escenario elegido: [Conservador / Balanceado / Agresivo]
Prioridad estratégica: [Generación de caja / Rentabilidad / Crecimiento o cobertura]

Devolveme:

1. Cantidad total de SKUs clasificados como Core, Review y Eliminar.
2. Cantidad de SKUs en cada clasificación por familia o categoría.
3. Revenue total asociado a cada clasificación.
4. Margen bruto total asociado a cada clasificación.
5. Margen porcentual promedio o rango relevante por clasificación.
6. Stock actual asociado a cada clasificación.
7. Capital inmovilizado asociado a cada clasificación.
8. Capital potencialmente liberable por SKUs candidatos a eliminación.
9. Cobertura actual del portfolio.
10. Cobertura final estimada según la clasificación propuesta.
11. Revenue histórico asociado a SKUs candidatos a eliminación.
12. Margen histórico asociado a SKUs candidatos a eliminación.
13. Margen positivo en riesgo.
14. Margen negativo o destrucción de valor que podría evitarse.
15. Leakage comercial estimado.
16. Principales familias donde se concentra la decisión de Eliminar.
17. Principales familias donde se concentra la decisión de Review.
18. Principales familias que quedan como Core.
19. Riesgos comerciales de ejecutar el escenario elegido.
20. Qué decisiones deberían revisarse manualmente antes de ejecutar.

Compará:
- Antes: portfolio sin decisión explícita.
- Después: portfolio clasificado en Core / Review / Eliminar bajo el escenario elegido.

Definiciones sugeridas:
- Capital inmovilizado: current_inventory_value.
- Capital potencialmente liberable: current_inventory_value de SKUs clasificados como Eliminar.
- Cobertura actual: cobertura del portfolio antes de ejecutar decisiones.
- Cobertura final: cobertura estimada del portfolio que queda como Core o Review.
- Revenue en riesgo: revenue_12m asociado a SKUs clasificados como Eliminar.
- Margen en riesgo: gross_margin_12m positivo asociado a SKUs clasificados como Eliminar.
- Leakage comercial: pérdida potencial de valor comercial por eliminar SKUs que todavía tenían revenue, margen, cobertura o valor estratégico.
- Destrucción de valor evitada: margen negativo o bajo retorno asociado a SKUs que podrían salir del portfolio.

Importante:
- No presentes el impacto como resultado financiero garantizado.
- Hablá de impacto potencial, exposición asociada o capital potencialmente liberable.
- Si no podés calcular alguna métrica con los datos disponibles, aclaralo.
- Separá datos calculados de supuestos.
- Marcá qué supuestos debería validar el negocio antes de ejecutar.
- No ocultes riesgos del escenario elegido.

Cerrá con un resumen ejecutivo de 5 bullets sobre cómo impacta esta decisión al negocio.

Después cerrá tu respuesta con una sección llamada "Respuesta para plataforma" usando exactamente estos 5 bloques:

1. Resumen de clasificación
2. Escenario recomendado o elegido
3. Impacto potencial en el negocio
4. Decisiones a revisar antes de ejecutar
5. Datos o supuestos a validar
```

### Checkpoint fields

| ID | Label | Placeholder |
|---|---|---|
| `classification_summary` | 1. Resumen de clasificación | Ejemplo: cuántos SKUs quedaron como Core, Review y Eliminar, y en qué familias se concentran. |
| `selected_scenario` | 2. Escenario recomendado o elegido | Ejemplo: escenario Conservador, Balanceado o Agresivo; prioridad estratégica elegida; y por qué ese escenario tiene sentido para el caso. |
| `business_impact` | 3. Impacto potencial en el negocio | Ejemplo: capital potencialmente liberable, cobertura final estimada, revenue en riesgo, margen en riesgo, margen negativo evitado o leakage comercial. |
| `decisions_to_review` | 4. Decisiones a revisar antes de ejecutar | Ejemplo: casos dudosos, SKUs críticos, familias sensibles, productos con alto revenue, productos con buena cobertura o decisiones que requieren validación con negocio. |
| `assumptions_to_validate` | 5. Datos o supuestos a validar | Ejemplo: supuestos de recupero de inventario, calidad del dato de cobertura, vigencia de precios, sustitutos disponibles, elasticidad, tendencia de demanda o reglas usadas por la IA. |

### Confirmaciones del checkpoint

- Completé la hoja de portfolio en el workbook.
- Revisé las recomendaciones con criterio ejecutivo, no solo con la AI.

### Requeridos para cerrar el ejercicio

- `06_PORTFOLIO` completa con propuesta de portfolio por SKU.
- Síntesis del criterio guardada en plataforma.

---

## 1.3 Ejercicio 2 — Pricing Optimization

### Título y subtítulo

- **Título:** Ejercicio 2: Pricing Optimization
- **Subtítulo:** Definir una arquitectura de precios que maximice margen manteniendo posicionamiento competitivo.

### Objetivo

Definir una arquitectura de precios para los próximos meses. El desafío es equilibrar tres objetivos: capturar margen, defender volumen y mantener la posición competitiva, sin romper la lógica de precios dentro de cada familia. La decisión operativa por SKU queda en el workbook; la síntesis del impacto, los riesgos y la estrategia elegida quedan en la plataforma.

### Hojas principales y de apoyo

- **Hojas principales:** `09_PRICING`
- **Hojas de apoyo:** `03_BASE_SKUS`, `06_PORTFOLIO`

### Conceptos clave

- **Elasticidad proxy:** Mide cómo cambió el volumen cuando cambió el precio. No es una elasticidad econométrica perfecta, pero ayuda a distinguir SKUs sensibles de SKUs más defendibles.
- **Índice de competitividad:** Compara el precio propio contra el precio competidor o mercado. Un índice mayor a 1 indica precio por encima del mercado; menor a 1 indica precio por debajo.
- **Pricing leakage:** Valor económico potencialmente perdido por vender por debajo de una referencia defendible de mercado o margen.
- **Potencial económico:** Impacto estimado de corregir precios, considerando margen, volumen esperado y competitividad.
- **Arquitectura de precios:** Ordena la relación entre productos, familias, roles y posicionamiento competitivo: más barato, igual o premium.

### Posicionamientos competitivos

- **A. Más barato que mercado:** Conviene cuando la categoría es sensible, hay alta elasticidad, fuerte competencia o el objetivo es defender volumen.
- **B. Igual mercado:** Conviene cuando el objetivo es mantener competitividad sin resignar margen innecesariamente.
- **C. Premium:** Conviene cuando hay baja sensibilidad, margen defendible, buena propuesta de valor o SKUs/familias con fortaleza comercial.

### Variables ajustables

- **Posicionamiento competitivo:** Decisión por familia o por tipo de SKU: más barato, igual o premium.
- **Margen objetivo:** Mínimo o target de margen que se busca defender o alcanzar con la arquitectura.
- **Categorías estratégicas:** Familias que no deberían perder competitividad, aunque signifique resignar algo de margen.

### Estructura de secciones / prompts

- **Parte A:** Lectura por familias.
- **Parte B:** Diagnóstico cuantitativo de pricing.
- **Parte C:** Definir posicionamiento y arquitectura de precios.
- **Parte D:** Completar decisiones de pricing.
- **Parte E:** Reporte final.

### Prompt 1 — Lectura por familias

```text
Analizá 03_BASE_SKUS, 06_PORTFOLIO y 09_PRICING para entender el problema por familias antes de recomendar precios SKU por SKU. No uses 07_FORECAST_90_DIAS.
```

### Prompt 2 — Diagnóstico cuantitativo de pricing

```text
Usando el workbook del Laboratorio 1, trabajá con estas hojas:

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
Terminá con una sección llamada “Lectura para decidir posicionamiento” con 5 bullets ejecutivos.
```

### Prompt 3 — Definir posicionamiento y arquitectura de precios

```text
Usando el diagnóstico cuantitativo de pricing, ayudame a definir una arquitectura de precios para el negocio.

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
No inventes nombres de hojas.
```

### Prompt 4 — Completar decisiones de pricing SKU por SKU

```text
Usando el workbook del Laboratorio 1, trabajá con:

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
Mostrá el impacto esperado: volumen esperado, revenue y margen, e índice de competitividad.
```

### Prompt 5 — Reporte final

```text
Usando 03_BASE_SKUS, 06_PORTFOLIO y 09_PRICING como fuente principal, resumí el Ejercicio 2 de Pricing Optimization.

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
Si una métrica no puede calcularse con los datos disponibles, aclaralo.
```

### Checkpoint fields

| ID | Label | Placeholder |
|---|---|---|
| `pricing_diagnosis` | 1. Diagnóstico de pricing | Ejemplo: SKUs subvaluados y sobrevaluados, elasticidad por familia, leakage estimado y potencial económico. |
| `pricing_strategy` | 2. Posicionamiento y arquitectura de precios elegida | Ejemplo: más barato, igual o premium por familia; margen objetivo; categorías estratégicas; reglas para CORE, REVIEW y ELIMINAR. |
| `business_impact` | 3. Impacto esperado en margen, revenue y competitividad | Ejemplo: revenue proyectado, margen proyectado, índice de competitividad, volumen esperado y familias con mayor impacto. |
| `risks_to_review` | 4. Riesgos y decisiones a revisar | Ejemplo: SKUs con subas agresivas, familias sensibles, riesgo de perder volumen o romper arquitectura de precios. |
| `assumptions_to_validate` | 5. Datos o supuestos a validar | Ejemplo: elasticidad proxy, precios de competidores, costos, vigencia de promociones y supuestos de reacción del mercado. |

### Requeridos para cerrar el ejercicio

- `09_PRICING` completa o propuesta.
- Síntesis de diagnóstico, posicionamiento, impacto y riesgos guardada en plataforma.

---

## 1.4 Ejercicio 3 — Forecast Engine

### Título y subtítulo

- **Título:** Ejercicio 3: Forecast Engine
- **Subtítulo:** Proyectar resultados a 90 días a partir de las decisiones de portfolio y pricing.

### Objetivo

Proyectar qué pasa con revenue, volumen y margen en los próximos 90 días. Un forecast comercial no es una predicción exacta: es una forma disciplinada de traducir decisiones en impacto esperado. El objetivo es explicitar supuestos, cuantificar exposición y entender cómo las decisiones de portfolio y pricing pueden impactar en ventas, volumen y margen.

### Hojas principales y de apoyo

- **Hojas principales:** `07_FORECAST_90_DIAS`
- **Hojas de apoyo:** `03_BASE_SKUS`, `06_PORTFOLIO`, `09_PRICING`

### Conceptos clave

- **Baseline:** Forecast base de continuidad antes de aplicar una lectura de escenario. Sirve como punto de comparación.
- **Projected:** Escenario proyectado después de incorporar decisiones de portfolio, pricing y supuestos de demanda.
- **M13-M15:** Próximos 90 días. El equipo debe completar unidades, precios, costos, stock, revenue y margen.
- **Supuestos explícitos:** Todo forecast depende de hipótesis. El equipo debe explicar qué mueve volumen, precio, margen y riesgo.

### Preguntas orientadoras

- ¿Qué familias explican el forecast base?
- ¿Qué escenario de mercado elegimos?
- ¿Qué supuestos mueven unidades M13-M15?
- ¿Cómo impacta pricing en volumen y margen?
- ¿Qué riesgos tiene la proyección?

### Escenarios de mercado

- **Conservador:** Demanda débil o adopción lenta de decisiones comerciales. Menor crecimiento de unidades, mayor prudencia en revenue proyectado, menor margen esperado si cae volumen. Más foco en riesgo y validación.
- **Base:** Continuidad ajustada por decisiones de portfolio y pricing. Proyección cercana al baseline, ajuste moderado, margen consistente, riesgo medio.
- **Agresivo:** Demanda favorable o alta captura de valor. Mayor crecimiento de unidades o revenue, mejor margen esperado, mayor riesgo de sobreestimación, requiere justificar supuestos.

### Variables ajustables

- **Escenario demanda:** Define si la demanda esperada es débil, estable o favorable. Afecta principalmente `projected_units_m13`, `projected_units_m14` y `projected_units_m15`.
- **Escenario crecimiento:** Define si el negocio proyecta caída, continuidad o expansión. Afecta la trayectoria M13-M15.
- **Efecto pricing:** Incorpora el efecto esperado de las decisiones tomadas en `09_PRICING` sobre volumen, revenue y margen.
- **Efecto portfolio:** Incorpora si los SKUs CORE se sostienen, los REVIEW se moderan y los ELIMINAR salen progresivamente o reducen volumen.

### Criterios para elegir escenario

- Si el objetivo es defender un número prudente ante dirección, usar Conservador o Base.
- Si el objetivo es construir el caso más defendible, usar Base.
- Si el objetivo es mostrar upside comercial, usar Agresivo, pero explicitando riesgos.
- Si el margen mejora sólo por supuestos débiles de volumen, revisar antes de elegir.
- Si pocas familias explican casi todo el upside, validar esas familias manualmente.
- Si el escenario depende de subas de precio con elasticidad incierta, marcarlo como riesgo.

### Estructura de secciones / prompts

- **Parte A:** Exploración por familias.
- **Parte B:** Escenarios de mercado.
- **Parte B.2:** Calibrar escenarios con números.
- **Parte C:** Decisión de escenario y variables ajustables.
- **Parte D:** Reporte y síntesis ejecutiva.

### Prompt 1 — Lectura inicial por familias

```text
Usando el workbook del Laboratorio 1, trabajá con estas hojas:

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
Separá datos observados, cálculos y supuestos.
```

### Prompt 2 — Construir escenarios Conservador, Base y Agresivo

```text
Usando el análisis por familias y las hojas 03_BASE_SKUS, 06_PORTFOLIO y 09_PRICING, construí tres escenarios de forecast para M13-M15:

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
Separá datos observados de supuestos.
```

### Prompt 2B — Calibrar escenarios con cálculos comparativos

```text
Usando el workbook del Laboratorio 1, trabajá con estas hojas:

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
Terminá con una sección llamada “Recomendación para elegir escenario” con 5 bullets ejecutivos.
```

### Prompt 3 — Completar 07_FORECAST_90_DIAS SKU por SKU

```text
Usando el workbook del Laboratorio 1, trabajá con estas hojas:

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
Separá datos de supuestos.
```

### Prompt 4 — Reporte final del forecast

```text
Usá la hoja 07_FORECAST_90_DIAS ya completada como fuente principal del forecast. Si necesitás contexto de portfolio o pricing, cruzá contra:

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
5. Riesgos y decisiones a revisar
```

### Output esperado en el workbook

- `07_FORECAST_90_DIAS` completa.
- `scenario` y `forecast_assumption` completos.
- `projected_units_m13`, `projected_units_m14`, `projected_units_m15` completos o validados.
- `revenue_m13`, `revenue_m14`, `revenue_m15` calculados.
- `margin_m13`, `margin_m14`, `margin_m15` calculados.

### Checkpoint fields

| ID | Label | Placeholder |
|---|---|---|
| `forecast_scenario` | 1. Escenario elegido | Conservador, Base o Agresivo. Explicá por qué el equipo eligió ese escenario. |
| `demand_growth_assumptions` | 2. Supuestos de demanda y crecimiento | Explicá qué supuestos usaron para proyectar unidades M13-M15 y cómo incorporaron escenario de demanda y crecimiento. |
| `forecast_projection_summary` | 3. Forecast proyectado 90 días | Resumí venta proyectada, volumen proyectado y margen proyectado para los próximos 90 días. |
| `business_impact` | 4. Impacto potencial en revenue y margen | Explicá cómo impactan las decisiones de portfolio y pricing en revenue, margen y volumen proyectado. |
| `risks_to_review` | 5. Riesgos y decisiones a revisar | Identificá riesgos del forecast, familias sensibles, SKUs críticos, supuestos débiles o decisiones que requieren validación comercial. |

### Requeridos para cerrar el ejercicio

- `07_FORECAST_90_DIAS` completa.
- `scenario` y `forecast_assumption` completos.
- Síntesis del forecast guardada en plataforma.

---

## 1.5 Ejercicio 4 — Inventory & Working Capital Optimization

### Título y subtítulo

- **Título:** Ejercicio 4: Inventory & Working Capital Optimization
- **Subtítulo:** Optimizar capital de trabajo minimizando riesgo de quiebres.

### Objetivo

Traducir la proyección de forecast en decisiones de inventario y capital de trabajo. Un inventario más bajo libera capital, pero puede aumentar el riesgo de quiebre. Un inventario más alto protege ventas, pero inmoviliza caja. El objetivo es construir una política de cobertura que respete el rol de cada SKU, el forecast de demanda y la presión sobre capital de trabajo.

### Hojas principales y de apoyo

- **Hojas principales:** `08_INVENTARIO`
- **Hojas de apoyo:** `03_BASE_SKUS`, `06_PORTFOLIO`, `09_PRICING`, `07_FORECAST_90_DIAS`

### Conceptos clave

- **DDI actual:** Días de inventario actual. Indica cuántos días de demanda cubre el stock disponible. Un DDI alto puede inmovilizar capital; un DDI bajo puede aumentar riesgo de quiebre.
- **DDI objetivo:** Cobertura deseada. Es la cobertura que el equipo decide alcanzar según demanda, criticidad, portfolio y riesgo de servicio.
- **Stock de seguridad:** Inventario adicional para absorber variaciones de demanda, lead time o ejecución comercial.
- **Capital liberado:** Valor económico que se podría liberar al reducir exceso de inventario sin comprometer ventas críticas.
- **Riesgo de quiebre:** Probabilidad o severidad esperada de quedarse sin stock frente al forecast de demanda.

### Preguntas orientadoras

- ¿Qué stock necesita el forecast?
- ¿Dónde hay excedente de inventario?
- ¿Qué SKUs tienen riesgo de quiebre?
- ¿Qué capital puede liberarse sin destruir servicio?

### Estructura de secciones / prompts

- **Parte A:** Exploración por familias.
- **Parte B:** Diagnóstico cuantitativo de inventario.
- **Parte C:** Definir DDI objetivo y cobertura.
- **Parte D:** Completar 08_INVENTARIO SKU por SKU.
- **Parte E:** Reporte y síntesis ejecutiva.

### Políticas de cobertura

- **Prudente:** Protege servicio y minimiza quiebres. Conviene cuando hay muchos SKUs CORE, alta demanda proyectada, riesgo alto de quiebre o incertidumbre en forecast. Efecto típico: menor capital liberado, menor riesgo de quiebre, mayor inventario requerido.
- **Balanceada:** Libera capital sin comprometer SKUs críticos. Conviene cuando el forecast es razonablemente confiable, hay exceso en algunas familias y se puede diferenciar cobertura por rol de SKU. Efecto típico: capital liberado moderado, riesgo controlado, cobertura diferenciada.
- **Agresiva:** Maximiza liberación de capital. Conviene cuando hay sobrestock fuerte, muchos SKUs ELIMINAR o REVIEW, y el objetivo financiero pesa más que servicio. Efecto típico: mayor capital liberado, mayor riesgo de quiebre, requiere monitoreo estricto.

### Variables ajustables

- **DDI objetivo:** Días de inventario deseados para el negocio o por tipo de SKU.
- **Cobertura objetivo:** Nivel de protección de stock que se quiere mantener según criticidad y demanda.

### Prompt 1 — Lectura inicial por familias

```text
Usando el workbook del Laboratorio 1, trabajá con estas hojas:

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
Separá datos observados, cálculos y supuestos.
```

### Prompt 2 — Diagnóstico cuantitativo de DDI, capital y riesgo

```text
Usando el workbook del Laboratorio 1, trabajá con estas hojas:

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
Terminá con una sección llamada “Lectura para definir DDI objetivo” con 5 bullets ejecutivos.
```

### Prompt 3 — Definir DDI objetivo y política de cobertura

```text
Usando el diagnóstico cuantitativo de inventario, ayudame a definir una política de DDI objetivo y cobertura.

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
Terminá con una sección llamada “Decisión recomendada de DDI objetivo” con 5 bullets ejecutivos.
```

### Prompt 4 — Completar 08_INVENTARIO SKU por SKU

```text
Usando el workbook del Laboratorio 1, trabajá con estas hojas:

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
* Separá datos de supuestos.
```

### Prompt 5 — Reporte final de inventario y capital de trabajo

```text
Usá la hoja 08_INVENTARIO ya completada como fuente principal. Si necesitás contexto, cruzá contra:

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
5. Decisiones a revisar antes de ejecutar
```

### Output esperado en el workbook

- `08_INVENTARIO` completa.
- `ddi_target` completo.
- `target_stock` completo o validado.
- `stock_gap` completo o validado.
- `inventory_action` completa.
- `capital_released` calculado o validado.
- `stockout_risk` clasificado.
- `rationale` y `ai_comment` completos.

### Checkpoint fields

| ID | Label | Placeholder |
|---|---|---|
| `ddi_target_decision` | 1. DDI objetivo elegido | Indicá el DDI objetivo elegido y explicá por qué tiene sentido para el negocio. |
| `coverage_policy` | 2. Política de cobertura | Describí si eligieron una política prudente, balanceada, agresiva o mixta por familia/SKU. |
| `capital_released_summary` | 3. Capital liberado estimado | Resumí cuánto capital de trabajo se libera, en qué familias se concentra y qué supuestos sostienen el cálculo. |
| `stockout_risk_summary` | 4. Riesgo de quiebre | Explicá qué familias o SKUs quedan con mayor riesgo de quiebre y cómo deberían monitorearse. |
| `decisions_to_review` | 5. Decisiones a revisar antes de ejecutar | Identificá SKUs críticos, familias sensibles, supuestos de demanda, restricciones operativas o decisiones que requieren validación comercial/logística. |

### Requeridos para cerrar el ejercicio

- `08_INVENTARIO` completa.
- Síntesis de DDI objetivo, política, capital liberado y riesgos guardada en plataforma.

---

# 2. Laboratorio 2 — Customer Profitability Copilot

## 2.1 Ejercicio 1 — Customer Segmentation

### Título y subtítulo

- **Título:** Ejercicio 1: Customer Segmentation
- **Subtítulo:** Clasificar clientes según valor económico y comportamiento.

### Contexto / objetivo

Usar la AI personal para construir una primera segmentación comercial de la base de clientes. No se busca todavía la estrategia final: se busca detectar segmentos de valor, riesgo de fuga y oportunidades promocionales.

### Hojas principales y de apoyo

- **Hojas principales:** `BASE_CLIENTES`, `SEGMENTACION_RFM`
- **Hojas de apoyo:** `00_INSTRUCCIONES`, `01_CASO_NEGOCIO`, `02_DICCIONARIO_DATOS`

### Conceptos clave

- **Recencia:** Tiempo desde la última compra.
- **Frecuencia:** Cantidad de compras en un período.
- **Ticket:** Monto promedio por compra.
- **CLV:** Customer Lifetime Value: valor económico esperado de un cliente a lo largo del tiempo.
- **Churn Score:** Señal de riesgo de que un cliente no vuelva a comprar.
- **RFM:** Segmentación por Recencia, Frecuencia y Monto.

### Preguntas orientadoras

- ¿Qué variables explican mejor el valor de un cliente?
- ¿Qué clientes están en riesgo de fuga?
- ¿Qué clientes son oportunistas o promocioneros?
- ¿Qué segmentos merecen estrategias diferenciadas?

### Prompt completo

```text
Usando el workbook del Laboratorio 2, analizá la base de clientes para construir una primera segmentación comercial.

Quiero que actúes como analista senior de customer profitability.

Primero explorá las variables disponibles:

* recencia
* frecuencia
* ticket
* margen
* categorías compradas
* comportamiento de compra

Después proponé una segmentación inicial usando lógica RFM, CLV y riesgo de churn.

Devolveme:

1. Segmentos principales detectados.
2. Criterios usados para definir cada segmento.
3. Clientes o grupos de clientes con mayor valor económico.
4. Clientes en riesgo de fuga.
5. Clientes oportunistas o promocioneros.
6. Variables más importantes para explicar valor, frecuencia y riesgo.
7. Riesgos o limitaciones de la segmentación.
8. Qué decisiones comerciales habilita esta segmentación.

No inventes datos.
Separá hallazgos basados en datos de hipótesis.
```

### Checkpoint fields

| ID | Label | Placeholder |
|---|---|---|
| `segmentation_summary` | 1. Resumen de segmentación | Ejemplo: segmentos principales detectados y criterios usados. |
| `vip_segment` | 2. Segmento VIP identificado | Ejemplo: clientes con alto valor, frecuencia y ticket. |
| `churn_risk_segment` | 3. Clientes en riesgo de fuga | Ejemplo: perfiles con alta recencia, baja frecuencia o caída de ticket. |
| `opportunistic_segment` | 4. Clientes oportunistas | Ejemplo: clientes sensibles a promociones o compras esporádicas. |
| `assumptions_to_validate` | 5. Datos o supuestos a validar | Ejemplo: calidad de datos, definición de recencia, cálculo de CLV proxy. |

### Requeridos para cerrar el ejercicio

- Segmentación inicial guardada en plataforma.

---

## 2.2 Ejercicio 2 — VIP Strategy Simulator

### Título y subtítulo

- **Título:** Ejercicio 2: VIP Strategy Simulator
- **Subtítulo:** Incrementar CLV del segmento VIP.

### Contexto / objetivo

Diseñar una estrategia para el segmento VIP. El objetivo es incrementar ticket, frecuencia y CLV sin sobre-incentivar clientes que ya comprarían sin promoción.

### Hojas principales y de apoyo

- **Hojas principales:** `SEGMENTACION_RFM`, `ESTRATEGIA_VIP`
- **Hojas de apoyo:** `BASE_CLIENTES`, `CALCULADORA_VIP`

### Conceptos clave

- **CLV incremental:** Valor adicional esperado por acciones de loyalty.
- **Baja incrementalidad:** Riesgo de que la promoción genere ventas que ya ocurrirían de todos modos.
- **Sobre-incentivo:** Dar beneficios a clientes que no necesitan incentivos para comprar.

### Preguntas orientadoras

- ¿Cuál es el tamaño y valor del segmento VIP?
- ¿Qué estrategia de loyalty maximiza CLV incremental?
- ¿Qué nivel de inversión promocional tiene sentido?
- ¿Qué riesgos de baja incrementalidad existen?

### Estrategias a comparar

- Doble puntos.
- Beneficios exclusivos.
- Acceso anticipado.
- Envío gratuito.

Para cada estrategia se estima cualitativamente: impacto en ticket, impacto en frecuencia, impacto en CLV, riesgo de costo promocional, riesgo de baja incrementalidad, condiciones bajo las cuales tendría sentido.

### Niveles de inversión promocional

- Baja.
- Media.
- Alta.

### Prompt completo

```text
Usando la segmentación del Laboratorio 2, enfocá el análisis en el segmento VIP.

Quiero que actúes como analista senior de estrategia comercial y loyalty.

Identificá:

1. Tamaño del segmento VIP.
2. CLV actual estimado.
3. Ticket promedio.
4. Frecuencia.
5. Margen asociado.
6. Categorías más relevantes.
7. Potencial de expansión del segmento.
8. Riesgo de sobre-incentivar clientes que ya comprarían sin promoción.

Compará estas estrategias:

* Doble puntos
* Beneficios exclusivos
* Acceso anticipado
* Envío gratuito

Para cada estrategia, estimá cualitativamente:

1. Impacto esperado en ticket.
2. Impacto esperado en frecuencia.
3. Impacto esperado en CLV.
4. Riesgo de costo promocional.
5. Riesgo de baja incrementalidad.
6. Condiciones bajo las cuales tendría sentido.

Después recomendá una estrategia y una intensidad de inversión:

* Baja
* Media
* Alta

No presentes los resultados como predicción garantizada.
Separá datos de supuestos.
```

### Checkpoint fields

| ID | Label | Placeholder |
|---|---|---|
| `vip_baseline` | 1. Diagnóstico del segmento VIP | Ejemplo: tamaño, CLV, ticket, frecuencia y margen del segmento. |
| `selected_strategy` | 2. Estrategia seleccionada | Ejemplo: Doble puntos, Beneficios exclusivos, Acceso anticipado o Envío gratuito. |
| `investment_level` | 3. Nivel de inversión promocional | Ejemplo: Baja, Media o Alta. |
| `expected_impact` | 4. Impacto esperado | Ejemplo: ticket incremental, frecuencia incremental, CLV incremental y ROI esperado. |
| `risks_to_validate` | 5. Riesgos o supuestos a validar | Ejemplo: baja incrementalidad, sobre-incentivo, elasticidad real del segmento. |

### Requeridos para cerrar el ejercicio

- Estrategia VIP seleccionada y guardada en plataforma.

---

## 2.3 Ejercicio 3 — Churn Recovery Simulator

### Título y subtítulo

- **Título:** Ejercicio 3: Churn Recovery Simulator
- **Subtítulo:** Recuperar clientes en riesgo.

### Contexto / objetivo

Diseñar una estrategia para recuperar clientes en riesgo de fuga. El objetivo es recuperar revenue comprometido sin canibalizar el resto de la base ni atraer solo oportunistas.

### Hojas principales y de apoyo

- **Hojas principales:** `SEGMENTACION_RFM`, `CHURN_RECOVERY`
- **Hojas de apoyo:** `BASE_CLIENTES`, `CALCULADORA_CHURN`

### Conceptos clave

- **Revenue comprometido:** Revenue que podría perderse si los clientes en riesgo no vuelven a comprar.
- **Canibalización:** Riesgo de que una promoción desvíe compras de otros clientes.
- **Reactivación:** Acciones para que un cliente inactivo vuelva a comprar.

### Preguntas orientadoras

- ¿Cuántos clientes están en riesgo y qué CLV está comprometido?
- ¿Qué estrategia de recuperación tiene mejor ROI?
- ¿Qué clientes no conviene recuperar?
- ¿Cómo se controla la canibalización?

### Estrategias a comparar

- % OFF.
- Cashback.
- Reactivación.

Para cada estrategia se evalúa: probabilidad de recuperación, revenue incremental esperado, costo promocional, riesgo de canibalización, riesgo de atraer sólo oportunistas, ROI esperado cualitativo.

### Niveles de inversión promocional

- Baja.
- Media.
- Alta.

### Prompt completo

```text
Usando la segmentación del Laboratorio 2, enfocá el análisis en clientes con riesgo de fuga.

Quiero que actúes como analista senior de churn recovery.

Identificá:

1. Cuántos clientes están en riesgo.
2. Qué CLV está comprometido.
3. Qué señales explican el riesgo de churn.
4. Qué segmentos o perfiles concentran mayor riesgo.
5. Qué categorías o comportamientos aparecen antes de la fuga.
6. Qué clientes conviene recuperar y cuáles no por bajo valor económico.

Compará estas estrategias:

* % OFF
* Cashback
* Reactivación

Para cada estrategia, evaluá:

1. Probabilidad de recuperación.
2. Revenue incremental esperado.
3. Costo promocional.
4. Riesgo de canibalización.
5. Riesgo de atraer sólo oportunistas.
6. ROI esperado cualitativo.

Recomendá una estrategia y nivel de inversión:

* Baja
* Media
* Alta

No inventes datos.
Separá hallazgos de supuestos.
```

### Checkpoint fields

| ID | Label | Placeholder |
|---|---|---|
| `churn_diagnosis` | 1. Diagnóstico de churn | Ejemplo: clientes en riesgo, CLV comprometido y señales de fuga. |
| `selected_recovery_strategy` | 2. Estrategia de recuperación seleccionada | Ejemplo: % OFF, Cashback o Reactivación. |
| `investment_level` | 3. Nivel de inversión promocional | Ejemplo: Baja, Media o Alta. |
| `expected_recovery_impact` | 4. Impacto esperado | Ejemplo: clientes recuperados, revenue incremental y ROI esperado. |
| `risks_to_validate` | 5. Riesgos o supuestos a validar | Ejemplo: canibalización, oportunistas, probabilidad de recuperación real. |

### Requeridos para cerrar el ejercicio

- Estrategia de churn recovery seleccionada y guardada en plataforma.

---

## 2.4 Ejercicio 4 — Opportunistic Customer Simulator

### Título y subtítulo

- **Título:** Ejercicio 4: Opportunistic Customer Simulator
- **Subtítulo:** Incrementar ticket promedio.

### Contexto / objetivo

Diseñar una estrategia para incrementar el ticket promedio de clientes oportunistas. El objetivo es aumentar el valor de la compra sin destruir margen ni generar descuentos innecesarios.

### Hojas principales y de apoyo

- **Hojas principales:** `SEGMENTACION_RFM`, `TICKET_BUILDER`
- **Hojas de apoyo:** `BASE_CLIENTES`, `CALCULADORA_TICKET`

### Conceptos clave

- **Ticket incremental:** Aumento del monto promedio por compra.
- **Cross Selling:** Ofrecer productos complementarios a lo que el cliente ya compra.
- **Bundle:** Paquete de productos vendidos juntos a un precio combinado.

### Preguntas orientadoras

- ¿Cuál es el perfil del cliente oportunista?
- ¿Qué estrategia aumenta ticket sin destruir margen?
- ¿Qué nivel de inversión promocional es razonable?
- ¿Cómo se evita el descuento innecesario?

### Estrategias a comparar

- Cross Selling.
- Bundle.
- Combo.
- Ticket Builder.

Para cada estrategia se evalúa: impacto esperado en ticket, impacto esperado en revenue, impacto esperado en margen, riesgo de descuento innecesario, riesgo de baja incrementalidad, condiciones de éxito.

### Niveles de inversión promocional

- Baja.
- Media.
- Alta.

### Prompt completo

```text
Usando la segmentación del Laboratorio 2, enfocá el análisis en clientes oportunistas.

Quiero que actúes como analista senior de revenue growth y promociones.

Identificá:

1. Tamaño del segmento oportunista.
2. Ticket promedio actual.
3. Frecuencia actual.
4. Margen asociado.
5. Categorías más compradas.
6. Sensibilidad promocional.
7. Oportunidades de aumentar ticket sin destruir margen.

Compará estas estrategias:

* Cross Selling
* Bundle
* Combo
* Ticket Builder

Para cada estrategia, evaluá:

1. Impacto esperado en ticket.
2. Impacto esperado en revenue.
3. Impacto esperado en margen.
4. Riesgo de descuento innecesario.
5. Riesgo de baja incrementalidad.
6. Condiciones de éxito.

Recomendá una estrategia y nivel de inversión:

* Baja
* Media
* Alta

No inventes datos.
Separá datos de hipótesis.
```

### Checkpoint fields

| ID | Label | Placeholder |
|---|---|---|
| `opportunistic_diagnosis` | 1. Diagnóstico de clientes oportunistas | Ejemplo: tamaño, ticket, frecuencia, margen y categorías del segmento. |
| `selected_ticket_strategy` | 2. Estrategia seleccionada | Ejemplo: Cross Selling, Bundle, Combo o Ticket Builder. |
| `investment_level` | 3. Nivel de inversión promocional | Ejemplo: Baja, Media o Alta. |
| `expected_ticket_impact` | 4. Impacto esperado | Ejemplo: ticket incremental, revenue incremental y ROI esperado. |
| `risks_to_validate` | 5. Riesgos o supuestos a validar | Ejemplo: descuento innecesario, baja incrementalidad, impacto en margen. |

### Requeridos para cerrar el ejercicio

- Estrategia de incremento de ticket seleccionada y guardada en plataforma.

---

## 2.5 Ejercicio 5 — Marketing ROI Consolidator

### Título y subtítulo

- **Título:** Ejercicio 5: Marketing ROI Consolidator
- **Subtítulo:** Consolidar todas las inversiones promocionales.

### Contexto / objetivo

Consolidar el impacto económico de las estrategias diseñadas para VIP, churn y oportunistas. El objetivo es tener una visión integral de inversión, revenue incremental, margen y ROI promocional.

### Hojas principales y de apoyo

- **Hojas principales:** `CONSOLIDADOR_ROI`, `MARKETING_DASHBOARD`
- **Hojas de apoyo:** `ESTRATEGIA_VIP`, `CHURN_RECOVERY`, `TICKET_BUILDER`

### Conceptos clave

- **ROI promocional:** Retorno de la inversión en promociones.
- **Margen incremental:** Margen adicional generado por las acciones promocionales.
- **Canibalización:** Ventas desviadas de una estrategia a otra o de clientes no objetivo.

### Preguntas orientadoras

- ¿Cuál es la inversión promocional total?
- ¿Qué revenue y margen incremental esperamos?
- ¿Cuántos clientes recuperamos?
- ¿Qué estrategia aporta más valor y cuál más riesgo?

### Prompt completo

```text
Usando los resultados de los ejercicios anteriores del Laboratorio 2, consolidá el impacto económico de las estrategias promocionales.

Quiero que actúes como analista senior de marketing ROI.

Consolidá:

1. Estrategia elegida para VIP.
2. Estrategia elegida para clientes en riesgo de fuga.
3. Estrategia elegida para clientes oportunistas.
4. Inversión promocional total.
5. Revenue incremental esperado.
6. Margen incremental esperado.
7. Clientes recuperados.
8. Ticket incremental.
9. Frecuencia incremental.
10. ROI promocional consolidado.

Además:

1. Identificá qué estrategia aporta más valor.
2. Identificá qué estrategia tiene más riesgo.
3. Identificá dónde puede haber canibalización.
4. Identificá dónde puede haber baja incrementalidad.
5. Recomendá qué inversiones ejecutar, ajustar o descartar.

No presentes el ROI como resultado garantizado.
Separá cálculos, supuestos y decisiones comerciales.
```

### Checkpoint fields

| ID | Label | Placeholder |
|---|---|---|
| `consolidated_strategy` | 1. Estrategia consolidada | Ejemplo: resumen de estrategias seleccionadas por segmento. |
| `total_investment` | 2. Inversión promocional total | Ejemplo: suma de inversiones VIP, churn y oportunistas. |
| `incremental_impact` | 3. Impacto incremental esperado | Ejemplo: revenue incremental, margen incremental, clientes recuperados, ticket y frecuencia. |
| `consolidated_roi` | 4. ROI promocional consolidado | Ejemplo: cálculo direccional y supuestos clave. |
| `decisions_to_review` | 5. Decisiones a revisar antes de ejecutar | Ejemplo: canibalización, baja incrementalidad, ajustes de inversión. |

### Requeridos para cerrar el ejercicio

- Consolidación de ROI guardada en plataforma.

---

# 3. Navegación de la plataforma

## 3.1 Login y roles

### Página de login

- Ruta: `/login`
- Título: **NEXUS Retail Labs — Laboratorio ejecutivo de decisiones con AI personal**
- El usuario ingresa con usuario de grupo o admin. En el entorno mock la autenticación es `localStorage`-only; en producción debe reemplazarse por backend/Auth real.

### Usuarios y credenciales (entorno mock)

El sistema crea 20 grupos de estudiantes y un usuario administrador:

- Grupos: `grupo01` a `grupo20`.
  - Username: `grupoXX`
  - Nombre mostrado: `Grupo XX`
  - Contraseña: `laboratorio#grupoXX`
  - Rol: `group`
- Admin:
  - Username: `admin`
  - Nombre mostrado: `Admin`
  - Contraseña: `admin#admin#messi`
  - Rol: `admin`

### Roles

- **`group` / estudiante:** Ve solo los ejercicios cuyo estado es `active`. Puede guardar borradores y enviar submissions. No ve el admin.
- **`admin`:** Ve todos los ejercicios (incluidos los de estado `draft` y `archived`), accede al dashboard de gestión `/admin`, puede cambiar el status de ejercicios, ver submissions, resetear envíos y (en modo Amplify) ejecutar el seed de ejercicios.

### Flujo de login

1. El usuario completa usuario y contraseña.
2. El repositorio valida las credenciales.
3. Si son correctas, crea una sesión con `role`, `username`, `groupId` (solo para grupos) y un `token`.
4. Redirige a `/admin` si es admin, o a `/labs` si es grupo.
5. El logout elimina la sesión y redirige a `/login`.

---

## 3.2 Estructura de rutas

### Rutas principales

| Ruta | Descripción |
|---|---|
| `/` | Inicio |
| `/login` | Selector de grupo / login |
| `/labs` | Catálogo de laboratorios |
| `/labs/lab-01` | Overview del Laboratorio 1 |
| `/labs/lab-02` | Overview del Laboratorio 2 |
| `/admin` | Dashboard de gestión (solo admin) |

### Rutas de ejercicios del Laboratorio 1

| Ruta | Ejercicio |
|---|---|
| `/labs/lab-01/exercises/ex-00` | Ejercicio 0: Exploración Inicial |
| `/labs/lab-01/exercises/ex-01` | Ejercicio 1: Portfolio Optimization |
| `/labs/lab-01/exercises/ex-02` | Ejercicio 2: Pricing Optimization |
| `/labs/lab-01/exercises/ex-03` | Ejercicio 3: Forecast Engine |
| `/labs/lab-01/exercises/ex-04` | Ejercicio 4: Inventory & Working Capital Optimization |

### Rutas adicionales del Laboratorio 1

| Ruta | Descripción |
|---|---|
| `/labs/lab-01/scoreboard` | Scoreboard consolidado |
| `/labs/lab-01/final-plan` | Plan de captura de valor 90 días |

### Rutas de ejercicios del Laboratorio 2

| Ruta | Ejercicio |
|---|---|
| `/labs/lab-02/exercises/ex-01` | Ejercicio 1: Customer Segmentation |
| `/labs/lab-02/exercises/ex-02` | Ejercicio 2: VIP Strategy Simulator |
| `/labs/lab-02/exercises/ex-03` | Ejercicio 3: Churn Recovery Simulator |
| `/labs/lab-02/exercises/ex-04` | Ejercicio 4: Opportunistic Customer Simulator |
| `/labs/lab-02/exercises/ex-05` | Ejercicio 5: Marketing ROI Consolidator |

---

## 3.3 AppShell, sidebar y breadcrumbs

### AppShell

`AppShell` es el layout principal que envuelve todas las páginas autenticadas. Contiene:

- **Sidebar fija** a la izquierda.
- **Área principal** (`main`) con breadcrumb y contenido.

### Sidebar

- **Brand block:** `NEXUS` + `Retail Labs`.
- **Navegación principal:**
  - Inicio (`/`)
  - Laboratorios (`/labs`)
  - Admin (`/admin`, solo si el rol es `admin`)
- **Sección contextual de laboratorio:**
  - Si la URL está bajo `/labs/lab-01`, se muestra la sección **Laboratorio 1** con links a Overview y a cada ejercicio activo/visible.
  - Si la URL está bajo `/labs/lab-02`, se muestra la sección **Laboratorio 2** con links a Overview y a cada ejercicio activo/visible.
- **Status pills:** En la vista admin, cada ejercicio del sidebar muestra su status (`active`, `draft`, `archived`).
- **Nota lateral:** *“La plataforma guía. Tu AI analiza. Tu equipo decide.”*
- **Panel de Data mode:** Muestra si la app está en modo `local` o `amplify`.
- **Panel de sesión:** Muestra usuario, rol, grupo y data mode; incluye botón de cerrar sesión.

### Breadcrumbs

Se construyen automáticamente según el `pathname`:

- `/labs` → `Laboratorios`
- `/labs/lab-01` → `Laboratorios / Laboratorio 1`
- `/labs/lab-01/exercises/ex-XX` → `Laboratorios / Laboratorio 1 / Ejercicio X`
- `/labs/lab-01/scoreboard` → `Laboratorios / Laboratorio 1 / Scoreboard`
- `/labs/lab-01/final-plan` → `Laboratorios / Laboratorio 1 / Plan final`
- `/labs/lab-02` → `Laboratorios / Laboratorio 2`
- `/labs/lab-02/exercises/ex-XX` → `Laboratorios / Laboratorio 2 / Ejercicio X`

### Labels de ejercicios usados en breadcrumbs y sidebar

| ID | Label |
|---|---|
| `ex-00` | Ejercicio 0 |
| `ex-01` | Ejercicio 1 |
| `ex02` | Ejercicio 2 |
| `ex-03` | Ejercicio 3 |
| `ex-04` | Ejercicio 4 |
| `lab02-ex01` | Ejercicio 1 |
| `lab02-ex02` | Ejercicio 2 |
| `lab02-ex03` | Ejercicio 3 |
| `lab02-ex04` | Ejercicio 4 |
| `lab02-ex05` | Ejercicio 5 |

---

## 3.4 Admin

### Acceso

- Solo usuarios con `role === "admin"` pueden acceder a `/admin`.
- Si un usuario no autenticado o no admin intenta acceder, se redirige a `/login`.

### Componentes del dashboard de admin

1. **AdminExerciseManager:** gestión de ejercicios.
2. **AdminSubmissionTable:** revisión de submissions.
3. **AdminDiagnostics:** diagnóstico técnico de la capa de persistencia.

### AdminExerciseManager

- Lista todos los ejercicios agrupados por `labId`.
- Muestra: Lab, ID, Título, Path, Versión, Status y Acciones.
- Permite cambiar el status de cada ejercicio entre:
  - `draft`
  - `active`
  - `archived`
- En modo **Amplify**, muestra un botón para **regenerar ejercicios desde código** (llama a `seedExerciseMeta`). Esto crea los que faltan, actualiza los existentes y elimina los obsoletos.
- En modo **local**, los ejercicios se cargan desde la definición estática y el seed no es necesario.

### AdminSubmissionTable

- Muestra todas las submissions/respuestas guardadas.
- Columnas: Lab, Grupo, Ejercicio, Versión, Estado, Actualizado, Enviado, Acciones.
- Permite:
  - **Ver JSON:** expande el `responsesJson` de la submission seleccionada.
  - **Reset:** cambia el estado de una submission a `reset`.
- El lab se infiere a partir del `exerciseId`: si comienza con `lab02-` es `lab-02`, de lo contrario `lab-01`.

### AdminDiagnostics

- Muestra paneles con:
  - `NEXT_PUBLIC_DATA_MODE` (local/amplify).
  - Repository activo (local/amplify/other).
  - Estado del Amplify repository.
  - Cantidad de ejercicios cargados.
  - Cantidad de submissions cargadas.
- Útil para verificar que la capa de persistencia responde correctamente.

---

## 3.5 Progreso de ejercicios

### ExerciseProgressNav

Componente usado en las páginas de overview de cada laboratorio para mostrar la secuencia de ejercicios.

- Muestra una tarjeta por ejercicio.
- Cada tarjeta incluye:
  - Número de ejercicio (`Ej. {order}`).
  - Título.
  - Path.
  - Botón **Abrir**.
  - Status pill (solo admin).
- Si no hay ejercicios habilitados para el rol, muestra: *“No hay ejercicios habilitados para este rol.”*
- El título del componente es:
  - `Secuencia Laboratorio 1` para `lab-01`.
  - `Secuencia Laboratorio 2` para `lab-02`.

### Filtro de visibilidad por rol

- **Admin:** ve todos los ejercicios sin importar su status.
- **Grupo / estudiante:** ve solo ejercicios con `status === "active"`.

### Estados de ejercicio posibles

| Status | Significado |
|---|---|
| `draft` | Borrador / no visible para estudiantes |
| `active` | Visible y disponible para estudiantes |
| `archived` | Archivado / no visible para estudiantes |

### Modo demo en Laboratorio 1

- En el overview de `lab-01`, los grupos (no admins) ven un checkbox: **“Modo demo: abrir todos los ejercicios”**.
- Al activarlo, se abren todos los ejercicios del laboratorio para que el grupo pueda navegar libremente sin depender del status de cada ejercicio.
- El estado del modo demo se guarda vía `mockLabService`.

---

## 3.6 Modo local vs modo Amplify

### Selección del repositorio

El repositorio activo se decide mediante la variable de entorno `NEXT_PUBLIC_DATA_MODE`:

```ts
const mode = process.env.NEXT_PUBLIC_DATA_MODE ?? "local";
if (mode === "amplify") return amplifyLabRepository;
return localLabRepository;
```

- **Valor por defecto:** `local`.
- Para usar Amplify se debe setear `NEXT_PUBLIC_DATA_MODE=amplify`.

### Modo local (`localLabRepository`)

- **Auth:** login mock basado en `localStorage`.
- **Metadatos de ejercicios:** `localStorage` bajo la clave `nexus:exercise-meta`.
- **Submissions:** `localStorage` bajo claves con prefijo `nexus:submission:{groupId}:{exerciseId}:v{version}`.
- **Upload de workbooks:** no se sube el archivo real; solo se guarda metadata en `filesJson`.
- **Seed:** los ejercicios iniciales se cargan desde `INITIAL_EXERCISES` en `labRepository.local.ts` al acceder por primera vez.
- **Estados de submission posibles:** `draft`, `submitted`, `reset`.

### Modo Amplify (`amplifyLabRepository`)

- **Auth:** login mock basado en `localStorage` (aún no se migró a Cognito; es un stub explícito).
- **Metadatos de ejercicios:** persistidos en **Amplify Data** en el modelo `ExerciseMeta`.
- **Submissions:** persistidos en **Amplify Data** en el modelo `Submission`.
- **Upload de workbooks / Storage:** deshabilitado para este MVP. Los workbooks se entregan por fuera.
- **Seed:** requiere llamar a `seedExerciseMeta()` desde el admin (`/admin`) para crear los metadatos iniciales de EX00 a EX04 y de los 5 ejercicios del Laboratorio 2.

### Modelos de datos en Amplify (resumen)

- **ExerciseMeta:**
  - `id`
  - `labId`
  - `title`
  - `path`
  - `order`
  - `status`
  - `version`
- **Submission:**
  - `id`
  - `groupId`
  - `exerciseId`
  - `exerciseVersion`
  - `status`
  - `responsesJson` (string JSON)
  - `submittedAt`
  - timestamps

### Ejercicios iniciales (seed)

Tanto en local como en Amplify, los ejercicios iniciales son:

| ID | Lab | Título | Path | Order | Status default |
|---|---|---|---|---|---|
| `ex-00` | `lab-01` | Ejercicio 0: Exploración Inicial | `/labs/lab-01/exercises/ex-00` | 0 | `active` |
| `ex-01` | `lab-01` | Ejercicio 1: Portfolio Optimization | `/labs/lab-01/exercises/ex-01` | 1 | `active` |
| `ex02` | `lab-01` | Ejercicio 2: Pricing Optimization | `/labs/lab-01/exercises/ex-02` | 2 | `active` |
| `ex-03` | `lab-01` | Ejercicio 3: Forecast Engine | `/labs/lab-01/exercises/ex-03` | 3 | `draft` |
| `ex-04` | `lab-01` | Ejercicio 4: Inventory & Working Capital Optimization | `/labs/lab-01/exercises/ex-04` | 4 | `draft` |
| `lab02-ex01` | `lab-02` | Ejercicio 1: Customer Segmentation | `/labs/lab-02/exercises/ex-01` | 1 | `active` |
| `lab02-ex02` | `lab-02` | Ejercicio 2: VIP Strategy Simulator | `/labs/lab-02/exercises/ex-02` | 2 | `active` |
| `lab02-ex03` | `lab-02` | Ejercicio 3: Churn Recovery Simulator | `/labs/lab-02/exercises/ex-03` | 3 | `active` |
| `lab02-ex04` | `lab-02` | Ejercicio 4: Opportunistic Customer Simulator | `/labs/lab-02/exercises/ex-04` | 4 | `active` |
| `lab02-ex05` | `lab-02` | Ejercicio 5: Marketing ROI Consolidator | `/labs/lab-02/exercises/ex-05` | 5 | `active` |

### Workbooks base asociados

- `ex-00`, `ex-01`, `ex-03`, `ex-04`: `NEXUS_RETAIL_LAB01_WORKBOOK_COMPLETO.xlsx`
- `ex02`: `NEXUS_RETAIL_LAB01_EJ02_PRICING_WORKBOOK.xlsx`
- Los ejercicios del Laboratorio 2 no tienen `workbookBaseKey` definido en el repositorio local.

---

# 4. Tipos de datos relevantes

## 4.1 Grupos y laboratorios

```ts
type Group = { id: string; name: string; role: "student" | "admin"; };
type Lab = { id: string; title: string; description: string; status: "available" | "locked" | "completed" | "mock_available" | "coming_soon"; route?: string; };
```

## 4.2 Sesión y roles

```ts
type Role = "admin" | "group";
type Session = { role: Role; groupId?: string; username: string; token?: string; };
```

## 4.3 Metadatos de ejercicio

```ts
type ExerciseMeta = {
  id: string;
  labId: string;
  title: string;
  path: string;
  order: number;
  status: "draft" | "active" | "archived";
  version: number;
  workbookBaseKey?: string;
};
```

## 4.4 Submissions

```ts
type Submission = {
  id: string;
  groupId: string;
  exerciseId: string;
  exerciseVersion: number;
  status: "draft" | "submitted" | "reset";
  responsesJson: Record<string, unknown>;
  filesJson?: Record<string, unknown>;
  workbookUploadKey?: string;
  reportUploadKey?: string;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
};
```

## 4.5 Scoreboard del sistema (Laboratorio 1)

```ts
type SystemScoreboard = {
  groupId: string;
  labId: string;
  stateVersion: string;
  totalSkus: number;
  coreSkus: number;
  reviewSkus: number;
  eliminateSkus: number;
  revenueBase: number;
  revenueProjected: number;
  revenueImpact: number;
  revenueAtRisk: number;
  grossMarginBase: number;
  grossMarginProjected: number;
  grossMarginImpact: number;
  expectedMarginRate: number;
  workingCapitalBase: number;
  workingCapitalProjected: number;
  capitalReleased: number;
  ebitdaImpact: number;
  ddiCurrent?: number;
  ddiTarget?: number;
  checkpointCount?: number;
  lastWorkbookName?: string | null;
};
```

---

# 5. Notas finales

- Este documento refleja el estado del código en la ruta de trabajo indicada.
- El contenido pedagógico vive principalmente en los componentes de vista de cada ejercicio y en `lib/lab01Content.ts` / `lib/lab02Content.ts`.
- La plataforma no reemplaza al workbook: las decisiones operativas se trabajan en Excel; la plataforma guía, registra síntesis y expone el progreso.
- La capa de persistencia está abstraída en `lib/repositories/labRepository.ts`, permitiendo alternar entre modo local (desarrollo/mock) y modo Amplify (backend real) mediante `NEXT_PUBLIC_DATA_MODE`.
