export const lab02ExerciseContent = {
  "lab02-ex01": {
    title: "Ejercicio 1: Customer Segmentation",
    subtitle: "Clasificar clientes según valor económico y comportamiento.",
    context: "En este ejercicio vas a usar tu AI personal para construir una primera segmentación comercial de la base de clientes. No buscamos todavía la estrategia final: buscamos detectar segmentos de valor, riesgo de fuga y oportunidades promocionales.",
    mainSheets: ["BASE_CLIENTES", "SEGMENTACION_RFM"],
    supportSheets: ["00_INSTRUCCIONES", "01_CASO_NEGOCIO", "02_DICCIONARIO_DATOS"],
    concepts: [
      { term: "Recencia", definition: "Tiempo desde la última compra." },
      { term: "Frecuencia", definition: "Cantidad de compras en un período." },
      { term: "Ticket", definition: "Monto promedio por compra." },
      { term: "CLV", definition: "Customer Lifetime Value: valor económico esperado de un cliente a lo largo del tiempo." },
      { term: "Churn Score", definition: "Señal de riesgo de que un cliente no vuelva a comprar." },
      { term: "RFM", definition: "Segmentación por Recencia, Frecuencia y Monto." }
    ],
    questions: [
      "¿Qué variables explican mejor el valor de un cliente?",
      "¿Qué clientes están en riesgo de fuga?",
      "¿Qué clientes son oportunistas o promocioneros?",
      "¿Qué segmentos merecen estrategias diferenciadas?"
    ],
    prompts: [
      {
        title: "Prompt 1 — Segmentación inicial",
        body: "Usando el workbook del Laboratorio 2, analizá la base de clientes para construir una primera segmentación comercial.\n\nQuiero que actúes como analista senior de customer profitability.\n\nPrimero explorá las variables disponibles:\n\n* recencia\n* frecuencia\n* ticket\n* margen\n* categorías compradas\n* comportamiento de compra\n\nDespués proponé una segmentación inicial usando lógica RFM, CLV y riesgo de churn.\n\nDevolveme:\n\n1. Segmentos principales detectados.\n2. Criterios usados para definir cada segmento.\n3. Clientes o grupos de clientes con mayor valor económico.\n4. Clientes en riesgo de fuga.\n5. Clientes oportunistas o promocioneros.\n6. Variables más importantes para explicar valor, frecuencia y riesgo.\n7. Riesgos o limitaciones de la segmentación.\n8. Qué decisiones comerciales habilita esta segmentación.\n\nNo inventes datos.\nSepará hallazgos basados en datos de hipótesis."
      }
    ],
    required: ["Segmentación inicial guardada en plataforma."],
    fields: [
      { key: "segmentation_summary", label: "1. Resumen de segmentación", placeholder: "Ejemplo: segmentos principales detectados y criterios usados." },
      { key: "vip_segment", label: "2. Segmento VIP identificado", placeholder: "Ejemplo: clientes con alto valor, frecuencia y ticket." },
      { key: "churn_risk_segment", label: "3. Clientes en riesgo de fuga", placeholder: "Ejemplo: perfiles con alta recencia, baja frecuencia o caída de ticket." },
      { key: "opportunistic_segment", label: "4. Clientes oportunistas", placeholder: "Ejemplo: clientes sensibles a promociones o compras esporádicas." },
      { key: "assumptions_to_validate", label: "5. Datos o supuestos a validar", placeholder: "Ejemplo: calidad de datos, definición de recencia, cálculo de CLV proxy." }
    ],
    confirmations: []
  },
  "lab02-ex02": {
    title: "Ejercicio 2: VIP Strategy Simulator",
    subtitle: "Incrementar CLV del segmento VIP.",
    context: "En este ejercicio vas a diseñar una estrategia para el segmento VIP. Tu objetivo es incrementar ticket, frecuencia y CLV sin sobre-incentivar clientes que ya comprarían sin promoción.",
    mainSheets: ["SEGMENTACION_RFM", "ESTRATEGIA_VIP"],
    supportSheets: ["BASE_CLIENTES", "CALCULADORA_VIP"],
    concepts: [
      { term: "CLV incremental", definition: "Valor adicional esperado por acciones de loyalty." },
      { term: "Baja incrementalidad", definition: "Riesgo de que la promoción genere ventas que ya ocurrirían de todos modos." },
      { term: "Sobre-incentivo", definition: "Dar beneficios a clientes que no necesitan incentivos para comprar." }
    ],
    questions: [
      "¿Cuál es el tamaño y valor del segmento VIP?",
      "¿Qué estrategia de loyalty maximiza CLV incremental?",
      "¿Qué nivel de inversión promocional tiene sentido?",
      "¿Qué riesgos de baja incrementalidad existen?"
    ],
    prompts: [
      {
        title: "Prompt 2 — Estrategia VIP",
        body: "Usando la segmentación del Laboratorio 2, enfocá el análisis en el segmento VIP.\n\nQuiero que actúes como analista senior de estrategia comercial y loyalty.\n\nIdentificá:\n\n1. Tamaño del segmento VIP.\n2. CLV actual estimado.\n3. Ticket promedio.\n4. Frecuencia.\n5. Margen asociado.\n6. Categorías más relevantes.\n7. Potencial de expansión del segmento.\n8. Riesgo de sobre-incentivar clientes que ya comprarían sin promoción.\n\nCompará estas estrategias:\n\n* Doble puntos\n* Beneficios exclusivos\n* Acceso anticipado\n* Envío gratuito\n\nPara cada estrategia, estimá cualitativamente:\n\n1. Impacto esperado en ticket.\n2. Impacto esperado en frecuencia.\n3. Impacto esperado en CLV.\n4. Riesgo de costo promocional.\n5. Riesgo de baja incrementalidad.\n6. Condiciones bajo las cuales tendría sentido.\n\nDespués recomendá una estrategia y una intensidad de inversión:\n\n* Baja\n* Media\n* Alta\n\nNo presentes los resultados como predicción garantizada.\nSepará datos de supuestos."
      }
    ],
    required: ["Estrategia VIP seleccionada y guardada en plataforma."],
    fields: [
      { key: "vip_baseline", label: "1. Diagnóstico del segmento VIP", placeholder: "Ejemplo: tamaño, CLV, ticket, frecuencia y margen del segmento." },
      { key: "selected_strategy", label: "2. Estrategia seleccionada", placeholder: "Ejemplo: Doble puntos, Beneficios exclusivos, Acceso anticipado o Envío gratuito." },
      { key: "investment_level", label: "3. Nivel de inversión promocional", placeholder: "Ejemplo: Baja, Media o Alta." },
      { key: "expected_impact", label: "4. Impacto esperado", placeholder: "Ejemplo: ticket incremental, frecuencia incremental, CLV incremental y ROI esperado." },
      { key: "risks_to_validate", label: "5. Riesgos o supuestos a validar", placeholder: "Ejemplo: baja incrementalidad, sobre-incentivo, elasticidad real del segmento." }
    ],
    confirmations: []
  },
  "lab02-ex03": {
    title: "Ejercicio 3: Integrador P1",
    subtitle: "Diagnóstico multieje sobre rentabilidad, capital, surtido y clientes.",
    context: "Nexus tiene un problema de rentabilidad y un problema de capital al mismo tiempo. El grupo apuesta hipótesis, profundiza un eje, cruza con otro y cierra una ficha de diagnóstico que alimenta el Ejercicio 4.",
    mainSheets: ["RESULTADO", "SKUS", "DEMANDA", "CLIENTES", "RESTRICCIONES"],
    supportSheets: ["00_INSTRUCCIONES", "01_CASO_NEGOCIO"],
    concepts: [],
    questions: [],
    prompts: [],
    required: ["Ficha de diagnóstico guardada en plataforma."],
    fields: [],
    confirmations: []
  },
  "lab02-ex04": {
    title: "Ejercicio 4: Integrador P2",
    subtitle: "Cerrar diagnóstico, elegir acciones, proyectar metas y construir instrumento de defensa.",
    context: "A partir del diagnóstico del Ejercicio 3, el grupo cierra el plan que alcance las cuatro metas simultáneamente, proyecta el scoreboard a 12 meses y construye un instrumento visual para la defensa frente al Comité.",
    mainSheets: ["RESULTADO", "SKUS", "DEMANDA", "CLIENTES", "RESTRICCIONES"],
    supportSheets: ["Ficha del Ejercicio 3"],
    concepts: [],
    questions: [],
    prompts: [],
    required: ["Plan, scoreboard proyectado e instrumento guardados en plataforma."],
    fields: [],
    confirmations: []
  }
} as const;

export type Lab02ExerciseId = keyof typeof lab02ExerciseContent;
