import type { Submission } from "../types/lab";

export function SubmissionStatus({ submission }: { submission: Submission | null }) {
  if (!submission) {
    return (
      <section className="panel">
        <div className="statusPill warning">Sin entrega</div>
        <p className="muted" style={{ marginBottom: 0, marginTop: 10 }}>
          Todavía no hay borrador ni envío para este grupo.
        </p>
      </section>
    );
  }

  return (
    <section className="panel">
      <div className={`statusPill ${submission.status}`}>{submission.status}</div>
      <p className="muted" style={{ marginBottom: 0, marginTop: 10 }}>
        Versión {submission.version} · Actualizado {new Date(submission.updatedAt).toLocaleString("es-AR")}
      </p>
      {submission.validationMessages.length > 0 ? (
        <div className="messageList" style={{ marginTop: 14 }}>
          {submission.validationMessages.map((message, index) => (
            <div className={`message ${message.type}`} key={`${message.type}-${index}`}>
              {message.message}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
