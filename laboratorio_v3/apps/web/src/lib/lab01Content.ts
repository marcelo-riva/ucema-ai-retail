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
    title: "Ejercicio 1: Decidir qué portfolio sostener",
    subtitle: "Clasificar SKUs como CORE, REVIEW o ELIMINAR y justificar la decisión con datos.",
    context: "El foco es decidir portfolio. Usá el diagnóstico del Ejercicio 0, la base histórica M01-M12 y el scoreboard inicial para definir qué productos mantener, revisar o retirar.",
    mainSheets: ["05_DECISIONES_PORTFOLIO"],
    supportSheets: ["01_BASE_SKUS", "04_DIAGNOSTICO_INICIAL", "09_SCOREBOARD_ALUMNO", "10_PLAN_90_DIAS"],
    concepts: [
      { term: "CORE", definition: "SKU que conviene sostener por venta, margen, cobertura o rol comercial." },
      { term: "REVIEW", definition: "SKU que requiere análisis o acción antes de decidir retiro." },
      { term: "ELIMINAR", definition: "SKU candidato a retirar, liquidar o discontinuar." },
      { term: "Revenue en riesgo", definition: "Ventas que podrían perderse si se retiran productos." },
      { term: "Capital inmovilizado", definition: "Dinero atrapado en stock." }
    ],
    questions: [
      "¿Qué productos concentran ventas y margen?",
      "¿Qué productos tienen bajo margen o margen negativo?",
      "¿Qué productos tienen mucho stock o DDI alto?",
      "¿Qué productos venden poco pero ocupan capital?",
      "¿Qué productos conviene revisar antes de eliminar?"
    ],
    prompts: [
      { title: "Explorar portfolio", body: "Usá 01_BASE_SKUS y 04_DIAGNOSTICO_INICIAL para detectar productos CORE, REVIEW y ELIMINAR. No decidas sólo por baja venta." },
      { title: "Proponer criterios", body: "Proponé criterios simples combinando ventas, margen, DDI, stock, cobertura y rol comercial. Explicá excepciones." },
      { title: "Preparar checkpoint", body: "Ayudame a completar 05_DECISIONES_PORTFOLIO y la sección Portfolio de 09_SCOREBOARD_ALUMNO con diagnóstico, criterios y riesgos." }
    ],
    required: [
      "05_DECISIONES_PORTFOLIO completa.",
      "09_SCOREBOARD_ALUMNO actualizada en sección portfolio.",
      "Diagnóstico de portfolio, criterios de clasificación, riesgos y cuidados."
    ],
    fields: [
      { key: "portfolioDiagnosis", label: "Diagnóstico de portfolio", placeholder: "Qué problema detectaron en el portfolio." },
      { key: "classificationCriteria", label: "Criterios de clasificación", placeholder: "Reglas para CORE, REVIEW o ELIMINAR." },
      { key: "risks", label: "Riesgos y cuidados", placeholder: "Qué puede salir mal y cómo controlarlo." }
    ],
    confirmations: [
      { key: "completedPortfolio", label: "Completé 05_DECISIONES_PORTFOLIO." },
      { key: "updatedScoreboardPortfolio", label: "Actualicé la sección Portfolio de 09_SCOREBOARD_ALUMNO." },
      { key: "reviewedExecutiveCriteria", label: "Revisé la recomendación con criterio ejecutivo, no solo con la AI." },
      { key: "firstPlan90", label: "Completé una primera versión del plan 90 días.", optional: true }
    ]
  },
  "ex-02": {
    title: "Ejercicio 2: Pricing Optimization",
    subtitle: "Definir precios para capturar margen sin destruir volumen ni competitividad.",
    context: "Ahora que el portfolio está clasificado, el equipo debe revisar precios. Algunos productos pueden estar subvaluados, otros pueden requerir liquidación y otros deberían mantener precio para proteger volumen.",
    mainSheets: ["06_PRICING_DECISIONS"],
    supportSheets: ["01_BASE_SKUS", "05_DECISIONES_PORTFOLIO", "09_SCOREBOARD_ALUMNO"],
    concepts: [
      { term: "Elasticidad proxy", definition: "Indicador direccional de sensibilidad precio-volumen. No controla promociones, estacionalidad, quiebres ni competencia." },
      { term: "Pricing estructural", definition: "Cambio de precio para productos que seguirán en el portfolio." },
      { term: "Liquidación", definition: "Precio táctico para reducir stock de SKUs a retirar." }
    ],
    questions: [
      "¿Qué SKUs CORE o REVIEW podrían capturar margen?",
      "¿Qué productos parecen subvaluados?",
      "¿Qué productos no soportan suba de precio?",
      "¿Qué SKUs ELIMINAR requieren precio de liquidación?"
    ],
    prompts: [
      { title: "Analizar precio vs volumen", body: "Usá PVP M01-M12 y volumen M01-M12 para detectar sensibilidad precio-volumen. Tratá elasticity proxy como señal, no verdad absoluta." },
      { title: "Detectar oportunidades", body: "Separá productos subvaluados, sobrevaluados, liquidación y revisar competitividad. Usá margen, stock, DDI y rol comercial." },
      { title: "Preparar decisiones", body: "Ayudame a completar conceptualmente 06_PRICING_DECISIONS con pricing_decision, price_m13-m15, efecto esperado, rationale y riesgo." }
    ],
    required: ["06_PRICING_DECISIONS completa", "09_SCOREBOARD_ALUMNO sección pricing actualizada"],
    fields: [
      { key: "pricingStrategy", label: "Estrategia de pricing", placeholder: "Qué tipo de cambios de precio proponen." },
      { key: "criteria", label: "Criterios usados", placeholder: "Qué reglas usaron para subir, bajar, mantener o liquidar." },
      { key: "risks", label: "Riesgos de elasticidad / volumen", placeholder: "Qué puede salir mal en volumen, margen o competitividad." }
    ],
    confirmations: [
      { key: "completedPricing", label: "Completé 06_PRICING_DECISIONS." },
      { key: "updatedScoreboardPricing", label: "Actualicé 09_SCOREBOARD_ALUMNO sección pricing." },
      { key: "reviewedElasticityProxy", label: "Usé elasticidad proxy como señal, no como verdad absoluta." }
    ]
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
