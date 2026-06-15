"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "../../components/AppShell";
import { ExerciseProgressNav } from "../../components/ExerciseProgressNav";
import { WorkbookDownloadCard } from "../../components/WorkbookDownloadCard";
import { WorkbookStatusCard } from "../../components/WorkbookStatusCard";
import type { Group, SystemScoreboard } from "../../types/lab";
import {
  getCurrentGroup,
  getLab01DemoMode,
  getLab01Progress,
  getLab01State,
  getSystemScoreboard,
  setLab01DemoMode
} from "../../services/mockLabService";

export default function LabsPage() {
  const router = useRouter();
  const [group, setGroup] = useState<Group | null>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [demoMode, setDemoMode] = useState(true);
  const [scoreboard, setScoreboard] = useState<SystemScoreboard | null>(null);
  const [stateVersion, setStateVersion] = useState("state_v0");

  useEffect(() => {
    async function load() {
      const currentGroup = await getCurrentGroup();
      if (!currentGroup) {
        router.push("/login");
        return;
      }

      setGroup(currentGroup);
      setDemoMode(await getLab01DemoMode());
      setProgress(await getLab01Progress(currentGroup.id));
      setStateVersion(await getLab01State(currentGroup.id));
      setScoreboard(await getSystemScoreboard(currentGroup.id, "lab-01"));
    }

    load();
  }, [router]);

  async function toggleDemoMode(enabled: boolean) {
    if (!group) return;
    await setLab01DemoMode(enabled);
    setDemoMode(enabled);
    setProgress(await getLab01Progress(group.id));
  }

  return (
    <AppShell>
      <header className="topbar">
        <div>
          <div className="eyebrow">Laboratorios</div>
          <h1>Laboratorio 1: AI Revenue & Inventory Copilot</h1>
          <p className="lead">
            Un único workbook vivo guía todo el recorrido: exploración, portfolio, pricing,
            forecast, inventario y plan de captura de valor.
          </p>
        </div>
        <div className="panel">
          <div className="muted">Grupo activo</div>
          <h3>{group?.name ?? "Cargando..."}</h3>
          <label className="checkItem" style={{ marginTop: 12 }}>
            <input checked={demoMode} onChange={(event) => toggleDemoMode(event.target.checked)} type="checkbox" />
            <span>Modo demo: abrir todos los ejercicios</span>
          </label>
        </div>
      </header>

      <div className="grid" style={{ gap: 22 }}>
        <WorkbookDownloadCard />
        <WorkbookStatusCard stateVersion={stateVersion} lastWorkbookName={scoreboard?.lastWorkbookName} />
        <ExerciseProgressNav items={progress} />
      </div>
    </AppShell>
  );
}
