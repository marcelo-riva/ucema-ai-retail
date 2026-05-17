# ucema-ai-retail — Shared Agent Context

> Este archivo es la fuente de verdad compartida. Todos los agentes (Claude Code, Codex, OpenCode, etc.) deben leerlo antes de cualquier tarea.

## Objetivo

Curso universitario (UCEMA) sobre aplicaciones de inteligencia artificial en retail.
El simulador permite que los alumnos experimenten con decisiones de negocio (pricing, inventario, demanda) usando modelos de AI.

## Simulador

El foco actual del repo es construir el simulador interactivo. El contenido de clases se trabajara mas adelante y debe mantenerse separado en `clases/`.

El caso base del simulador es **PharmaLink 360**, una cadena de farmacias con 120 locales que enfrenta un turnaround de 12 meses. El desafio ejecutivo es salir del "boring middle": pierde conveniencia contra pure players digitales y pierde experiencia contra farmacias boutique.

Punto de partida del caso:

- ventas mensuales base: ARS 29.984,5 MM;
- EBITDA mes 0: ARS 881,125 MM;
- caja inicial: ARS -25.000 MM;
- inventario inicial: ARS 60.000 MM;
- DDI inicial ponderado: 62 dias;
- CAPEX maximo anual: ARS 50.000 MM;
- constraint de caja: no mas de 3 meses consecutivos de FCF negativo.

La metrica de exito combina EBITDA, caja final y consistencia estrategica. El simulador debe ayudar a explicar trade-offs ejecutivos, no solo calcular outputs financieros.

## Referencias del simulador

Los archivos fuente viven en `simulador/referencias/planificador/`:

- `Caso de Negocio P2.docx` — marco pedagogico general y laboratorios ejecutivos.
- `PharmaLink 360_ Caso Draft 05.13.26.docx` — narrativa ejecutiva del caso PharmaLink 360.
- `PharmaLink360_Simulador_Operativo_12M V1.xlsx` — modelo operativo base del simulador.

Analisis consolidado:

- `simulador/docs/analisis-referencias.md`
- `simulador/docs/variables-caso-y-ejercicios.md`
- `simulador/docs/simulador-specs.md`
- `simulador/docs/resumen-sesion-2026-05-17.md`
- `simulador/docs/presentacion-interaccion-jugador.html`

## Estructura del proyecto

```
simulador/                         — simulador interactivo de retail con AI
  referencias/planificador/        — Excel base del planificador/simulador
  escenarios/                      — escenarios versionables para simulaciones
  data/raw/                        — datos crudos consumibles por el simulador
  data/processed/                  — datos normalizados o derivados
  src/                             — motor de simulacion y reglas de negocio
  app/                             — interfaz interactiva
  tests/                           — pruebas del motor y escenarios
  docs/                            — notas de diseno y glosario de variables
clases/                            — notebooks, slides y ejercicios por clase
```

## Modelo conceptual

No copiar el Excel celda por celda. Usarlo como referencia funcional para construir un motor mantenible con estas capas:

1. `Scenario` — decisiones del usuario para los 12 meses.
2. `Assumptions` — parametros base del negocio.
3. `Engines` — modulos de negocio:
   - pricing y elasticidad;
   - inventario, surtido, cobertura y DDI;
   - digital, fulfillment, SLA y cost-to-serve;
   - CLV, marketing, churn, retencion y CAC;
   - red de PDV, aperturas/cierres y CAPEX.
4. `FinancialCore` — P&L, cash flow, constraints y score.
5. `Dashboard` — resultados ejecutivos, alertas y comparacion de escenarios.

## Excel base

El Excel `PharmaLink360_Simulador_Operativo_12M V1.xlsx` contiene estas hojas:

- `Intro` — instrucciones de uso.
- `00_General` — parametros globales, punto de partida y hard constraints.
- `01_Master_Variables` — capa de integracion hacia P&L y caja.
- `02_Pricing` — pricing, elasticidad, competitividad y margen por categoria.
- `03_CatMan_DDI` — surtido, cobertura, DDI, quiebres, inventario y working capital.
- `04_Digital_Logistica` — mix fisico/digital, fulfillment, SLA y cost-to-serve.
- `05_CLV_Marketing` — segmentos, churn, retencion, nuevos clientes, revenue incremental y marketing.
- `06_Red_CAPEX` — aperturas, cierres, formatos de PDV, ventas asociadas y CAPEX.
- `07_PL_TiposPDV` — P&L base por tipo de punto de venta y zona.
- `08_Core_Financiero` — P&L mensual, flujo de caja y constraints.
- `09_Dashboard` — tablero ejecutivo con KPIs y alertas.

Las celdas amarillas del Excel representan inputs editables. Para la app, traducir esos inputs a controles ejecutivos claros: sliders, tablas por mes/categoria, selectores de estrategia y comparador de escenarios.

El mapa de variables que guian el caso y las palancas por ejercicio esta documentado en `simulador/docs/variables-caso-y-ejercicios.md`.

## Ramas

- `main` — estable, solo merges revisados
- `feature/simulador` — desarrollo activo del simulador

## Stack

- Python
- Streamlit para el MVP local
- JSON local para persistencia de jugadas
- Mock IA por reglas en la primera version

## Estado actual

- [x] Repo inicializado y configurado para múltiples agentes
- [x] Estructura de carpetas del simulador
- [x] Referencias base del simulador incorporadas
- [x] Analisis inicial de referencias documentado
- [x] Specs funcionales y arquitectura documentadas
- [x] Motor inicial simplificado del simulador
- [x] App interactiva inicial en Streamlit
- [x] Cockpit compacto, progresion 12 meses y vistas por categoria
- [x] Comparacion baseline vs actual e iteraciones guardadas
- [x] Jugadas guiadas A/B/C para inventario y pricing
- [x] Reset del escenario actual
- [ ] Primer notebook de clase

## Convenciones

- Idioma del código: inglés
- Idioma de comentarios y docs: español
- Commits en inglés, estilo convencional (`feat:`, `fix:`, `chore:`)
- No commitear a `main` directamente

## Instrucciones para agentes

- Leer este archivo al inicio de cada sesión
- Actualizar "Estado actual" cuando algo cambie
- El simulador vive en `simulador/`, no mezclar con materiales de clase
- Antes de cambiar el simulador, revisar y respetar `simulador/docs/simulador-specs.md`
- Para correr el MVP local: `cd simulador && PYTHONPATH=src streamlit run app/streamlit_app.py`
