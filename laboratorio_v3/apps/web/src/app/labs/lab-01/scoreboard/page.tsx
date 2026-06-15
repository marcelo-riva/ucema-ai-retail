"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "../../../../components/AppShell";
import { SystemScoreboard } from "../../../../components/SystemScoreboard";
import type { Group, SystemScoreboard as SystemScoreboardType } from "../../../../types/lab";
import { getCurrentGroup, getSystemScoreboard } from "../../../../services/mockLabService";

export default function ScoreboardPage() {
  const router = useRouter();
  const [group, setGroup] = useState<Group | null>(null);
  const [scoreboard, setScoreboard] = useState<SystemScoreboardType | null>(null);

  useEffect(() => {
    async function load() {
      const currentGroup = await getCurrentGroup();
      if (!currentGroup) {
        router.push("/login");
        return;
      }

      setGroup(currentGroup);
      setScoreboard(await getSystemScoreboard(currentGroup.id, "lab-01"));
    }

    load();
  }, [router]);

  return (
    <AppShell>
      <header className="topbar">
        <div>
          <div className="eyebrow">Laboratorio 1</div>
          <h1>Scoreboard oficial</h1>
          <p className="lead">
            Estado del sistema para {group?.name ?? "el grupo seleccionado"}. En Fase 0 se
            actualiza con valores mock cuando la entrega queda en submitted.
          </p>
        </div>
      </header>

      {scoreboard ? <SystemScoreboard scoreboard={scoreboard} /> : <p>Cargando scoreboard...</p>}
    </AppShell>
  );
}
