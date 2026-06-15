import Link from "next/link";
import { ArrowRight, LockKeyhole } from "lucide-react";
import type { Lab } from "../types/lab";

export function LabCard({ lab }: { lab: Lab }) {
  const isAvailable = lab.status === "available";

  return (
    <article className="card">
      <div className={`statusPill ${lab.status}`}>{lab.status}</div>
      <h2 style={{ marginTop: 18 }}>{lab.title}</h2>
      <p className="muted">{lab.description}</p>

      {isAvailable ? (
        <Link className="button primary" href="/labs/lab-01/exercises/ex-01">
          Abrir laboratorio <ArrowRight size={17} />
        </Link>
      ) : (
        <button className="button secondary" disabled type="button">
          <LockKeyhole size={17} /> Bloqueado
        </button>
      )}
    </article>
  );
}
