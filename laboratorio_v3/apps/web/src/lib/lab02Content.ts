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
    title: "Ejercicio 3: Churn Recovery Simulator",
    subtitle: "Recuperar clientes en riesgo.",
    context: "En este ejercicio vas a diseñar una estrategia para recuperar clientes en riesgo de fuga. Tu objetivo es recuperar revenue comprometido sin canibalizar el resto de la base ni atraer solo oportunistas.",
    mainSheets: ["SEGMENTACION_RFM", "CHURN_RECOVERY"],
    supportSheets: ["BASE_CLIENTES", "CALCULADORA_CHURN"],
    concepts: [
      { term: "Revenue comprometido", definition: "Revenue que podría perderse si los clientes en riesgo no vuelven a comprar." },
      { term: "Canibalización", definition: "Riesgo de que una promoción desvíe compras de otros clientes." },
      { term: "Reactivación", definition: "Acciones para que un cliente inactivo vuelva a comprar." }
    ],
    questions: [
      "¿Cuántos clientes están en riesgo y qué CLV está comprometido?",
      "¿Qué estrategia de recuperación tiene mejor ROI?",
      "¿Qué clientes no conviene recuperar?",
      "¿Cómo se controla la canibalización?"
    ],
    prompts: [
      {
        title: "Prompt 3 — Recuperación de churn",
        body: "Usando la segmentación del Laboratorio 2, enfocá el análisis en clientes con riesgo de fuga.\n\nQuiero que actúes como analista senior de churn recovery.\n\nIdentificá:\n\n1. Cuántos clientes están en riesgo.\n2. Qué CLV está comprometido.\n3. Qué señales explican el riesgo de churn.\n4. Qué segmentos o perfiles concentran mayor riesgo.\n5. Qué categorías o comportamientos aparecen antes de la fuga.\n6. Qué clientes conviene recuperar y cuáles no por bajo valor económico.\n\nCompará estas estrategias:\n\n* % OFF\n* Cashback\n* Reactivación\n\nPara cada estrategia, evaluá:\n\n1. Probabilidad de recuperación.\n2. Revenue incremental esperado.\n3. Costo promocional.\n4. Riesgo de canibalización.\n5. Riesgo de atraer sólo oportunistas.\n6. ROI esperado cualitativo.\n\nRecomendá una estrategia y nivel de inversión:\n\n* Baja\n* Media\n* Alta\n\nNo inventes datos.\nSepará hallazgos de supuestos."
      }
    ],
    required: ["Estrategia de churn recovery seleccionada y guardada en plataforma."],
    fields: [
      { key: "churn_diagnosis", label: "1. Diagnóstico de churn", placeholder: "Ejemplo: clientes en riesgo, CLV comprometido y señales de fuga." },
      { key: "selected_recovery_strategy", label: "2. Estrategia de recuperación seleccionada", placeholder: "Ejemplo: % OFF, Cashback o Reactivación." },
      { key: "investment_level", label: "3. Nivel de inversión promocional", placeholder: "Ejemplo: Baja, Media o Alta." },
      { key: "expected_recovery_impact", label: "4. Impacto esperado", placeholder: "Ejemplo: clientes recuperados, revenue incremental y ROI esperado." },
      { key: "risks_to_validate", label: "5. Riesgos o supuestos a validar", placeholder: "Ejemplo: canibalización, oportunistas, probabilidad de recuperación real." }
    ],
    confirmations: []
  },
  "lab02-ex04": {
    title: "Ejercicio 4: Opportunistic Customer Simulator",
    subtitle: "Incrementar ticket promedio.",
    context: "En este ejercicio vas a diseñar una estrategia para incrementar el ticket promedio de clientes oportunistas. Tu objetivo es aumentar el valor de la compra sin destruir margen ni generar descuentos innecesarios.",
    mainSheets: ["SEGMENTACION_RFM", "TICKET_BUILDER"],
    supportSheets: ["BASE_CLIENTES", "CALCULADORA_TICKET"],
    concepts: [
      { term: "Ticket incremental", definition: "Aumento del monto promedio por compra." },
      { term: "Cross Selling", definition: "Ofrecer productos complementarios a lo que el cliente ya compra." },
      { term: "Bundle", definition: "Paquete de productos vendidos juntos a un precio combinado." }
    ],
    questions: [
      "¿Cuál es el perfil del cliente oportunista?",
      "¿Qué estrategia aumenta ticket sin destruir margen?",
      "¿Qué nivel de inversión promocional es razonable?",
      "¿Cómo se evita el descuento innecesario?"
    ],
    prompts: [
      {
        title: "Prompt 4 — Incremento de ticket",
        body: "Usando la segmentación del Laboratorio 2, enfocá el análisis en clientes oportunistas.\n\nQuiero que actúes como analista senior de revenue growth y promociones.\n\nIdentificá:\n\n1. Tamaño del segmento oportunista.\n2. Ticket promedio actual.\n3. Frecuencia actual.\n4. Margen asociado.\n5. Categorías más compradas.\n6. Sensibilidad promocional.\n7. Oportunidades de aumentar ticket sin destruir margen.\n\nCompará estas estrategias:\n\n* Cross Selling\n* Bundle\n* Combo\n* Ticket Builder\n\nPara cada estrategia, evaluá:\n\n1. Impacto esperado en ticket.\n2. Impacto esperado en revenue.\n3. Impacto esperado en margen.\n4. Riesgo de descuento innecesario.\n5. Riesgo de baja incrementalidad.\n6. Condiciones de éxito.\n\nRecomendá una estrategia y nivel de inversión:\n\n* Baja\n* Media\n* Alta\n\nNo inventes datos.\nSepará datos de hipótesis."
      }
    ],
    required: ["Estrategia de incremento de ticket seleccionada y guardada en plataforma."],
    fields: [
      { key: "opportunistic_diagnosis", label: "1. Diagnóstico de clientes oportunistas", placeholder: "Ejemplo: tamaño, ticket, frecuencia, margen y categorías del segmento." },
      { key: "selected_ticket_strategy", label: "2. Estrategia seleccionada", placeholder: "Ejemplo: Cross Selling, Bundle, Combo o Ticket Builder." },
      { key: "investment_level", label: "3. Nivel de inversión promocional", placeholder: "Ejemplo: Baja, Media o Alta." },
      { key: "expected_ticket_impact", label: "4. Impacto esperado", placeholder: "Ejemplo: ticket incremental, revenue incremental y ROI esperado." },
      { key: "risks_to_validate", label: "5. Riesgos o supuestos a validar", placeholder: "Ejemplo: descuento innecesario, baja incrementalidad, impacto en margen." }
    ],
    confirmations: []
  },
  "lab02-ex05": {
    title: "Ejercicio 5: Marketing ROI Consolidator",
    subtitle: "Consolidar todas las inversiones promocionales.",
    context: "En este ejercicio vas a consolidar el impacto económico de las estrategias diseñadas para VIP, churn y oportunistas. Tu objetivo es tener una visión integral de inversión, revenue incremental, margen y ROI promocional.",
    mainSheets: ["CONSOLIDADOR_ROI", "MARKETING_DASHBOARD"],
    supportSheets: ["ESTRATEGIA_VIP", "CHURN_RECOVERY", "TICKET_BUILDER"],
    concepts: [
      { term: "ROI promocional", definition: "Retorno de la inversión en promociones." },
      { term: "Margen incremental", definition: "Margen adicional generado por las acciones promocionales." },
      { term: "Canibalización", definition: "Ventas desviadas de una estrategia a otra o de clientes no objetivo." }
    ],
    questions: [
      "¿Cuál es la inversión promocional total?",
      "¿Qué revenue y margen incremental esperamos?",
      "¿Cuántos clientes recuperamos?",
      "¿Qué estrategia aporta más valor y cuál más riesgo?"
    ],
    prompts: [
      {
        title: "Prompt 5 — Consolidación de ROI",
        body: "Usando los resultados de los ejercicios anteriores del Laboratorio 2, consolidá el impacto económico de las estrategias promocionales.\n\nQuiero que actúes como analista senior de marketing ROI.\n\nConsolidá:\n\n1. Estrategia elegida para VIP.\n2. Estrategia elegida para clientes en riesgo de fuga.\n3. Estrategia elegida para clientes oportunistas.\n4. Inversión promocional total.\n5. Revenue incremental esperado.\n6. Margen incremental esperado.\n7. Clientes recuperados.\n8. Ticket incremental.\n9. Frecuencia incremental.\n10. ROI promocional consolidado.\n\nAdemás:\n\n1. Identificá qué estrategia aporta más valor.\n2. Identificá qué estrategia tiene más riesgo.\n3. Identificá dónde puede haber canibalización.\n4. Identificá dónde puede haber baja incrementalidad.\n5. Recomendá qué inversiones ejecutar, ajustar o descartar.\n\nNo presentes el ROI como resultado garantizado.\nSepará cálculos, supuestos y decisiones comerciales."
      }
    ],
    required: ["Consolidación de ROI guardada en plataforma."],
    fields: [
      { key: "consolidated_strategy", label: "1. Estrategia consolidada", placeholder: "Ejemplo: resumen de estrategias seleccionadas por segmento." },
      { key: "total_investment", label: "2. Inversión promocional total", placeholder: "Ejemplo: suma de inversiones VIP, churn y oportunistas." },
      { key: "incremental_impact", label: "3. Impacto incremental esperado", placeholder: "Ejemplo: revenue incremental, margen incremental, clientes recuperados, ticket y frecuencia." },
      { key: "consolidated_roi", label: "4. ROI promocional consolidado", placeholder: "Ejemplo: cálculo direccional y supuestos clave." },
      { key: "decisions_to_review", label: "5. Decisiones a revisar antes de ejecutar", placeholder: "Ejemplo: canibalización, baja incrementalidad, ajustes de inversión." }
    ],
    confirmations: []
  }
} as const;

export type Lab02ExerciseId = keyof typeof lab02ExerciseContent;
