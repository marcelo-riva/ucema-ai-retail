# CODEX PROMPT 02 — Build Lab 1 UI

Implementar el flujo mock del Laboratorio 1.

## Objetivo

La plataforma debe funcionar como copilot de acompañamiento, no como AI que
resuelve.

Debe guiar al alumno para que use su AI personal y complete un único workbook
vivo durante todo el laboratorio.

## Rutas

- `/labs`
- `/labs/lab-01/exercises/ex-00`
- `/labs/lab-01/exercises/ex-01`
- `/labs/lab-01/exercises/ex-02`
- `/labs/lab-01/exercises/ex-03`
- `/labs/lab-01/exercises/ex-04`
- `/labs/lab-01/scoreboard`
- `/labs/lab-01/final-plan`

## Workbook

- Descargar `NEXUS_RETAIL_LAB01_WORKBOOK_COMPLETO.xlsx`.
- Link a `/templates/NEXUS_RETAIL_LAB01_WORKBOOK_COMPLETO.xlsx`.
- Nombrarlo como "Workbook del Laboratorio 1".
- Explicar que el workbook es la memoria del laboratorio.

## Secuencia

0. Exploración Inicial.
1. Portfolio Optimization.
2. Pricing Optimization.
3. Forecast Engine.
4. Inventory & Working Capital Optimization.
5. Plan de Captura de Valor 90 días.

## Ejercicio 1

- Título: "Ejercicio 1: Decidir qué portfolio sostener".
- Foco: clasificar SKUs como CORE, REVIEW o ELIMINAR.
- Hoja principal: `05_DECISIONES_PORTFOLIO`.
- Scoreboard del equipo: `09_SCOREBOARD_ALUMNO`.
- Forecast `07_FORECAST_90_DIAS` es preview, no tarea pesada en Portfolio.

## Checkpoints

- Usar el término "Subir checkpoint del workbook".
- No usar "subir archivo del ejercicio".
- Persistir en localStorage.
- Estados mock: `state_v0`, `state_v0_explored`, `state_v1_portfolio`,
  `state_v2_pricing`, `state_v3_forecast`, `state_v4_inventory`,
  `state_final_plan`.

## Textos clave

Usar este principio visible:
"La plataforma acompaña; el workbook sostiene el ejercicio."

## Validaciones Fase 0

- Campos obligatorios por checkpoint.
- Workbook `.xlsx` obligatorio para enviar checkpoint.
- Reporte AI opcional.
- Confirmaciones obligatorias.
