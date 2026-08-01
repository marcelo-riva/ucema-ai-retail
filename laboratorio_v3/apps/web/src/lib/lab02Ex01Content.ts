export const initialClients = [
  {
    id: "C03839",
    label: "Ticket alto, muy promocional",
    ticket: "$124.044",
    recency: "175 días",
    frequency: "0,39",
    promoPct: "62%"
  },
  {
    id: "C03356",
    label: "Ticket medio, fiel y reciente",
    ticket: "$33.515",
    recency: "20 días",
    frequency: "1,06",
    promoPct: "10%"
  },
  {
    id: "C08634",
    label: "Reciente, frecuente, ticket medio-alto",
    ticket: "$71.823",
    recency: "2 días",
    frequency: "3,12",
    promoPct: "30%"
  },
  {
    id: "C07379",
    label: "No compra hace casi un año",
    ticket: "$46.744",
    recency: "359 días",
    frequency: "0,83",
    promoPct: "79%"
  }
] as const;

export const portfolioCategories = [
  "Cosmética",
  "Higiene",
  "Nutrición",
  "Bebé & Mamá",
  "Parafarmacia",
  "Dermocosmética",
  "Suplementos",
  "Fragancias"
] as const;

export const healthOptions = [
  { key: "sana", label: "Sana" },
  { key: "vigilar", label: "Vigilar" },
  { key: "fragil", label: "Frágil" }
] as const;

export const segmentCollapseTable = [
  {
    segment: "VIP",
    cells: "VIP, Leales",
    logic: "Alto valor y recientes -- proteger y retener."
  },
  {
    segment: "Riesgo de Fuga",
    cells: "En Riesgo, Leales Potenciales",
    logic: "Compraban bien y la recencia está cayendo -- recuperables si se actúa ahora."
  },
  {
    segment: "Oportunistas",
    cells: "Ocasionales, Casuales, Nuevos",
    logic: "Bajo desarrollo todavía -- potencial de subir frecuencia o ticket."
  },
  {
    segment: "Baja Prioridad",
    cells: "Dormidos, Dormidos Profundos",
    logic: "Ya perdidos hace tiempo -- no entran en los 3 segmentos centrales."
  }
] as const;

export const scoreboardVariables = [
  { key: "clv_total", label: "CLV total de la base (ARS)" },
  { key: "pct_riesgo", label: "% de clientes en riesgo de fuga" },
  { key: "cantidad_riesgo", label: "Clientes en riesgo de fuga (cantidad)" },
  { key: "pct_clv_vip", label: "% del CLV concentrado en VIP" }
] as const;

export const checkpointQuestions = [
  {
    id: "checkpoint_1",
    label: "1. ¿En qué cliente de la Parte A su orden de prioridad no coincidió con el diagnóstico real, y qué les hizo errar?"
  },
  {
    id: "checkpoint_2",
    label: "2. Para cada uno de los 4 segmentos finales (Parte D), ¿qué jugada le harían con el presupuesto de fidelización -- y por qué es una jugada distinta en cada caso, no un mismo descuento para todos?"
  },
  {
    id: "checkpoint_3",
    label: "3. De los arquetipos de la Parte E, ¿cuál cruza más segmentos de valor (VIP, Oportunistas, etc.) y qué les dice eso sobre comunicar por perfil en vez de por valor?"
  },
  {
    id: "checkpoint_4",
    label: "4. ¿Cómo deciden hoy en tu empresa a qué clientes priorizar y cómo comunicarles? ¿Quién es dueño de esa decisión, y qué cambiarían después de este ejercicio?"
  }
] as const;

export const promptCalidadCartera = `Sos un analista de portfolio para Nexus. Tenés la hoja 03_CLIENTES con los
10.000 clientes: categoría principal, margen bruto %, participación en
promociones % y margen acumulado.

Para cada una de las 8 categorías, calculá: cantidad de clientes que la
tienen como categoría principal, margen bruto promedio, participación
promocional promedio, y margen acumulado total.

Devolveme la tabla de 8 filas con esas columnas. No clasifiques vos las
categorías -- Sana / Vigilar / Frágil es una decisión de negocio que toma
el equipo con tu tabla como insumo, no un cálculo tuyo.`;

export const promptRfm = `Sos un copiloto de customer analytics para Nexus. Tenés 03_CLIENTES: 10.000
clientes con recencia, frecuencia mensual, ticket promedio y margen.

1. Analizá la distribución real de Recencia, Frecuencia y Ticket -- no
   asumas cortes de otro negocio -- y definí dos puntos de corte para cada
   una (Baja/Media y Media/Alta), documentando el percentil o criterio.
   Para Recencia, "Alta" significa cliente MÁS reciente (menos días).

2. Con esos cortes, ubicá a cada cliente en una de las 9 celdas de la
   matriz RFM (VIP, Leales, Leales Potenciales, En Riesgo, Ocasionales,
   Casuales, Nuevos, Dormidos, Dormidos Profundos).

3. CLIENTE POR CLIENTE (no por celda): Recencia Esperada = 30 /
   frecuencia_mensual; Churn Ratio = Recencia real / Recencia Esperada;
   Permanencia Estimada (años), inferida del Churn Ratio con tu propio
   criterio documentado (a mayor ratio, menor permanencia); CLV = Ticket
   Promedio x Frecuencia Anual x Margen Bruto % x Permanencia Estimada.

Devolveme dos tablas: (a) los cortes elegidos con su criterio, y (b) un
resumen por las 9 celdas -- no las 10.000 filas sueltas -- con cantidad de
clientes, promedios de recencia/frecuencia/ticket, Recencia Esperada,
Churn Ratio, Permanencia Estimada, CLV promedio y CLV total de la celda.`;

export const promptSegmentacionFinal = `Con el diagnóstico de 06_DIAGNOSTICO_RFM (9 celdas RFM con CLV y Churn Ratio),
colapsá cada celda a uno de 4 segmentos finales según esta regla -- está en
15_LISTS, no la cambies sin decirlo:

- VIP: VIP, Leales
- Riesgo de Fuga: En Riesgo, Leales Potenciales
- Oportunistas: Ocasionales, Casuales, Nuevos
- Baja Prioridad: Dormidos, Dormidos Profundos

Sumá el CLV total y la cantidad de clientes por segmento final. Después
consolidá cuatro números para el Executive Scoreboard: CLV total de toda la
base, cantidad y % de clientes en el segmento Riesgo de Fuga, y % del CLV
total que representa el segmento VIP.`;

export const promptClustering = `Sos un copiloto de analítica para Nexus. Tenés 03_CLIENTES: Género, Zona,
% de canal online, y el mix % de las 8 categorías para cada uno de los
10.000 clientes.

Agrupá a los clientes en clusters usando estas variables (podés codificar
Género y Zona como variables binarias). Probá con una cantidad de clusters
entre 4 y 6, y quedate con la cantidad que arme grupos genuinamente
distintos entre sí -- no fuerces 6 si con menos ya se separan bien.

Para cada cluster, devolveme: cantidad de clientes, las 1-2 categorías que
más pesan en el mix promedio del cluster (y su %), el % de canal online
promedio, el % de género femenino, y el % de zona CABA.

Esta tabla es solo el perfil frío -- no le pongas nombre ni descripción de
negocio todavía, eso es el Paso 2.`;

export const promptArquetipos = `Con la tabla fría del Paso 1, para cada cluster:

1. Nombre del arquetipo (memorable, no "Cluster 3").
2. Descripción en 2-3 líneas: quién es, qué compra, qué busca -- apoyándote
   en los números del Paso 1, no en supuestos sin sustento.
3. Regla de comunicación: canal preferido, tono, frecuencia de contacto
   sugerida.
4. Un momento WOW: una idea de experiencia memorable y no necesariamente
   monetaria para ese arquetipo, coherente con su perfil.

No definas ofertas ni descuentos concretos -- esto es sobre cómo
comunicarte y qué experiencia generar, no sobre qué vender.`;
