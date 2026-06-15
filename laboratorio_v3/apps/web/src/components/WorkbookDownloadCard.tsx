import { Download } from "lucide-react";
import { LAB01_WORKBOOK_FILENAME } from "../lib/constants";

export function WorkbookDownloadCard({ compact = false }: { compact?: boolean }) {
  return (
    <section className="card">
      <div className="eyebrow">Workbook del Laboratorio 1</div>
      <h2>{compact ? "Workbook del Laboratorio 1" : "Descargar workbook del Laboratorio 1"}</h2>
      <p className="muted">
        {compact
          ? "El workbook es la memoria del laboratorio. Cada ejercicio completa una parte del mismo archivo."
          : "Este es el archivo de trabajo para todo el laboratorio. Vas a completarlo por etapas. Cada ejercicio trabaja sobre una o varias hojas del mismo workbook."}
      </p>
      <p className="muted">
        La plataforma acompaña con checkpoints y dashboards, pero el recorrido puede
        hacerse desde el Excel.
      </p>
      <a className="button primary" href={`/templates/${LAB01_WORKBOOK_FILENAME}`} download>
        <Download size={17} /> {compact ? "Descargar workbook" : "Descargar workbook del Laboratorio 1"}
      </a>
    </section>
  );
}
