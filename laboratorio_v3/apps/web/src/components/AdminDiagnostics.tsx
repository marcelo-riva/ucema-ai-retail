"use client";

import { useEffect, useState } from "react";
import { getLabRepository, localLabRepository, amplifyLabRepository } from "../lib/repositories/labRepository";
import type { ExerciseMeta, Submission } from "../lib/repositories/labRepository.types";

export function AdminDiagnostics() {
  const [dataMode, setDataMode] = useState<string>("local (default)");
  const [exerciseCount, setExerciseCount] = useState<number | null>(null);
  const [submissionCount, setSubmissionCount] = useState<number | null>(null);
  const [activeRepo, setActiveRepo] = useState<string>("unknown");
  const [amplifyStatus, setAmplifyStatus] = useState<string>("unknown");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const mode = process.env.NEXT_PUBLIC_DATA_MODE ?? "local";
        setDataMode(mode === "local" ? "local (default)" : mode);

        const repo = getLabRepository();
        const isLocal = repo === localLabRepository;
        const isAmplify = repo === amplifyLabRepository;
        setActiveRepo(isLocal ? "local" : isAmplify ? "amplify" : "other");
        setAmplifyStatus(isAmplify ? "scaffold (Storage implemented, Data/Auth stub)" : "not active");

        const exercises = await repo.listExercises({ role: "admin" });
        setExerciseCount(exercises.length);

        const submissions = await repo.listSubmissions();
        setSubmissionCount(submissions.length);
      } catch (err) {
        setError(String(err));
      }
    }
    load();
  }, []);

  return (
    <section className="card">
      <div className="eyebrow">Diagnóstico técnico</div>
      <h2>Estado de la capa de persistencia</h2>

      {error ? <div className="message error" style={{ marginBottom: 12 }}>{error}</div> : null}

      <div className="grid two">
        <div className="panel">
          <strong>NEXT_PUBLIC_DATA_MODE</strong>
          <p className="muted" style={{ margin: "6px 0 0" }}>{dataMode}</p>
        </div>
        <div className="panel">
          <strong>Repository activo</strong>
          <p className="muted" style={{ margin: "6px 0 0" }}>{activeRepo}</p>
        </div>
        <div className="panel">
          <strong>Amplify repository</strong>
          <p className="muted" style={{ margin: "6px 0 0" }}>{amplifyStatus}</p>
        </div>
        <div className="panel">
          <strong>Ejercicios cargados</strong>
          <p className="muted" style={{ margin: "6px 0 0" }}>{exerciseCount ?? "Cargando..."}</p>
        </div>
        <div className="panel">
          <strong>Submissions cargadas</strong>
          <p className="muted" style={{ margin: "6px 0 0" }}>{submissionCount ?? "Cargando..."}</p>
        </div>
      </div>
    </section>
  );
}
