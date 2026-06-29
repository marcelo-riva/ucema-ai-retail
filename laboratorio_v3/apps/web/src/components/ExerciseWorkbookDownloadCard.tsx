import { Download } from "lucide-react";
import { LAB01_EXERCISE_WORKBOOKS } from "../lib/constants";
import type { Lab01ExerciseId } from "../lib/lab01Content";

export function ExerciseWorkbookDownloadCard({ exerciseId }: { exerciseId: Lab01ExerciseId }) {
  const filename = LAB01_EXERCISE_WORKBOOKS[exerciseId];
  if (!filename) return null;

  return (
    <section className="card" style={{ background: "rgba(15, 107, 93, 0.06)", borderColor: "var(--brand)" }}>
      <div className="eyebrow" style={{ color: "var(--brand-strong)" }}>Workbook del ejercicio</div>
      <h2>Descargar workbook de este ejercicio</h2>
      <p className="muted">
        Este archivo es el punto de partida para el ejercicio. Trabajalo con tu IA personal y guardá la síntesis en la plataforma.
      </p>
      <p className="muted">
        La plataforma acompaña con checkpoints, pero el recorrido numérico vive en el workbook.
      </p>
      <a className="button primary" href={`/templates/${filename}`} download>
        <Download size={17} /> Descargar workbook
      </a>
    </section>
  );
}
