export const lab01ExerciseContent = {
  "ex-00": {
    title: "Ejercicio 0: Entender el negocio y explorar la base",
    subtitle: "Antes de decidir qué productos mantener, ajustar o retirar, necesitás entender cómo está compuesto el negocio.",
    context: "En este ejercicio vas a usar tu AI personal para explorar una base de SKUs y construir una primera lectura comercial. Todavía no buscamos definir una estrategia final: buscamos detectar patrones, alertas y buenas preguntas para seguir investigando.",
    mainSheets: ["03_BASE_SKUS"],
    supportSheets: ["00_INSTRUCCIONES", "01_CASO_NEGOCIO", "02_DICCIONARIO_DATOS"],
    concepts: [
      { term: "Revenue", definition: "Ventas valorizadas." },
      { term: "Margen", definition: "Diferencia entre venta y costo." },
      { term: "DDI", definition: "Días de inventario disponible." },
      { term: "Capital inmovilizado", definition: "Dinero atrapado en stock." },
      { term: "Tendencia", definition: "Evolución mensual de una variable." }
    ],
    questions: [],
    prompts: [
      {
        title: "Prompt recomendado: explorar la base",
        body: "Subí el workbook y analizá principalmente la hoja de SKUs.\n\nQuiero que actúes como analista de inteligencia comercial. El objetivo es explorar la base para entender el negocio antes de definir una estrategia comercial.\n\nPrimero identificá qué hojas y columnas relevantes tiene el archivo. Luego analizá la hoja de SKUs y devolveme:\n\n1. Qué categorías o familias concentran mayor revenue.\n2. Qué categorías o familias concentran mayor margen.\n3. Dónde aparece más stock, DDI o capital inmovilizado.\n4. Qué productos o categorías muestran caída reciente.\n5. Qué productos tienen margen bajo o negativo.\n6. Qué señales parecen relevantes para pensar decisiones de portfolio, pricing, inventario o forecast.\n7. Qué preguntas debería investigar el equipo antes de tomar decisiones.\n\nImportante:\n\n* No inventes datos.\n* Si no encontrás una columna o variable, aclaralo.\n* Separá hallazgos basados en datos de hipótesis.\n* No propongas todavía una estrategia final.\n* Cerrá con una lista de 5 hallazgos principales y 3 preguntas críticas para seguir investigando."
      }
    ],
    required: ["Síntesis del equipo guardada en plataforma"],
    fields: [
      { key: "hallazgos", label: "5 hallazgos principales sobre el negocio", placeholder: "Listá cinco hallazgos concretos de la exploración." },
      { key: "preguntas", label: "3 preguntas que conviene investigar antes de decidir", placeholder: "¿Qué debería investigar el equipo antes de tomar decisiones?" },
      { key: "alerta", label: "1 alerta sobre los datos o la interpretación de la IA", placeholder: "¿Qué limitación, duda o señal de cautela encontraron?" }
    ],
    confirmations: []
  },
  "ex-01": {
    title: "Ejercicio 1: Definir decisiones de portfolio",
    subtitle: "Clasificar SKUs como Core, Review o Eliminar y justificar la decisión con datos.",
    context: "En este ejercicio vas a definir una primera estrategia de portfolio. Antes de clasificar productos SKU por SKU, necesitás entender cómo se comporta el negocio por familias o categorías. Después vas a usar tu AI personal para aplicar criterios de portfolio y completar una propuesta por producto en el workbook. La decisión operativa por producto queda en el Excel. La síntesis del criterio queda en la plataforma.",
    mainSheets: ["06_PORTFOLIO"],
    supportSheets: ["03_BASE_SKUS", "04_EXPLORACION", "05_DIAGNOSTICO_INICIAL", "11_SCOREBOARD_ALUMNO"],
    concepts: [
      { term: "Core", definition: "Producto a proteger, sostener o potenciar." },
      { term: "Review", definition: "Producto que requiere revisión antes de decidir." },
      { term: "Eliminar", definition: "Candidato a salida controlada, liquidación o no reposición." },
      { term: "Revenue en riesgo", definition: "Ventas que podrían perderse si se retiran productos." },
      { term: "Capital inmovilizado", definition: "Dinero atrapado en stock." }
    ],
    questions: [],
    prompts: [
      {
        title: "Prompt recomendado: completar portfolio por SKU",
        body: "Usando el workbook del Laboratorio 1, analizá la hoja de SKUs y la hoja de portfolio.\n\nQuiero que actúes como analista de inteligencia comercial. El objetivo es construir una primera estrategia de portfolio y completar una propuesta por SKU.\n\nPrimero hacé una lectura agregada por familia o categoría:\n1. Qué familias concentran revenue.\n2. Qué familias concentran margen.\n3. Dónde hay más stock, DDI o capital inmovilizado.\n4. Dónde hay productos suspendidos con stock.\n5. Dónde hay caída reciente o bajo margen.\n6. Qué señales deberían influir en la decisión de portfolio.\n\nDespués, clasificá cada SKU usando estas categorías:\n\nCore: Producto a proteger, sostener o potenciar. Usalo para SKUs activos con alta contribución a revenue o margen, tendencia estable o positiva, margen saludable, relevancia comercial o riesgo alto si se discontinuaran.\n\nReview: Producto que requiere revisión antes de decidir. Usalo para SKUs con señales mixtas: buen revenue pero margen bajo, buen margen pero baja rotación, stock alto, DDI elevado, caída reciente, precio desalineado, datos contradictorios o dudas comerciales.\n\nEliminar: Producto candidato a salida controlada, liquidación o no reposición. Usalo para SKUs suspendidos o con baja contribución, margen bajo o negativo, tendencia negativa, baja rotación, alto capital inmovilizado sin justificación o bajo riesgo comercial si se retiran.\n\nCompletá o proponé valores para estas columnas del workbook:\n\n- decision_portfolio: Core / Review / Eliminar.\n- action_90_days: acción recomendada para los próximos 90 días.\n- decision_reason: razón principal de la clasificación.\n- priority: Alta / Media / Baja.\n- commercial_risk: principal riesgo comercial.\n- ai_comment: comentario breve que explique la lógica de la recomendación.\n- team_comment: dejar vacío salvo que el equipo quiera corregir o desafiar la recomendación.\n\nCriterio para priority:\n- Alta: requiere acción rápida por alto impacto, alto riesgo, alto capital inmovilizado, riesgo de quiebre o decisión crítica.\n- Media: relevante, pero no urgente o de impacto moderado.\n- Baja: bajo impacto, bajo riesgo o baja urgencia.\n\nImportante:\n- No inventes datos.\n- Si una variable no existe o no es clara, aclaralo.\n- No clasifiques usando una sola variable aislada.\n- Si el caso es dudoso, marcá Review.\n- Separá hallazgos basados en datos de hipótesis.\n- Priorizá la explicación comercial por sobre la aparente precisión matemática."
      }
    ],
    required: [
      "06_PORTFOLIO completa con propuesta de portfolio por SKU.",
      "Síntesis del criterio guardada en plataforma."
    ],
    fields: [
      { key: "resumenClasificacion", label: "1. Resumen de clasificación", placeholder: "Ejemplo: cuántos SKUs quedaron como Core, Review y Eliminar, y en qué familias se concentran." },
      { key: "escenarioElegido", label: "2. Escenario recomendado o elegido", placeholder: "Ejemplo: escenario Conservador, Balanceado o Agresivo; prioridad estratégica elegida; y por qué ese escenario tiene sentido para el caso." },
      { key: "impactoPotencial", label: "3. Impacto potencial en el negocio", placeholder: "Ejemplo: capital potencialmente liberable, cobertura final estimada, revenue en riesgo, margen en riesgo, margen negativo evitado o leakage comercial." },
      { key: "decisionesRevisar", label: "4. Decisiones a revisar antes de ejecutar", placeholder: "Ejemplo: casos dudosos, SKUs críticos, familias sensibles, productos con alto revenue, productos con buena cobertura o decisiones que requieren validación con negocio." },
      { key: "limitesCuidados", label: "5. Datos o supuestos a validar", placeholder: "Ejemplo: supuestos de recupero de inventario, calidad del dato de cobertura, vigencia de precios, sustitutos disponibles, elasticidad, tendencia de demanda o reglas usadas por la IA." }
    ],
    confirmations: [
      { key: "completedPortfolio", label: "Completé la hoja de portfolio en el workbook." },
      { key: "reviewedExecutiveCriteria", label: "Revisé las recomendaciones con criterio ejecutivo, no solo con la AI." }
    ]
  },
  ex02: {
    title: "Ejercicio 2: Pricing Optimization",
    subtitle: "Definir una arquitectura de precios que maximice margen manteniendo posicionamiento competitivo.",
    context: "El equipo debe decidir una arquitectura de precios para los próximos meses. El desafío es equilibrar tres objetivos: capturar margen, defender volumen y mantener la posición competitiva, sin romper la lógica de precios dentro de cada familia. La decisión operativa por SKU queda en el workbook. La síntesis del impacto, los riesgos y la estrategia elegida quedan en la plataforma.",
    mainSheets: ["09_PRICING"],
    supportSheets: ["03_BASE_SKUS", "06_PORTFOLIO"],
    concepts: [
      { term: "Elasticidad por SKU", definition: "Señal de sensibilidad precio-volumen. Debe usarse como señal direccional, no como verdad estadística perfecta." },
      { term: "Elasticidad por categoría", definition: "Ayuda a entender qué familias son más sensibles a cambios de precio." },
      { term: "Índice de competitividad", definition: "Compara el precio propio contra el mercado. La decisión no debe ser automática." },
      { term: "Pricing leakage", definition: "Valor económico potencialmente perdido por vender por debajo de una referencia defendible de mercado o margen." },
      { term: "Potencial económico", definition: "Impacto estimado de corregir precios, considerando margen, volumen esperado y competitividad." },
      { term: "Arquitectura de precios", definition: "Ordena la relación entre productos, familias, roles y posicionamiento competitivo: más barato, igual o premium." }
    ],
    questions: [],
    prompts: [
      { title: "Prompt 1 — Lectura por familias", body: "Analizá 03_BASE_SKUS, 06_PORTFOLIO y 09_PRICING para entender el problema por familias antes de recomendar precios SKU por SKU. No uses 07_FORECAST_90_DIAS." },
      { title: "Prompt 2 — Diagnóstico cuantitativo de pricing", body: "Calculá elasticidad proxy, índice de competitividad, SKUs subvaluados y sobrevaluados, pricing leakage y potencial económico antes de elegir la estrategia. No uses 07_FORECAST_90_DIAS." },
      { title: "Prompt 3 — Definir posicionamiento y arquitectura de precios", body: "Elegí el posicionamiento competitivo (más barato, igual o premium), el margen objetivo y las categorías estratégicas. Proponé una arquitectura de precios por familia y tipo de SKU." },
      { title: "Prompt 4 — Completar decisiones de pricing", body: "Completá o proponé completar 09_PRICING con decisión, precios recomendados, efecto esperado, rationale, riesgo y comentarios, respetando la arquitectura de precios." },
      { title: "Prompt 5 — Reporte final", body: "Resumí la recomendación de pricing, el impacto esperado (revenue, margen, índice de competitividad) y los riesgos comerciales usando 09_PRICING como fuente principal. No uses 07_FORECAST_90_DIAS." }
    ],
    required: ["09_PRICING completa o propuesta", "Síntesis de diagnóstico, posicionamiento, impacto y riesgos guardada en plataforma."],
    fields: [
      { key: "pricing_diagnosis", label: "1. Diagnóstico de pricing", placeholder: "Ejemplo: SKUs subvaluados y sobrevaluados, elasticidad por familia, leakage estimado y potencial económico." },
      { key: "pricing_strategy", label: "2. Posicionamiento y arquitectura de precios elegida", placeholder: "Ejemplo: más barato, igual o premium por familia; margen objetivo; categorías estratégicas; reglas para CORE, REVIEW y ELIMINAR." },
      { key: "business_impact", label: "3. Impacto esperado en margen, revenue y competitividad", placeholder: "Ejemplo: revenue proyectado, margen proyectado, índice de competitividad, volumen esperado y familias con mayor impacto." },
      { key: "risks_to_review", label: "4. Riesgos y decisiones a revisar", placeholder: "Ejemplo: SKUs con subas agresivas, familias sensibles, productos Core con riesgo de volumen, SKUs Eliminar con liquidación dudosa o inconsistencias de arquitectura." },
      { key: "assumptions_to_validate", label: "5. Datos o supuestos a validar", placeholder: "Ejemplo: elasticidad proxy, precios de competidores, costos unitarios, vigencia de promociones, disponibilidad de stock, sustitutos y supuestos de reacción del mercado." }
    ],
    confirmations: []
  },
  "ex-03": {
    title: "Ejercicio 3: Forecast Engine",
    subtitle: "Proyectar resultados a 90 días a partir de las decisiones de portfolio y pricing.",
    context: "Hasta ahora el equipo definió qué productos sostener, revisar o eliminar y qué estrategia de precios aplicar. Ahora el desafío es proyectar qué pasa con revenue, volumen y margen en los próximos 90 días. Un forecast comercial no es una predicción exacta: es una forma disciplinada de traducir decisiones en impacto esperado.",
    mainSheets: ["07_FORECAST_90_DIAS"],
    supportSheets: ["03_BASE_SKUS", "06_PORTFOLIO", "09_PRICING"],
    concepts: [
      { term: "Baseline", definition: "Forecast base de continuidad antes de aplicar una lectura de escenario. Sirve como punto de comparación." },
      { term: "Projected", definition: "Escenario proyectado después de incorporar decisiones de portfolio, pricing y supuestos de demanda." },
      { term: "M13-M15", definition: "Próximos 90 días. El equipo debe completar unidades, precios, costos, stock, revenue y margen." },
      { term: "Supuestos explícitos", definition: "Todo forecast depende de hipótesis. El equipo debe explicar qué mueve volumen, precio, margen y riesgo." }
    ],
    questions: [
      "¿Qué familias explican el forecast base?",
      "¿Qué escenario de mercado elegimos?",
      "¿Qué supuestos mueven unidades M13-M15?",
      "¿Cómo impacta pricing en volumen y margen?",
      "¿Qué riesgos tiene la proyección?"
    ],
    prompts: [
      {
        title: "Prompt 1 — Lectura inicial por familias",
        body: "Usando el workbook del Laboratorio 1, trabajá con estas hojas:\n\n* 03_BASE_SKUS: fuente histórica de ventas, unidades, precios, costos e inventario.\n* 06_PORTFOLIO: decisiones de portfolio ya completadas.\n* 09_PRICING: decisiones de pricing ya completadas.\n* 07_FORECAST_90_DIAS: hoja de trabajo del forecast.\n\nNo inventes nombres de hojas.\nNo modifiques 03_BASE_SKUS.\nNo cambies las decisiones ya tomadas en 06_PORTFOLIO o 09_PRICING salvo que encuentres una inconsistencia evidente y la marques para revisión.\n\nQuiero que actúes como analista senior de forecast comercial.\n\nAntes de completar el forecast SKU por SKU, analizá el negocio por familias.\n\nDevolveme:\n\n1. Qué familias concentran mayor revenue histórico.\n2. Qué familias concentran mayor margen histórico.\n3. Qué familias tienen mayor volumen y podrían mover más el forecast.\n4. Qué familias tienen más SKUs marcados como CORE, REVIEW o ELIMINAR en 06_PORTFOLIO.\n5. Qué familias concentran más decisiones de pricing relevantes en 09_PRICING.\n6. Qué familias podrían crecer, mantenerse o caer según las decisiones tomadas.\n7. Qué familias tienen mayor riesgo de sobreestimar demanda.\n8. Qué familias tienen mayor riesgo de subestimar demanda.\n9. Qué familias deberían revisarse con más cuidado antes de completar M13-M15.\n10. Qué tensiones aparecen entre portfolio, pricing, volumen, revenue y margen.\n\nNo completes todavía todos los SKUs.\nPrimero quiero una lectura ejecutiva por familia.\nSepará datos observados, cálculos y supuestos."
      },
      {
        title: "Prompt 2 — Construir escenarios Conservador, Base y Agresivo",
        body: "Usando el análisis por familias y las hojas 03_BASE_SKUS, 06_PORTFOLIO y 09_PRICING, construí tres escenarios de forecast para M13-M15. No uses 07_FORECAST_90_DIAS en esta etapa; la calibración numérica con baseline se hace en el Prompt 2B.\n\n1. Conservador\n2. Base\n3. Agresivo\n\nDefiniciones:\n\nEscenario Conservador:\nAsume demanda más débil, respuesta más lenta a las decisiones comerciales, mayor riesgo competitivo o mayor sensibilidad negativa a cambios de precio. Debe evitar sobreestimar unidades, revenue y margen.\n\nEscenario Base:\nAsume continuidad razonable ajustada por las decisiones de portfolio y pricing. Es el escenario de referencia para defender ante dirección.\n\nEscenario Agresivo:\nAsume demanda favorable, buena captura de margen, menor elasticidad negativa y mayor capacidad de sostener volumen aun con decisiones de pricing.\n\nPara cada escenario, devolveme:\n\n1. Supuesto general de demanda.\n2. Supuesto de crecimiento.\n3. Cómo debería impactar en unidades M13-M15.\n4. Cómo debería impactar en revenue M13-M15.\n5. Cómo debería impactar en margen M13-M15.\n6. Qué familias serían más beneficiadas.\n7. Qué familias tendrían mayor riesgo.\n8. Cómo debería tratar SKUs CORE.\n9. Cómo debería tratar SKUs REVIEW.\n10. Cómo debería tratar SKUs ELIMINAR.\n11. Cómo debería incorporar decisiones de pricing.\n12. Qué riesgos debería monitorear el equipo.\n\nDespués recomendá cuál escenario usar como base de trabajo y por qué.\n\nNo completes todavía todos los SKUs.\nNo presentes el forecast como certeza.\nSepará datos observados de supuestos."
      },
      {
        title: "Prompt 3 — Completar 07_FORECAST_90_DIAS SKU por SKU",
        body: "Usando el workbook del Laboratorio 1, trabajá con estas hojas:\n\n* 03_BASE_SKUS: datos históricos de SKUs.\n* 06_PORTFOLIO: decisiones de portfolio ya completadas.\n* 09_PRICING: decisiones de pricing ya completadas.\n* 07_FORECAST_90_DIAS: hoja que hay que completar.\n\nEl escenario elegido por el equipo es:\n[Conservador / Base / Agresivo]\n\nSupuesto de demanda:\n[describir supuesto]\n\nSupuesto de crecimiento:\n[describir supuesto]\n\nObjetivo:\nCompletar o proponer valores para 07_FORECAST_90_DIAS, proyectando M13, M14 y M15.\n\nColumnas a completar o revisar:\n\n* projected_units_m13\n* projected_units_m14\n* projected_units_m15\n* projected_price_m13\n* projected_price_m14\n* projected_price_m15\n* projected_cost_m13\n* projected_cost_m14\n* projected_cost_m15\n* projected_stock_m13\n* projected_stock_m14\n* projected_stock_m15\n* revenue_m13\n* revenue_m14\n* revenue_m15\n* margin_m13\n* margin_m14\n* margin_m15\n* scenario\n* forecast_assumption\n* ai_comment\n* team_comment\n\nReglas de negocio:\n\n1. Si portfolio_decision es CORE:\n   * sostener el SKU como parte del forecast.\n   * proyectar continuidad o crecimiento según escenario.\n   * cuidar que pricing no destruya volumen sin justificación.\n\n2. Si portfolio_decision es REVIEW:\n   * aplicar una proyección más prudente.\n   * marcar riesgos o supuestos en forecast_assumption.\n   * evitar crecimiento agresivo salvo que haya evidencia.\n\n3. Si portfolio_decision es ELIMINAR:\n   * reflejar salida progresiva, liquidación o reducción de volumen.\n   * no proyectar crecimiento normal salvo justificación comercial.\n   * explicar si queda revenue residual por liquidación o transición.\n\n4. Si pricing_decision implica subir precio:\n   * considerar posible efecto negativo en unidades.\n   * estimar si el margen compensa el menor volumen.\n   * explicar el supuesto.\n\n5. Si pricing_decision implica bajar precio o promoción:\n   * considerar posible efecto positivo en unidades.\n   * no asumir crecimiento ilimitado.\n   * revisar impacto en margen.\n\n6. Si pricing_decision es mantener:\n   * usar baseline ajustado por escenario de demanda.\n\n7. Revenue:\n   * revenue_m13 = projected_units_m13 * projected_price_m13.\n   * revenue_m14 = projected_units_m14 * projected_price_m14.\n   * revenue_m15 = projected_units_m15 * projected_price_m15.\n\n8. Margin:\n   * margin_m13 = projected_units_m13 * (projected_price_m13 - projected_cost_m13).\n   * margin_m14 = projected_units_m14 * (projected_price_m14 - projected_cost_m14).\n   * margin_m15 = projected_units_m15 * (projected_price_m15 - projected_cost_m15).\n\nImportante:\n\n* No inventes datos.\n* Si una columna ya tiene fórmula válida, no la reemplaces innecesariamente.\n* Si no podés editar el archivo directamente, devolveme una tabla lista para copiar en 07_FORECAST_90_DIAS.\n* Respetá sku_id.\n* Marcá scenario con el escenario elegido.\n* En forecast_assumption explicá el supuesto principal.\n* En ai_comment dejá una explicación breve.\n* team_comment debe quedar vacío salvo que el equipo quiera desafiar la recomendación.\n\nNo cambies las decisiones de 06_PORTFOLIO ni 09_PRICING.\nNo uses hojas inexistentes.\nSepará datos de supuestos."
      },
      {
        title: "Prompt 4 — Reporte final del forecast",
        body: "Usá la hoja 07_FORECAST_90_DIAS ya completada como fuente principal del forecast. Si necesitás contexto de portfolio o pricing, cruzá contra:\n\n* 06_PORTFOLIO\n* 09_PRICING\n* 03_BASE_SKUS\n\nEl escenario elegido fue:\n[Conservador / Base / Agresivo]\n\nDevolveme:\n\n1. Revenue proyectado total 90 días.\n2. Revenue proyectado por M13, M14 y M15.\n3. Margen proyectado total 90 días.\n4. Margen proyectado por M13, M14 y M15.\n5. Volumen proyectado total 90 días.\n6. Volumen proyectado por M13, M14 y M15.\n7. Comparación contra baseline.\n8. Familias que más explican el revenue proyectado.\n9. Familias que más explican el margen proyectado.\n10. Familias o SKUs con mayor riesgo de forecast.\n11. Impacto de las decisiones de portfolio.\n12. Impacto de las decisiones de pricing.\n13. Qué parte del forecast depende de datos históricos.\n14. Qué parte del forecast depende de supuestos.\n15. Riesgos de sobreestimación.\n16. Riesgos de subestimación.\n17. Métricas que deberían monitorearse durante los próximos 90 días.\n18. Decisiones que deberían revisarse antes de ejecutar.\n\nVariables para Executive Scoreboard:\n\n* Revenue Base.\n* Margen Base.\n\nNo presentes el forecast como resultado garantizado.\nHablá de proyección, escenario, exposición y supuestos.\nSepará datos calculados de hipótesis.\nMarcá cualquier inconsistencia o dato faltante.\n\nCerrá con una sección llamada “Respuesta para plataforma” usando exactamente estos bloques:\n\n1. Escenario elegido\n2. Supuestos de demanda y crecimiento\n3. Forecast proyectado 90 días\n4. Impacto potencial en revenue y margen\n5. Riesgos y decisiones a revisar"
      }
    ],
    required: ["07_FORECAST_90_DIAS completa", "scenario y forecast_assumption completos", "Síntesis del forecast guardada en plataforma"],
    fields: [
      { key: "forecast_scenario", label: "1. Escenario elegido", placeholder: "Conservador, Base o Agresivo. Explicá por qué el equipo eligió ese escenario." },
      { key: "demand_growth_assumptions", label: "2. Supuestos de demanda y crecimiento", placeholder: "Explicá qué supuestos usaron para proyectar unidades M13-M15 y cómo incorporaron escenario de demanda y crecimiento." },
      { key: "forecast_projection_summary", label: "3. Forecast proyectado 90 días", placeholder: "Resumí venta proyectada, volumen proyectado y margen proyectado para los próximos 90 días." },
      { key: "business_impact", label: "4. Impacto potencial en revenue y margen", placeholder: "Explicá cómo impactan las decisiones de portfolio y pricing en revenue, margen y volumen proyectado." },
      { key: "risks_to_review", label: "5. Riesgos y decisiones a revisar", placeholder: "Identificá riesgos del forecast, familias sensibles, SKUs críticos, supuestos débiles o decisiones que requieren validación comercial." }
    ],
    confirmations: []
  },
  "ex-04": {
    title: "Ejercicio 4: Inventory & Working Capital Optimization",
    subtitle: "Definir inventario objetivo y liberar capital minimizando riesgo de quiebre.",
    context: "Con el forecast definido, ahora el equipo debe decidir cuánto stock necesita y cuánto capital puede liberar sin poner en riesgo la operación.",
    mainSheets: ["08_INVENTORY_DECISIONS"],
    supportSheets: ["01_BASE_SKUS", "05_DECISIONES_PORTFOLIO", "07_FORECAST_90_DIAS", "09_SCOREBOARD_ALUMNO", "10_PLAN_90_DIAS"],
    concepts: [
      { term: "DDI objetivo", definition: "Días de inventario deseados." },
      { term: "Capital liberado", definition: "Reducción de stock valorizado." },
      { term: "Riesgo de quiebre", definition: "Posibilidad de quedarse sin stock." },
      { term: "Stock objetivo", definition: "Inventario necesario para sostener el forecast." }
    ],
    questions: ["¿Qué stock necesita el forecast?", "¿Dónde hay excedente?", "¿Qué SKUs tienen riesgo de quiebre?", "¿Qué capital puede liberarse?"],
    prompts: [
      { title: "Definir DDI objetivo", body: "Usá forecast, stock actual y rol de portfolio para proponer DDI objetivo por grupo de SKUs." },
      { title: "Detectar capital liberable", body: "Identificá dónde reducir compra, liquidar excedente o bloquear reposición sin romper la operación." },
      { title: "Preparar inventario", body: "Ayudame a completar conceptualmente 08_INVENTORY_DECISIONS con acción, capital liberado, riesgo y rationale." }
    ],
    required: ["08_INVENTORY_DECISIONS completa", "09_SCOREBOARD_ALUMNO sección inventario actualizada"],
    fields: [
      { key: "inventoryPolicy", label: "Política de inventario", placeholder: "Cómo van a decidir stock objetivo." },
      { key: "ddiTarget", label: "DDI objetivo", placeholder: "Qué DDI objetivo proponen y por qué." },
      { key: "stockoutRisks", label: "Riesgos de quiebre", placeholder: "Dónde podría faltar stock y cómo controlarlo." }
    ],
    confirmations: [
      { key: "completedInventory", label: "Completé 08_INVENTORY_DECISIONS." },
      { key: "updatedScoreboardInventory", label: "Actualicé 09_SCOREBOARD_ALUMNO sección inventario." },
      { key: "reviewedStockoutRisk", label: "Revisé riesgo de quiebre." }
    ]
  }
} as const;

export type Lab01ExerciseId = keyof typeof lab01ExerciseContent;
