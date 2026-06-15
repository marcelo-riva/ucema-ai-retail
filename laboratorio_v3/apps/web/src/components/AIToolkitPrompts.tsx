"use client";

import { Copy } from "lucide-react";

const prompts = [
  {
    title: "Prompt A: explorar la base",
    body: `Actuá como analista comercial.

Voy a cargar NEXUS_RETAIL_LAB01_EJ01_PORTFOLIO_PACK_FINAL.xlsx. Ayudame a entender la base antes de decidir.

Mirando M01-M12, identificá productos o categorías con buena venta, bajo margen, mucho stock, DDI alto o baja contribución. Explicá qué columnas usaste y qué hallazgos debería revisar el equipo. No tomes decisiones finales todavía.`
  },
  {
    title: "Prompt B: proponer criterios",
    body: `Ayudame a proponer criterios para clasificar productos como CORE, REVIEW o ELIMINAR.

Usá variables simples: ventas, margen, stock, DDI, cobertura y rol comercial. DDI significa días de inventario disponible. Proponé reglas claras y excepciones razonables. No decidas por nosotros: mostrarnos alternativas y riesgos.`
  },
  {
    title: "Prompt C: preparar la entrega",
    body: `Ayudame a preparar la entrega del Ejercicio 1.

Necesito completar 05_DECISIONES_SKU y 06_SCOREBOARD_ALUMNO. Ayudame a justificar decisiones, estimar impacto inicial y explicar supuestos. Revenue en riesgo significa ventas que podrían perderse si retiramos productos. La decisión final es del equipo.`
  }
];

export function AIToolkitPrompts() {
  async function copyPrompt(body: string) {
    await navigator.clipboard.writeText(body);
  }

  return (
    <section className="card">
      <div className="eyebrow">Herramientas para AI personal</div>
      <h2>Usá tu AI como analista, no como decisor</h2>
      <p className="muted">
        Estos prompts ayudan a entender la base, clasificar SKUs, justificar decisiones y
        estimar impacto inicial. La decisión final sigue siendo del equipo.
      </p>
      <div className="promptGrid">
        {prompts.map((prompt) => (
          <details className="promptCard" key={prompt.title}>
            <summary>
              <span>{prompt.title}</span>
              <button
                aria-label={`Copiar ${prompt.title}`}
                className="iconButton"
                onClick={(event) => {
                  event.preventDefault();
                  copyPrompt(prompt.body);
                }}
                type="button"
              >
                <Copy size={16} />
              </button>
            </summary>
            <pre>{prompt.body}</pre>
          </details>
        ))}
      </div>
    </section>
  );
}
