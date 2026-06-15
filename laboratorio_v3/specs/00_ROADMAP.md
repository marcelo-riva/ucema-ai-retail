# Roadmap laboratorio_v3

## Fase 0 — Experiencia sin backend

Objetivo:
Validar la dinámica de interacción alumno-plataforma-AI personal.

Entregables:
- Next.js frontend.
- Login simulado.
- Laboratorio 1 / Ejercicio 1.
- Descarga de Excel template.
- Carga simulada de tesis, Excel y reporte.
- Scoreboard del sistema mock.
- Admin mock.
- Persistencia en localStorage.

Definition of done:
- Un alumno puede entrar como Grupo 01.
- Puede abrir el ejercicio 1.
- Puede descargar el pack.
- Puede copiar el prompt para su AI.
- Puede cargar tesis.
- Puede subir Excel y reporte.
- Puede enviar entrega.
- El sistema cambia estado a `submitted`.
- El scoreboard muestra `state_v1`.

## Fase 1 — Backend tradicional

Objetivo:
Reemplazar mocks por API FastAPI.

Entregables:
- FastAPI.
- Endpoints de labs, exercises, submissions, scoreboard.
- Validación real de Excel.
- Storage local de archivos.
- Tests.

## Fase 2 — AWS

Objetivo:
Desplegar la plataforma cloud con bajo costo.

Servicios:
- Amplify o S3 + CloudFront.
- Cognito.
- API Gateway.
- Lambda o FastAPI container.
- DynamoDB.
- S3.
- CloudWatch 7 días.
