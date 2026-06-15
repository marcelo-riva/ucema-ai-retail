"use client";

import { Copy } from "lucide-react";

export function AIPromptCards({ title = "Tu AI personal ayuda a analizar; el equipo decide", prompts }: { title?: string; prompts: Array<{ title: string; body: string }> }) {
  async function copyPrompt(body: string) {
    await navigator.clipboard.writeText(body);
  }

  return (
    <section className="card">
      <div className="eyebrow">Prompts para AI personal</div>
      <h2>{title}</h2>
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
