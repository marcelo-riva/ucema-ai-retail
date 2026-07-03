import Link from "next/link";
import { AppShell } from "../components/AppShell";

export default function HomePage() {
  return (
    <AppShell>
      <header className="topbar">
        <div>
          <div className="eyebrow">NEXUS Retail Labs</div>
          <h1>AI Revenue & Inventory Copilot</h1>
          <p className="lead">
            Experiencia de laboratorios para practicar decisiones de negocio con IA personal.
          </p>
        </div>
      </header>

      <section className="card">
        <h2>Empezar revisión</h2>
        <p className="muted">
          Ingresá con un grupo de prueba para recorrer el laboratorio. La plataforma guía
          el análisis, registra la síntesis del equipo y mantiene el workbook como fuente de verdad.
        </p>
        <div className="buttonRow">
          <Link className="button primary" href="/login" prefetch={false}>
            Ir a login
          </Link>
          <Link className="button secondary" href="/labs" prefetch={false}>
            Ver laboratorios
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
