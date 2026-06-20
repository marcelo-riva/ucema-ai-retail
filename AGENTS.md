# AGENTS.md - Guía de continuidad del proyecto

## Proposito

Este repositorio construye una experiencia educativa para alumnos de UCEMA que usan su propia IA para resolver problemas de negocio de NEXUS Retail.

Actualmente hay dos artefactos en el repo:

1. **Plataforma de laboratorios** (`laboratorio_v3/`): versión activa. Es un frontend Next.js desplegado en AWS Amplify.
2. **Experiencia HTML legacy** (`old/index.html`): versión anterior estática. Se mantuvo por compatibilidad pero no es el foco actual.

El trabajo nuevo debe concentrarse en `laboratorio_v3/`.

## Estado actual

- **Versión marcada**: `mock_review_1` (tag y commit `53409a1`). Punto estable antes de productivizar.
- **Rama de trabajo**: `laboratorio_v3/laboratorio-v3-mock`.
- **Deploy**: AWS Amplify, app root `laboratorio_v3/apps/web`, build estático exportado a `out/`.
- **Backend**: no hay backend real. Persistencia mock en `localStorage`.
- **Ingesta de artefactos**: carpeta `ingest/` para nuevas versiones del workbook. Ver sección "Ingestión de artefactos".

## Principio del producto

La plataforma no reemplaza a la IA personal del alumno.

- La plataforma guía.
- El alumno opera.
- La AI personal analiza.
- El alumno decide.
- La plataforma valida estructura, versiona estados y muestra dashboards de apoyo.

## Experiencia principal

### Laboratorio 1 — AI Revenue & Inventory Copilot

Rutas principales:

- `/login`: selector de grupo.
- `/labs`: catálogo de laboratorios.
- `/labs/lab-01`: overview del Laboratorio 1.
- `/labs/lab-01/exercises/ex-00`: Exploración Inicial.
- `/labs/lab-01/exercises/ex-01`: Portfolio Optimization.
- `/labs/lab-01/exercises/ex-02`: Pricing Optimization.
- `/labs/lab-01/exercises/ex-03`: Forecast Engine.
- `/labs/lab-01/exercises/ex-04`: Inventory & Working Capital Optimization.
- `/labs/lab-01/scoreboard`: scoreboard consolidado.
- `/labs/lab-01/final-plan`: plan de captura de valor 90 días.

### Workbook del Laboratorio 1

Archivo central: `NEXUS_RETAIL_LAB01_WORKBOOK_COMPLETO.xlsx`.

Ubicaciones:

- Fuente: `laboratorio_v3/public/templates/NEXUS_RETAIL_LAB01_WORKBOOK_COMPLETO.xlsx`
- Next.js: `laboratorio_v3/apps/web/public/templates/NEXUS_RETAIL_LAB01_WORKBOOK_COMPLETO.xlsx`

El workbook es la memoria del laboratorio. Tiene 16 hojas organizadas en flujo de trabajo:

| Hoja | Uso |
|---|---|
| `00_INSTRUCCIONES` | Cómo usar el workbook, leyenda de celdas y orden de trabajo |
| `01_CASO_NEGOCIO` | Contexto del caso |
| `02_DICCIONARIO_DATOS` | Explicación de campos |
| `03_BASE_SKUS` | Base histórica M01-M12. **No editar.** |
| `04_EXPLORACION` | Ejercicio 0: guía y hallazgos de exploración |
| `05_DIAGNOSTICO_INICIAL` | Ejercicio 0: diagnóstico y preguntas de negocio |
| `06_PORTFOLIO` | Ejercicio 1: clasificación CORE/REVIEW/ELIMINAR |
| `07_FORECAST_90_DIAS` | Ejercicio 2: proyección M13-M15 |
| `08_INVENTARIO` | Ejercicio 3: decisiones de inventario y capital de trabajo |
| `09_PRICING` | Ejercicio 4: decisiones de pricing |
| `10_JUGADAS_COMERCIALES` | Síntesis de jugadas comerciales por SKU |
| `11_SCOREBOARD_ALUMNO` | Scoreboard automático de avance (no editar manualmente) |
| `12_PLAN_90_DIAS` | Plan de iniciativas 30/60/90 |
| `13_OUTPUT_FINAL` | Tesis y resumen final |
| `14_CONTROL_STATUS` | Checklist de avance técnico |
| `15_LISTS` | Listas de validación |

**Diseño**: Excel = trabajo numérico, cálculo y análisis por SKU. Plataforma = guía pedagógica, hallazgos cualitativos, decisiones ejecutivas y plan final. El Scoreboard se actualiza automáticamente a partir de las hojas de trabajo.

### Datos de la base SKU

El workbook incluye datos históricos de 8.224 productos aproximadamente.

Campos principales de `03_BASE_SKUS`:

- Identificación: `sku_id`, `sku_name`, `family`, `department`, `current_status`, `barcode`.
- Precio histórico mensual: `pvp_m01` a `pvp_m12`.
- Costo histórico mensual: `cost_m01` a `cost_m12`.
- Volumen histórico mensual: `vol_m01` a `vol_m12` (unidades mensuales, ya incluyen días del mes).
- Inventario: `stock_cd_*`, `stock_pdv_*`, `stock_total_*`, `current_inventory_value`, `ddi_current`.
- Competencia: `competitor_price_1`, `competitor_price_2`, `competitor_price_3`, `market_coverage_pct`.
- Métricas calculadas: `units_12m`, `revenue_12m_calc`, `cost_12m_calc`, `gross_margin_12m`, `gross_margin_pct`, `avg_price_12m`, `avg_cost_12m`.

**Importante**: `vol_m01..vol_m12` son unidades mensuales. El cálculo es `pvp_mXX * vol_mXX` para obtener revenue mensual. No hace falta multiplicar por días del mes.

## Decisiones firmes

- La experiencia está diseñada para alumnos, no para quienes crean el curso.
- Los alumnos no ven el brief original.
- La plataforma guía pero no resuelve el caso.
- El alumno usa su propia IA y es responsable de controlar fórmulas, supuestos y conclusiones.
- No hay una única respuesta correcta.
- El workbook es la fuente de verdad del recorrido.
- La plataforma no reemplaza al workbook: si falla, el alumno continúa desde Excel con su IA.

## Lo que se descartó (no reintroducir sin decisión explícita)

- Las cinco variables editables en la UI.
- Formularios para cargar decisiones en el HTML.
- Escenarios prearmados conservador, balanceado y agresivo.
- Un motor interno que calcula resultados.
- Score gamer o evaluación automática.
- Uso de la base de clientes en esta versión.
- La experiencia `index.html` estático de la raíz (ahora en `old/`).

## Archivos principales

- `laboratorio_v3/apps/web/src/`: frontend Next.js.
- `laboratorio_v3/apps/web/src/app/labs/`: rutas de laboratorios.
- `laboratorio_v3/apps/web/src/lib/lab01Content.ts`: contenido pedagógico de los ejercicios.
- `laboratorio_v3/apps/web/src/services/mockLabService.ts`: lógica mock, estados y scoreboard.
- `laboratorio_v3/data/mock/`: JSONs mock (labs, ejercicios, grupos, scoreboard).
- `laboratorio_v3/public/templates/NEXUS_RETAIL_LAB01_WORKBOOK_COMPLETO.xlsx`: workbook fuente.
- `laboratorio_v3/scripts/generate_lab01_workbook.py`: generador base del workbook (desactualizado; genera la estructura antigua).
- `laboratorio_v3/scripts/transform_workbook_v2.py`: script que transforma la estructura antigua en la nueva versión con mejor UX y scoreboard automático.
- `laboratorio_v3/scripts/README.md`: documentación del estado del generador y discrepancias con el workbook actual.
- `ingest/`: inbox de nuevas versiones del workbook y otros artefactos.
- `old/index.html`: experiencia HTML legacy.
- `contexto-alumno.md`: contexto descargable para trabajar con una IA.
- `brief/simulador01-brief.md`: definición funcional y pedagógica del HTML legacy.
- `AGENTS.md`: esta guía.

## Cómo correr localmente

```bash
cd laboratorio_v3/apps/web
npm install
npm run dev
```

URL: `http://localhost:3000/labs`

## Cómo hacer deploy

El deploy es automático por AWS Amplify al hacer push a `laboratorio_v3/laboratorio-v3-mock`.

Configuración: `amplify.yml` en la raíz.

## Verificación mínima después de editar

- Confirmar que `npm run build` pasa sin errores.
- Confirmar que las rutas esperadas se generan en `out/`.
- Confirmar que el workbook descargable es el correcto.
- Buscar referencias descartadas (cinco variables, base de clientes, carga de decisiones, escenarios prearmados, motor interno).
- No modificar el Excel directamente sin actualizar el script generador (o al menos documentar la excepción).

## Ingestión de artefactos

La carpeta `ingest/` es el inbox de nuevas versiones del workbook y otros artefactos.

Flujo:

1. El equipo sube el archivo nuevo a `ingest/` (por ejemplo, `NEXUS_RETAIL_LAB01_WORKBOOK_v2.xlsx`).
2. El agente revisa el archivo, lo compara con la versión actual y lo distribuye a los destinos correspondientes.
3. Para un nuevo workbook del Laboratorio 1, los destinos son:
   - `laboratorio_v3/public/templates/NEXUS_RETAIL_LAB01_WORKBOOK_COMPLETO.xlsx`
   - `laboratorio_v3/apps/web/public/templates/NEXUS_RETAIL_LAB01_WORKBOOK_COMPLETO.xlsx`
4. El agente revisa si el script generador `laboratorio_v3/scripts/generate_lab01_workbook.py` sigue alineado con el Excel. Si no, lo actualiza o documenta la discrepancia.
5. El agente actualiza `AGENTS.md`, `contexto-alumno.md` y cualquier otra documentación afectada.
6. El agente hace commit y push.

Reglas:

- No se commitean archivos en `ingest/` como destino final.
- Si un archivo no se puede procesar, el agente deja una nota en `ingest/` explicando por qué.
- Ver documentación detallada en `ingest/README.md`.

## Preguntas abiertas / próximos pasos

- Productivizar: backend real, autenticación, validación de Excel, persistencia compartida.
- Decidir si se actualiza o se elimina `generate_lab01_workbook.py`.
- Definir cómo el alumno sube el workbook y cómo la plataforma lo valida.
- Definir métricas de evaluación del docente.
- Revisar si la experiencia HTML legacy (`old/index.html`) se mantiene o se elimina.
