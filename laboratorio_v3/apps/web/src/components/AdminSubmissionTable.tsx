"use client";

import { useState } from "react";
import type { Submission } from "../lib/repositories/labRepository.types";
import { getLabRepository } from "../lib/repositories/labRepository";

export function AdminSubmissionTable({ submissions, onRefresh }: { submissions: Submission[]; onRefresh?: () => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [resettingId, setResettingId] = useState<string | null>(null);

  if (submissions.length === 0) {
    return (
      <section className="card">
        <h2>Submissions / respuestas</h2>
        <p className="muted">Todavía no hay entregas guardadas.</p>
      </section>
    );
  }

  async function resetSubmission(groupId: string, exerciseId: string, exerciseVersion: number) {
    const id = `${groupId}:${exerciseId}:v${exerciseVersion}`;
    setResettingId(id);
    try {
      const repo = getLabRepository();
      await repo.resetSubmission({ groupId, exerciseId, exerciseVersion });
      onRefresh?.();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error al resetear submission:", error);
    } finally {
      setResettingId(null);
    }
  }

  return (
    <section className="card">
      <h2>Submissions / respuestas</h2>
      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>Grupo</th>
              <th>Ejercicio</th>
              <th>Versión</th>
              <th>Estado</th>
              <th>Actualizado</th>
              <th>Enviado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => {
              const id = `${submission.groupId}:${submission.exerciseId}:v${submission.exerciseVersion}`;
              return (
                <tr key={id}>
                  <td>{submission.groupId}</td>
                  <td>{submission.exerciseId}</td>
                  <td>v{submission.exerciseVersion}</td>
                  <td>
                    <span className={`statusPill ${submission.status}`}>{submission.status}</span>
                  </td>
                  <td>{new Date(submission.updatedAt).toLocaleString("es-AR")}</td>
                  <td>{submission.submittedAt ? new Date(submission.submittedAt).toLocaleString("es-AR") : "-"}</td>
                  <td>
                    <div className="buttonRow" style={{ margin: 0 }}>
                      <button
                        className="button small secondary"
                        onClick={() => setExpandedId(expandedId === id ? null : id)}
                        type="button"
                      >
                        {expandedId === id ? "Ocultar JSON" : "Ver JSON"}
                      </button>
                      <button
                        className="button small secondary"
                        disabled={resettingId === id}
                        onClick={() => resetSubmission(submission.groupId, submission.exerciseId, submission.exerciseVersion)}
                        type="button"
                      >
                        {resettingId === id ? "Reseteando..." : "Reset"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {expandedId ? (
        <div className="panel" style={{ marginTop: 16 }}>
          <strong>responsesJson</strong>
          <pre style={{ marginTop: 8, overflow: "auto", maxHeight: 400 }}>
            {JSON.stringify(
              submissions.find(
                (s) => `${s.groupId}:${s.exerciseId}:v${s.exerciseVersion}` === expandedId
              )?.responsesJson,
              null,
              2
            )}
          </pre>
        </div>
      ) : null}
    </section>
  );
}
