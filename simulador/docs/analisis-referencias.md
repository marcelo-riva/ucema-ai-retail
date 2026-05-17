# Analisis de referencias del simulador

Fecha de analisis: 2026-05-17

## Archivos revisados

- `referencias/planificador/Caso de Negocio P2.docx`
- `referencias/planificador/PharmaLink 360_ Caso Draft 05.13.26.docx`
- `referencias/planificador/PharmaLink360_Simulador_Operativo_12M V1.xlsx`

## Lectura general

El simulador debe funcionar como un laboratorio ejecutivo de decisiones comerciales para un turnaround retail/omnicanal.

El caso pedagogico plantea que los participantes actuan como un comite ejecutivo que debe optimizar el sistema completo, no solo una palanca aislada. La tesis central es que la IA no reemplaza el management comercial, sino la improvisacion: ayuda a integrar datos, modelos y criterio ejecutivo para tomar mejores decisiones.

## Caso operativo: PharmaLink 360

PharmaLink 360 es una cadena de farmacias con 120 locales y posicionamiento de precio medio/surtido amplio. El problema de negocio es el "boring middle": pierde conveniencia contra pure players digitales y pierde experiencia contra farmacias boutique.

Situacion inicial declarada:

- Ventas mensuales base: ARS 29.984,5 MM.
- EBITDA mes 0: ARS 881,125 MM.
- Caja inicial: ARS -25.000 MM.
- Inventario inicial: ARS 60.000 MM.
- DDI inicial ponderado: 62 dias.
- Horizonte: 12 meses.
- CAPEX maximo: ARS 50.000 MM.
- Restriccion de caja: no mas de 3 meses consecutivos de FCF negativo.

La metrica de exito combina EBITDA, caja final y consistencia estrategica.

## Laboratorios y motores del simulador

### 1. Working Capital & Inventory Intelligence

Objetivo: optimizar capital de trabajo mediante reduccion de error de pronostico y racionalizacion de cobertura de inventario.

Decisiones:

- reduccion de SKUs;
- cobertura objetivo;
- stock de seguridad;
- priorizacion de categorias;
- asignacion de capital de trabajo.

KPIs:

- DDI;
- fill rate;
- GMROI;
- quiebres de stock;
- working capital;
- inventory turnover.

### 2. AI Revenue Optimization

Objetivo: maximizar margen bruto usando pricing dinamico, elasticidad y competitividad.

Decisiones:

- pricing regular;
- pricing promocional;
- arquitectura de precios;
- estrategia competitiva;
- mix margen/volumen.

KPIs:

- margen bruto;
- elasticidad;
- revenue uplift;
- competitividad de precio;
- sell-through;
- margen por categoria.

### 3. Customer Profitability & Growth

Objetivo: optimizar inversion comercial y rentabilidad de clientes mediante segmentacion y CLV.

Decisiones:

- segmentacion RFM;
- cuponing;
- retencion;
- recuperacion de clientes;
- inversion promocional.

KPIs:

- CLV;
- CAC;
- churn;
- frecuencia;
- ticket promedio;
- ROI marketing;
- tasa de recompra.

## Estructura del Excel base

El Excel ya esta organizado como un modelo modular de 12 meses:

- `Intro`: instrucciones de uso y logica pedagogica.
- `00_General`: parametros globales, punto de partida y hard constraints.
- `01_Master_Variables`: capa de integracion hacia P&L y caja.
- `02_Pricing`: pricing, elasticidad, competitividad y margen por categoria.
- `03_CatMan_DDI`: surtido, cobertura, DDI, quiebres, inventario y working capital.
- `04_Digital_Logistica`: mix fisico/digital, fulfillment, SLA y cost-to-serve.
- `05_CLV_Marketing`: segmentos de clientes, churn, retencion, nuevos clientes, revenue incremental y marketing.
- `06_Red_CAPEX`: aperturas, cierres, formatos de PDV, ventas asociadas y CAPEX.
- `07_PL_TiposPDV`: P&L base por tipo de punto de venta y zona.
- `08_Core_Financiero`: P&L mensual, flujo de caja y constraints.
- `09_Dashboard`: tablero ejecutivo con KPIs y alertas.

## Inputs principales detectados

Las celdas de input del Excel estan marcadas con fondo amarillo claro (`FFFFF2CC`). Conceptualmente se agrupan asi:

- parametros generales: PDV base, ventas mes 0, EBITDA mes 0, caja inicial, inventario inicial, DDI inicial, CAPEX maximo, inflacion y FX;
- pricing: cambios de PVP por categoria y mes;
- catman/DDI: cobertura, reduccion de SKUs y DDI objetivo por categoria;
- digital/logistica: mix de canal, delivery, pick-up, hub/dark store y estrategia de fulfillment;
- CLV/marketing: foco de retencion por segmento, nuevos clientes y presupuesto/CAC;
- red/CAPEX: aperturas y cierres por formato, zona y mes;
- P&L por PDV: margen por formato/zona.

## Outputs principales

- revenue simulado;
- margen bruto y margen final;
- mermas/vencidos;
- costo logistico;
- marketing;
- personal, alquileres y G&A;
- EBITDA operativo;
- EBITDA ajustado por cost-to-serve;
- liberacion o absorcion de working capital;
- CAPEX;
- FCF;
- caja final;
- alertas de constraint;
- dashboard ejecutivo.

## Implicancias para el simulador web/app

El primer producto no deberia intentar copiar el Excel celda por celda. Conviene convertirlo en un motor con estas capas:

1. `Scenario`: decisiones del usuario para los 12 meses.
2. `Assumptions`: parametros base del negocio.
3. `Engines`: pricing, inventario/DDI, digital/logistica, CLV/marketing, red/CAPEX.
4. `FinancialCore`: P&L, cash flow, constraints y score.
5. `Dashboard`: resultados ejecutivos, alertas y comparacion contra baseline.

La experiencia del usuario deberia priorizar decisiones ejecutivas:

- mover palancas por mes o por trimestre;
- ver impacto inmediato en EBITDA, FCF, caja final, CAPEX y alertas;
- comparar escenarios;
- explicar trade-offs, no solo mostrar numeros.

## Archivos fuente

Mantener los documentos originales en `simulador/referencias/planificador/` como fuente historica.

Cuando empecemos el motor, conviene extraer una representacion normalizada en `simulador/data/processed/`, por ejemplo:

- `assumptions.json`
- `base_case.json`
- `categories.csv`
- `store_formats.csv`
- `scenario_base.json`
