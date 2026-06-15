# Excel Contract — Exercise 01

## Archivo

`NEXUS_RETAIL_LAB01_EJ01_PORTFOLIO_PACK_FINAL.xlsx`

## Hojas

- `00_CASO_NEGOCIO`
- `01_BASE_SKUS`
- `02_DICCIONARIO_DATOS`
- `03_GUIA_EXPLORACION`
- `04_HIPOTESIS_EQUIPO`
- `05_DECISIONES_SKU`
- `09_PROYECCION_90_DIAS`
- `06_SCOREBOARD_ALUMNO`
- `07_PLAN_90_DIAS`
- `08_OUTPUT_FINAL`

## Reglas

El alumno puede usar todas las hojas como input para su AI personal.

La hoja principal de entrega es:
- `05_DECISIONES_SKU`

La hipótesis, criterios y trade-offs del equipo están en:
- `04_HIPOTESIS_EQUIPO`

El cierre ejecutivo está en:
- `08_OUTPUT_FINAL`
- y también en los textareas de la plataforma.

El scoreboard propio del alumno debe estar en:
- `06_SCOREBOARD_ALUMNO`

El plan táctico debe estar en:
- `07_PLAN_90_DIAS`

La proyección de 90 días está en:
- `09_PROYECCION_90_DIAS`

Reglas de proyección:
- M01-M12 son meses históricos.
- M13-M15 son los próximos 90 días.
- `baseline_*` es referencia automática de la plataforma.
- `projected_*` es la respuesta editable del equipo.
- El equipo debe justificar supuestos para M13-M15.

## Columnas editables

En `05_DECISIONES_SKU`:
- decision_portfolio
- action_90_days
- decision_reason
- priority
- commercial_risk
- ai_comment
- team_comment

En `09_PROYECCION_90_DIAS`:
- projected_*
- projection_assumption
- projection_comment

## Columnas no editables

- sku_id
- sku_name
- category
- historical_revenue_12m
- historical_margin_12m
- current_inventory_value
- ddi
- market_coverage
- columnas históricas M01-M12
- columnas baseline_*

## Validaciones actuales

En `05_DECISIONES_SKU`:

- `decision_portfolio`: CORE, REVIEW, ELIMINAR.
- `action_90_days`: Mantener, Revisar precio, Liquidar stock, Reducir compra, Discontinuar, Mantener con monitoreo.
- `priority`: Alta, Media, Baja.
- `commercial_risk`: Alto, Medio, Bajo.

## Validaciones futuras de backend

- No eliminar filas.
- No duplicar sku_id.
- No modificar columnas no editables.
- No dejar decisiones vacías.
- Usar valores permitidos.
