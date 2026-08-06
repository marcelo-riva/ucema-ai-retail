export const scoreboardSegments = [
  { segment: "VIP", value: "221 clientes · $142.310.566 CLV total" },
  { segment: "Riesgo de Fuga", value: "208 clientes · $61.591.104 CLV total" },
  { segment: "Oportunistas", value: "341 clientes · $63.213.150 CLV total" },
  { segment: "Baja Prioridad", value: "230 clientes · $16.400.413 CLV total" }
] as const;

export const nextBestActionLogic = [
  {
    action: "Cross-sell",
    description: "Compra frecuente concentrada en 1-2 categorías — hay espacio blanco."
  },
  {
    action: "Upsell",
    description: "El ticket tiene margen para crecer dentro de la misma categoría."
  },
  {
    action: "Cupón",
    description: "Sensibilidad al precio o dependencia promocional — buscando el incentivo mínimo, no el máximo descuento."
  },
  {
    action: "Beneficio no monetario",
    description: "Alto engagement ya instalado — el objetivo es status o retención."
  },
  {
    action: "No hacer nada",
    description: "El costo de activar supera el retorno esperado dado el CLV."
  }
] as const;

export const archetypesTable = [
  {
    cluster: "Rutina Preventiva",
    description: "Mayoría femenina, foco Nutrición/Dermocosmética, canal mixto. Compra por necesidad recurrente, no por impulso.",
    canal: "Online / Tienda física",
    tono: "Práctico, sin urgencia artificial"
  },
  {
    cluster: "Hogar y Cuidado Básico",
    description: "Mix parejo de género, foco Higiene/Dermocosmética, mayormente presencial. Reposición del hogar.",
    canal: "Tienda física / WhatsApp",
    tono: "Directo, orientado a conveniencia"
  },
  {
    cluster: "Belleza Urbana",
    description: "Mayoría femenina, alta concentración CABA, foco Cosmética/Fragancias, fuerte canal online.",
    canal: "Online",
    tono: "Aspiracional pero cercano"
  },
  {
    cluster: "Familia en Crecimiento",
    description: "Mayoría femenina, foco Parafarmacia/Bebé y Mamá, mayormente presencial.",
    canal: "WhatsApp / Tienda física",
    tono: "Cálido, tranquilizador"
  },
  {
    cluster: "Cuidado Consciente",
    description: "Mayoría femenina, alta concentración CABA, foco Dermocosmética/Parafarmacia, fuerte canal online. Busca prevención, no solo estética.",
    canal: "Online / Email",
    tono: "Informado, sin tono promocional agresivo"
  },
  {
    cluster: "Rendimiento y Bienestar",
    description: "Mayoría masculina, foco Suplementos/Higiene, canal mixto. Orientado a resultados.",
    canal: "Online / WhatsApp",
    tono: "Directo, sin rodeos"
  }
] as const;

export const checkpointQuestions = [
  {
    id: "checkpoint_1",
    label: "1. ¿Por qué el incentivo mínimo efectivo importa más que el descuento máximo?"
  },
  {
    id: "checkpoint_2",
    label: "2. En la auditoría de la Parte C, ¿encontraron mensajes que sonaban genéricos pese a tener datos de cluster distintos? ¿Qué lo delataba?"
  },
  {
    id: "checkpoint_3",
    label: "3. ¿Qué se pierde al pasar del brief de tono (descubierto con un cliente de ejemplo) a aplicarlo sobre 100 clientes reales sin volver a iterar?"
  },
  {
    id: "checkpoint_4",
    label: "4. ¿En qué momento conviene formalizar el objetivo secundario de la Parte A como una segunda línea de acción?"
  }
] as const;

export const promptObjetivo = `Ya tenés cargado el workbook NEXUS_LAB02_EJ02_BASE.xlsx. Usá la hoja
01_SCOREBOARD_SEGMENTOS (4 segmentos: VIP, Riesgo de Fuga, Oportunistas,
Baja Prioridad, con clientes y CLV total/promedio de cada uno).

Con presupuesto comercial limitado, analizá qué pasaría si priorizáramos cada uno
de estos objetivos: aumentar frecuencia de compra, incrementar ticket promedio,
recuperar clientes inactivos, reducir el abandono (churn), generar cross-selling.

Para cada objetivo indicá: qué segmento(s) se beneficia más, qué impacto
potencial tiene dado su CLV y tamaño, y qué riesgo corremos si lo ignoramos.
Devolveme una tabla comparativa.`;

export const promptNextBestAction = `Seguimos con el workbook NEXUS_LAB02_EJ02_BASE.xlsx ya cargado.
El objetivo priorizado es: [OBJETIVO DE LA PARTE A].

Usá esta lógica de decisión para recomendar la Next Best Action de cada segmento:
- Cross-sell: compra frecuente concentrada en pocas categorías (espacio blanco)
- Upsell: ticket con margen de crecimiento dentro de su categoría actual
- Cupón: sensibilidad al precio / dependencia promocional -- pero buscando el
  incentivo MÍNIMO efectivo, no el máximo descuento
- Beneficio no monetario: alto engagement, objetivo es status/retención
- No hacer nada: el costo de activar supera el retorno esperado dado el CLV

Con la hoja 01_SCOREBOARD_SEGMENTOS, para cada segmento recomendame UNA
Next Best Action usando esa lógica, y justificá con qué criterio de la
tabla la elegiste.`;

export const promptTurno1 = `Este es un cliente de ejemplo del cluster "Cuidado Consciente":

Género: Femenino | Edad estimada: ~42 años (dato de contexto, no viene del CRM)
Cluster: Cuidado Consciente -- mayoría femenina, alta concentración CABA, foco
en Dermocosmética/Parafarmacia, fuerte canal online, busca prevención más que
estética, tono informado y sin lenguaje promocional agresivo.

Categoría principal: Dermocosmética
Recencia: 45 días | Frecuencia: 1,8 compras/mes
Ticket promedio: $38.500 | Margen: 42% | % de compras con promoción: 30%

Proponeme 3 versiones distintas de mensaje de incentivo para este cliente,
cada una con un ángulo diferente (una más racional/informativa, una más
cercana/personal, una más orientada a beneficio concreto). Cada versión:
qué se ofrece + copy de 2-3 líneas.`;

export const promptTurno2 = `Este es el mensaje final que elegimos para el cliente del cluster
"Cuidado Consciente" (resultado de iterar sobre las 3 versiones que
propusiste antes):

[PEGAR ACÁ EL MENSAJE FINAL ELEGIDO O AJUSTADO]

A partir de este mensaje, armame un "brief de tono" reusable para clientes
de este cluster: 4-5 bullets con qué sí, qué no, estructura y longitud del
mensaje.`;

export const promptTurno3 = `Seguimos con el workbook NEXUS_LAB02_EJ02_BASE.xlsx ya cargado.

Aplicá el criterio de tono por cluster de la hoja 02_ARQUETIPOS (cada
cliente tiene el suyo -- no uses el mismo brief para todos) a cada uno de
los 100 clientes de la hoja 04_MUESTRA_100. Para cada uno, generá:
- el incentivo (con el criterio de incentivo mínimo efectivo)
- el canal
- el copy final del mensaje en el tono de su cluster
- una justificación breve (1 línea) de por qué elegiste ese mensaje/tono
  puntual para ESE cliente -- qué dato suyo lo explica

Escribí los resultados directamente en la hoja 05_MENSAJES_PERSONALIZADOS
del mismo Excel (ya tiene id_cliente y cluster_nombre precargados, una fila
por cliente): completá las columnas incentivo, canal, copy_final y
justificacion_tono, y devolveme el Excel actualizado.`;

export const promptProyeccion = `Con el workbook ya cargado, usá los 100 incentivos de la hoja
05_MENSAJES_PERSONALIZADOS y proyectá para todo el segmento [SEGMENTO]
(tamaño y CLV total: hoja 01_SCOREBOARD_SEGMENTOS):
- Conversión esperada (% que responde)
- CLV incremental generado
- Costo total del incentivo
- ROI de la acción

Usá el costo promedio de incentivo que salió de la muestra de 100 como base
del cálculo, y mostrá el cálculo, no solo el resultado.`;
