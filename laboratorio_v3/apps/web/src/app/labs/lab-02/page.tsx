import Link from "next/link";
import { AppShell } from "../../../components/AppShell";

export default function Lab02Page() {
  return (
    <AppShell>
      <header className="topbar">
        <div>
          <div className="eyebrow">Laboratorio 2</div>
          <h1>Laboratorio 2 — Customer Profitability Copilot</h1>
          <p className="lead">Segmentación, CLV, churn, estrategia VIP y ROI promocional.</p>
        </div>
      </header>

      <section className="card">
        <div className="statusPill locked">Próximamente</div>
        <h2>Overview / Próximamente</h2>
        <p className="muted">
          Este laboratorio queda reservado como mock simple. No hay ejercicios disponibles todavía.
        </p>
        <Link className="button secondary" href="/labs">
          Volver a Laboratorios
        </Link>
      </section>
    </AppShell>
  );
}
