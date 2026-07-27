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

Convención de cálculo (usala tal cual, para que todos los equipos lleguen
a números comparables):
- Venta promedio diaria = suma de los 12 meses / 365.
- Cobertura operativa base = 1.5 x lead time. Es también el DDI mínimo de
  seguridad: el piso para sobrevivir un ciclo y medio de reposición.

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

Convención de cálculo (la misma de la Parte B):
- Venta promedio diaria = suma de los 12 meses / 365.
- Cobertura operativa base = 1.5 x lead time.
- Inventario objetivo = venta diaria x cobertura base x (1 + % seguridad).
- Capital objetivo = inventario objetivo x costo unitario.

Hacé esto en tres pasos, en este orden:

PASO 1 -- Escenario de máxima protección.
Ubicá todos los subgrupos en el TECHO de su banda. Calculá Stock de
Seguridad, Inventario Objetivo, DDI recomendado, Capital Objetivo y
Capital Liberado por subgrupo, y el total liberado como % del capital
actual. Decime explícitamente si ese escenario alcanza el 15%.

PASO 2 -- Si no alcanza, mostrame el costo de proteger.
Para cada subgrupo calculá cuánto capital adicional se libera al bajarlo
del techo al piso de su banda, y qué días de cobertura resigna al
hacerlo. Ordená la lista de mayor a menor capital liberado por día
resignado.

PASO 3 -- Armá un plan que cumpla la meta.
Elegí, subgrupo por subgrupo, techo o piso, hasta llegar al 15%. Ningún
subgrupo puede salir de su banda ni quedar por debajo de su DDI mínimo
de seguridad. Justificá cada subgrupo que dejes en el piso: qué riesgo
comercial se asume a cambio de esa liberación.

Si algún subgrupo requiere INVERSIÓN en lugar de liberar capital (su
stock actual está por debajo del inventario objetivo), señalalo -- no lo
escondas en el neto.`;

export const promptPortfolio = `Al plan de la Parte C, sumale este dato conocido -- es una restricción de
negocio ya decidida, no algo que tengas que inferir de la variabilidad:

- Medicamentos Bajo Receta y Fragancias Premium: clasificados REVIEW en
  el Ejercicio 1 de Portfolio.
- Protección Solar, Repelentes de Insectos, Vitaminas y Suplementos,
  Nutrición Infantil y Farmacia OTC: clasificados CORE.

Recalculá el plan con esta regla: los subgrupos REVIEW van al PISO de su
banda y los CORE al TECHO, aunque la variabilidad o la criticidad de
algún REVIEW hubieran sugerido más protección.

Devolveme:
1. El plan completo con esa regla y el % total de capital liberado.
2. La comparación contra el plan de la Parte C: cuánto capital adicional
   aporta priorizar los REVIEW, y si ese aporte es lo que permite cumplir
   la meta del 15%.
3. Por cada REVIEW que baja al piso: qué días de cobertura resigna y qué
   riesgo comercial o regulatorio asume el equipo a cambio (por ejemplo,
   exigencias de disponibilidad en la categoría regulada de Medicamentos
   Bajo Receta).
4. Si algún subgrupo quedara por debajo de su DDI mínimo de seguridad,
   señalalo y no lo apliques.`;

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
