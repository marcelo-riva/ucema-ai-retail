import type { Exercise, Group } from "../types/lab";

export function ExerciseHeader({
  exercise,
  groupName,
  stateVersion,
  submissionStatus
}: {
  exercise: Exercise;
  groupName: Group["name"];
  stateVersion: string;
  submissionStatus: string;
}) {
  return (
    <header className="caseHeader">
      <div>
        <div className="eyebrow">Laboratorio 1 / Ejercicio 1</div>
        <h1>Ejercicio 1: Decidir qué portfolio sostener</h1>
        <p className="lead">
          Nexus Retail tiene demasiados productos activos. Tu equipo debe identificar
          qué productos mantener, revisar o retirar durante los próximos 90 días.
        </p>
      </div>
      <div className="caseMeta">
        <div>
          <span>Grupo</span>
          <strong>{groupName}</strong>
        </div>
        <div>
          <span>Base</span>
          <strong>state_{stateVersion}</strong>
        </div>
        <div>
          <span>Horizonte</span>
          <strong>90 días</strong>
        </div>
        <div>
          <span>Estado</span>
          <strong>{submissionStatus}</strong>
        </div>
      </div>
    </header>
  );
}
