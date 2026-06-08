# NEXUS Retail - Brief del laboratorio con IA v0.3

## 1. Definicion del producto

NEXUS Retail es una experiencia educativa basada en problemas de negocio.

En esta etapa, llamamos "simulador" al HTML que presenta el contexto, explica conceptos y propone desafios. El HTML no calcula escenarios ni recibe decisiones del alumno.

La simulacion ocurre cuando el alumno:

1. Recibe una situacion de negocio.
2. Trabaja con la base de SKUs usando su propia IA.
3. Construye un diagnostico.
4. Propone acciones.
5. Estima como esas acciones impactarian en el negocio.
6. Revisa y defiende los resultados producidos con la IA.

El valor pedagogico no esta en obtener una respuesta unica. Esta en aprender a formular preguntas, analizar datos, revisar el trabajo de una IA y convertir resultados analiticos en decisiones de negocio.

## 2. Objetivo de aprendizaje general

Al finalizar el recorrido, el alumno deberia poder:

- Usar una IA para analizar una base comercial masiva.
- Traducir una situacion de negocio en una consigna analitica clara.
- Indicar correctamente los datos que la IA debe utilizar.
- Exigir formulas, supuestos, criterios y controles.
- Identificar oportunidades de pricing, inventario y portfolio.
- Estimar impactos sobre ventas, volumen, margen, capital de trabajo, caja y cobertura.
- Reconocer trade-offs y riesgos.
- Construir y defender un plan de accion.

## 3. Principio de diseno

El HTML presenta problemas y orienta el aprendizaje. No resuelve el caso por el alumno.

| Componente | Responsabilidad |
| --- | --- |
| HTML de NEXUS | Presentar contexto, teoria, problema, aprendizaje buscado, input esperado y output esperado |
| Alumno | Formular pedidos, controlar resultados, decidir y defender recomendaciones |
| IA del alumno | Analizar datos, calcular, clasificar, estimar impactos y ayudar a estructurar propuestas |
| Docente | Acompanar, desafiar supuestos y evaluar calidad del razonamiento |

Frase rectora:

> NEXUS presenta una situacion de negocio. El alumno usa su IA para diagnosticarla, proponer acciones y estimar consecuencias.

## 4. Alcance actual

### Incluido

- Una pagina HTML para alumnos.
- Problemas guiados de pricing, inventario, portfolio y plan integrado.
- Explicaciones teoricas breves.
- Definicion explicita del aprendizaje buscado en cada problema.
- Inputs concretos que el alumno debe entregar a su IA.
- Prompts sugeridos.
- Outputs esperados claros y verificables.
- Uso de la base de SKUs.

### Fuera de alcance por ahora

- Uso de la base de clientes.
- Formularios para cargar decisiones dentro del HTML.
- Motor interno de simulacion.
- Cinco variables editables predefinidas.
- Escenarios prearmados conservador, balanceado o agresivo.
- Score automatico del alumno.
- IA interna que resuelva o evalue el caso.

## 5. Datos disponibles

### Archivo utilizado

- Archivo: `data/Base SKUs.xlsx`
- Hoja principal: `Base`
- La hoja contiene aproximadamente 8.224 registros de productos utilizables, aunque conceptualmente se la presenta como una base masiva de SKUs.

### Campos relevantes

| Dimension | Campos |
| --- | --- |
| Identificacion | Familia, Departamento, Estado Actual, Producto DESC, Producto CODE, Producto BARRAS |
| Resultado comercial | Venta Neta (S/IVA) |
| Precio historico | PVP 1 a PVP 12 |
| Costo historico | CU 1 a CU 12 |
| Demanda historica | Vol 1 a Vol 12 |
| Inventario CD | Units, $, DDI |
| Inventario PDV | Units, $, DDI |
| Inventario total | Units, $, DDI |
| Competencia | Competidor 1, Competidor 2, Competidor 3 |
| Relevancia comercial | Cobertura Mercado % |

### Archivo no utilizado

`data/Base_Clientes_10000.xlsx` existe y puede ser relevante para una etapa futura, pero no debe utilizarse ni mostrarse como input en la version actual.

## 6. Estructura obligatoria de cada problema

Cada problema presentado al alumno debe incluir:

1. **Situacion o contexto del negocio**: que esta ocurriendo en NEXUS y por que importa.
2. **Que vamos a aprender**: conceptos y capacidades que se busca desarrollar.
3. **Teoria necesaria**: explicacion breve para poder abordar el problema.
4. **Input esperado para la IA**: archivo, hoja, columnas y resultados previos que debe recibir.
5. **Prompt sugerido**: ejemplo suficientemente preciso, sin ser una solucion cerrada.
6. **Output esperado**: formato, metricas, rankings, explicaciones y decisiones que debe producir el alumno.
7. **Riesgos y controles**: que deberia revisar el alumno antes de aceptar la respuesta de la IA.

El input esperado debe ser concreto. No alcanza con indicar "usar la base" o "analizar los datos".

## 7. Problemas actuales

### Problema 1 - Encontrar productos con pricing leakage

#### Situacion

NEXUS sospecha que algunos productos tienen un precio bajo frente a la competencia. Si su demanda presenta baja o media sensibilidad al precio, podria existir una oportunidad de aumentar precio y margen sin perder demasiado volumen.

#### Aprendizajes

- Comparar precio propio contra competidores.
- Calcular elasticidad con los ultimos 12 meses.
- Entender el trade-off entre precio, volumen y margen.
- Diferenciar una oportunidad de precio de una suba riesgosa.

#### Input para la IA

- Identificacion del producto.
- PVP 1-12.
- Vol 1-12.
- PVP 12 y CU 12.
- Venta Neta.
- Competidor 1, 2 y 3.

#### Output esperado

Una tabla de candidatos con:

- Precio actual.
- Precio competidor promedio.
- Brecha porcentual.
- Elasticidad estimada.
- Aumento recomendado.
- Volumen esperado.
- Margen incremental.
- Nivel de riesgo.

El alumno debe priorizar productos y explicar formulas, supuestos y controles.

### Problema 2 - Reducir inventario sin provocar shortage

#### Situacion

NEXUS tiene capital inmovilizado en productos con exceso de inventario. Reducir stock sin criterio puede generar faltantes, perdida de ventas y deterioro comercial.

#### Aprendizajes

- Entender el impacto de los dias de inventario sobre capital de trabajo y caja.
- Identificar exceso de stock y baja rotacion.
- Reconocer riesgo de shortage.
- Calcular capital potencialmente liberable.

#### Input para la IA

- Stock total Units, $, DDI.
- Stock CD y PDV con Units, $ y DDI.
- Vol 1-12.
- Venta Neta.
- Familia, Departamento y Estado Actual.
- Cobertura Mercado %.

#### Output esperado

Dos tablas:

- SKUs con exceso: DDI actual, DDI objetivo razonado, stock actual y capital liberable.
- SKUs con riesgo de shortage: senal de riesgo e impacto comercial posible.

El alumno debe sumar el capital liberable total y explicar como evitaria quiebres.

### Problema 3 - Detectar productos que agregan complejidad y poco valor

#### Situacion

NEXUS quiere revisar productos que venden poco, tienen bajo margen, rotan lentamente o aportan poca cobertura. Eliminar productos sin un analisis integral puede afectar el surtido y las ventas.

#### Aprendizajes

- Evaluar contribucion economica y comercial por SKU.
- Diferenciar productos core, productos a revisar y candidatos a liquidacion.
- Entender el costo de complejidad de un portfolio amplio.
- Considerar cobertura y riesgo antes de recomendar una baja.

#### Input para la IA

- Identificacion, familia, departamento y estado.
- Venta Neta.
- PVP 12 y CU 12.
- Vol 1-12.
- Stock total $ y DDI total.
- Cobertura Mercado %.
- Precios competidores.

#### Output esperado

Una clasificacion completa y trazable:

- Core.
- Mantener con accion.
- Revisar.
- Liquidacion controlada.

Debe incluir accion sugerida, valor de stock involucrado, venta y margen expuestos, cobertura afectada y ranking para revision.

### Problema 4 - Construir un plan de accion integrado

#### Situacion

Las oportunidades de pricing, inventario y portfolio pueden competir entre si. La direccion necesita un plan ejecutable que priorice valor y controle riesgos.

#### Aprendizajes

- Integrar diagnosticos.
- Estimar impacto economico con supuestos explicitos.
- Priorizar por valor, esfuerzo y riesgo.
- Disenar controles para aprender y corregir durante la ejecucion.

#### Input para la IA

- Outputs completos de los problemas 1, 2 y 3.
- Formulas, supuestos y criterios utilizados.
- Acciones candidatas con impacto y riesgo.
- Base SKU para verificaciones.

#### Output esperado

Un plan 30/60/90 con:

- Acciones priorizadas.
- SKUs afectados.
- Impacto estimado.
- Riesgo.
- Responsable sugerido.
- Indicador de seguimiento.
- Comparacion entre situacion actual y esperada.

## 8. Reglas para el trabajo con IA

La experiencia debe ensenar al alumno a controlar a la IA, no solamente a pedirle resultados.

El alumno debe exigir:

- Uso exclusivo de los datos indicados.
- Formulas y supuestos explicitos.
- Criterios de clasificacion trazables.
- Tablas completas y rankings priorizados.
- Identificacion de datos faltantes y limitaciones.
- Revision de valores extremos.

El alumno debe verificar:

- Que la IA uso las columnas correctas.
- Que no invento datos.
- Que los calculos son consistentes.
- Que la recomendacion responde al problema planteado.
- Que el impacto y el riesgo estan explicados.

## 9. Criterios pedagogicos de evaluacion

La evaluacion deberia considerar:

| Dimension | Pregunta |
| --- | --- |
| Definicion del problema | ¿El alumno entendio la situacion de negocio? |
| Calidad del input | ¿Le dio a la IA los datos e instrucciones correctos? |
| Control de la IA | ¿Reviso formulas, supuestos y resultados extremos? |
| Diagnostico | ¿La conclusion esta respaldada por datos? |
| Plan de accion | ¿Las acciones son concretas, priorizadas y ejecutables? |
| Impacto | ¿Estimo beneficios, riesgos y trade-offs? |
| Comunicacion | ¿Puede explicar y defender su recomendacion? |

## 10. Estado actual y proximas iteraciones

La version actual del HTML ya presenta los cuatro problemas y su estructura pedagogica.

Las proximas iteraciones deberian concentrarse en:

- Mejorar la narrativa de cada situacion.
- Incorporar ejemplos de outputs buenos y deficientes.
- Definir rubricas de evaluacion por problema.
- Validar formulas sugeridas para elasticidad, margen y capital liberable.
- Decidir si los alumnos trabajan todos los SKUs o una muestra preparada.
- Evaluar en una etapa futura si se incorpora la base de clientes.

