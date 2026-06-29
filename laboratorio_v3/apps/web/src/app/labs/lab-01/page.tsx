"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "../../../components/AppShell";
import { ExerciseProgressNav } from "../../../components/ExerciseProgressNav";
import { WorkbookStatusCard } from "../../../components/WorkbookStatusCard";
import type { Group, SystemScoreboard } from "../../../types/lab";
import type { ExerciseMeta, Session } from "../../../lib/repositories/labRepository.types";
import { getLabRepository } from "../../../lib/repositories/labRepository";
import {
  getCurrentGroup,
  getLab01DemoMode,
  getLab01State,
  getSystemScoreboard,
  setLab01DemoMode
} from "../../../services/mockLabService";

export default function Lab01Page() {
  const router = useRouter();
  const [group, setGroup] = useState<Group | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [exercises, setExercises] = useState<ExerciseMeta[]>([]);
  const [demoMode, setDemoMode] = useState(true);
  const [scoreboard, setScoreboard] = useState<SystemScoreboard | null>(null);
  const [stateVersion, setStateVersion] = useState("state_v0");

  useEffect(() => {
    async function load() {
      const currentSession = await getLabRepository().getSession();
      const currentGroup = await getCurrentGroup();

      if (!currentGroup && currentSession?.role !== "admin") {
        router.push("/login");
        return;
      }

      setSession(currentSession);
      setGroup(currentGroup);
      setDemoMode(await getLab01DemoMode());
      setStateVersion(await getLab01State(currentGroup?.id ?? "admin"));
      setScoreboard(await getSystemScoreboard(currentGroup?.id ?? "admin", "lab-01"));

      const allExercises = await getLabRepository().listExercises({
        role: currentSession?.role ?? "group"
      });
      const visible =
        currentSession?.role === "admin"
          ? allExercises
          : allExercises.filter((exercise) => exercise.status === "active");
      setExercises(visible);
    }

    load();
  }, [router]);

  async function toggleDemoMode(enabled: boolean) {
    if (!group) return;
    await setLab01DemoMode(enabled);
    setDemoMode(enabled);
    setScoreboard(await getSystemScoreboard(group.id, "lab-01"));
  }

  return (
    <AppShell>
      <header className="topbar">
        <div>
          <div className="eyebrow">Laboratorio 1</div>
          <h1>Laboratorio 1 — AI Revenue & Inventory Copilot</h1>
          <p className="lead">
            Trabajá sobre un único workbook para recorrer exploración, portfolio,
            pricing, forecast e inventario.
          </p>
        </div>
        <div className="panel">
          <div className="muted">Grupo activo</div>
          <h3>{group?.name ?? session?.username ?? "Cargando..."}</h3>
          {session?.role !== "admin" ? (
            <label className="checkItem" style={{ marginTop: 12 }}>
              <input checked={demoMode} onChange={(event) => toggleDemoMode(event.target.checked)} type="checkbox" />
              <span>Modo demo: abrir todos los ejercicios</span>
            </label>
          ) : null}
        </div>
      </header>

      <div className="grid" style={{ gap: 22 }}>
        <WorkbookStatusCard stateVersion={stateVersion} lastWorkbookName={scoreboard?.lastWorkbookName} />
        <ExerciseProgressNav items={exercises} role={session?.role ?? "group"} />
      </div>
    </AppShell>
  );
}
