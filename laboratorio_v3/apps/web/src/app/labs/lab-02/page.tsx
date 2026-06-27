"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "../../../components/AppShell";
import { ExerciseProgressNav } from "../../../components/ExerciseProgressNav";
import type { ExerciseMeta, Session } from "../../../lib/repositories/labRepository.types";
import { getLabRepository } from "../../../lib/repositories/labRepository";

export default function Lab02Page() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [exercises, setExercises] = useState<ExerciseMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const currentSession = await getLabRepository().getSession();
      if (!currentSession) {
        router.push("/login");
        return;
      }

      setSession(currentSession);

      const allExercises = await getLabRepository().listExercises({
        role: currentSession.role
      });
      const lab02Exercises = allExercises
        .filter((exercise) => exercise.labId === "lab-02")
        .sort((a, b) => a.order - b.order);

      const visible =
        currentSession.role === "admin"
          ? lab02Exercises
          : lab02Exercises.filter((exercise) => exercise.status === "active");

      setExercises(visible);
      setLoading(false);
    }

    load();
  }, [router]);

  return (
    <AppShell>
      <header className="topbar">
        <div>
          <div className="eyebrow">Laboratorio 2</div>
          <h1>Laboratorio 2 — Customer Profitability Copilot</h1>
          <p className="lead">
            Maximizar el valor económico de la base de clientes mediante CLV, churn reduction,
            couponing inteligente, incremento de ticket e incremento de frecuencia.
          </p>
        </div>
        <div className="panel">
          <div className="muted">Sesión activa</div>
          <h3>{session?.username ?? "Cargando..."}</h3>
        </div>
      </header>

      <section className="card">
        <div className="eyebrow">Descripción</div>
        <p className="muted">
          En este laboratorio, el equipo trabaja sobre una base de clientes para identificar segmentos
          de valor, diseñar estrategias diferenciales por segmento y consolidar el impacto económico
          de las decisiones promocionales.
        </p>
      </section>

      {loading ? (
        <section className="card">
          <p className="muted">Cargando ejercicios...</p>
        </section>
      ) : (
        <ExerciseProgressNav items={exercises} role={session?.role ?? "group"} />
      )}
    </AppShell>
  );
}
