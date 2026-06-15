# Backend Future Spec — FastAPI

## Objetivo

Reemplazar mocks por API tradicional Python.

## Endpoints

- `GET /health`
- `GET /labs`
- `GET /labs/{lab_id}/exercises`
- `GET /groups/{group_id}/scoreboard`
- `GET /groups/{group_id}/labs/{lab_id}/state`
- `POST /submissions`
- `POST /submissions/{submission_id}/validate`
- `POST /submissions/{submission_id}/finalize`
- `GET /admin/submissions`
- `GET /admin/groups/{group_id}/export`

## Servicios

- `ExcelValidationService`
- `SubmissionService`
- `ScoreboardService`
- `StateVersionService`
- `ExportService`

## Storage Fase 1

Local:
- `/storage/master`
- `/storage/groups/{group_id}/submissions`
- `/storage/groups/{group_id}/states`
- `/storage/groups/{group_id}/exports`

## Storage Fase 2

S3 con la misma estructura lógica.
