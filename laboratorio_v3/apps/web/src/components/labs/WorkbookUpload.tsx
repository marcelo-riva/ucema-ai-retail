"use client";

import { useState } from "react";
import { FileSpreadsheet, X } from "lucide-react";

export type WorkbookMetadata = {
  filename: string;
  size: number;
  type: string;
  selectedAt: string;
};

export type WorkbookUploadProps = {
  value?: WorkbookMetadata | null;
  onChange: (metadata: WorkbookMetadata | null) => void;
  error?: boolean;
};

export function WorkbookUpload({ value, onChange, error }: WorkbookUploadProps) {
  const [localError, setLocalError] = useState<string | null>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validación de extensión .xlsx
    if (!file.name.toLowerCase().endsWith(".xlsx")) {
      setLocalError("El archivo debe ser un workbook de Excel (.xlsx).");
      onChange(null);
      return;
    }

    setLocalError(null);
    onChange({
      filename: file.name,
      size: file.size,
      type: file.type,
      selectedAt: new Date().toISOString()
    });
  }

  function clearSelection() {
    setLocalError(null);
    onChange(null);
  }

  return (
    <div className={`dropBox ${error ? "error" : ""}`} style={{ flexDirection: "column", alignItems: "stretch", gap: 10 }}>
      {value ? (
        <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <FileSpreadsheet size={22} style={{ color: "var(--success)" }} />
            <div>
              <strong style={{ display: "block" }}>Workbook seleccionado</strong>
              <span className="muted">
                {value.filename} · {(value.size / 1024).toFixed(1)} KB
              </span>
            </div>
          </div>
          <button
            aria-label="Cambiar workbook"
            className="iconButton"
            onClick={clearSelection}
            type="button"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <FileSpreadsheet size={22} />
          <span>
            <strong>Seleccionar workbook .xlsx</strong>
            <br />
            <span className="muted">Solo se guarda metadata en modo local.</span>
            {/* TODO: en producción con Amplify, subir el archivo a Storage y guardar workbookUploadKey en filesJson. */}
          </span>
          <input
            accept=".xlsx"
            onChange={handleFileChange}
            style={{ display: "none" }}
            type="file"
          />
        </label>
      )}

      {localError ? (
        <div className="message error" style={{ margin: 0 }}>
          {localError}
        </div>
      ) : null}

      {value ? (
        <p className="muted" style={{ margin: 0, fontSize: 12 }}>
          Workbook seleccionado previamente: {value.filename}
        </p>
      ) : null}
    </div>
  );
}
