import { Download } from "lucide-react";
import { LAB01_WORKBOOK_FILENAME } from "../lib/constants";

export function FileDownloadCard() {
  return (
    <section className="card">
      <div className="eyebrow">Archivos de trabajo</div>
      <h2>Descargar pack de trabajo</h2>
      <p className="muted">
        El Excel tiene la base histórica, la hoja para tomar decisiones por SKU y un
        scoreboard para que el equipo explique su impacto.
      </p>
      <p className="muted">
        No modifiques columnas históricas ni nombres de hojas. La plataforma usará esta
        estructura para validar la entrega.
      </p>
      <a className="button primary" href={`/templates/${LAB01_WORKBOOK_FILENAME}`} download>
        <Download size={17} /> Descargar pack de trabajo
      </a>
    </section>
  );
}
