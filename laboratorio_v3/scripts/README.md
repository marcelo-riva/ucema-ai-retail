# Estado del generador de workbook

## Scripts disponibles

- `generate_lab01_workbook.py`: generador base del workbook. Construye un esqueleto a partir de `data/Base SKUs.xlsx`.
- `transform_workbook_v2.py`: transforma el workbook de la estructura antigua (13 hojas) a la nueva estructura (15 hojas) con mejor UX, bloques de guía, scoreboard automático y orden de trabajo claro.

## Qué hace `transform_workbook_v2.py`

1. Renombra y reordena las hojas según el flujo de trabajo propuesto.
2. Actualiza las referencias de fórmulas entre hojas.
3. Corrige el desplazamiento de filas causado por la inserción de bloques de guía (openpyxl no actualiza automáticamente las referencias relativas dentro de la misma fila).
4. Crea `00_INSTRUCCIONES` con leyenda de celdas y orden de trabajo.
5. Agrega un bloque de guía en cada hoja de ejercicio (objetivo, qué va en Excel, qué va en plataforma, criterio de completitud).
6. Marca celdas editables, fórmulas y referencias con colores distintos.
7. Construye `11_SCOREBOARD_ALUMNO` automático con fórmulas que leen el estado de avance de las hojas de ejercicio.
8. Configura `14_CONTROL_STATUS` con umbrales mínimos de completitud por ejercicio.
9. Aplica estilos básicos, freeze panes y filtros.
10. No crea hojas nuevas no validadas: `10_JUGADAS_COMERCIALES` no se genera.

## Estructura resultante

| Hoja | Uso |
|---|---|
| `00_INSTRUCCIONES` | Guía de uso y leyenda |
| `01_CASO_NEGOCIO` | Contexto |
| `02_DICCIONARIO_DATOS` | Explicación de campos |
| `03_BASE_SKUS` | Datos históricos. A1 = `sku_id`. No editar. |
| `04_EXPLORACION` | Ejercicio 0 |
| `05_DIAGNOSTICO_INICIAL` | Ejercicio 0 |
| `06_PORTFOLIO` | Ejercicio 1 |
| `07_FORECAST_90_DIAS` | Ejercicio 2 |
| `08_INVENTARIO` | Ejercicio 3 |
| `09_PRICING` | Ejercicio 4 |
| `11_SCOREBOARD_ALUMNO` | Scoreboard automático |
| `12_PLAN_90_DIAS` | Plan 30/60/90 |
| `13_OUTPUT_FINAL` | Tesis y resumen |
| `14_CONTROL_STATUS` | Checklist técnico + umbrales de completitud |
| `15_LISTS` | Listas de validación |

## Lógica del Scoreboard

El scoreboard mide completitud por **umbral mínimo**, no por todos los SKUs de la base.

Configuración en `14_CONTROL_STATUS`:

| Ejercicio | Hoja | Columna clave | Fila inicio | Mínimo requerido |
|---|---|---|---|---|
| Ejercicio 0 | `04_EXPLORACION` | `D` (hallazgo) | 7 | 5 |
| Ejercicio 0 | `05_DIAGNOSTICO_INICIAL` | `B` (respuesta) | 8 | 5 |
| Ejercicio 1 | `06_PORTFOLIO` | `O` (decision_portfolio) | 7 | 10 |
| Ejercicio 2 | `07_FORECAST_90_DIAS` | `E` (pricing_decision) | 7 | 10 |
| Ejercicio 3 | `08_INVENTARIO` | `I` (ddi_target) | 7 | 10 |
| Ejercicio 4 | `09_PRICING` | `N` (pricing_decision) | 7 | 10 |
| Plan | `12_PLAN_90_DIAS` | `C` (initiative_name) | 7 | 3 |
| Cierre | `13_OUTPUT_FINAL` | `B` (respuesta) | 8 | 5 |

Fórmula de estado:

```excel
=IF(COUNTA(hoja!columna_fila_inicio:columna_8226)=0, "Pendiente",
 IF(COUNTA(hoja!columna_fila_inicio:columna_8226)<min_required, "En progreso", "Completo"))
```

## Estado de `generate_lab01_workbook.py`

El generador base está **desactualizado**. Genera la estructura antigua (13 hojas) y no produce el formato limpio del `03_BASE_SKUS` actual. Si se ejecuta tal cual, **sobrescribe el workbook con una versión incompleta**.

Para regenerar el workbook actual se recomienda:
1. Partir de la versión actual en `public/templates/`.
2. Si se necesita cambiar los datos base, modificar `data/Base SKUs.xlsx` y regenerar un workbook con la estructura antigua, luego correr `transform_workbook_v2.py` sobre él.
3. O bien, actualizar `generate_lab01_workbook.py` para que genere directamente la nueva estructura.

## Uso recomendado

No ejecutar `generate_lab01_workbook.py` sobre el workbook actual sin antes corregirlo. Si se necesita una nueva versión del workbook, subir el archivo a `ingest/` y avisar al agente para que lo distribuya y revise estos scripts.

## Advertencias conocidas

- El scoreboard automático usa `COUNTA` sobre columnas clave. Es una aproximación de completitud: no detecta si el alumno completó "bien", solo si completó.
- Las hojas cualitativas (`05_DIAGNOSTICO_INICIAL`, `13_OUTPUT_FINAL`) tienen estructura libre, por lo que el scoreboard puede mostrar progreso parcial incluso con contenido preexistente.
- El script de transformación requiere que el workbook de origen tenga la estructura antigua exacta.
- openpyxl no calcula fórmulas: para ver el scoreboard actualizado hay que abrir el archivo en Excel, Google Sheets o LibreOffice.
