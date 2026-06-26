"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "../../components/AppShell";
import type { Lab } from "../../types/lab";
import { getLabs } from "../../services/mockLabService";

function statusLabel(status: Lab["status"]) {
  if (status === "coming_soon") return "Próximamente";
  if (status === "completed") return "Completado";
  return null;
}

export default function LabsPage() {
  const [labs, setLabs] = useState<Lab[]>([]);

  useEffect(() => {
    getLabs().then(setLabs);
  }, []);

  return (
    <AppShell>
      <header className="topbar">
        <div>
          <div className="eyebrow">Catálogo</div>
          <h1>Laboratorios</h1>
          <p className="lead">Elegí el laboratorio que querés revisar.</p>
        </div>
      </header>

      <section className="grid two">
        {labs.map((lab) => (
          <article className="card labSelectionCard" key={lab.id}>
            {statusLabel(lab.status) ? (
              <div className={`statusPill ${lab.status === "coming_soon" ? "locked" : "available"}`}>
                {statusLabel(lab.status)}
              </div>
            ) : null}
            <h2>{lab.title}</h2>
            <p className="muted">{lab.description}</p>
            <Link
              className={`button ${lab.status === "coming_soon" ? "secondary" : "primary"}`}
              href={lab.route ?? `/labs/${lab.id}`}
            >
              {lab.id === "lab-01" ? "Abrir laboratorio" : "Ver laboratorio"}
            </Link>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
