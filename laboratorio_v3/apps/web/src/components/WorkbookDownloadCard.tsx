import { Download } from "lucide-react";
import { LAB01_WORKBOOK_FILENAME } from "../lib/constants";

export function WorkbookDownloadCard() {
  return (
    <section className="card">
      <div className="eyebrow">Workbook del Laboratorio 1</div>
      <h2>Descargar workbook del Laboratorio 1</h2>
      <p className="muted">
        Este es el archivo de trabajo para todo el laboratorio. Vas a completarlo por
        etapas. Cada ejercicio trabaja sobre una o varias hojas del mismo workbook.
      </p>
      <p className="muted">
        La plataforma puede pedirte subir checkpoints para actualizar dashboards, pero si
        la plataforma falla podés continuar el recorrido directamente desde el Excel con
        tu AI personal.
      </p>
      <a className="button primary" href={`/templates/${LAB01_WORKBOOK_FILENAME}`} download>
        <Download size={17} /> Descargar workbook del Laboratorio 1
      </a>
    </section>
  );
}
