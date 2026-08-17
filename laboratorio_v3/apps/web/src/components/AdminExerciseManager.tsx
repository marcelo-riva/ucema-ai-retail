"use client";

import { useCallback, useEffect, useState } from "react";
import type { ExerciseMeta, ExerciseStatus } from "../lib/repositories/labRepository.types";
import { getLabRepository } from "../lib/repositories/labRepository";

export function AdminExerciseManager() {
  const [exercises, setExercises] = useState<ExerciseMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const isAmplify = process.env.NEXT_PUBLIC_DATA_MODE === "amplify";

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const repo = getLabRepository();
      const all = await repo.listExercises({ role: "admin" });
      setExercises(all.sort((a, b) => a.order - b.order));
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const seedExercises = useCallback(async () => {
    if (!isAmplify) return;
    try {
      setSeeding(true);
      setError(null);
      const { seedExerciseMeta } = await import("../lib/repositories/labRepository.amplify");
      await seedExerciseMeta();
      await load();
    } catch (err) {
      setError(String(err));
    } finally {
      setSeeding(false);
    }
  }, [isAmplify, load]);

  useEffect(() => {
    // En modo Amplify sincronizamos los metadatos automáticamente al abrir /admin.
    // Así no hace falta clicar "Regenerar ejercicios desde código" después de cada deploy.
    if (isAmplify) {
      seedExercises();
    } else {
      load();
    }
  }, [isAmplify, load, seedExercises]);

  async function changeStatus(exerciseId: string, status: ExerciseStatus) {
    try {
      const repo = getLabRepository();
      await repo.updateExerciseStatus({ exerciseId, status });
      setExercises((current) =>
        current.map((ex) => (ex.id === exerciseId ? { ...ex, status } : ex))
      );
    } catch (err) {
      setError(String(err));
    }
  }

  if (loading) {
    return <p className="muted">Cargando ejercicios...</p>;
  }

  if (error) {
    return <div className="message error">{error}</div>;
  }

  if (exercises.length === 0) {
    return (
      <div className="card">
        <p className="muted">No hay ejercicios cargados en el backend.</p>
        {isAmplify ? (
          <button
            className="button primary"
            disabled={seeding}
            onClick={seedExercises}
            type="button"
          >
            {seeding ? "Creando ejercicios..." : "Crear ejercicios iniciales"}
          </button>
        ) : (
          <p className="muted">En modo local los ejercicios se cargan desde la definición estática.</p>
        )}
      </div>
    );
  }

  const grouped = exercises.reduce<Record<string, ExerciseMeta[]>>((acc, exercise) => {
    const key = exercise.labId ?? "sin-lab";
    if (!acc[key]) acc[key] = [];
    acc[key].push(exercise);
    return acc;
  }, {});

  return (
    <div>
      {isAmplify ? (
        <div className="card" style={{ marginBottom: 22 }}>
          <div className="eyebrow">Sincronización con backend</div>
          <h2>Regenerar ejercicios</h2>
          <p className="muted">
            Si agregaste o modificaste ejercicios en el código, hacé clic para sincronizar los metadatos en Amplify Data con la definición local. Esto crea los que faltan, actualiza los existentes y elimina los obsoletos.
          </p>
          <button
            className="button primary"
            disabled={seeding}
            onClick={seedExercises}
            type="button"
          >
            {seeding ? "Sincronizando..." : "Regenerar ejercicios desde código"}
          </button>
        </div>
      ) : null}

      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>Lab</th>
              <th>ID</th>
              <th>Título</th>
              <th>Path</th>
              <th>Versión</th>
              <th>Status</th>
              <th>Acciones</th>
            </tr>
          </thead>
        <tbody>
          {Object.entries(grouped).map(([labId, labExercises]) => (
            labExercises.map((exercise, index) => (
              <tr key={exercise.id}>
                {index === 0 ? (
                  <td rowSpan={labExercises.length} style={{ verticalAlign: "top", fontWeight: 600 }}>
                    {labId}
                  </td>
                ) : null}
                <td>{exercise.id}</td>
                <td>{exercise.title}</td>
                <td>{exercise.path}</td>
                <td>v{exercise.version}</td>
                <td>
                  <span className={`statusPill ${exercise.status}`}>{exercise.status}</span>
                </td>
                <td>
                  <div className="buttonRow" style={{ margin: 0 }}>
                    <button
                      className={`button small ${exercise.status === "draft" ? "primary" : "secondary"}`}
                      disabled={exercise.status === "draft"}
                      onClick={() => changeStatus(exercise.id, "draft")}
                      type="button"
                    >
                      Draft
                    </button>
                    <button
                      className={`button small ${exercise.status === "active" ? "primary" : "secondary"}`}
                      disabled={exercise.status === "active"}
                      onClick={() => changeStatus(exercise.id, "active")}
                      type="button"
                    >
                      Active
                    </button>
                    <button
                      className={`button small ${exercise.status === "archived" ? "primary" : "secondary"}`}
                      disabled={exercise.status === "archived"}
                      onClick={() => changeStatus(exercise.id, "archived")}
                      type="button"
                    >
                      Archived
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
}
