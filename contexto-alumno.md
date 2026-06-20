# NEXUS Retail - Contexto para trabajar con tu IA

## Tu rol

Formás parte del equipo comercial de NEXUS Retail. Vas a recorrer un laboratorio de 5 ejercicios para analizar una base masiva de productos, decidir portfolio, definir pricing, proyectar 90 días, optimizar inventario y cerrar un plan de captura de valor.

## Plataforma

La plataforma guía el recorrido, pero **no reemplaza a tu IA personal**. Vos operás, tu IA analiza y tu equipo decide.

- Entrá a la plataforma de laboratorios.
- Elegí tu grupo.
- Descargá el workbook del Laboratorio 1.
- Completá cada ejercicio en el Excel, con ayuda de tu IA.
- Subí checkpoints para actualizar el avance.

## Archivo a usar

- `NEXUS_RETAIL_LAB01_WORKBOOK_COMPLETO.xlsx` (descargable desde la plataforma).

Ese workbook es la memoria del laboratorio. Tiene todas las hojas que vas a necesitar:

- `00_INSTRUCCIONES`: cómo usar el workbook, leyenda de celdas y orden de trabajo.
- `01_CASO_NEGOCIO`: contexto del caso.
- `02_DICCIONARIO_DATOS`: explicación de campos.
- `03_BASE_SKUS`: datos históricos M01-M12. **No la edites.**
- `04_EXPLORACION` y `05_DIAGNOSTICO_INICIAL`: Ejercicio 0.
- `06_PORTFOLIO`: Ejercicio 1.
- `07_FORECAST_90_DIAS`: Ejercicio 2.
- `08_INVENTARIO`: Ejercicio 3.
- `09_PRICING`: Ejercicio 4.
- `10_JUGADAS_COMERCIALES`: síntesis de jugadas por SKU.
- `11_SCOREBOARD_ALUMNO`: tu scoreboard. **No lo edites manualmente: se actualiza solo.**
- `12_PLAN_90_DIAS` y `13_OUTPUT_FINAL`: cierre del laboratorio.

## Información disponible en la base

- Identificación: `sku_id`, `sku_name`, `family`, `department`, `current_status`, `barcode`.
- Venta neta original: `net_revenue_original_12m`.
- Precio de venta mensual: `pvp_m01` a `pvp_m12`.
- Costo unitario mensual: `cost_m01` a `cost_m12`.
- Volumen mensual: `vol_m01` a `vol_m12` (ya incluyen todos los días del mes).
- Stock y DDI en CD, PDV y total.
- Precio de tres competidores.
- Cobertura de mercado.
- Métricas calculadas: `units_12m`, `revenue_12m_calc`, `cost_12m_calc`, `gross_margin_12m`, `gross_margin_pct`, etc.

**Nota importante**: `vol_m01..vol_m12` son unidades mensuales. Para calcular revenue mensual usá `pvp_mXX * vol_mXX`. No hace falta multiplicar por días del mes.

## Cómo trabajar en cada ejercicio

1. Leé el contexto y las preguntas en la plataforma.
2. Abrí el workbook en Excel.
3. Usá tu IA personal para analizar la hoja correspondiente.
4. Indicale exactamente qué columnas debe usar.
5. Pedile que explique fórmulas, supuestos y criterios.
6. Revisá resultados extremos y conclusiones dudosas.
7. Convertí el análisis en una recomendación de negocio.
8. Completá el checkpoint en la plataforma.

## Reglas para tu IA

```text
Actuá como analista senior de retail.

Usá únicamente la información disponible en el workbook NEXUS_RETAIL_LAB01_WORKBOOK_COMPLETO.xlsx.
No inventes datos ni variables.
Explicá todas las fórmulas, supuestos y criterios de clasificación.
Identificá datos faltantes, resultados extremos y limitaciones del análisis.
Entregá tablas completas y un resumen ejecutivo priorizado.
```

## Resultado final esperado

Un diagnóstico defendible y un plan de captura de valor de 90 días que integre decisiones de portfolio, pricing, forecast e inventario, incluyendo impacto esperado, riesgos y supuestos.

## Si la plataforma falla

Continuá trabajando directamente en el Excel con tu IA. El workbook es la fuente de verdad del recorrido.
