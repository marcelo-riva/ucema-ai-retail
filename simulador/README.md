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

Para correrla localmente desde la raiz del repo:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r simulador/requirements.txt
PYTHONPATH=simulador/src streamlit run simulador/app/streamlit_app.py
```

Tambien se puede correr desde esta carpeta:

```bash
cd simulador
PYTHONPATH=src streamlit run app/streamlit_app.py
```

La app queda disponible en `http://127.0.0.1:8501`.

Las jugadas de los equipos se guardan como JSON locales en `data/scenarios/<equipo>/`.

## Flujo de practica

1. Elegir el equipo en la sidebar.
2. Usar `Reset escenario actual` para volver el escenario en pantalla al baseline.
3. Entrar a un laboratorio segun la clase tematica.
4. En `Inventario` o `Pricing`, probar `Jugada A`, `Jugada B` y `Jugada C` para comparar hipotesis.
5. Revisar siempre la progresion de 12 meses, las categorias, `Baseline vs actual` e `Iteraciones`.
6. Guardar solo las jugadas que se quieran conservar para discusion o comparacion.

El reset no borra los JSON ya guardados. Para practicar desde cero sin historial, usar otro nombre de equipo o limpiar manualmente la carpeta local.
