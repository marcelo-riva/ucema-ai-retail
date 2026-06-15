"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AIPromptCards } from "./AIPromptCards";
import { ConceptExplainer } from "./ConceptExplainer";
import { ExerciseCheckpointForm } from "./ExerciseCheckpointForm";
import { ExerciseStepLayout } from "./ExerciseStepLayout";
import { RequiredOutputsCard } from "./RequiredOutputsCard";
import { SystemScoreboardCard } from "./SystemScoreboardCard";
import { WorkbookDownloadCard } from "./WorkbookDownloadCard";
import { WorkbookStatusCard } from "./WorkbookStatusCard";
import { TrendProjectionChart } from "./TrendProjectionChart";
import type { Group, LabCheckpoint, SystemScoreboard } from "../types/lab";
import { lab01ExerciseContent, type Lab01ExerciseId } from "../lib/lab01Content";
import {
  getCurrentGroup,
  getLab01State,
  getLabCheckpoint,
  getSystemScoreboard,
  saveLabCheckpoint,
  submitLabCheckpoint
} from "../services/mockLabService";

export function Lab01ExerciseClient({ exerciseId }: { exerciseId: Lab01ExerciseId }) {
  const router = useRouter();
  const content = lab01ExerciseContent[exerciseId];
  const [group, setGroup] = useState<Group | null>(null);
  const [stateVersion, setStateVersion] = useState("state_v0");
  const [checkpoint, setCheckpoint] = useState<LabCheckpoint | null>(null);
  const [scoreboard, setScoreboard] = useState<SystemScoreboard | null>(null);

  const reload = useCallback(async (currentGroup: Group) => {
    setStateVersion(await getLab01State(currentGroup.id));
    setCheckpoint(await getLabCheckpoint(currentGroup.id, exerciseId));
    setScoreboard(await getSystemScoreboard(currentGroup.id, "lab-01"));
  }, [exerciseId]);

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
  }, [router, exerciseId, reload]);

  if (!group || !scoreboard) {
    return (
      <ExerciseStepLayout eyebrow="Laboratorio 1" title={content.title} subtitle="Cargando..." meta={[]}>
        <p className="lead">Cargando ejercicio...</p>
      </ExerciseStepLayout>
    );
  }

  return (
    <ExerciseStepLayout
      eyebrow="AI Revenue & Inventory Copilot"
      title={content.title}
      subtitle={content.subtitle}
      meta={[
        { label: "Grupo", value: group.name },
        { label: "Estado", value: stateVersion },
        { label: "Workbook", value: "único" },
        { label: "Checkpoint", value: checkpoint?.status ?? "borrador" }
      ]}
    >
      <WorkbookStatusCard stateVersion={stateVersion} lastWorkbookName={scoreboard.lastWorkbookName} />
      <WorkbookDownloadCard />

      <section className="card">
        <div className="eyebrow">Contexto</div>
        <h2>Qué estás resolviendo</h2>
        <p className="muted">{content.context}</p>
        <div className="grid two">
          <div className="panel">
            <h3>Hojas principales</h3>
            <p className="muted">{content.mainSheets.join(", ")}</p>
          </div>
          <div className="panel">
            <h3>Hojas de apoyo</h3>
            <p className="muted">{content.supportSheets.join(", ")}</p>
          </div>
        </div>
      </section>

      <ConceptExplainer concepts={[...content.concepts]} />

      <section className="card">
        <div className="eyebrow">Guía de trabajo</div>
        <h2>Preguntas para orientar el análisis</h2>
        <div className="questionGrid">
          {content.questions.map((question) => (
            <div className="questionItem" key={question}>{question}</div>
          ))}
        </div>
      </section>

      <AIPromptCards prompts={[...content.prompts]} />
      <RequiredOutputsCard required={[...content.required]} />
      <TrendProjectionChart />
      <SystemScoreboardCard scoreboard={scoreboard} />

      <ExerciseCheckpointForm
        checkpoint={checkpoint}
        confirmations={[...content.confirmations]}
        fieldLabels={[...content.fields]}
        onSave={async (payload) => {
          const next = await saveLabCheckpoint({
            groupId: group.id,
            labId: "lab-01",
            exerciseId,
            ...payload
          });
          setCheckpoint(next);
        }}
        onSubmit={async (payload) => {
          const next = await submitLabCheckpoint({
            groupId: group.id,
            labId: "lab-01",
            exerciseId,
            ...payload
          });
          setCheckpoint(next);
          await reload(group);
        }}
        requiredFields={content.fields.map((field) => field.key)}
        title={`Subir checkpoint del workbook`}
      />
    </ExerciseStepLayout>
  );
}
