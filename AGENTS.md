# AGENTS.md - Guia de continuidad del proyecto

## Proposito

Este repositorio construye una experiencia educativa para alumnos que usan su propia IA para resolver problemas de negocio de NEXUS Retail.

Aunque el proyecto se llama "simulador", el HTML no es un motor de simulacion. El HTML presenta contexto, teoria y problemas. Los alumnos realizan los analisis y estimaciones con ChatGPT, Claude, Gemini u otra IA.

Antes de modificar la experiencia, leer:

1. `brief/simulador01-brief.md`
2. `index.html`
3. `contexto-alumno.md`

## Decisiones firmes

- La experiencia esta disenada para alumnos, no para quienes crean el curso.
- Los alumnos no ven el brief original.
- El HTML debe hablar directamente al alumno.
- Cada problema debe ser una situacion concreta del negocio NEXUS.
- Cada problema debe indicar claramente:
  - contexto del negocio;
  - que vamos a aprender;
  - teoria necesaria;
  - input esperado para la IA;
  - prompt sugerido;
  - output esperado;
  - riesgos y controles.
- El input esperado debe nombrar archivo, hoja y columnas concretas.
- El alumno usa su propia IA para diagnosticar, proponer acciones y estimar impacto.
- El alumno es responsable de controlar formulas, supuestos y conclusiones de la IA.
- No hay una unica respuesta correcta.

## Alcance de datos actual

Usar:

- `data/Base SKUs.xlsx`
- Hoja `Base`

No usar por ahora:

- `data/Base_Clientes_10000.xlsx`

La base de clientes puede ser importante para problemas futuros, pero no debe aparecer como input en la experiencia actual.

La hoja `Base` tiene 8.232 filas totales, con encabezados hasta la fila 7 y aproximadamente 8.224 registros de productos. El usuario suele describirla conceptualmente como una base de 10.000 SKUs; evitar mostrar una cifra exacta al alumno salvo que se confirme o se prepare una nueva base.

## Campos principales de la base SKU

- Identificacion: Familia, Departamento, Estado Actual, Producto DESC, Producto CODE, Producto BARRAS.
- Resultado: Venta Neta (S/IVA).
- Precio historico: PVP 1-12.
- Costo historico: CU 1-12.
- Demanda historica: Vol 1-12.
- Inventario CD: Units, $, DDI.
- Inventario PDV: Units, $, DDI.
- Inventario TOTAL: Units, $, DDI.
- Competencia: Competidor 1, Competidor 2, Competidor 3.
- Cobertura: Mercado %.

Los encabezados utiles estan en varias filas del Excel. Verificar la estructura antes de automatizar lecturas.

## Problemas actuales

1. Pricing leakage:
   encontrar SKUs baratos frente a competencia cuya elasticidad historica permita evaluar aumentos.

2. Inventario y caja:
   detectar exceso de inventario, capital liberable y riesgo de shortage.

3. Portfolio:
   clasificar SKUs segun contribucion economica, rotacion, inventario y cobertura.

4. Plan integrado:
   combinar diagnosticos en un plan 30/60/90 con impacto, riesgo y controles.

## Conceptos que deben quedar claros

- Pricing leakage no significa simplemente "precio menor que competencia". Tambien requiere evaluar sensibilidad de volumen, margen y riesgo.
- Elasticidad debe calcularse o estimarse usando los 12 meses de PVP y volumen, explicando metodo y limitaciones.
- DDI alto inmoviliza capital; DDI bajo puede provocar shortage. La recomendacion debe considerar ambos lados.
- Reducir inventario puede liberar caja, pero tambien afectar ventas y cobertura.
- Baja venta no alcanza para retirar un SKU. Portfolio debe considerar margen, rotacion, inventario, cobertura y rol comercial.
- Toda recomendacion debe explicitar impacto esperado, supuesto y trade-off.

## Lo que se descarto

No reintroducir sin una decision explicita del usuario:

- Las cinco variables editables: DDI objetivo, cobertura minima, ajuste maximo de precio, portfolio a revisar y agresividad.
- Formularios para cargar decisiones en el HTML.
- Escenarios prearmados conservador, balanceado y agresivo.
- Un motor interno que calcula resultados.
- Score gamer o evaluacion automatica.
- Uso de la base de clientes en esta version.

## Guia de contenido y tono

- Hablar en espanol rioplatense claro y profesional.
- Evitar lenguaje de producto interno como "brief", "panel de creacion" o "v0.1" en la interfaz del alumno.
- No decirle al alumno simplemente "lee el caso": el contexto debe estar explicado en el propio HTML.
- Explicar por que importa cada problema antes de pedir una tarea.
- Evitar consignas vagas como "analiza la base".
- Los outputs esperados deben especificar formato, metricas y decisiones.
- Los prompts sugeridos deben orientar, pero no entregar la solucion.

## Archivos principales

- `index.html`: experiencia principal para alumnos.
- `contexto-alumno.md`: contexto descargable para trabajar con una IA.
- `brief/simulador01-brief.md`: definicion funcional y pedagogica vigente.
- `AGENTS.md`: decisiones y continuidad para futuras iteraciones.

## Verificacion minima despues de editar

- Confirmar que `index.html` parsea como HTML.
- Confirmar que los enlaces locales existen.
- Buscar referencias descartadas:
  - cinco variables;
  - base de clientes;
  - carga de decisiones;
  - escenarios prearmados;
  - motor interno de simulacion.
- Confirmar que cada problema contiene "Que vamos a aprender", "Input esperado para tu IA" y "Output esperado".
- Revisar visualmente el HTML en el navegador cuando la herramienta este disponible.

## Preguntas abiertas

- ¿Que metodo exacto se ensenara para calcular elasticidad?
- ¿Como se tratara elasticidad extrema, positiva o con pocos cambios de precio?
- ¿Que formula de margen se usara para estimar impacto?
- ¿Como se definira un DDI objetivo razonable por segmento?
- ¿Como se estimara shortage con los datos disponibles?
- ¿Como se agregara la cobertura de mercado al retirar o revisar SKUs?
- ¿Los alumnos analizaran toda la base o una muestra?
- ¿Que rubrica utilizara el docente para evaluar cada output?
- ¿Se incorporaran ejemplos resueltos parciales sin revelar la solucion completa?
