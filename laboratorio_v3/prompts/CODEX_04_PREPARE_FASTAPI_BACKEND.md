# CODEX PROMPT 04 — Prepare FastAPI backend

Preparar estructura de backend tradicional en Python, sin conectarla todavía al frontend.

## Ubicación

`laboratorio_v3/apps/api`

## Stack

- FastAPI
- Pydantic
- Pytest

## Crear endpoints

- `GET /health`
- `GET /labs`
- `GET /labs/{lab_id}/exercises`
- `GET /groups/{group_id}/scoreboard`
- `GET /groups/{group_id}/labs/{lab_id}/state`
- `POST /submissions`
- `POST /submissions/{submission_id}/validate`
- `POST /submissions/{submission_id}/finalize`
- `GET /admin/submissions`

## Implementación

- Usar repositorios in-memory.
- No usar DB real todavía.
- No usar S3 todavía.
- Definir schemas Pydantic equivalentes a los tipos TypeScript.
- Agregar tests básicos.

## Regla

La API debe implementar la misma semántica que `mockLabService.ts` para que después sea fácil reemplazar el service frontend por llamadas HTTP.
