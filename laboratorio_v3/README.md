# Laboratorio V3 — Mock Revisable

Rama de revisión: `laboratorio_v3/laboratorio-v3-mock`

Esta carpeta contiene una versión mock de la experiencia educativa de NEXUS Retail Labs.
La plataforma acompaña el recorrido, pero no resuelve el caso por el alumno.

## Alcance

- Frontend Next.js.
- Datos mock JSON.
- Persistencia local con `localStorage`.
- Sin backend real.
- Sin AWS.
- Sin Streamlit.
- Sin lógica de evaluación productiva.

## Principio de la experiencia

El Laboratorio 1 usa un único workbook vivo:

`NEXUS_RETAIL_LAB01_WORKBOOK_COMPLETO.xlsx`

El workbook es la memoria del laboratorio. Cada ejercicio completa una parte del mismo archivo.
La plataforma guía, recibe checkpoints mock y muestra dashboards de apoyo.
Si la plataforma falla, el alumno puede continuar trabajando desde el Excel con su AI personal.

## Cómo correr

Desde la raíz del repo:

```bash
cd laboratorio_v3/apps/web
npm install
npm run dev
```

Abrir:

```text
http://localhost:3000/labs
```

Si el puerto `3000` está ocupado, Next usará otro puerto y lo mostrará en consola.

## Rutas principales

- `/labs`: catálogo general de laboratorios.
- `/labs/lab-01`: home del Laboratorio 1 con cards de ejercicios.
- `/labs/lab-02`: mock simple de Laboratorio 2, próximamente.
- `/labs/lab-01/exercises/ex-00`: Exploración Inicial.
- `/labs/lab-01/exercises/ex-01`: Portfolio Optimization.
- `/labs/lab-01/exercises/ex-02`: Pricing Optimization.
- `/labs/lab-01/exercises/ex-03`: Forecast Engine.
- `/labs/lab-01/exercises/ex-04`: Inventory & Working Capital Optimization.
- `/labs/lab-01/scoreboard`: scoreboard consolidado mock.
- `/labs/lab-01/final-plan`: plan de captura de valor 90 días.

## Flujo esperado para revisar

1. Entrar a `/labs`.
2. Confirmar que se ven sólo dos laboratorios.
3. Abrir Laboratorio 1.
4. Confirmar que aparecen cards de ejercicios, incluyendo Ejercicio 0.
5. Descargar el workbook del Laboratorio 1.
6. Abrir cada ejercicio desde su card o desde el sidebar.
7. Confirmar que el sidebar se adapta a la vista general de laboratorios.
8. Confirmar que el sidebar se expande dentro de Laboratorio 1.
9. Confirmar que Laboratorio 2 no muestra ejercicios de Laboratorio 1.
10. Subir checkpoints mock si se quiere probar avance de estado.
11. Revisar scoreboard y plan final.

## Workbook

Archivo fuente:

```text
laboratorio_v3/public/templates/NEXUS_RETAIL_LAB01_WORKBOOK_COMPLETO.xlsx
```

Archivo publicado por Next:

```text
laboratorio_v3/apps/web/public/templates/NEXUS_RETAIL_LAB01_WORKBOOK_COMPLETO.xlsx
```

Para regenerarlo:

```bash
cd laboratorio_v3
python3 scripts/generate_lab01_workbook.py
```

## Verificación

```bash
cd laboratorio_v3/apps/web
npm run build
```

El build debe generar, como mínimo, estas rutas:

- `/labs`
- `/labs/lab-01`
- `/labs/lab-02`
- `/labs/lab-01/exercises/ex-00`
- `/labs/lab-01/exercises/ex-01`
- `/labs/lab-01/exercises/ex-02`
- `/labs/lab-01/exercises/ex-03`
- `/labs/lab-01/exercises/ex-04`
- `/labs/lab-01/scoreboard`
- `/labs/lab-01/final-plan`

## Notas

- Los checkpoints son mock y viven en el navegador.
- El modo demo desbloquea navegación para revisión.
- El alumno usa su AI personal como analista; el equipo decide.
- No incluir en revisión los artefactos legacy del antiguo pack de Portfolio.
