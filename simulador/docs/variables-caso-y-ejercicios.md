# Variables del caso y palancas por ejercicio

Fecha de analisis: 2026-05-17

Fuente principal: `simulador/referencias/planificador/PharmaLink360_Simulador_Operativo_12M V1.xlsx`

## Lectura ejecutiva

El caso no esta guiado por una unica variable. Esta guiado por un sistema de tension entre rentabilidad, caja, crecimiento, servicio e inversion.

La pregunta central para los alumnos es:

> Como recuperar rentabilidad y caja en 12 meses sin destruir la red, la experiencia de cliente ni la capacidad competitiva.

## Variables que guian todo el caso

Estas variables son las que definen si una estrategia gana o pierde. Deben estar siempre visibles en el dashboard.

### 1. EBITDA ajustado por cost-to-serve

Es la metrica madre economica. Captura si la estrategia genera rentabilidad despues de incorporar costos operativos, logisticos, marketing y red.

Fuente Excel:

- `08_Core_Financiero`
- `09_Dashboard`

### 2. Flujo de caja libre (FCF)

Es la metrica de supervivencia. Una estrategia puede mejorar margen, pero si consume demasiada caja, falla.

Fuente Excel:

- `08_Core_Financiero`
- `09_Dashboard`

### 3. Caja final

Mide si el turnaround realmente estabiliza la compania.

Fuente Excel:

- caja inicial en `00_General`
- caja mensual en `08_Core_Financiero`
- resumen en `09_Dashboard`

### 4. CAPEX utilizado

Limita cuanto puede invertir el equipo en aperturas, hubs, dark stores o transformacion de red.

Constraint:

- CAPEX maximo anual: ARS 50.000 MM.

Fuente Excel:

- `00_General`
- `06_Red_CAPEX`
- `08_Core_Financiero`
- `09_Dashboard`

### 5. Meses consecutivos de FCF negativo

Es el constraint mas pedagogico porque fuerza a pensar timing, no solo resultado anual.

Constraint:

- no mas de 3 meses consecutivos de FCF negativo.

Fuente Excel:

- `00_General`
- `08_Core_Financiero`
- `09_Dashboard`

### 6. Revenue simulado

Es el volumen economico que alimenta todo el P&L. Se construye desde pricing, inventario/DDI, red y clientes.

Fuente Excel:

- `01_Master_Variables`
- `02_Pricing`
- `03_CatMan_DDI`
- `05_CLV_Marketing`
- `06_Red_CAPEX`

### 7. Margen bruto / margen final

Mide el trade-off entre precio, elasticidad, mix, costo, merma y quiebres.

Fuente Excel:

- `02_Pricing`
- `03_CatMan_DDI`
- `08_Core_Financiero`

### 8. Inventario, DDI y working capital

Es el puente entre operacion y caja. Bajar DDI libera caja, pero puede subir quiebres y afectar ventas.

Fuente Excel:

- `03_CatMan_DDI`
- `01_Master_Variables`
- `08_Core_Financiero`

### 9. Penetracion digital y costo logistico

Mide la tension entre conveniencia, servicio y cost-to-serve.

Fuente Excel:

- `04_Digital_Logistica`
- `01_Master_Variables`
- `08_Core_Financiero`

### 10. Clientes, churn, nuevos clientes y marketing

Mide si la estrategia crea o destruye base de clientes rentable.

Fuente Excel:

- `05_CLV_Marketing`
- `01_Master_Variables`
- `08_Core_Financiero`

### 11. Red de PDV

Mide decisiones estructurales: aperturas, cierres, mix de formatos, hubs y dark stores.

Fuente Excel:

- `06_Red_CAPEX`
- `07_PL_TiposPDV`
- `04_Digital_Logistica`

### 12. Competitividad / consistencia estrategica

El Excel tiene una variable de competitividad y el caso pide defender trade-offs. Para la app conviene convertir esto en un score explicable: coherencia entre pricing, surtido, canal digital, red y marketing.

Fuente Excel:

- `01_Master_Variables`
- `02_Pricing`
- `09_Dashboard`

## Variables base que conviene tratar como supuestos

Estas variables definen el mundo inicial. En ejercicios normales no deberian ser palancas libres; conviene dejarlas como configuracion avanzada o baseline.

### Generales

- PDV base: 120.
- Ventas mes 0: ARS 29.984,5 MM.
- EBITDA mes 0: ARS 881,125 MM.
- Caja inicial: ARS -25.000 MM.
- Inventario inicial: ARS 60.000 MM.
- DDI inicial ponderado: 62 dias.
- CAPEX maximo: ARS 50.000 MM.
- Maximo de meses consecutivos con FCF negativo: 3.
- Inflacion mensual de costos: 4%.
- Factor IPC + personal/alquileres: 2%.
- FX referencia: ARS/USD 1.000.

Fuente Excel: `00_General`.

### Pricing

- PVP base por categoria.
- Costo unitario base por categoria.
- Volumen por PDV base.
- Elasticidad por categoria.

Fuente Excel: `02_Pricing`.

### Clientes

- clientes base por segmento;
- ticket promedio;
- frecuencia mensual;
- churn base.

Fuente Excel: `05_CLV_Marketing`.

### Red

- PDV iniciales por formato y zona;
- CAPEX de apertura por formato/zona;
- ventas por PDV por formato/zona;
- margen por formato/zona;
- ratios de personal, alquileres, G&A y logistica.

Fuente Excel: `06_Red_CAPEX` y `07_PL_TiposPDV`.

## Variables a mover por ejercicio

### Ejercicio 1: Working Capital & Inventory

Objetivo: liberar caja y mejorar capital de trabajo sin romper disponibilidad.

Palancas principales:

- `Cobertura %` por categoria.
- `Reduccion SKUs %` por categoria.
- `DDI Objetivo` por categoria y mes.

Variables que observa el alumno:

- inventario;
- liberacion / absorcion de working capital;
- quiebres estimados;
- revenue perdido por quiebre;
- mermas;
- DDI ponderado;
- FCF y caja final.

Trade-off esperado:

- bajar DDI libera caja;
- bajar demasiado la cobertura o el surtido aumenta quiebres;
- reducir SKUs puede bajar merma, pero tambien puede afectar ventas y disponibilidad.

Fuente Excel: `03_CatMan_DDI`.

### Ejercicio 2: Pricing & Elasticity

Objetivo: mejorar margen y competitividad sin destruir volumen.

Palanca principal:

- `Cambio PVP %` por categoria y mes.

Variables que observa el alumno:

- revenue simulado;
- volumen implicito por elasticidad;
- margen bruto;
- margen bruto porcentual;
- competitividad;
- EBITDA;
- FCF.

Trade-off esperado:

- subir precio mejora margen unitario, pero puede destruir volumen en categorias elasticas;
- bajar precio puede recuperar competitividad y volumen, pero erosiona margen;
- cada categoria reacciona distinto por elasticidad.

Fuente Excel: `02_Pricing`.

### Ejercicio 3: Customer Profitability & Growth

Objetivo: decidir donde invertir marketing para proteger CLV y crecimiento rentable.

Palancas principales:

- `Foco Retencion %` por segmento y mes:
  - VIPs;
  - Riesgo Fuga;
  - Oportunistas.
- `Nuevos` clientes por mes.

Palancas candidatas para version futura:

- costo por cliente retenido por segmento;
- CAC de nuevos clientes;
- ticket/frecuencia objetivo por segmento.

Variables que observa el alumno:

- churn ajustado;
- clientes finales;
- revenue incremental;
- budget marketing;
- budget marketing como porcentaje de ventas;
- EBITDA;
- FCF.

Trade-off esperado:

- invertir en retencion reduce churn, pero consume caja;
- captar clientes nuevos crece revenue, pero puede tener CAC alto;
- no todos los segmentos deberian recibir la misma inversion.

Fuente Excel: `05_CLV_Marketing`.

### Ejercicio 4: Digital, Fulfillment & Cost-to-Serve

Objetivo: crecer conveniencia omnicanal sin que el costo logistico coma el margen.

Palancas principales:

- porcentaje de ventas por `Delivery` por mes;
- porcentaje de ventas por `Pick-up` por mes;
- desarrollo de `Hub/Dark Store`, indirectamente via aperturas en red.

Variables que observa el alumno:

- penetracion digital target;
- costo logistico;
- mix fisico/digital;
- SLA prometido;
- penalidad por SLA;
- EBITDA ajustado por cost-to-serve;
- FCF.

Trade-off esperado:

- delivery aumenta conveniencia, pero tiene mayor cost-to-serve;
- pick-up puede balancear conveniencia y costo;
- hubs/dark stores mejoran promesa digital, pero consumen CAPEX y cambian la red.

Fuente Excel: `04_Digital_Logistica` y `06_Red_CAPEX`.

### Ejercicio 5: Network, Store Formats & CAPEX

Objetivo: redisenar la red fisica y omnicanal sin pasarse de CAPEX ni destruir cobertura.

Palancas principales:

- aperturas por formato, zona y mes;
- cierres por formato, zona y mes.

Formatos/zona:

- Flagship CABA;
- Flagship GBA;
- Standard CABA;
- Standard GBA;
- Proximidad CABA;
- Proximidad GBA;
- Hub/Dark Store CABA;
- Hub/Dark Store GBA.

Variables que observa el alumno:

- PDV finales;
- CAPEX utilizado;
- ventas asociadas a aperturas/cierres;
- costo fijo por formato;
- margen por formato/zona;
- costo logistico;
- caja final;
- alertas de CAPEX y validacion de cierres.

Trade-off esperado:

- cerrar tiendas libera costos, pero puede perder ventas, cobertura y conveniencia;
- abrir hubs mejora fulfillment, pero consume CAPEX;
- abrir flagship puede crecer venta, pero exige inversion alta.

Fuente Excel: `06_Red_CAPEX` y `07_PL_TiposPDV`.

### Ejercicio final: Board Meeting / Turnaround Plan

Objetivo: construir una estrategia integrada de 12 meses y defender trade-offs.

Palancas:

- todas las anteriores combinadas.

Variables de evaluacion:

- EBITDA anual;
- FCF anual;
- caja final;
- CAPEX utilizado;
- meses de FCF negativo;
- competitividad;
- consistencia estrategica;
- explicacion de que se decidio no hacer.

Fuente Excel:

- `08_Core_Financiero`
- `09_Dashboard`

## Recomendacion para la app

Para una primera version, no mostrar todas las celdas del Excel. Mostrar controles ejecutivos agrupados por ejercicio:

1. Pricing: cambio de precio por categoria.
2. Inventory: cobertura, reduccion de SKUs y DDI objetivo.
3. Digital: mix delivery / pick-up / hubs.
4. Customer: foco de retencion y nuevos clientes.
5. Network: aperturas/cierres por formato y zona.

Siempre mostrar en un panel fijo:

- EBITDA anual;
- FCF anual;
- caja final;
- CAPEX utilizado;
- meses FCF negativo;
- DDI ponderado;
- quiebres;
- costo logistico;
- churn / clientes finales;
- alertas.

La app deberia permitir comparar al menos dos escenarios: `baseline` vs `escenario actual`.
