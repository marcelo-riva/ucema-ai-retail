import type { Submission } from "../types/lab";

export function AdminSubmissionTable({ submissions }: { submissions: Submission[] }) {
  if (submissions.length === 0) {
    return (
      <section className="card">
        <h2>Entregas</h2>
        <p className="muted">Todavía no hay entregas guardadas en este navegador.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>Entregas</h2>
      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>Grupo</th>
              <th>Ejercicio</th>
              <th>Estado</th>
              <th>Excel</th>
              <th>Reporte</th>
              <th>Actualizado</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.id}>
                <td>{submission.groupId}</td>
                <td>{submission.exerciseId}</td>
                <td>
                  <span className={`statusPill ${submission.status}`}>{submission.status}</span>
                </td>
                <td>{submission.uploadedExcelName ?? "-"}</td>
                <td>{submission.uploadedReportName ?? "-"}</td>
                <td>{new Date(submission.updatedAt).toLocaleString("es-AR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
