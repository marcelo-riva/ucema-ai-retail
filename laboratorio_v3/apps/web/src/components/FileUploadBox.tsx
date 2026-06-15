import { FileSpreadsheet, FileText } from "lucide-react";

export function FileUploadBox({
  excelName,
  reportName,
  onExcelChange,
  onReportChange
}: {
  excelName?: string;
  reportName?: string;
  onExcelChange: (fileName?: string) => void;
  onReportChange: (fileName?: string) => void;
}) {
  return (
    <section className="card">
      <div className="eyebrow">Carga simulada</div>
      <h2>Qué archivo tenés que subir</h2>
      <div className="grid two">
        <label className="dropBox">
          <span>
            <strong><FileSpreadsheet size={17} /> Excel completado obligatorio</strong>
            <br />
            <span className="muted">{excelName ?? "Debe ser .xlsx"}</span>
          </span>
          <input
            accept=".xlsx"
            onChange={(event) => onExcelChange(event.target.files?.[0]?.name)}
            type="file"
          />
        </label>

        <label className="dropBox">
          <span>
            <strong><FileText size={17} /> Reporte AI opcional</strong>
            <br />
            <span className="muted">{reportName ?? "PDF, DOCX o texto exportado"}</span>
          </span>
          <input onChange={(event) => onReportChange(event.target.files?.[0]?.name)} type="file" />
        </label>
      </div>
    </section>
  );
}
