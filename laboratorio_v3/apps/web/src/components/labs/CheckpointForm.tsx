"use client";

import { useEffect, useState } from "react";
import { Save, Send } from "lucide-react";
import { getLabRepository } from "../../lib/repositories/labRepository";
import type { Session } from "../../lib/repositories/labRepository.types";
import { WorkbookUpload, type WorkbookMetadata } from "./WorkbookUpload";

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
  saveLabel = "Guardar checkpoint",
  submitLabel = "Subir checkpoint"
}: CheckpointFormProps) {
  const repo = getLabRepository();
  const [session, setSession] = useState<Session | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [workbookMetadata, setWorkbookMetadata] = useState<WorkbookMetadata | null>(null);
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
            setWorkbookMetadata(workbook as WorkbookMetadata);
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
    return { workbook: workbookMetadata };
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
      await repo.saveSubmission({
        groupId: session.groupId,
        exerciseId,
        exerciseVersion,
        responsesJson: buildPayload(),
        filesJson: buildFilesJson(),
        status: "draft"
      });
      setMessages([{ type: "info", text: "Checkpoint guardado como borrador local." }]);
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

    if (requiresWorkbookUpload && !workbookMetadata) {
      setWorkbookError(true);
      setMessages([{ type: "error", text: "Tenés que seleccionar un workbook .xlsx antes de enviar el checkpoint." }]);
      return;
    }

    setLoading(true);
    setErrors(new Set());
    setMessages([]);

    try {
      await repo.submitSubmission({
        groupId: session.groupId,
        exerciseId,
        exerciseVersion,
        responsesJson: buildPayload(),
        filesJson: buildFilesJson()
      });
      setMessages([{ type: "success", text: "Checkpoint enviado correctamente." }]);
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

      {requiresWorkbookUpload ? (
        <p className="muted" style={{ marginTop: 8, marginBottom: 16 }}>
          El envío del checkpoint requiere seleccionar el workbook actualizado en formato .xlsx.
        </p>
      ) : null}

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

      <div style={{ marginTop: 16 }}>
        <WorkbookUpload
          error={workbookError}
          onChange={(metadata) => {
            setWorkbookMetadata(metadata);
            setWorkbookError(false);
          }}
          value={workbookMetadata}
        />
      </div>

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
