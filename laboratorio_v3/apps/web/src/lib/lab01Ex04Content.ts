export const inventorySubgroups = [
  {
    name: "Protección Solar",
    margin: "Medio",
    criticality: "Alta -- entra a su pico ahora",
    portfolio: "CORE"
  },
  {
    name: "Repelentes de Insectos",
    margin: "Medio",
    criticality: "Alta -- entra a su pico ahora",
    portfolio: "CORE"
  },
  {
    name: "Vitaminas y Suplementos",
    margin: "Medio-alto",
    criticality: "Media -- sustituible, pero recurrente",
    portfolio: "CORE"
  },
  {
    name: "Nutrición Infantil",
    margin: "Alto",
    criticality: "Muy alta -- categoría sensible, cliente cautivo",
    portfolio: "CORE"
  },
  {
    name: "Farmacia OTC",
    margin: "Bajo",
    criticality: "Baja -- reposición diaria, se recupera rápido",
    portfolio: "CORE"
  },
  {
    name: "Medicamentos Bajo Receta",
    margin: "Alto",
    criticality: "Muy alta -- categoria regulada, exigencia estricta de disponibilidad",
    portfolio: "REVIEW"
  },
  {
    name: "Fragancias Premium",
    margin: "Alto",
    criticality: "Baja -- compra no urgente, postergable",
    portfolio: "REVIEW"
  },
  {
    name: "Maquillaje Estacional",
    margin: "Medio",
    criticality: "Media -- postergable, pero pico muy concentrado",
    portfolio: undefined
  }
] as const;

export const postureOptions = [
  { key: "proteger", label: "Proteger cobertura", style: "ok" as const },
  { key: "balanceado", label: "Balanceado", style: "tight" as const },
  { key: "recortar", label: "Recortar y liberar", style: "over" as const }
];

export const safetyStockBands = [
  { profile: "Muy estable", coefficient: "< 0.15", range: "10% – 15%" },
  { profile: "Estable", coefficient: "0.15 – 0.30", range: "15% – 20%" },
  { profile: "Moderado", coefficient: "0.30 – 0.50", range: "20% – 30%" },
  { profile: "Volátil", coefficient: "0.50 – 0.80", range: "30% – 40%" },
  { profile: "Muy volátil", coefficient: "> 0.80", range: "40% – 50%" }
];

export const promptDiagnostico = `Sos un analista de capital de trabajo para NEXUS Retail, cadena de salud y
belleza en Argentina. Tenés la hoja 03_SUBGRUPOS del workbook: 12 meses de
historia de venta, precio, costo, lead time, canal de reposición y stock
actual por subgrupo.

Usá esta tabla de bandas de stock de seguridad -- no inventes tus propios
cortes de coeficiente de variación:

Perfil          | Coef. variación | % Stock Seguridad
Muy estable     | < 0.15          | 10% - 15%
Estable         | 0.15 - 0.30     | 15% - 20%
Moderado        | 0.30 - 0.50     | 20% - 30%
Volátil         | 0.50 - 0.80     | 30% - 40%
Muy volátil     | > 0.80          | 40% - 50%

Para cada uno de los 8 subgrupos, calculá:
1. DDI actual (stock actual / venta promedio diaria).
2. Capital de trabajo actual (stock actual x costo unitario).
3. Coeficiente de variación de la demanda mensual (desvío estándar /
   promedio mensual).
4. Perfil de variabilidad y el RANGO de % de stock de seguridad que le
   corresponde según la tabla de arriba (piso y techo, no un solo
   número).
5. DDI mínimo de seguridad: 1.5 x el lead time del subgrupo.

Devolveme una tabla con las 8 filas y esas columnas. Documentá el método
en una nota al final, de forma reproducible por otra persona con los
mismos datos.`;

export const promptDdiOptimo = `Sos un copiloto de optimización de inventario para NEXUS Retail. Tenés el
diagnóstico de 05_DIAGNOSTICO (DDI actual, capital actual, variabilidad,
RANGO de stock de seguridad y DDI mínimo por subgrupo) y estos datos de
negocio:

- Costo de oportunidad del capital de trabajo: 3% mensual.
- Margen y criticidad de quiebre por subgrupo: hoja 03_SUBGRUPOS,
  columnas margen_cualitativo y criticidad_quiebre.
- Meta: liberar al menos 15% del capital de trabajo total actual, sin
  llevar ningún subgrupo CORE por debajo de su DDI mínimo de seguridad.

Para cada subgrupo:
1. Calculá el costo mensual de sostener el extra de cobertura si te
   parás en el TECHO del rango (días extra x costo unitario x 3% / 30) y
   comparalo contra el margen unitario que se pierde en un quiebre
   (aproximalo con el margen_cualitativo y la criticidad_quiebre dados).
2. Elegí tu posición dentro del rango de stock de seguridad: más cerca
   del techo solo si el costo de quiebre supera al costo de capital;
   más cerca del piso si es al revés. Nunca salgas del rango.
3. Con esa posición, calculá Stock de Seguridad, Inventario Objetivo,
   DDI recomendado, Capital Objetivo y Capital Liberado por subgrupo.
4. Sumá el capital liberado total. Si no llegan al 15% sin poner un CORE
   en riesgo, decilo explícitamente -- no fuerces un número que no
   sostiene la restricción -- y proponé qué subgrupo tiene más margen
   para ceder más.
5. Documentá, subgrupo por subgrupo, en qué punto del rango te ubicaste
   y por qué (costo de capital vs. costo de quiebre).`;

export const promptPortfolio = `Al plan de la Parte C, sumale este dato conocido -- es una restricción de
negocio ya decidida, no algo que tengas que inferir de la variabilidad:

- Medicamentos Bajo Receta y Fragancias Premium: clasificados REVIEW en
  el Ejercicio 1 de Portfolio.
- Protección Solar, Repelentes de Insectos, Vitaminas y Suplementos,
  Nutrición Infantil y Farmacia OTC: clasificados CORE.

Recalculá dando prioridad a liberar capital en los subgrupos REVIEW,
aunque su variabilidad y criticidad hubieran sugerido más protección, y
explicá qué riesgo comercial y regulatorio asume el equipo al hacerlo en
cada uno (por ejemplo, exigencias de disponibilidad en la categoría
regulada de Medicamentos Bajo Receta). Ningún CORE puede quedar por
debajo de su DDI mínimo de seguridad.`;

export const checkpointFields = [
  {
    id: "checkpoint_1",
    label: "1. ¿En qué subgrupo su postura de la Parte A no coincidió con el diagnóstico real, y qué les hizo errar?"
  },
  {
    id: "checkpoint_2",
    label: "2. ¿Qué decidieron con Protección Solar en la Parte D, y qué hubiera pasado si no lo auditaban?"
  },
  {
    id: "checkpoint_3",
    label: "3. ¿Cómo deciden hoy en su empresa cuánto stock sostener? ¿Quién es dueño de esa decisión y qué cambiarían después de este ejercicio?"
  }
];
