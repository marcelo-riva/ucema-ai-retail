# Estado del generador de workbook

## Scripts disponibles

- `generate_lab01_workbook.py`: generador base del workbook. Construye un esqueleto a partir de `data/Base SKUs.xlsx`.
- `transform_workbook_v2.py`: transforma el workbook de la estructura antigua (13 hojas) a la nueva estructura (16 hojas) con mejor UX, bloques de guía, scoreboard automático y orden de trabajo claro.

## Qué hace `transform_workbook_v2.py`

1. Renombra y reordena las hojas según el flujo de trabajo propuesto.
2. Actualiza las referencias de fórmulas entre hojas.
3. Crea `00_INSTRUCCIONES` con leyenda de celdas y orden de trabajo.
4. Agrega un bloque de guía en cada hoja de ejercicio (objetivo, qué va en Excel, qué va en plataforma, criterio de completitud).
5. Marca celdas editables, fórmulas y referencias con colores distintos.
6. Construye `11_SCOREBOARD_ALUMNO` automático con fórmulas que leen el estado de avance de las hojas de ejercicio.
7. Crea `10_JUGADAS_COMERCIALES` como síntesis de jugadas por SKU.
8. Aplica estilos básicos, freeze panes y filtros.

## Estructura resultante

| Hoja | Uso |
|---|---|
| `00_INSTRUCCIONES` | Guía de uso y leyenda |
| `01_CASO_NEGOCIO` | Contexto |
| `02_DICCIONARIO_DATOS` | Explicación de campos |
| `03_BASE_SKUS` | Datos históricos. No editar. |
| `04_EXPLORACION` | Ejercicio 0 |
| `05_DIAGNOSTICO_INICIAL` | Ejercicio 0 |
| `06_PORTFOLIO` | Ejercicio 1 |
| `07_FORECAST_90_DIAS` | Ejercicio 2 |
| `08_INVENTARIO` | Ejercicio 3 |
| `09_PRICING` | Ejercicio 4 |
| `10_JUGADAS_COMERCIALES` | Síntesis de jugadas |
| `11_SCOREBOARD_ALUMNO` | Scoreboard automático |
| `12_PLAN_90_DIAS` | Plan 30/60/90 |
| `13_OUTPUT_FINAL` | Tesis y resumen |
| `14_CONTROL_STATUS` | Checklist técnico |
| `15_LISTS` | Listas de validación |

## Estado de `generate_lab01_workbook.py`

El generador base está **desactualizado**. Genera la estructura antigua (13 hojas) y no produce el formato limpio del `03_BASE_SKUS` actual. Si se ejecuta tal cual, **sobrescribe el workbook con una versión incompleta**.

Para regenerar el workbook actual se recomienda:
1. Partir de la versión actual en `public/templates/`.
2. Si se necesita cambiar los datos base, modificar `data/Base SKUs.xlsx` y luego correr `transform_workbook_v2.py` sobre un workbook con la estructura antigua.
3. O bien, actualizar `generate_lab01_workbook.py` para que genere directamente la nueva estructura.

## Uso recomendado

No ejecutar `generate_lab01_workbook.py` sobre el workbook actual sin antes corregirlo. Si se necesita una nueva versión del workbook, subir el archivo a `ingest/` y avisar al agente para que lo distribuya y revise estos scripts.

## Advertencias conocidas

- El scoreboard automático usa `COUNTA` sobre columnas clave. Es una aproximación de completitud: no detecta si el alumno completó "bien", solo si completó.
- Algunas hojas cualitativas (`05_DIAGNOSTICO_INICIAL`, `13_OUTPUT_FINAL`) tienen estructura libre, por lo que el scoreboard puede mostrar progreso parcial incluso con contenido preexistente.
- El script de transformación requiere que el workbook de origen tenga la estructura antigua exacta.
