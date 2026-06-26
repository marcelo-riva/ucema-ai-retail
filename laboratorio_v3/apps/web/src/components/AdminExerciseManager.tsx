"use client";

import { useEffect, useState } from "react";
import type { ExerciseMeta, ExerciseStatus } from "../lib/repositories/labRepository.types";
import { getLabRepository } from "../lib/repositories/labRepository";

export function AdminExerciseManager() {
  const [exercises, setExercises] = useState<ExerciseMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const isAmplify = process.env.NEXT_PUBLIC_DATA_MODE === "amplify";

  async function load() {
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
  }

  useEffect(() => {
    load();
  }, []);

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

  async function seedExercises() {
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

  return (
    <div className="tableWrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Path</th>
            <th>Versión</th>
            <th>Status</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {exercises.map((exercise) => (
            <tr key={exercise.id}>
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
