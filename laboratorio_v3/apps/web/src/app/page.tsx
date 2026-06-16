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
            Experiencia mock para revisar laboratorios, ejercicios y workbook de trabajo.
          </p>
        </div>
      </header>

      <section className="card">
        <h2>Empezar revisión</h2>
        <p className="muted">
          Ingresá con un grupo de prueba para recorrer el laboratorio. La plataforma usa
          datos mock y guarda el avance localmente en este navegador.
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
