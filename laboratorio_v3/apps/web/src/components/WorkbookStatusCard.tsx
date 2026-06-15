export function WorkbookStatusCard({ stateVersion, lastWorkbookName }: { stateVersion: string; lastWorkbookName?: string | null }) {
  return (
    <section className="panel">
      <div className="eyebrow">Memoria del laboratorio</div>
      <h3>El workbook sostiene el recorrido</h3>
      <p className="muted">
        La plataforma acompaña; el workbook sostiene el ejercicio. Subir checkpoints
        permite actualizar el dashboard, pero el recorrido vive en el workbook.
      </p>
      <div className="statusPill info">Estado: {stateVersion}</div>
      <p className="muted" style={{ marginTop: 10, marginBottom: 0 }}>
        Último workbook: {lastWorkbookName ?? "sin checkpoint subido"}
      </p>
    </section>
  );
}
