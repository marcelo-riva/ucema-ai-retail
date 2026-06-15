# laboratorio_v3 — NEXUS RETAIL LABS

Objetivo de esta carpeta: construir y probar la experiencia del alumno antes de implementar backend real o AWS.

## Principio del producto

La plataforma no reemplaza a la AI personal del alumno.

- La plataforma guía.
- El alumno opera.
- La AI personal analiza.
- El alumno decide.
- La plataforma valida, versiona y recalcula.

## Fases

### Fase 0 — Frontend sin backend
- Next.js / React
- Datos mock JSON
- Login simulado por grupo
- Upload simulado
- Persistencia en localStorage
- Scoreboard mock
- Excel descargable desde `/public/templates`

### Fase 1 — Backend tradicional local
- FastAPI
- Procesamiento de Excel con Python
- Persistencia local o Postgres
- Validaciones reales

### Fase 2 — AWS
- Frontend en Amplify o S3 + CloudFront
- Cognito
- API Gateway + Lambda o FastAPI container
- DynamoDB para metadata
- S3 para Excel/reportes/estados

## Cómo usar esta versión

1. Entrar a `laboratorio_v3/apps/web`.
2. Instalar dependencias si hace falta con `npm install`.
3. Ejecutar `npm run dev`.
4. Entrar a `/login`, elegir Grupo 01 y abrir `/labs`.
5. Recorrer el Laboratorio 1 desde Ejercicio 0 hasta Plan final.
6. Mantener esta etapa sin backend: checkpoints, dashboards y estados viven en `localStorage`.

## Workbook del Laboratorio 1

El laboratorio usa un único workbook vivo desde el inicio hasta el final:

`public/templates/NEXUS_RETAIL_LAB01_WORKBOOK_COMPLETO.xlsx`

La app lo publica para descarga desde:

`apps/web/public/templates/NEXUS_RETAIL_LAB01_WORKBOOK_COMPLETO.xlsx`

Este workbook contiene todas las hojas del Laboratorio 1. `01_BASE_SKUS`
conserva el histórico M01-M12 y no debe ser modificada por el alumno. Las
decisiones se cargan por etapa en hojas específicas, y el workbook funciona como
memoria del laboratorio incluso si la plataforma no está disponible.

## Validar y publicar el workbook

El workbook se valida y copia a la carpeta pública de Next con:

```bash
python3 scripts/generate_lab01_workbook.py
```

El script verifica la estructura esperada de hojas y publica el archivo en
`apps/web/public/templates`.

Requiere `openpyxl`:

```bash
python3 -m pip install openpyxl
```
