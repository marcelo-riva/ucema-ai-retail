# Inbox de ingestión de artefactos

## Para qué sirve esta carpeta

Acá se suben las nuevas versiones del workbook y otros artefactos que el equipo quiere incorporar al proyecto. El agente se encarga de revisar, validar y distribuir el contenido a los lugares correctos.

## Cómo usarla

1. Copiá el archivo nuevo acá, con un nombre descriptivo.
   - Ejemplo: `NEXUS_RETAIL_LAB01_WORKBOOK_v2.xlsx`
2. No modifiques manualmente los archivos que ya están en las carpetas destino.
3. Avisá al agente: "Hay un nuevo archivo en `ingest/` para procesar".
4. El agente va a:
   - Revisar el archivo.
   - Compararlo con la versión actual.
   - Distribuirlo a los destinos correspondientes.
   - Actualizar el script generador si es necesario.
   - Actualizar la documentación.
   - Hacer commit.

## Archivos actuales en esta carpeta

- (vacía)

## Destinos del workbook

Cuando se ingresa un nuevo workbook del Laboratorio 1, el agente lo copia a:

- `laboratorio_v3/public/templates/NEXUS_RETAIL_LAB01_WORKBOOK_COMPLETO.xlsx`
- `laboratorio_v3/apps/web/public/templates/NEXUS_RETAIL_LAB01_WORKBOOK_COMPLETO.xlsx`

Y revisa que el script generador esté alineado:

- `laboratorio_v3/scripts/generate_lab01_workbook.py`

## Reglas

- Un archivo en esta carpeta es una tarea pendiente para el agente.
- No se commitean archivos acá como destino final; siempre se mueven o procesan.
- Si un archivo no se puede procesar, el agente deja una nota acá explicando por qué.
