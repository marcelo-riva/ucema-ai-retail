# Deploy Mock en AWS Amplify Hosting

## Objetivo

Publicar `laboratorio_v3` como frontend mock para revisión docente.

No se crea backend, Lambda, DynamoDB, Cognito, S3 custom, CloudFront manual,
Terraform ni CDK. Amplify Hosting administra el hosting estático/SSR de Next.

## Región

- Región objetivo: `us-west-2`
- Nombre AWS Console: Oregon

## Branch

Usar la rama:

```text
laboratorio_v3/laboratorio-v3-mock
```

## Estructura detectada

La app está en:

```text
laboratorio_v3/apps/web
```

No está en la raíz del repo.

El proyecto usa Next.js sin `output: "export"`, por lo tanto el artifact de
Amplify debe ser:

```text
.next
```

## Build local

Desde la raíz del repo:

```bash
cd laboratorio_v3/apps/web
npm ci
npm run build
```

## Start local

Después del build:

```bash
cd laboratorio_v3/apps/web
npm run start
```

Para desarrollo:

```bash
cd laboratorio_v3/apps/web
npm run dev
```

## amplify.yml esperado

El archivo `amplify.yml` vive en la raíz del repo y usa configuración monorepo:

```yaml
version: 1
env:
  variables:
    NEXT_PUBLIC_APP_ENV: mock
    NEXT_PUBLIC_AWS_REGION: us-west-2
    NEXT_PUBLIC_LAB_VERSION: v3
applications:
  - appRoot: laboratorio_v3/apps/web
    frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: .next
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
```

## Crear app en Amplify Console

1. Entrar a AWS Console.
2. Cambiar región a `us-west-2` Oregon.
3. Abrir AWS Amplify.
4. Crear nueva app.
5. Elegir hosting desde repositorio Git.
6. Conectar GitHub.
7. Seleccionar repo `marcelo-riva/ucema-ai-retail`.
8. Seleccionar branch `laboratorio_v3/laboratorio-v3-mock`.
9. Confirmar que Amplify detecta `amplify.yml`.
10. Confirmar app root `laboratorio_v3/apps/web`.
11. Confirmar build command `npm run build`.
12. Confirmar artifact/base directory `.next`.
13. Guardar y desplegar.

## Variables de entorno

El `amplify.yml` define:

- `NEXT_PUBLIC_APP_ENV=mock`
- `NEXT_PUBLIC_AWS_REGION=us-west-2`
- `NEXT_PUBLIC_LAB_VERSION=v3`

También se pueden cargar manualmente en Amplify Console si se prefiere
administrarlas desde la UI.

## Workbook

El workbook debe estar incluido en:

```text
laboratorio_v3/apps/web/public/templates/NEXUS_RETAIL_LAB01_WORKBOOK_COMPLETO.xlsx
```

Debe descargarse públicamente desde:

```text
/templates/NEXUS_RETAIL_LAB01_WORKBOOK_COMPLETO.xlsx
```

## Checklist de validación

Validar estas rutas en la URL pública de Amplify:

- `/login`
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
- `/templates/NEXUS_RETAIL_LAB01_WORKBOOK_COMPLETO.xlsx`

## Prueba funcional mínima

1. Abrir `/login`.
2. Elegir Grupo 01.
3. Entrar a `/labs`.
4. Confirmar que se muestran dos laboratorios.
5. Abrir Laboratorio 1.
6. Confirmar que la home muestra cards de ejercicios.
7. Descargar el workbook.
8. Abrir Ejercicio 0.
9. Guardar un checkpoint draft.
10. Confirmar que `localStorage` conserva el avance al recargar.
11. Abrir Scoreboard.
12. Abrir Plan final.

## Compartir con profesores

Una vez que Amplify finalice el deploy:

1. Copiar la URL pública generada por Amplify.
2. Compartir esa URL con profesores.
3. Indicar que es un mock sin backend.
4. Indicar que cada navegador guarda su propio avance localmente.
5. Indicar que el workbook se descarga desde la pantalla de Laboratorio 1.

## Límites conocidos

- No hay backend real.
- No hay autenticación real.
- No hay persistencia compartida entre usuarios.
- No hay validación real del Excel.
- Los dashboards son mock.
- Los checkpoints viven en `localStorage`.
