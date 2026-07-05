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

## Modo Amplify (backend real)

La capa de persistencia está abstraída en `apps/web/src/lib/repositories/`:

- `labRepository.ts` selecciona el repositorio según `NEXT_PUBLIC_DATA_MODE`.
- `labRepository.local.ts` implementa la versión mock con `localStorage` (por defecto).
- `labRepository.amplify.ts` implementa persistencia real con **Amplify Data** (ExerciseMeta y Submission). Storage no se usa en este MVP: los workbooks se entregan por fuera de la plataforma.

### Para desarrollar en modo local (sin backend)

```bash
cd laboratorio_v3/apps/web
npm run dev
```

### Para desarrollar con backend real (sandbox)

Requisitos:
- AWS credentials configuradas para el entorno de desarrollo.
- Amplify CLI ya instalado (viene con `@aws-amplify/backend-cli`).

```bash
cd laboratorio_v3/apps/web
npx ampx sandbox
# en otra terminal, con el backend corriendo:
NEXT_PUBLIC_DATA_MODE=amplify npm run dev
```

`npx ampx sandbox` genera `amplify_outputs.json` en `laboratorio_v3/apps/web`. La app lo importa automáticamente en `ConfigureAmplify.tsx` cuando `NEXT_PUBLIC_DATA_MODE=amplify`.

### Para deployar en Amplify Hosting

El repositorio ya incluye `amplify.yml` en la raíz con el build de backend y frontend. La variable `NEXT_PUBLIC_DATA_MODE=amplify` está configurada para el deploy. Al hacer push a la rama conectada, Amplify ejecuta:

```bash
npx ampx pipeline-deploy --branch $AWS_BRANCH --app-id $AWS_APP_ID
```

y luego el build de Next.js.

### Seed de ejercicios

En modo Amplify, la primera vez que se abre `/admin` la tabla de ejercicios estará vacía. El admin puede hacer clic en **Crear ejercicios iniciales** para cargar los metadatos de EX00 a EX04. Esto ejecuta `seedExerciseMeta()` desde `labRepository.amplify.ts`.

### Auth (MVP cerrado)

El login sigue siendo un mecanismo simple basado en `localStorage`:

- Grupos IAEC: `iaec-grupo01`..`iaec-grupo20` con password `laboratorio#iaec-grupoXX`.
- Grupos ERO: `ero-grupo01`..`ero-grupo20` con password `laboratorio#ero-grupoXX`.
- Admin: `admin` con password `admin#admin#messi`.

Este es un placeholder adecuado para un curso cerrado. Antes de abrir la app a más usuarios se debe reemplazar por **Amplify Auth (Cognito)** o un endpoint server-side que devuelva rol y sesión.

### Modelo de datos actual

Amplify Data define dos modelos:

- **ExerciseMeta**: metadatos de cada ejercicio (`id`, `labId`, `title`, `path`, `order`, `status`, `version`).
- **Submission**: respuestas de cada grupo (`id`, `groupId`, `exerciseId`, `exerciseVersion`, `status`, `responsesJson`, `submittedAt`).

`responsesJson` se guarda como string JSON (`JSON.stringify`/`JSON.parse`) porque Amplify Data no expone un escalar JSON nativo.

### Autorización (MVP cerrado)

El schema usa `allow.publicApiKey()` para simplificar el curso cerrado. Esto significa que cualquier cliente con la API key puede leer y escribir. Antes de producción real se debe migrar a Cognito, custom authorizer o validación server-side.

### TODO antes de abrir la app

1. **Auth**: reemplazar el login simple por Cognito o endpoint server-side.
2. **Autorización**: quitar `publicApiKey` y usar identidad autenticada con reglas por rol (grupo/admin).
3. **Workbook**: decidir si se habilita Storage para entregas de workbook; por ahora están desactivadas.

## Notas

- Los checkpoints son mock y viven en el navegador.
- El modo demo desbloquea navegación para revisión.
- El alumno usa su AI personal como analista; el equipo decide.
- No incluir en revisión los artefactos legacy del antiguo pack de Portfolio.
