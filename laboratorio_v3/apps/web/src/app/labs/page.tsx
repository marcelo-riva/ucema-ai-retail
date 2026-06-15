"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "../../components/AppShell";
import { LabCard } from "../../components/LabCard";
import type { Group, Lab } from "../../types/lab";
import { getCurrentGroup, getLabs } from "../../services/mockLabService";

export default function LabsPage() {
  const router = useRouter();
  const [group, setGroup] = useState<Group | null>(null);
  const [labs, setLabs] = useState<Lab[]>([]);

  useEffect(() => {
    async function load() {
      const currentGroup = await getCurrentGroup();
      if (!currentGroup) {
        router.push("/login");
        return;
      }

      setGroup(currentGroup);
      setLabs(await getLabs());
    }

    load();
  }, [router]);

  return (
    <AppShell>
      <header className="topbar">
        <div>
          <div className="eyebrow">Laboratorios</div>
          <h1>Panel de trabajo</h1>
          <p className="lead">
            Elegí un laboratorio disponible para descargar datos, trabajar con tu AI personal y
            registrar la decisión del equipo.
          </p>
        </div>
        <div className="panel">
          <div className="muted">Grupo activo</div>
          <h3>{group?.name ?? "Cargando..."}</h3>
        </div>
      </header>

      <div className="grid two">
        {labs.map((lab) => (
          <LabCard key={lab.id} lab={lab} />
        ))}
      </div>
    </AppShell>
  );
}
