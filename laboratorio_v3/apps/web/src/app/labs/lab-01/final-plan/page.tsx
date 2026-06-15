"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Download } from "lucide-react";
import { ExerciseCheckpointForm } from "../../../../components/ExerciseCheckpointForm";
import { ExerciseStepLayout } from "../../../../components/ExerciseStepLayout";
import { FinalPlanEditor } from "../../../../components/FinalPlanEditor";
import { RequiredOutputsCard } from "../../../../components/RequiredOutputsCard";
import { SystemScoreboardCard } from "../../../../components/SystemScoreboardCard";
import { WorkbookDownloadCard } from "../../../../components/WorkbookDownloadCard";
import type { Group, LabCheckpoint, SystemScoreboard } from "../../../../types/lab";
import {
  getCurrentGroup,
  getLab01State,
  getLabCheckpoint,
  getSystemScoreboard,
  saveLabCheckpoint,
  submitLabCheckpoint
} from "../../../../services/mockLabService";

export default function FinalPlanPage() {
  const router = useRouter();
  const [group, setGroup] = useState<Group | null>(null);
  const [stateVersion, setStateVersion] = useState("state_v0");
  const [checkpoint, setCheckpoint] = useState<LabCheckpoint | null>(null);
  const [scoreboard, setScoreboard] = useState<SystemScoreboard | null>(null);
  const [planFields, setPlanFields] = useState<Record<string, string>>({});

  async function reload(currentGroup: Group) {
    setStateVersion(await getLab01State(currentGroup.id));
    const currentCheckpoint = await getLabCheckpoint(currentGroup.id, "final-plan");
    setCheckpoint(currentCheckpoint);
    setPlanFields(currentCheckpoint?.fields ?? {});
    setScoreboard(await getSystemScoreboard(currentGroup.id, "lab-01"));
  }

  useEffect(() => {
    async function load() {
      const currentGroup = await getCurrentGroup();
      if (!currentGroup) {
        router.push("/login");
        return;
      }
      setGroup(currentGroup);
      await reload(currentGroup);
    }
    load();
  }, [router]);

  if (!group || !scoreboard) {
    return (
      <ExerciseStepLayout eyebrow="Laboratorio 1" title="Plan de Captura de Valor 90 días" subtitle="Cargando..." meta={[]}>
        <p className="lead">Cargando plan final...</p>
      </ExerciseStepLayout>
    );
  }

  return (
    <ExerciseStepLayout
      eyebrow="Cierre Laboratorio 1"
      title="Plan de Captura de Valor 90 días"
      subtitle="Consolidá portfolio, pricing, forecast e inventario en una recomendación ejecutiva."
      meta={[
        { label: "Grupo", value: group.name },
        { label: "Estado", value: stateVersion },
        { label: "Hoja", value: "11_OUTPUT_FINAL" },
        { label: "Checkpoint", value: checkpoint?.status ?? "borrador" }
      ]}
    >
      <WorkbookDownloadCard />
      <SystemScoreboardCard scoreboard={scoreboard} />
      <RequiredOutputsCard
        required={[
          "Resumen de decisiones de portfolio.",
          "Resumen de pricing.",
          "Forecast 90 días.",
          "Inventario objetivo.",
          "Capital liberado, impacto revenue, margen y EBITDA.",
          "Riesgos principales y quick wins."
        ]}
      />
      <FinalPlanEditor fields={planFields} onChange={setPlanFields} />
      <section className="panel">
        <button className="button secondary" type="button">
          <Download size={17} /> Descargar plan final mock
        </button>
      </section>
      <ExerciseCheckpointForm
        checkpoint={checkpoint}
        confirmations={[
          { key: "completedFinalOutput", label: "Completé 11_OUTPUT_FINAL." },
          { key: "reviewedFullWorkbook", label: "Revisé todas las decisiones del workbook." },
          { key: "validatedExecutivePlan", label: "Validé el plan con criterio ejecutivo." }
        ]}
        fieldLabels={[
          { key: "tesisFinal", label: "Tesis final", placeholder: "Síntesis ejecutiva del plan." },
          { key: "impactoEconomico", label: "Impacto económico", placeholder: "Revenue, margen, capital y EBITDA." },
          { key: "quickWins", label: "Quick wins", placeholder: "Acciones inmediatas." },
          { key: "riesgos", label: "Riesgos", placeholder: "Riesgos principales y controles." }
        ]}
        onSave={async (payload) => {
          const next = await saveLabCheckpoint({
            groupId: group.id,
            labId: "lab-01",
            exerciseId: "final-plan",
            ...payload,
            fields: { ...planFields, ...payload.fields }
          });
          setCheckpoint(next);
        }}
        onSubmit={async (payload) => {
          const next = await submitLabCheckpoint({
            groupId: group.id,
            labId: "lab-01",
            exerciseId: "final-plan",
            ...payload,
            fields: { ...planFields, ...payload.fields }
          });
          setCheckpoint(next);
          await reload(group);
        }}
        requiredFields={["tesisFinal", "impactoEconomico", "quickWins", "riesgos"]}
        title="Subir workbook final"
      />
    </ExerciseStepLayout>
  );
}
