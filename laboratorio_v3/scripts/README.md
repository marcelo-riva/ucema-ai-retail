# Estado del generador de workbook

## Qué hace este script

`generate_lab01_workbook.py` construye un esqueleto del workbook del Laboratorio 1 a partir de una base SKU externa (`data/Base SKUs.xlsx`).

## Problema conocido

**El script está desactualizado respecto al workbook actual.**

Diferencias detectadas el 20 de junio de 2026:

| Aspecto | Script generado | Workbook actual |
|---|---|---|
| Hojas | 13 | 14 (falta `13_LISTS`) |
| Hoja `01_BASE_SKUS` | Primeras filas son notas y no headers | Headers correctos desde la fila 1 |
| Columnas | 65 | 71 |
| Columnas clave actuales | No generadas | `sku_id`, `sku_name`, `family`, `department`, `current_status`, `barcode`, `net_revenue_original_12m`, `pvp_m01..m12`, `cost_m01..m12`, `vol_m01..m12`, `stock_*`, `ddi_current`, `competitor_price_*`, `market_coverage_pct`, `units_12m`, `revenue_12m_calc`, `cost_12m_calc`, `gross_margin_12m`, `gross_margin_pct`, `avg_price_12m`, `avg_cost_12m` |
| Datos | Copia literal de `data/Base SKUs.xlsx` con primeras filas como notas | Datos limpios, 8.224 productos aproximadamente |

## Consecuencia

Si se ejecuta el script tal como está, **sobrescribe el workbook actual con una versión incompleta y con formato incorrecto**.

## Qué falta para alinearlo

- Actualizar `copy_base_skus()` para que lea correctamente los headers y datos de `data/Base SKUs.xlsx`, o regenerar `data/Base SKUs.xlsx` con el formato esperado.
- Agregar la hoja `13_LISTS` con las listas de validación.
- Asegurar que las métricas calculadas (`units_12m`, `revenue_12m_calc`, etc.) se generen con las fórmulas correctas.
- Validar que `vol_m01..vol_m12` sean unidades mensuales (no diarias).
- Ejecutar validación contra los números de referencia del negocio.

## Uso recomendado

No ejecutar el script sobre el workbook actual sin antes corregirlo. Si se necesita una nueva versión del workbook, subir el archivo a `ingest/` y avisar al agente para que lo distribuya y revise este script.
