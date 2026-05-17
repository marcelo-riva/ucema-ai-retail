# Resumen de sesion — 2026-05-17

## Contexto

Se trabajo sobre el MVP del simulador **PharmaLink 360** para el curso AI & Retail de UCEMA. El foco de la sesion fue convertir la idea inicial en una primera experiencia navegable en Streamlit, separada del contenido de clases, y dejar una base para iterar laboratorios, interfaz y motor de simulacion.

## Decisiones de estructura

- El simulador vive en `simulador/`.
- Los materiales de clase quedan separados en `clases/`.
- Las referencias originales del caso, el Excel base y el caso de negocio se guardan en `simulador/referencias/planificador/`.
- Las jugadas de alumnos se persisten localmente como JSON en `simulador/data/scenarios/<equipo>/`, ignoradas por Git.

## Documentacion generada

- `simulador/docs/analisis-referencias.md`: lectura de los archivos base.
- `simulador/docs/variables-caso-y-ejercicios.md`: variables que guian el caso y palancas por ejercicio.
- `simulador/docs/simulador-specs.md`: specs funcionales, arquitectura propuesta y estrategia comun para simuladores.
- `simulador/docs/presentacion-simulador.html`: presentacion HTML para explicar la dinamica del simulador.
- `simulador/docs/presentacion-interaccion-jugador.html`: presentacion HTML para explicar la experiencia del jugador, la secuencia mensual y el rol de la IA.

## MVP construido

- App en Streamlit: `simulador/app/streamlit_app.py`.
- Motor simplificado: `simulador/src/pharmalink/simulation.py`.
- Persistencia local: `simulador/src/pharmalink/storage.py`.
- Dependencias: `simulador/requirements.txt`.

## Capacidades actuales del MVP

- Cockpit ejecutivo compacto con KPIs clave:
  - revenue anual;
  - EBITDA anual;
  - FCF anual;
  - caja final;
  - CAPEX usado;
  - DDI;
  - margen bruto;
  - quiebres;
  - costo logistico;
  - churn;
  - consistencia estrategica.
- Progresion mensual de 12 meses con revenue, EBITDA, FCF, caja, capital de trabajo y CAPEX.
- Selector de mes de lectura para entender donde se para el equipo dentro del plan.
- Lectura por categorias:
  - medicamentos cronicos;
  - OTC y cuidado diario;
  - dermocosmetica;
  - perfumeria y belleza;
  - suplementos y bienestar.
- Vista baseline vs escenario actual para ver que cambio contra el punto de partida.
- Comparador de iteraciones guardadas para revisar jugadas anteriores.
- Laboratorios iniciales:
  - diagnostico;
  - inventario;
  - pricing;
  - clientes;
  - digital;
  - red y CAPEX;
  - board meeting.
- Guia contextual por laboratorio:
  - que tiene que hacer el alumno;
  - que palancas puede mover;
  - que variables mirar antes de guardar.
- Jugadas guiadas en inventario y pricing:
  - Jugada A para probar una decision agresiva;
  - Jugada B para corregir con segmentacion;
  - Jugada C para construir una version defendible.
- Reset del escenario actual desde la sidebar.
- Feedback IA mockeado por reglas:
  - diagnostico;
  - riesgos;
  - recomendaciones;
  - preguntas de board.

## Ajustes de UX realizados

- Se reemplazaron los `st.metric` grandes por tarjetas compactas para que el cockpit sea legible.
- Se agregaron globitos `?` con explicaciones de siglas y variables.
- Se corrigio la lectura temporal de meses para mostrar `M01` a `M12`.
- Se aclaro que mover sliders recalcula el escenario y guardar solo congela una iteracion.
- Se agrego intervencion por categoria en el laboratorio de inventario.
- Se agregaron botones `Aplicar Jugada A/B/C` para acompanar practica guiada.
- Se agregaron vistas `Baseline vs actual`, `Iteraciones` y `Mapa de decisiones`.
- Se agrego un reset rapido del escenario actual. El reset no borra JSONs ya guardados; para practicar limpio conviene usar otro equipo.

## Aclaraciones pedagogicas

- El laboratorio diagnostico no es para mover numeros operativos; sirve para definir la tesis estrategica del equipo.
- Una jugada no requiere tocar todos los laboratorios. Puede probar una hipotesis acotada.
- Guardar una iteracion sirve para comparar escenarios, no para ejecutar el calculo.
- El mes no es un turno de juego: es un mes de lectura de la pelicula de 12 meses.
- El simulador actual no replica celda por celda el Excel: usa un motor pedagogico simplificado que debe calibrarse luego contra el workbook.

## Proximos pasos sugeridos

- Validar con usuarios la dinamica de laboratorios antes de profundizar formulas.
- Definir si el modo clase sera local compartido por docente o acceso individual para alumnos.
- Calibrar formulas contra el Excel base.
- Agregar tests unitarios del motor de simulacion.
- Preparar escenarios docentes y una guia de uso por clase/laboratorio.
