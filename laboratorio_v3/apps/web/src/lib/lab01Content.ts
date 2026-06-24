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
  "ex-02": {
    title: "Ejercicio 2: Pricing Optimization",
    subtitle: "Definir una arquitectura de precios que capture margen sin destruir volumen ni competitividad.",
    context: "Después de clasificar el portfolio en el Ejercicio 1, el equipo debe definir una arquitectura de precios para los próximos meses. El desafío es decidir dónde capturar margen, dónde defender competitividad, dónde proteger volumen y dónde usar precio como herramienta táctica para acelerar la salida de productos. El workbook del Ejercicio 2 contiene una resolución base del Ejercicio 1 para que todos los equipos partan de un punto común.",
    mainSheets: ["09_PRICING"],
    supportSheets: ["03_BASE_SKUS", "06_PORTFOLIO"],
    concepts: [
      { term: "Elasticidad por SKU", definition: "Señal de sensibilidad precio-volumen. Debe usarse como señal direccional, no como verdad estadística perfecta." },
      { term: "Elasticidad por categoría", definition: "Ayuda a entender qué familias son más sensibles a cambios de precio." },
      { term: "Índice de competitividad", definition: "Compara el precio propio contra el mercado. La decisión no debe ser automática." },
      { term: "Pricing leakage", definition: "Margen potencial que se pierde por vender por debajo del precio que el producto podría sostener." },
      { term: "Arquitectura de precios", definition: "Ordena la relación entre productos, familias, roles y posicionamiento competitivo." },
      { term: "Precio como herramienta táctica", definition: "En SKUs candidatos a salida, el precio puede acelerar rotación y liberar capital." }
    ],
    questions: [],
    prompts: [
      { title: "Prompt 1 — Lectura por familias", body: "Analizá 03_BASE_SKUS, 06_PORTFOLIO y 09_PRICING para entender el problema por familias antes de recomendar precios SKU por SKU. No uses 07_FORECAST_90_DIAS." },
      { title: "Prompt 2 — Definir estrategia de pricing", body: "Compará los caminos de capturar margen, defender volumen/competitividad y liquidar/acelerar salida. Recomendá una estrategia principal o mixta por familia conectada con la clasificación de portfolio." },
      { title: "Prompt 3 — Completar decisiones de pricing", body: "Completá o proponé completar 09_PRICING con decisión, precios M13-M15, efecto esperado, rationale, riesgo y comentarios, respetando el rol de cada SKU y la arquitectura de precios." },
      { title: "Prompt 4 — Reporte final", body: "Resumí la recomendación de pricing, el impacto esperado y los riesgos comerciales usando 09_PRICING como fuente principal. No uses 07_FORECAST_90_DIAS." }
    ],
    required: ["09_PRICING completa o propuesta", "Síntesis de estrategia, impacto y riesgos guardada en plataforma."],
    fields: [
      { key: "estrategia", label: "1. Estrategia de pricing elegida", placeholder: "Ejemplo: capturar margen, defender volumen, liquidar o estrategia mixta por familia; explicar por qué." },
      { key: "impacto", label: "2. Impacto esperado en el negocio", placeholder: "Ejemplo: impacto esperado en revenue, margen, volumen, competitividad y pricing leakage capturado." },
      { key: "decisionesRevisar", label: "3. Decisiones a revisar antes de ejecutar", placeholder: "Ejemplo: SKUs con subas agresivas, familias sensibles, productos Core con riesgo de volumen, SKUs Eliminar con liquidación dudosa o inconsistencias de arquitectura." },
      { key: "datosValidar", label: "4. Datos o supuestos a validar", placeholder: "Ejemplo: elasticidad proxy, precios de competidores, costos unitarios, vigencia de promociones, disponibilidad de stock, sustitutos y supuestos de reacción del mercado." }
    ],
    confirmations: []
  },
  "ex-03": {
    title: "Ejercicio 3: Forecast Engine",
    subtitle: "Proyectar M13, M14 y M15 usando decisiones de portfolio y pricing.",
    context: "Hasta ahora decidiste qué productos sostener y qué precios aplicar. Ahora tenés que estimar qué pasaría con ventas, margen y unidades en los próximos 90 días.",
    mainSheets: ["07_FORECAST_90_DIAS"],
    supportSheets: ["01_BASE_SKUS", "05_DECISIONES_PORTFOLIO", "06_PRICING_DECISIONS", "09_SCOREBOARD_ALUMNO"],
    concepts: [
      { term: "M01-M12", definition: "Historia de ventas, unidades, precio y costo." },
      { term: "M13-M15", definition: "Forecast del equipo para los próximos 90 días." },
      { term: "BASELINE_*", definition: "Continuidad sin cambios." },
      { term: "PROJECTED_*", definition: "Escenario del equipo." }
    ],
    questions: ["¿Qué escenario eligen?", "¿Qué supuestos mueven unidades?", "¿Cómo impacta pricing en forecast?", "¿Qué riesgos tiene la proyección?"],
    prompts: [
      { title: "Proyectar unidades", body: "Usá historia M01-M12, portfolio y pricing para proyectar unidades M13-M15." },
      { title: "Construir escenarios", body: "Armá escenarios conservador, base y agresivo con supuestos claros." },
      { title: "Explicar riesgos", body: "Identificá riesgos del forecast y controles que el equipo debería monitorear." }
    ],
    required: ["07_FORECAST_90_DIAS completa", "09_SCOREBOARD_ALUMNO sección forecast actualizada"],
    fields: [
      { key: "scenario", label: "Escenario elegido", placeholder: "Conservador, base o agresivo." },
      { key: "demandAssumptions", label: "Supuestos de demanda", placeholder: "Cómo estimaron unidades M13-M15." },
      { key: "forecastRationale", label: "Justificación forecast", placeholder: "Por qué el forecast conecta portfolio, pricing y negocio." }
    ],
    confirmations: [
      { key: "completedForecast", label: "Completé 07_FORECAST_90_DIAS." },
      { key: "updatedScoreboardForecast", label: "Actualicé 09_SCOREBOARD_ALUMNO sección forecast." },
      { key: "reviewedForecastRisks", label: "Revisé riesgos del forecast." }
    ]
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
