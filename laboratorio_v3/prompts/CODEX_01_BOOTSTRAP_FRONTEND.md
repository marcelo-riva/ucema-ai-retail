# CODEX PROMPT 01 — Bootstrap frontend

Estamos en un repositorio existente. Hay una carpeta nueva llamada `laboratorio_v3`.

Quiero construir un prototipo frontend de NEXUS RETAIL LABS sin backend real.

## Objetivo

Crear una app Next.js/React con TypeScript para validar la experiencia del alumno del Laboratorio 1, Ejercicio 1: Portfolio Optimization.

## Restricciones

- No usar Streamlit.
- No implementar backend todavía.
- No conectar AWS todavía.
- Usar datos mock.
- Persistir estado en localStorage.
- Mantener todo dentro de `laboratorio_v3`.

## Rutas

Crear:

- `/login`
- `/labs`
- `/labs/lab-01/exercises/ex-01`
- `/labs/lab-01/scoreboard`
- `/admin`

## Componentes

Crear componentes reutilizables:

- `AppShell`
- `LabCard`
- `ExerciseHeader`
- `FileDownloadCard`
- `StudentInstructions`
- `ThesisEditor`
- `FileUploadBox`
- `SystemScoreboard`
- `SubmissionStatus`
- `AdminSubmissionTable`

## Services

Crear `mockLabService.ts` con funciones:

- `getGroups`
- `setCurrentGroup`
- `getCurrentGroup`
- `getLabs`
- `getExercise`
- `getSubmission`
- `saveDraftSubmission`
- `submitExercise`
- `getSystemScoreboard`
- `getAdminSubmissions`

## Data contracts

Usar los tipos de `specs/03_DATA_CONTRACTS.md`.

## UI

Diseño ejecutivo y limpio:
- cards
- estados visibles
- botones claros
- nada lúdico ni infantil
- foco en decisiones ejecutivas

## Definition of done

- La app corre localmente.
- Puedo seleccionar Grupo 01.
- Puedo entrar al Laboratorio 1.
- Puedo abrir Portfolio Optimization.
- Puedo guardar tesis como borrador.
- Puedo subir Excel y reporte en modo simulado.
- Puedo enviar entrega.
- El estado cambia a submitted.
- El scoreboard se actualiza a v1 mock.
