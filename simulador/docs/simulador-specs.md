# Specs del simulador PharmaLink 360

Estado: MVP implementado, specs actualizadas para revision
Fecha: 2026-05-17

## 0. Estado de la especificacion

Esta spec se inicio antes de construir el MVP. Luego de probar la primera version en Streamlit, se actualiza con aprendizajes de interfaz y dinamica pedagogica:

- el simulador debe mostrar siempre la foto ejecutiva y la pelicula mensual de 12 meses;
- cada jugada es un plan completo, no un avance automatico mes a mes;
- el alumno puede elegir un **mes de decision** para leer la curva temporal;
- mover sliders recalcula el escenario; guardar solo congela la iteracion;
- no hace falta tocar todos los laboratorios en cada jugada;
- inventario necesita intervencion por categoria, no solo valores globales;
- diagnostico no mueve numeros operativos: define la tesis estrategica que luego se evalua por consistencia.

## 1. Objetivo

Construir un simulador interactivo para el caso **PharmaLink 360**, orientado a alumnos ejecutivos del curso de AI & Retail en UCEMA.

El simulador debe permitir que los alumnos:

- entiendan el problema de negocio;
- tomen decisiones sobre palancas comerciales, operativas y financieras;
- vean el impacto sistemico de esas decisiones;
- iteran escenarios antes de pasar al siguiente laboratorio;
- usen IA como copiloto para diagnosticar, simular, criticar y defender trade-offs;
- lleguen a un Board Meeting final con un plan integral de turnaround.

El simulador no busca replicar visualmente el Excel. El Excel es la referencia funcional del modelo.

## 2. Principios de diseno

### 2.1 Una estrategia comun para todos los laboratorios

Todos los laboratorios deben seguir el mismo patron:

1. **Contexto**: que problema de negocio se trabaja.
2. **Palancas**: que variables puede mover el alumno.
3. **Simulacion**: como esas palancas afectan el sistema.
4. **Impacto**: KPIs y alertas actualizadas.
5. **Lectura temporal**: como cambia la progresion de 12 meses.
6. **Lectura por categoria / segmento / canal**: donde aplica, no quedarse solo en promedios globales.
7. **Feedback IA**: explicacion, riesgos y recomendacion.
8. **Iteracion**: guardar escenario, ajustar o pasar al siguiente tema.

Esto evita que cada laboratorio se sienta como una herramienta distinta.

### 2.2 El alumno decide, la IA no juega sola

La IA debe actuar como copiloto:

- sugiere;
- explica;
- detecta contradicciones;
- desafia decisiones;
- ayuda a preparar la defensa ejecutiva.

No debe reemplazar la decision del alumno ni elegir automaticamente la estrategia final.

### 2.3 Siempre visible: cockpit de variables clave

La interfaz debe mantener visible un cockpit compacto con las variables madre del caso:

- EBITDA anual;
- FCF anual;
- caja final;
- CAPEX utilizado;
- meses consecutivos de FCF negativo;
- revenue simulado;
- margen bruto / margen final;
- inventario;
- DDI ponderado;
- quiebres estimados;
- costo logistico;
- churn / clientes finales;
- score de consistencia estrategica;
- alertas.

Ademas del cockpit anual, la interfaz debe mostrar una **lectura de sistema** con:

- progresion mensual M01-M12;
- KPIs del mes de decision seleccionado;
- categorias de producto y su sensibilidad;
- mapa de que palancas afectan que variables.

El objetivo es que el alumno vea la pelicula y no solo la foto final.

### 2.4 Iterar antes de avanzar

Cada laboratorio debe permitir al menos 2 o 3 iteraciones:

- escenario inicial;
- ajuste con feedback;
- escenario guardado.

El objetivo pedagogico no es acertar en el primer intento, sino entender consecuencias.
Guardar una iteracion no debe ser necesario para recalcular: mover una palanca recalcula el escenario actual. Guardar solo persiste una foto para comparacion posterior.

### 2.5 Progresion por desbloqueo

El simulador debe desbloquear temas progresivamente.

Orden sugerido:

1. Diagnostico inicial.
2. Inventario y capital de trabajo.
3. Pricing y elasticidad.
4. Clientes y marketing.
5. Digital, fulfillment y cost-to-serve.
6. Red de PDV y CAPEX.
7. Board Meeting final.

En la version inicial se puede permitir navegacion libre para el docente, pero la experiencia por defecto debe ser secuencial.

## 3. Diferencia contra el Excel

### Excel

- Expone muchas celdas, formulas y hojas.
- Sirve como modelo base y fuente de verdad inicial.
- Es util para auditar calculos.
- Puede abrumar al alumno.
- No guia pedagogicamente la decision.

### Simulador

- Expone palancas ejecutivas, no celdas.
- Mantiene el impacto siempre visible.
- Ordena la experiencia por laboratorios.
- Permite comparar escenarios.
- Integra feedback de IA.
- Obliga a explicar trade-offs.

## 4. Usuarios

### Alumno / equipo

Usa el simulador para tomar decisiones, comparar escenarios y preparar defensa ejecutiva.

Necesita:

- interfaz clara;
- pocas palancas por ronda;
- feedback rapido;
- explicacion de impactos;
- guardado de escenarios.

### Docente

Usa el simulador para guiar la clase, desbloquear temas y discutir trade-offs.

Necesita:

- modo demo/proyector;
- reset rapido;
- escenarios prearmados;
- visibilidad de resultados por equipo, si hay version multiusuario;
- capacidad de avanzar por laboratorios.

## 5. Estructura funcional

## 5.1 Diagnostico inicial

Objetivo: entender el caso y definir una hipotesis de turnaround.

En el MVP, diagnostico no debe operar como laboratorio numerico. Sirve para declarar el foco estrategico del equipo y escribir la hipotesis que luego sera contrastada con las decisiones de negocio. Esto evita que el alumno crea que el diagnostico es "otro set de sliders".

Inputs del alumno:

- seleccion de foco estrategico inicial:
  - caja primero;
  - margen primero;
  - cliente primero;
  - omnicanal primero;
  - red eficiente;
  - estrategia balanceada.
- breve diagnostico escrito.

Outputs:

- baseline de KPIs;
- alertas iniciales;
- hipotesis de IA sobre principales problemas.
- score de consistencia que se recalcula cuando las decisiones contradicen o refuerzan el foco declarado.

Rol de IA:

- resumir el problema;
- detectar tension principal;
- sugerir primera palanca a explorar;
- formular preguntas de decision.

## 5.2 Laboratorio 1: Inventario y capital de trabajo

Objetivo: liberar caja y mejorar capital de trabajo sin romper disponibilidad.

Palancas MVP:

- cobertura base %;
- reduccion global de SKUs %;
- DDI objetivo;
- ajuste de cobertura por categoria:
  - medicamentos cronicos;
  - OTC y cuidado diario;
  - dermocosmetica;
  - perfumeria y belleza;
  - suplementos y bienestar.

Palancas futuras:

- reduccion de SKUs por categoria;
- DDI objetivo por categoria;
- timing mensual o trimestral de cambios de inventario.

Impactos esperados:

- inventario;
- liberacion / absorcion de working capital;
- quiebres estimados;
- quiebres por categoria;
- cobertura por categoria;
- mermas;
- revenue ajustado por disponibilidad;
- FCF;
- caja final.

Rol de IA:

- identificar categorias donde bajar DDI es menos riesgoso;
- alertar sobre quiebres potenciales;
- explicar caja liberada vs venta perdida;
- sugerir ajustes conservadores o agresivos.

## 5.3 Laboratorio 2: Pricing y elasticidad

Objetivo: mejorar margen y competitividad sin destruir volumen.

Palancas:

- cambio PVP % por categoria y mes/trimestre;
- estrategia de pricing:
  - defender margen;
  - ganar volumen;
  - proteger categorias sensibles;
  - premiumizar mix.

Impactos esperados:

- volumen implicito por elasticidad;
- revenue simulado;
- margen bruto;
- margen final;
- competitividad;
- EBITDA;
- FCF.

Rol de IA:

- detectar categorias con alta sensibilidad;
- proponer bandas de cambio por categoria;
- explicar trade-off margen vs volumen;
- evaluar si el pricing es consistente con el foco estrategico.

## 5.4 Laboratorio 3: Clientes y marketing

Objetivo: invertir marketing donde genere rentabilidad y reduzca churn.

Palancas:

- foco de retencion % por segmento:
  - VIPs;
  - Riesgo Fuga;
  - Oportunistas.
- nuevos clientes por mes/trimestre;
- presupuesto o intensidad de marketing por segmento, en una version futura.

Impactos esperados:

- churn ajustado;
- clientes finales;
- revenue incremental;
- budget marketing;
- CAC;
- ROI marketing;
- EBITDA;
- FCF.

Rol de IA:

- sugerir segmentos prioritarios;
- contrastar retencion vs adquisicion;
- detectar gasto de marketing no rentable;
- ayudar a redactar estrategia de clientes.

## 5.5 Laboratorio 4: Digital, fulfillment y cost-to-serve

Objetivo: crecer conveniencia omnicanal sin que el costo logistico destruya margen.

Palancas:

- mix delivery %;
- mix pick-up %;
- uso de hubs/dark stores, conectado con red/CAPEX;
- nivel de servicio esperado, en una version futura.

Impactos esperados:

- penetracion digital;
- costo logistico;
- SLA / penalidad;
- revenue por canal;
- EBITDA ajustado por cost-to-serve;
- FCF.

Rol de IA:

- evaluar si el mix digital es rentable;
- sugerir balance delivery vs pick-up;
- detectar necesidad de hubs;
- explicar el costo de prometer demasiado servicio.

## 5.6 Laboratorio 5: Red de PDV y CAPEX

Objetivo: redisenar la red fisica y omnicanal sin exceder CAPEX ni destruir cobertura.

Palancas:

- aperturas por formato, zona y mes/trimestre;
- cierres por formato, zona y mes/trimestre.

Formatos:

- Flagship CABA;
- Flagship GBA;
- Standard CABA;
- Standard GBA;
- Proximidad CABA;
- Proximidad GBA;
- Hub/Dark Store CABA;
- Hub/Dark Store GBA.

Impactos esperados:

- PDV finales;
- CAPEX utilizado;
- ventas asociadas a aperturas/cierres;
- costos fijos;
- costo logistico;
- EBITDA;
- FCF;
- caja final;
- alertas de CAPEX y cierres.

Rol de IA:

- detectar cierres demasiado agresivos;
- sugerir donde abrir hubs;
- explicar impacto de red sobre digital;
- evaluar coherencia entre estrategia comercial y red fisica.

## 5.7 Board Meeting final

Objetivo: integrar todas las decisiones en un plan de turnaround de 12 meses.

Inputs:

- escenario final seleccionado;
- narrativa estrategica;
- principales trade-offs;
- plan 100 dias;
- decisiones descartadas.

Outputs:

- dashboard final;
- comparacion contra baseline;
- score de consistencia;
- alertas abiertas;
- resumen ejecutivo generado con IA.

Rol de IA:

- actuar como Board desafiante;
- detectar contradicciones;
- generar preguntas criticas;
- ayudar a construir la defensa final.

## 6. Arquitectura propuesta

Preferencia: **Python first**.

La arquitectura debe separar claramente:

- modelo de negocio;
- motor de simulacion;
- interfaz;
- capa IA;
- persistencia de escenarios.

## 6.1 Opcion recomendada para MVP

**Streamlit + Python puro + archivos JSON/CSV locales.**

Estado actual: esta opcion ya fue implementada como MVP inicial.

Archivos principales:

- `simulador/app/streamlit_app.py`: interfaz Streamlit.
- `simulador/src/pharmalink/simulation.py`: motor pedagogico simplificado.
- `simulador/src/pharmalink/storage.py`: persistencia local de jugadas.
- `simulador/data/scenarios/<team_id>/*.json`: jugadas guardadas localmente.

Motivos:

- rapido de construir;
- facil de correr localmente;
- suficiente para prototipo pedagogico;
- permite UI interactiva sin frontend complejo;
- exportable a Streamlit Community Cloud si se quiere compartir;
- facilita trabajar con pandas, pydantic y modelos numericos.

Limitaciones:

- menos control visual que React;
- multiusuario limitado si se corre local;
- manejo de sesiones y persistencia simple.
- no hay autenticacion ni agregacion docente de resultados por equipo.

## 6.2 Opcion posterior

**FastAPI backend + React frontend.**

Conviene si:

- se quiere producto mas pulido;
- varios alumnos/equipos usan la app al mismo tiempo;
- se necesita persistencia real por equipo;
- se quiere desplegar con autenticacion;
- se integrara IA real de manera robusta.

No recomendado para primera version si el objetivo es validar dinamica pedagogica.

## 7. Componentes Python

Estructura sugerida:

```text
simulador/
  src/
    pharmalink/
      __init__.py
      models/
        assumptions.py
        scenario.py
        results.py
      engines/
        pricing.py
        inventory.py
        customer.py
        digital.py
        network.py
        financial.py
        scoring.py
      ai/
        prompts.py
        advisor.py
        mock_advisor.py
      io/
        load_baseline.py
        scenario_store.py
      simulation.py
  app/
    streamlit_app.py
  data/
    processed/
      assumptions.json
      baseline_scenario.json
      categories.csv
      store_formats.csv
      customer_segments.csv
```

## 7.1 Modelos de dominio

Usar `pydantic` o dataclasses para tener estructuras claras.

### `Assumptions`

Representa los supuestos base:

- horizonte;
- ventas iniciales;
- caja inicial;
- inventario inicial;
- DDI inicial;
- CAPEX maximo;
- maximo de meses FCF negativo;
- categorias;
- segmentos;
- formatos de tienda;
- costos base;
- elasticidades.

### `Scenario`

Representa decisiones del alumno:

- pricing por categoria y periodo;
- cobertura por categoria;
- reduccion SKUs por categoria;
- DDI objetivo por categoria y periodo;
- mix digital por periodo;
- foco de retencion por segmento y periodo;
- nuevos clientes por periodo;
- aperturas y cierres por formato/zona/periodo;
- foco estrategico declarado;
- notas del equipo.

### `SimulationResult`

Representa resultados:

- series mensuales de P&L;
- KPIs anuales;
- alertas;
- score de consistencia;
- explicaciones por modulo;
- comparacion contra baseline.

## 7.2 Motores

Todos los motores deben exponer una interfaz similar:

```python
def run(assumptions: Assumptions, scenario: Scenario, state: SimulationState) -> ModuleResult:
    ...
```

Esto permite encadenar modulos de manera predecible.

### Orden de ejecucion sugerido

1. Pricing engine.
2. Inventory engine.
3. Customer engine.
4. Network engine.
5. Digital/logistics engine.
6. Financial engine.
7. Scoring/constraints engine.
8. AI advisor.

El orden puede ajustarse si aparecen dependencias mas fuertes, pero debe existir una capa `Master Variables` equivalente a la del Excel.

## 8. Datos y relacion con el Excel

## 8.1 Extraccion inicial

El Excel debe usarse para generar datos normalizados:

- `assumptions.json`
- `categories.csv`
- `store_formats.csv`
- `customer_segments.csv`
- `baseline_scenario.json`

La extraccion puede hacerse con `openpyxl` o `pandas`.

## 8.2 Politica de uso del Excel

Para MVP:

- el Excel es fuente inicial;
- no se recalcula Excel en runtime;
- el motor Python replica la logica principal de manera legible;
- se validan outputs contra algunos escenarios conocidos del Excel.

En una version posterior:

- se puede agregar exportacion de escenarios a Excel;
- se puede agregar comparacion automatica contra el workbook.

## 9. Interface propuesta

## 9.1 Layout general

La app debe tener:

- sidebar de navegacion por laboratorio;
- selector de mes de decision;
- cockpit fijo con KPIs clave;
- lectura del sistema con progresion mensual y categorias;
- area central de palancas;
- panel de impacto;
- panel de IA;
- gestor de escenarios.

## 9.2 Cockpit fijo

Debe mostrar:

- EBITDA anual;
- FCF anual;
- caja final;
- CAPEX utilizado;
- meses FCF negativo;
- DDI ponderado;
- quiebres;
- margen bruto;
- costo logistico;
- churn/clientes;
- score de consistencia.

Colores:

- verde: dentro de target;
- amarillo: zona de cuidado;
- rojo: rompe constraint o riesgo alto.

## 9.3 Laboratorio

Cada laboratorio debe tener:

- breve contexto;
- 3 a 6 controles principales en la version simple;
- controles por categoria / segmento / canal cuando el promedio global oculte el trade-off;
- recalculo automatico al mover controles;
- boton `Guardar iteracion`;
- comparacion contra baseline;
- alertas especificas del modulo.

No debe requerirse un boton `Simular` en el MVP: Streamlit recalcula al cambiar inputs. Si en una version futura se usa un frontend con estado mas complejo, puede reaparecer un boton explicito de simulacion.

### 9.3.1 Mes de decision

El selector de mes no significa que el equipo "avanza de turno" como en un juego por rondas. Representa el punto desde el cual el alumno lee el plan:

- M01: estado inicial y primeros impactos;
- M02-M04: caja liberada por inventario / capital de trabajo;
- M03, M06, M09, M11: meses relevantes para CAPEX en el MVP;
- M12: foto final del turnaround.

La jugada siempre recalcula el plan completo de 12 meses.

## 9.4 Escenarios

Cada equipo debe poder tener:

- baseline;
- iteracion actual;
- iteracion guardada 1;
- iteracion guardada 2;
- candidato final.

Para MVP local, los escenarios pueden guardarse como JSON en disco.

Para version compartida, guardar en SQLite, Supabase, Google Sheets o backend simple.

Ubicacion local definida para MVP:

```text
simulador/data/scenarios/<team_id>/*.json
```

Cada jugada guarda:

- datos del equipo;
- laboratorio;
- decisiones del escenario;
- snapshot de resultados;
- feedback IA;
- timestamp.

Los JSON generados localmente no deben commitearse.

## 10. Capa IA

## 10.1 MVP sin costo variable

Primero implementar `MockAdvisor`:

- reglas deterministicas;
- mensajes prearmados;
- diagnosticos basados en thresholds;
- recomendaciones simples.

Esto permite validar la dinamica sin depender de APIs ni costos.

## 10.2 IA real

Despues agregar `LLMAdvisor`:

- recibe resultados estructurados;
- recibe escenario y foco declarado;
- devuelve feedback en JSON:
  - diagnostico;
  - riesgos;
  - contradicciones;
  - recomendaciones;
  - preguntas para el Board.

El LLM no debe recalcular el modelo. Solo interpreta resultados generados por el motor.

## 10.3 Prompts por laboratorio

Cada laboratorio debe tener un prompt especifico:

- inventario: caja vs disponibilidad;
- pricing: margen vs volumen;
- clientes: retencion vs CAC;
- digital: conveniencia vs cost-to-serve;
- red: cobertura vs CAPEX;
- Board: consistencia integral.

## 11. Scoring

El simulador debe tener un score transparente, no magico.

Componentes sugeridos:

- rentabilidad: EBITDA anual;
- sostenibilidad de caja: caja final y meses FCF negativo;
- disciplina de inversion: CAPEX usado vs limite;
- salud operativa: DDI, quiebres, costo logistico;
- salud de clientes: churn y crecimiento;
- consistencia estrategica: reglas de coherencia.

Ejemplo de consistencia:

- si estrategia declarada es "cliente primero" pero se reduce marketing y sube churn, penalizar;
- si estrategia declarada es "omnicanal" pero no se invierte en hubs ni pick-up, alertar;
- si estrategia declarada es "caja primero" pero se excede CAPEX, alertar;
- si estrategia declarada es "margen primero" pero se baja precio en categorias inelasticas, alertar.

## 12. Dinamica de clase

### Modo recomendado

1. Docente presenta el caso.
2. Equipos eligen foco estrategico.
3. Se abre laboratorio 1.
4. Equipos generan 2 o 3 iteraciones.
5. Se discuten resultados.
6. Se desbloquea el siguiente laboratorio.
7. Al final, cada equipo presenta su escenario integral.

### Duracion sugerida por laboratorio

- 5 minutos: contexto.
- 10 minutos: primera simulacion.
- 10 minutos: feedback IA y ajuste.
- 5 minutos: puesta en comun.

## 13. Modalidades de despliegue

## 13.1 Local del docente

Recomendado para primera validacion.

Ventajas:

- costo cero;
- control total;
- no requiere cuentas de alumnos;
- facil de iterar.

Desventajas:

- los alumnos no interactuan individualmente salvo que pasen por una maquina;
- menos dinamica por equipos.

## 13.2 Local por equipo

Cada equipo corre el simulador en su notebook.

Ventajas:

- costo cero;
- todos interactuan.

Desventajas:

- requiere setup;
- puede haber problemas de ambiente;
- no ideal para clase ejecutiva.

## 13.3 Web compartida sin IA real

Deploy de Streamlit Community Cloud, Hugging Face Spaces, GitHub Codespaces o similar.

Ventajas:

- acceso simple via link;
- costo bajo o cero;
- buena para pilotos.

Desventajas:

- persistencia limitada;
- performance variable;
- cuidado con datos y quotas.

## 13.4 Web compartida con IA real

Backend con API key protegida.

Ventajas:

- experiencia completa;
- equipos pueden trabajar en paralelo;
- escenarios persistentes.

Desventajas:

- costo por uso;
- requiere backend y gestion de claves;
- mayor complejidad operativa.

Recomendacion: empezar con local docente + mock IA. Luego pasar a web compartida sin IA real. Recién despues agregar IA real.

## 14. Roadmap propuesto

### Fase 0: Validacion de specs

Objetivo: validar interfaz, laboratorios, palancas y arquitectura.

Entregables:

- esta spec;
- presentacion HTML;
- mapa de variables;
- wireframe simple si hace falta.

Estado: completada como primera version.

### Fase 1: Motor Python minimo

Objetivo: correr una simulacion baseline y una simulacion modificada desde JSON.

Incluye:

- modelos `Assumptions`, `Scenario`, `SimulationResult`;
- carga de datos normalizados;
- motores pricing, inventory y financial iniciales;
- tests contra casos simples.

Estado: parcialmente completada. Existe un motor Python simplificado en `simulation.py`, pero todavia faltan modelos separados, motores modulares y tests.

### Fase 2: App Streamlit MVP

Objetivo: interfaz local con cockpit y 2 laboratorios.

Incluye:

- cockpit fijo;
- laboratorio inventario;
- laboratorio pricing;
- comparacion baseline vs escenario actual;
- guardado JSON local;
- mock advisor.

Estado: completada y ampliada. El MVP actual cubre todos los laboratorios en forma inicial, no solo inventario y pricing.

### Fase 3: Laboratorios completos

Objetivo: cubrir todos los modulos.

Incluye:

- clientes/marketing;
- digital/logistica;
- red/CAPEX;
- Board Meeting;
- scoring integral.

Estado: iniciada. Los laboratorios existen en UI, pero falta profundizar formulas, comparacion de iteraciones y narrativa pedagogica final.

### Fase 4: IA real

Objetivo: reemplazar o complementar mock advisor con LLM.

Incluye:

- prompts por laboratorio;
- salida estructurada;
- controles de costo;
- fallback sin IA.

### Fase 5: Acceso alumnos

Objetivo: compartir con equipos.

Opciones:

- Streamlit Community Cloud;
- Hugging Face Spaces;
- Render/Fly.io;
- FastAPI + frontend si se decide producto mas robusto.

## 15. Decisiones pendientes

- Cuantos equipos/alumnos usarian el simulador en simultaneo.
- Si cada equipo necesita guardar escenarios propios.
- Si el docente necesita ver resultados agregados.
- Si la primera version debe tener IA real o mock IA.
- Si el modelo debe replicar exactamente el Excel o solo capturar su logica pedagogica.
- Si el avance por laboratorios sera obligatorio o flexible.
- Si los periodos de decision seran mensuales o trimestrales.
- Si se prioriza velocidad de prototipo o experiencia visual mas pulida.

## 16. Criterios de aceptacion del MVP

El MVP se considera valido si:

- [x] carga un baseline;
- [x] permite modificar palancas de los laboratorios principales;
- [x] recalcula KPIs clave al mover controles;
- [x] muestra alertas de constraints;
- [x] permite guardar iteraciones;
- [x] ofrece feedback IA mockeado;
- [x] puede correr localmente con un comando;
- [x] separa la logica principal de simulacion de la UI;
- [x] muestra progresion mensual de 12 meses;
- [x] muestra categorias de producto;
- [x] permite intervenir inventario por categoria;
- [ ] compara baseline vs escenario actual en una vista dedicada;
- [ ] compara iteraciones guardadas;
- [ ] tiene tests basicos para el motor.

## 17. Comando objetivo para correr local

```bash
cd simulador
streamlit run app/streamlit_app.py
```

Alternativa si se usa estructura de paquete:

```bash
PYTHONPATH=src streamlit run app/streamlit_app.py
```

## 18. Recomendacion actual

La app completa de producto todavia no esta definida, pero ya existe un MVP util para validar con docente/alumnos.

Siguiente paso recomendado:

1. Validar en una sesion corta si la dinamica de laboratorio se entiende.
2. Ajustar las consignas por laboratorio antes de profundizar formulas.
3. Agregar comparador de iteraciones guardadas.
4. Agregar vista baseline vs escenario actual.
5. Agregar tests del motor.
6. Calibrar formulas contra el Excel base.
7. Decidir modalidad de uso:
   - demo local docente;
   - local por equipos;
   - web compartida sin IA real.
8. Recién despues evaluar IA real y despliegue multiusuario.
