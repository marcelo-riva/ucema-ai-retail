"use client";

import { useState } from "react";
import { ArrowRight, Save, Send } from "lucide-react";
import type { LabCheckpoint } from "../types/lab";

export function ExerciseCheckpointForm({
  title,
  checkpoint,
  fieldLabels,
  requiredFields,
  confirmations,
  onSave,
  onSubmit,
  onContinue,
  hideUploads = false,
  hideReportUpload = false,
  introText,
  saveLabel = "Guardar checkpoint",
  showSubmit = true,
  continueLabel = "Continuar",
  skipWorkbookValidation = false
}: {
  title: string;
  checkpoint: LabCheckpoint | null;
  fieldLabels: Array<{ key: string; label: string; placeholder: string }>;
  requiredFields: string[];
  confirmations: Array<{ key: string; label: string; optional?: boolean }>;
  onSave: (payload: { fields: Record<string, string>; confirmations: Record<string, boolean>; workbookName?: string; reportName?: string }) => Promise<void>;
  onSubmit: (payload: { fields: Record<string, string>; confirmations: Record<string, boolean>; workbookName?: string; reportName?: string; requiredFields: string[]; requiredConfirmations: string[]; skipWorkbookValidation?: boolean }) => Promise<void>;
  onContinue?: () => void;
  hideUploads?: boolean;
  hideReportUpload?: boolean;
  introText?: string;
  saveLabel?: string;
  showSubmit?: boolean;
  continueLabel?: string;
  skipWorkbookValidation?: boolean;
}) {
  const [fields, setFields] = useState<Record<string, string>>(checkpoint?.fields ?? {});
  const [checks, setChecks] = useState<Record<string, boolean>>(checkpoint?.confirmations ?? {});
  const [workbookName, setWorkbookName] = useState<string | undefined>(checkpoint?.workbookName);
  const [reportName, setReportName] = useState<string | undefined>(checkpoint?.reportName);

  const requiredConfirmations = confirmations.filter((item) => !item.optional).map((item) => item.key);

  async function handleContinue() {
    await onSubmit({ fields, confirmations: checks, workbookName, reportName, requiredFields, requiredConfirmations, skipWorkbookValidation });
    onContinue?.();
  }

  return (
    <section className="card">
      <div className="eyebrow">Checkpoint</div>
      <h2>{title}</h2>
      <p className="muted">
        {introText ?? "Subí tu workbook actualizado del Laboratorio 1 para registrar el checkpoint. Si la plataforma falla, continuá trabajando en el Excel."}
      </p>
      <div className="grid">
        {fieldLabels.map((field) => (
          <label className="formField" key={field.key}>
            <span className="formLabel">{field.label}</span>
            <textarea
              onChange={(event) => setFields((current) => ({ ...current, [field.key]: event.target.value }))}
              placeholder={field.placeholder}
              value={fields[field.key] ?? ""}
            />
          </label>
        ))}
      </div>
      {hideUploads ? null : (
        <div className={`grid ${hideReportUpload ? "" : "two"}`} style={{ marginTop: 16 }}>
          <label className="dropBox">
            <span>
              <strong>Workbook actualizado</strong>
              <br />
              <span className="muted">{workbookName ?? "Debe ser .xlsx"}</span>
            </span>
            <input accept=".xlsx" onChange={(event) => setWorkbookName(event.target.files?.[0]?.name)} type="file" />
          </label>
          {hideReportUpload ? null : (
            <label className="dropBox">
              <span>
                <strong>Reporte AI opcional</strong>
                <br />
                <span className="muted">{reportName ?? "Opcional"}</span>
              </span>
              <input onChange={(event) => setReportName(event.target.files?.[0]?.name)} type="file" />
            </label>
          )}
        </div>
      )}
      <div className="checkList" style={{ marginTop: 16 }}>
        {confirmations.map((confirmation) => (
          <label className={`checkItem ${confirmation.optional ? "optionalCheck" : ""}`} key={confirmation.key}>
            <input
              checked={Boolean(checks[confirmation.key])}
              onChange={(event) => setChecks((current) => ({ ...current, [confirmation.key]: event.target.checked }))}
              type="checkbox"
            />
            <span>{confirmation.optional ? "Opcional: " : ""}{confirmation.label}</span>
          </label>
        ))}
      </div>
      {checkpoint?.validationMessages?.length ? (
        <div className="messageList" style={{ marginTop: 14 }}>
          {checkpoint.validationMessages.map((message, index) => (
            <div className={`message ${message.type}`} key={`${message.type}-${index}`}>{message.message}</div>
          ))}
        </div>
      ) : null}
      <div className="buttonRow" style={{ marginTop: 16 }}>
        <button className="button secondary" onClick={() => onSave({ fields, confirmations: checks, workbookName, reportName })} type="button">
          <Save size={17} /> {saveLabel}
        </button>
        {showSubmit ? (
          <button
            className="button primary"
            onClick={() => onSubmit({ fields, confirmations: checks, workbookName, reportName, requiredFields, requiredConfirmations })}
            type="button"
          >
            <Send size={17} /> Subir checkpoint del workbook
          </button>
        ) : null}
        {onContinue ? (
          <button className="button primary" onClick={handleContinue} type="button">
            <ArrowRight size={17} /> {continueLabel}
          </button>
        ) : null}
      </div>
    </section>
  );
}
