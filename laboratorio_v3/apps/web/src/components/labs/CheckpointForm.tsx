"use client";

import { useEffect, useMemo, useState } from "react";
import { Save, Send } from "lucide-react";
import { getLabRepository } from "../../lib/repositories/labRepository";
import type { Session, WorkbookUploadResult } from "../../lib/repositories/labRepository.types";
import { WorkbookUpload, type WorkbookUploadData, type WorkbookMetadata } from "./WorkbookUpload";

export type CheckpointField = {
  id: string;
  label: string;
  type: "text" | "textarea" | "select";
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
};

export type CheckpointFormProps = {
  exerciseId: string;
  exerciseVersion: number;
  fields: CheckpointField[];
  requiresWorkbookUpload?: boolean;
  enableWorkbookUpload?: boolean;
  saveLabel?: string;
  submitLabel?: string;
};

type Message = {
  type: "success" | "error" | "info";
  text: string;
};

export function CheckpointForm({
  exerciseId,
  exerciseVersion,
  fields,
  requiresWorkbookUpload = false,
  enableWorkbookUpload = false,
  saveLabel = "Guardar borrador",
  submitLabel = "Enviar checkpoint"
}: CheckpointFormProps) {
  const repo = getLabRepository();
  const isAmplify = useMemo(() => (process.env.NEXT_PUBLIC_DATA_MODE ?? "local") === "amplify", []);

  const [session, setSession] = useState<Session | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [workbookUpload, setWorkbookUpload] = useState<WorkbookUploadData | null>(null);
  const [existingWorkbookKey, setExistingWorkbookKey] = useState<string | null>(null);
  const [existingWorkbookMetadata, setExistingWorkbookMetadata] = useState<WorkbookMetadata | null>(null);
  const [workbookError, setWorkbookError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const currentSession = await repo.getSession();
      if (cancelled) return;
      setSession(currentSession);

      if (currentSession?.groupId) {
        const submission = await repo.getSubmission({
          groupId: currentSession.groupId,
          exerciseId,
          exerciseVersion
        });
        if (cancelled) return;

        if (submission?.responsesJson) {
          const initial: Record<string, string> = {};
          fields.forEach((field) => {
            const value = submission.responsesJson[field.id];
            initial[field.id] = typeof value === "string" ? value : "";
          });
          setValues(initial);
        }

        if (submission?.workbookUploadKey) {
          setExistingWorkbookKey(submission.workbookUploadKey);
        }

        if (submission?.filesJson) {
          const workbook = submission.filesJson.workbook;
          if (
            workbook &&
            typeof workbook === "object" &&
            "filename" in workbook &&
            "size" in workbook &&
            "type" in workbook &&
            "selectedAt" in workbook
          ) {
            setExistingWorkbookMetadata(workbook as WorkbookMetadata);
          }
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [exerciseId, exerciseVersion, fields, repo]);

  function updateValue(id: string, value: string) {
    setValues((current) => ({ ...current, [id]: value }));
    setErrors((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
  }

  function validate(): string[] {
    const missing: string[] = [];
    fields.forEach((field) => {
      if (field.required && !values[field.id]?.trim()) {
        missing.push(field.label);
      }
    });
    return missing;
  }

  function buildPayload() {
    const responsesJson: Record<string, string> = {};
    fields.forEach((field) => {
      responsesJson[field.id] = values[field.id] ?? "";
    });
    return responsesJson;
  }

  function buildFilesJson() {
    const metadata = workbookUpload?.metadata ?? existingWorkbookMetadata;
    return metadata ? { workbook: metadata } : {};
  }

  async function uploadIfNeeded(): Promise<WorkbookUploadResult | null> {
    if (!workbookUpload?.file) return null;
    if (!session?.groupId) return null;

    return repo.uploadWorkbook({
      file: workbookUpload.file,
      groupId: session.groupId,
      labId: "lab-01",
      exerciseId,
      exerciseVersion
    });
  }

  async function handleSave() {
    if (!session?.groupId) {
      setMessages([{ type: "error", text: "No hay sesión de grupo activa. Volvé a iniciar sesión." }]);
      return;
    }

    setLoading(true);
    setErrors(new Set());
    setMessages([]);

    try {
      const uploadResult = await uploadIfNeeded();
      const workbookKey = uploadResult?.key ?? existingWorkbookKey ?? undefined;

      await repo.saveSubmission({
        groupId: session.groupId,
        exerciseId,
        exerciseVersion,
        responsesJson: buildPayload(),
        filesJson: buildFilesJson(),
        workbookUploadKey: workbookKey,
        status: "draft"
      });

      if (workbookUpload && !uploadResult) {
        setMessages([{ type: "info", text: "Modo local: se guardó la metadata del archivo, no el archivo." }]);
      } else {
        setMessages([{ type: "info", text: "Checkpoint guardado como borrador." }]);
      }
    } catch (error) {
      setMessages([{ type: "error", text: `No se pudo guardar: ${String(error)}` }]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (!session?.groupId) {
      setMessages([{ type: "error", text: "No hay sesión de grupo activa. Volvé a iniciar sesión." }]);
      return;
    }

    const missing = validate();
    if (missing.length > 0) {
      const missingIds = new Set(
        fields.filter((field) => field.required && !values[field.id]?.trim()).map((field) => field.id)
      );
      setErrors(missingIds);
      setMessages([{ type: "error", text: `Faltan campos obligatorios: ${missing.join(", ")}` }]);
      return;
    }

    if (requiresWorkbookUpload && !workbookUpload && !existingWorkbookKey) {
      setWorkbookError(true);
      setMessages([{ type: "error", text: "Tenés que seleccionar un workbook .xlsx antes de enviar el checkpoint." }]);
      return;
    }

    setLoading(true);
    setErrors(new Set());
    setMessages([]);

    try {
      const uploadResult = await uploadIfNeeded();
      const workbookKey = uploadResult?.key ?? existingWorkbookKey ?? undefined;

      if (requiresWorkbookUpload && !workbookKey) {
        setWorkbookError(true);
        setMessages([{ type: "error", text: "No se pudo subir el workbook. Revisá el archivo e intentá de nuevo." }]);
        setLoading(false);
        return;
      }

      await repo.submitSubmission({
        groupId: session.groupId,
        exerciseId,
        exerciseVersion,
        responsesJson: buildPayload(),
        filesJson: buildFilesJson(),
        workbookUploadKey: workbookKey
      });

      if (workbookUpload && !uploadResult) {
        setMessages([
          { type: "success", text: "Checkpoint enviado." },
          { type: "info", text: "Modo local: se guardó la metadata del archivo, no el archivo." }
        ]);
      } else {
        setMessages([{ type: "success", text: "Checkpoint enviado correctamente." }]);
      }
    } catch (error) {
      setMessages([{ type: "error", text: `No se pudo enviar: ${String(error)}` }]);
    } finally {
      setLoading(false);
    }
  }

  if (!session) {
    return (
      <section className="card">
        <div className="eyebrow">Checkpoint</div>
        <h2>Sesión requerida</h2>
        <p className="muted">Iniciá sesión como grupo para guardar el checkpoint.</p>
      </section>
    );
  }

  if (session.role !== "group") {
    return (
      <section className="card">
        <div className="eyebrow">Checkpoint</div>
        <h2>Sesión de grupo requerida</h2>
        <p className="muted">
          El checkpoint está diseñado para grupos de alumnos. La sesión actual es de admin.
        </p>
      </section>
    );
  }

  return (
    <section className="card">
      <div className="eyebrow">Checkpoint</div>
      <h2>Guardá la síntesis del impacto</h2>
      <p className="muted">
        No copies toda la respuesta de la IA ni toda la tabla del Excel. Guardá la síntesis del resultado, la decisión estratégica y los riesgos que revisarías antes de ejecutar.
      </p>

      {messages.length > 0 ? (
        <div className="messageList" style={{ marginBottom: 16 }}>
          {messages.map((message, index) => (
            <div className={`message ${message.type}`} key={`${message.type}-${index}`}>
              {message.text}
            </div>
          ))}
        </div>
      ) : null}

      <div className="grid">
        {fields.map((field) => (
          <label className={`formField ${errors.has(field.id) ? "error" : ""}`} key={field.id}>
            <span className="formLabel">
              {field.label}
              {field.required ? <span style={{ color: "var(--danger)" }}> *</span> : null}
            </span>
            {field.type === "textarea" ? (
              <textarea
                onChange={(event) => updateValue(field.id, event.target.value)}
                placeholder={field.placeholder}
                value={values[field.id] ?? ""}
              />
            ) : field.type === "select" ? (
              <select
                onChange={(event) => updateValue(field.id, event.target.value)}
                value={values[field.id] ?? ""}
              >
                <option value="">{field.placeholder ?? "Seleccionar..."}</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                onChange={(event) => updateValue(field.id, event.target.value)}
                placeholder={field.placeholder}
                type="text"
                value={values[field.id] ?? ""}
              />
            )}
            {field.helperText ? <span className="helperText">{field.helperText}</span> : null}
            {errors.has(field.id) ? (
              <span className="errorText">Este campo es obligatorio.</span>
            ) : null}
          </label>
        ))}
      </div>

      {enableWorkbookUpload ? (
        <div style={{ marginTop: 16 }}>
          <WorkbookUpload
            error={workbookError}
            mode={isAmplify ? "amplify" : "local"}
            onChange={(data) => {
              setWorkbookUpload(data);
              setWorkbookError(false);
              if (data?.metadata) {
                setExistingWorkbookMetadata(null);
              }
            }}
            value={workbookUpload ?? (existingWorkbookMetadata ? { metadata: existingWorkbookMetadata } : null)}
          />
        </div>
      ) : null}

      <div className="buttonRow" style={{ marginTop: 16 }}>
        <button
          className="button secondary"
          disabled={loading}
          onClick={handleSave}
          type="button"
        >
          <Save size={17} /> {saveLabel}
        </button>
        <button
          className="button primary"
          disabled={loading}
          onClick={handleSubmit}
          type="button"
        >
          <Send size={17} /> {submitLabel}
        </button>
      </div>
    </section>
  );
}
