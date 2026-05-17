# UCEMA AI Retail

Repositorio de clases y simulador para el curso de AI & Retail en UCEMA.

## Estructura

- `simulador/` — simulador interactivo de retail con AI.
- `clases/` — materiales de clase, notebooks, slides y ejercicios.

## Levantar el simulador despues de clonar

Requisitos:

- Python 3.11 o superior.
- Git.

Desde la raiz del repo:

```bash
git clone https://github.com/marcelo-riva/ucema-ai-retail.git
cd ucema-ai-retail
git checkout feature/simulador
python3 -m venv .venv
source .venv/bin/activate
pip install -r simulador/requirements.txt
PYTHONPATH=simulador/src streamlit run simulador/app/streamlit_app.py
```

Luego abrir:

```text
http://127.0.0.1:8501
```

## Persistencia local

Las jugadas de los equipos se guardan como JSON en:

```text
simulador/data/scenarios/<equipo>/
```

Estos archivos no se commitean, porque son resultados locales de uso en clase.

## Documentacion del simulador

- `simulador/docs/simulador-specs.md` — specs funcionales y arquitectura.
- `simulador/docs/variables-caso-y-ejercicios.md` — variables clave y palancas por laboratorio.
- `simulador/docs/resumen-sesion-2026-05-17.md` — resumen de la primera sesion de trabajo.
