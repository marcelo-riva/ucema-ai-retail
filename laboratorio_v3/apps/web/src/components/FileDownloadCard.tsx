import { Download } from "lucide-react";
import { LAB01_WORKBOOK_FILENAME } from "../lib/constants";

export function FileDownloadCard() {
  return (
    <section className="card">
      <div className="eyebrow">Archivos de trabajo</div>
      <h2>Descargar workbook del Laboratorio 1</h2>
      <p className="muted">
        Este es el archivo de trabajo para todo el laboratorio. Lo vas a completar
        por etapas: exploración, portfolio, pricing, forecast, inventario y plan final.
      </p>
      <p className="muted">
        No modifiques `01_BASE_SKUS` ni los nombres de hojas. La plataforma puede pedir
        checkpoints, pero el recorrido vive en el workbook.
      </p>
      <a className="button primary" href={`/templates/${LAB01_WORKBOOK_FILENAME}`} download>
        <Download size={17} /> Descargar workbook del Laboratorio 1
      </a>
    </section>
  );
}
