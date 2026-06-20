# AGENTS.md - Guía de continuidad del proyecto

## Proposito

Este repositorio construye una experiencia educativa para alumnos de UCEMA que usan su propia IA para resolver problemas de negocio de NEXUS Retail.

Actualmente hay dos artefactos en el repo:

1. **Plataforma de laboratorios** (`laboratorio_v3/`): versión activa. Es un frontend Next.js desplegado en AWS Amplify.
2. **Experiencia HTML legacy** (`old/index.html`): versión anterior estática. Se mantuvo por compatibilidad pero no es el foco actual.

El trabajo nuevo debe concentrarse en `laboratorio_v3/`.

## Estado actual

- **Versión marcada**: `mock_review_1` (tag y commit `4feabd4`). Punto estable antes de productivizar.
- **Rama de trabajo**: `laboratorio_v3/laboratorio-v3-mock`.
- **Deploy**: AWS Amplify, app root `laboratorio_v3/apps/web`, build estático exportado a `out/`.
- **Backend**: no hay backend real. Persistencia mock en `localStorage`.

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

El workbook es la memoria del laboratorio. Tiene 13 hojas + 1 hoja de listas:

| Hoja | Uso |
|---|---|
| `00_CASO_NEGOCIO` | Contexto del caso |
| `01_BASE_SKUS` | Base histórica M01-M12. **No editar.** |
| `02_DICCIONARIO_DATOS` | Explicación de campos |
| `03_GUIA_EXPLORACION` | Guía para Ejercicio 0 |
| `04_DIAGNOSTICO_INICIAL` | Respuestas del equipo en Ejercicio 0 |
| `05_DECISIONES_PORTFOLIO` | Ejercicio 1: clasificación CORE/REVIEW/ELIMINAR |
| `06_PRICING_DECISIONS` | Ejercicio 2: decisiones de pricing |
| `07_FORECAST_90_DIAS` | Ejercicio 3: proyección M13-M15 |
| `08_INVENTORY_DECISIONS` | Ejercicio 4: decisiones de inventario |
| `09_SCOREBOARD_ALUMNO` | Scoreboard del equipo |
| `10_PLAN_90_DIAS` | Plan de iniciativas |
| `11_OUTPUT_FINAL` | Tesis y resumen final |
| `12_CONTROL_STATUS` | Checklist de avance |
| `13_LISTS` | Listas de validación |

### Datos de la base SKU

El workbook incluye datos históricos de 8.224 productos aproximadamente.

Campos principales de `01_BASE_SKUS`:

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
- `laboratorio_v3/scripts/generate_lab01_workbook.py`: generador del workbook (desactualizado respecto al Excel actual; usar con precaución).
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

## Preguntas abiertas / próximos pasos

- Productivizar: backend real, autenticación, validación de Excel, persistencia compartida.
- Decidir si se actualiza o se elimina `generate_lab01_workbook.py`.
- Definir cómo el alumno sube el workbook y cómo la plataforma lo valida.
- Definir métricas de evaluación del docente.
- Revisar si la experiencia HTML legacy (`old/index.html`) se mantiene o se elimina.
