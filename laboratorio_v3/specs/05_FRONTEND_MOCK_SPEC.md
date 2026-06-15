# Frontend Mock Spec

## Objetivo

Crear una app Next.js sin backend real.

## Rutas

- `/login`
- `/labs`
- `/labs/lab-01/exercises/ex-01`
- `/labs/lab-01/scoreboard`
- `/admin`

## Servicios mock

Archivo sugerido:
`apps/web/src/services/mockLabService.ts`

Funciones:
- `getGroups()`
- `getCurrentGroup()`
- `setCurrentGroup(groupId)`
- `getLabs()`
- `getExercise(labId, exerciseId)`
- `getSubmission(groupId, exerciseId)`
- `saveDraftSubmission(payload)`
- `submitExercise(payload)`
- `getSystemScoreboard(groupId, labId)`
- `getAdminSubmissions()`

## Persistencia

Usar localStorage con keys:
- `nexus.currentGroupId`
- `nexus.submissions`
- `nexus.scoreboards`

## Comportamiento submit Fase 0

Al enviar:
- Validar tesis no vacía.
- Validar Excel cargado.
- Validar checkboxes.
- Si ok, guardar status `submitted`.
- Cambiar stateVersion de `v0` a `v1`.
- Actualizar scoreboard mock.
