"use client";

import { useState } from "react";
import { FileSpreadsheet, X } from "lucide-react";

export type WorkbookMetadata = {
  filename: string;
  size: number;
  type: string;
  selectedAt: string;
};

export type WorkbookUploadData = {
  metadata: WorkbookMetadata;
  file?: File;
};

export type WorkbookUploadProps = {
  value?: WorkbookUploadData | null;
  onChange: (data: WorkbookUploadData | null) => void;
  error?: boolean;
  mode?: "local" | "amplify";
};

const MAX_WORKBOOK_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

export function WorkbookUpload({ value, onChange, error, mode = "local" }: WorkbookUploadProps) {
  const [localError, setLocalError] = useState<string | null>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".xlsx")) {
      setLocalError("El archivo debe ser un workbook de Excel (.xlsx).");
      onChange(null);
      return;
    }

    if (file.size === 0) {
      setLocalError("El archivo está vacío.");
      onChange(null);
      return;
    }

    if (file.size > MAX_WORKBOOK_SIZE_BYTES) {
      setLocalError("El archivo excede el límite de 50 MB.");
      onChange(null);
      return;
    }

    setLocalError(null);
    onChange({
      file,
      metadata: {
        filename: file.name,
        size: file.size,
        type: file.type,
        selectedAt: new Date().toISOString()
      }
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
                {value.metadata.filename} · {(value.metadata.size / 1024).toFixed(1)} KB
              </span>
              {mode === "local" ? (
                <span className="muted" style={{ display: "block", fontSize: 12, marginTop: 4 }}>
                  Modo local: se guardará la metadata, no el archivo.
                </span>
              ) : null}
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
            <span className="muted">
              {mode === "local"
                ? "Modo local: se guarda sólo la metadata del archivo."
                : "Modo Amplify: el archivo se subirá a Storage."}
            </span>
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
          Workbook seleccionado previamente: {value.metadata.filename}
        </p>
      ) : null}
    </div>
  );
}
