"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type PromptBlockProps = {
  eyebrow: string;
  title: string;
  helperText?: string;
  prompt: string;
};

export function PromptBlock({ eyebrow, title, helperText, prompt }: PromptBlockProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="card">
      <div className="eyebrow">{eyebrow}</div>
      <h2>{title}</h2>
      <div className="promptSingle">
        <div className="promptSingleHeader">
          <span>Prompt recomendado</span>
          <button
            aria-label={copied ? "Copiado" : "Copiar prompt"}
            className="iconButton"
            onClick={copy}
            type="button"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
        {helperText ? (
          <div className="panel" style={{ margin: 0, border: "none", borderRadius: 0, background: "rgba(255,255,255,0.72)" }}>
            <p className="muted" style={{ margin: 0 }}>{helperText}</p>
          </div>
        ) : null}
        <pre>{prompt}</pre>
      </div>
    </section>
  );
}
