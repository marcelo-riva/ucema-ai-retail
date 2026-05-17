# Simulador

Espacio de trabajo para construir el simulador interactivo de AI & Retail.

## Estructura

- `referencias/planificador/` — Excel original del planificador/simulador usado para entender variables, supuestos y escenarios.
- `escenarios/` — definiciones versionables de escenarios de simulacion, por ejemplo YAML o JSON.
- `data/raw/` — datos crudos que el simulador pueda consumir directamente.
- `data/processed/` — datos derivados, normalizados o exportados desde las referencias.
- `src/` — logica del motor de simulacion, modelos y reglas de negocio.
- `app/` — interfaz interactiva del simulador.
- `tests/` — pruebas del motor y de escenarios.
- `docs/` — notas de diseno, decisiones y glosario de variables.

## Excel planificador

El Excel base debe ir en `referencias/planificador/`.

Sugerencia de nombre:

```text
simulador/referencias/planificador/planificador-base.xlsx
```

Si mas adelante el motor necesita leer datos del Excel, conviene exportar/copiar la version normalizada a `data/processed/` y dejar el archivo original como referencia historica.

## MVP interactivo

La primera interfaz del simulador vive en `app/streamlit_app.py`.

Para correrla localmente:

```bash
cd simulador
PYTHONPATH=src streamlit run app/streamlit_app.py
```

Las jugadas de los equipos se guardan como JSON locales en `data/scenarios/<equipo>/`.
