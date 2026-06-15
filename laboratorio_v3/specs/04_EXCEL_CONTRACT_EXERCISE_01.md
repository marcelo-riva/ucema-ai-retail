# Excel Contract — Exercise 01 Portfolio

## Archivo

`NEXUS_RETAIL_LAB01_WORKBOOK_COMPLETO.xlsx`

## Principio

El Ejercicio 1 no usa un archivo propio. Trabaja sobre el workbook vivo del
Laboratorio 1. El alumno puede continuar desde el Excel aunque la plataforma no
esté disponible.

## Hoja principal

- `05_DECISIONES_PORTFOLIO`

## Hojas de apoyo

- `01_BASE_SKUS`
- `04_DIAGNOSTICO_INICIAL`
- `09_SCOREBOARD_ALUMNO`
- `10_PLAN_90_DIAS`

## Preview opcional

- `07_FORECAST_90_DIAS`

En Portfolio, Forecast se usa solo como estimación inicial de impacto. La
proyección M13-M15 se trabaja en profundidad en Ejercicio 3.

## Reglas

- `01_BASE_SKUS` conserva histórico M01-M12 y no debe ser modificada.
- La decisión de portfolio se carga en `05_DECISIONES_PORTFOLIO`.
- El tablero propio se actualiza en la sección Portfolio de `09_SCOREBOARD_ALUMNO`.
- El plan 90 días puede iniciarse en `10_PLAN_90_DIAS`, pero no es obligatorio
  para cerrar Portfolio salvo indicación docente.

## Columnas editables esperadas

En `05_DECISIONES_PORTFOLIO`:

- `decision_portfolio`
- `action_90_days`
- `decision_reason`
- `priority`
- `commercial_risk`
- `ai_comment`
- `team_comment`

## Validaciones actuales

En `05_DECISIONES_PORTFOLIO`:

- `decision_portfolio`: CORE, REVIEW, ELIMINAR.
- `action_90_days`: Mantener, Revisar precio, Liquidar stock, Reducir compra,
  Discontinuar, Mantener con monitoreo.
- `priority`: Alta, Media, Baja.
- `commercial_risk`: Alto, Medio, Bajo.

## Validaciones futuras de backend

- No eliminar filas.
- No duplicar `sku_id`.
- No modificar columnas históricas.
- No dejar decisiones vacías.
- Usar valores permitidos.
