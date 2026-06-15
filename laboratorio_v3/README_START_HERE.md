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

## Cómo usar este paquete

1. Copiar el contenido de esta carpeta dentro de `laboratorio_v3/` en tu repo.
2. Abrir Codex en el repo.
3. Pasarle primero `prompts/CODEX_01_BOOTSTRAP_FRONTEND.md`.
4. Cuando compile, pasar `prompts/CODEX_02_EXERCISE_01_UI.md`.
5. Probar la dinámica como alumno.
6. Recién después avanzar a backend con `prompts/CODEX_04_PREPARE_FASTAPI_BACKEND.md`.

## Archivo Excel final

El pack final del Ejercicio 1 está en:

`public/templates/NEXUS_RETAIL_LAB01_EJ01_PORTFOLIO_PACK_FINAL.xlsx`

La app lo publica para descarga desde:

`apps/web/public/templates/NEXUS_RETAIL_LAB01_EJ01_PORTFOLIO_PACK_FINAL.xlsx`

El pack incluye 12 meses históricos M01-M12 y una hoja `09_PROYECCION_90_DIAS`
para M13-M15. Las columnas `baseline_*` son referencia de plataforma; las
columnas `projected_*` son la proyección editable del equipo.

## Validar y publicar el pack Excel

El pack final adjunto se valida y copia a la carpeta pública de Next con:

```bash
python3 scripts/generate_excel_pack.py
```

El script verifica hojas, columnas principales de `05_DECISIONES_SKU` y presencia
de columnas `baseline_*` / `projected_*` en `09_PROYECCION_90_DIAS`.

Requiere `openpyxl`:

```bash
python3 -m pip install openpyxl
```
