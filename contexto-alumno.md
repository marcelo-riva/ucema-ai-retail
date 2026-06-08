# NEXUS Retail - Contexto para trabajar con tu IA

## Tu rol

Formás parte del equipo comercial de NEXUS Retail. Vas a analizar una base masiva de productos para detectar oportunidades y proponer planes de acción.

Este sitio presenta los problemas. La simulación la hacés vos con tu propia IA: analizás datos, probás supuestos y estimás impactos.

## Archivo a usar

- `data/Base SKUs.xlsx`
- Hoja: `Base`

La base de clientes no se utiliza en esta versión.

## Información disponible

- Identificación: familia, departamento, estado y producto.
- Venta neta.
- Precio de venta al público de los últimos 12 meses: `PVP 1-12`.
- Costo unitario de los últimos 12 meses: `CU 1-12`.
- Volumen de los últimos 12 meses: `Vol 1-12`.
- Stock y DDI en CD, PDV y total.
- Precio de tres competidores.
- Cobertura de mercado.

## Cómo trabajar

Para cada problema:

1. Cargá la base de SKUs en tu IA.
2. Indicá exactamente qué columnas debe utilizar.
3. Pedile que explique fórmulas, supuestos y criterios.
4. Solicitá una tabla completa y un ranking priorizado.
5. Revisá resultados extremos y conclusiones dudosas.
6. Convertí el análisis en una recomendación de negocio.

## Reglas para tu IA

```text
Actuá como analista senior de retail.

Usá únicamente la información disponible en la hoja Base del archivo Base SKUs.xlsx.
No inventes datos ni variables.
Explicá todas las fórmulas, supuestos y criterios de clasificación.
Identificá datos faltantes, resultados extremos y limitaciones del análisis.
Entregá tablas completas y un resumen ejecutivo priorizado.
```

## Resultado final esperado

Un diagnóstico defendible y un plan de acción de 90 días que integre oportunidades de pricing, inventario y portfolio, incluyendo impacto esperado, riesgos y supuestos.
