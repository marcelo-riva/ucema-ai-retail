"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "../../../../components/AppShell";
import { ExerciseProgressNav } from "../../../../components/ExerciseProgressNav";
import { SystemScoreboardCard } from "../../../../components/SystemScoreboardCard";
import { TrendProjectionChart } from "../../../../components/TrendProjectionChart";
import { WorkbookStatusCard } from "../../../../components/WorkbookStatusCard";
import type { Group, SystemScoreboard as SystemScoreboardType } from "../../../../types/lab";
import { getCurrentGroup, getLab01Progress, getSystemScoreboard } from "../../../../services/mockLabService";

export default function ScoreboardPage() {
  const router = useRouter();
  const [group, setGroup] = useState<Group | null>(null);
  const [scoreboard, setScoreboard] = useState<SystemScoreboardType | null>(null);
  const [progress, setProgress] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const currentGroup = await getCurrentGroup();
      if (!currentGroup) {
        router.push("/login");
        return;
      }

      setGroup(currentGroup);
      setScoreboard(await getSystemScoreboard(currentGroup.id, "lab-01"));
      setProgress(await getLab01Progress(currentGroup.id));
    }

    load();
  }, [router]);

  return (
    <AppShell>
      <header className="topbar">
        <div>
          <div className="eyebrow">Laboratorio 1</div>
          <h1>Scoreboard consolidado</h1>
          <p className="lead">
            Histórico M01-M12, proyección M13-M15, checkpoints subidos y último workbook
            registrado. Todo en modo mock/localStorage.
          </p>
        </div>
      </header>

      {scoreboard ? (
        <div className="grid" style={{ gap: 22 }}>
          <WorkbookStatusCard stateVersion={scoreboard.stateVersion} lastWorkbookName={scoreboard.lastWorkbookName} />
          <SystemScoreboardCard scoreboard={scoreboard} />
          <TrendProjectionChart />
          <ExerciseProgressNav items={progress} />
        </div>
      ) : (
        <p>Cargando scoreboard...</p>
      )}
    </AppShell>
  );
}
