"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AIPromptCards } from "./AIPromptCards";
import { ConceptExplainer } from "./ConceptExplainer";
import { Exercise00View } from "./Exercise00View";
import { Exercise01View } from "./Exercise01View";
import { Exercise02InitialView } from "./Exercise02InitialView";
import { ExerciseCheckpointForm } from "./ExerciseCheckpointForm";
import { ExerciseStepLayout } from "./ExerciseStepLayout";
import { RequiredOutputsCard } from "./RequiredOutputsCard";
import { SystemScoreboardCard } from "./SystemScoreboardCard";
import { WorkbookDownloadCard } from "./WorkbookDownloadCard";
import { WorkbookStatusCard } from "./WorkbookStatusCard";
import { TrendProjectionChart } from "./TrendProjectionChart";
import type { Group, LabCheckpoint, SystemScoreboard } from "../types/lab";
import { lab01ExerciseContent, type Lab01ExerciseId } from "../lib/lab01Content";
import type { ExerciseMeta, Session } from "../lib/repositories/labRepository.types";
import { getLabRepository } from "../lib/repositories/labRepository";
import {
  getCurrentGroup,
  getLab01State,
  getLabCheckpoint,
  getSystemScoreboard,
  saveLabCheckpoint,
  submitLabCheckpoint
} from "../services/mockLabService";

const customViews: Partial<Record<Lab01ExerciseId, React.ComponentType<any>>> = {
  "ex-00": Exercise00View,
  "ex-01": Exercise01View,
  ex02: Exercise02InitialView
};

export function Lab01ExerciseClient({ exerciseId }: { exerciseId: Lab01ExerciseId }) {
  const router = useRouter();
  const content = lab01ExerciseContent[exerciseId];
  const [group, setGroup] = useState<Group | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [exerciseMeta, setExerciseMeta] = useState<ExerciseMeta | null>(null);
  const [stateVersion, setStateVersion] = useState("state_v0");
  const [checkpoint, setCheckpoint] = useState<LabCheckpoint | null>(null);
  const [scoreboard, setScoreboard] = useState<SystemScoreboard | null>(null);

  const effectiveGroup: Group = group ?? {
    id: session?.groupId ?? "admin",
    name: session?.role === "admin" ? "Admin" : (session?.username ?? "Sin grupo"),
    role: session?.role === "admin" ? "admin" : "student"
  };

  const groupId = effectiveGroup.id;

  const reload = useCallback(async () => {
    setStateVersion(await getLab01State(groupId));
    setCheckpoint(await getLabCheckpoint(groupId, exerciseId));
    setScoreboard(await getSystemScoreboard(groupId, "lab-01"));
  }, [exerciseId, groupId]);

  useEffect(() => {
    async function load() {
      const currentSession = await getLabRepository().getSession();
      if (!currentSession) {
        router.push("/login");
        return;
      }
      setSession(currentSession);

      const meta = await getLabRepository().getExerciseMeta({ exerciseId });
      setExerciseMeta(meta);

      if (meta && currentSession.role === "group" && meta.status !== "active") {
        return; // grupo no puede acceder; mostramos mensaje de bloqueo
      }

      const currentGroup = await getCurrentGroup();
      setGroup(currentGroup);
      await reload();
    }
    load();
  }, [router, exerciseId, reload]);

  if (session && exerciseMeta && session.role === "group" && exerciseMeta.status !== "active") {
    return (
      <ExerciseStepLayout
        eyebrow="Laboratorio 1"
        title="Ejercicio no habilitado todavía"
        subtitle="Este ejercicio todavía no está disponible para tu grupo."
        meta={[]}
      >
        <section className="card">
          <div className="eyebrow">Acceso no habilitado</div>
          <h2>Ejercicio no habilitado todavía</h2>
          <p className="muted">
            Cuando el docente active este ejercicio, vas a poder acceder desde la navegación del laboratorio.
          </p>
        </section>
      </ExerciseStepLayout>
    );
  }

  if (!session || !scoreboard) {
    return (
      <ExerciseStepLayout eyebrow="Laboratorio 1" title={content.title} subtitle="Cargando..." meta={[]}>
        <p className="lead">Cargando ejercicio...</p>
      </ExerciseStepLayout>
    );
  }

  const handleSave = async (payload: {
    fields: Record<string, string>;
    confirmations: Record<string, boolean>;
    workbookName?: string;
    reportName?: string;
  }) => {
    const next = await saveLabCheckpoint({
      groupId,
      labId: "lab-01",
      exerciseId,
      ...payload
    });
    setCheckpoint(next);
  };

  const handleSubmit = async (payload: {
    fields: Record<string, string>;
    confirmations: Record<string, boolean>;
    workbookName?: string;
    reportName?: string;
    requiredFields: string[];
    requiredConfirmations: string[];
  }) => {
    const next = await submitLabCheckpoint({
      groupId,
      labId: "lab-01",
      exerciseId,
      ...payload
    });
    setCheckpoint(next);
    await reload();
  };

  const CustomView = customViews[exerciseId];
  if (CustomView) {
    return (
      <CustomView
        checkpoint={checkpoint}
        group={effectiveGroup}
        scoreboard={scoreboard}
        stateVersion={stateVersion}
        onSave={handleSave}
        onSubmit={handleSubmit}
      />
    );
  }

  return (
    <ExerciseStepLayout
      eyebrow="AI Revenue & Inventory Copilot"
      title={content.title}
      subtitle={content.subtitle}
      meta={[
        { label: "Grupo", value: effectiveGroup.name },
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
        onSave={handleSave}
        onSubmit={handleSubmit}
        requiredFields={content.fields.map((field) => field.key)}
        title="Subir checkpoint del workbook"
      />
    </ExerciseStepLayout>
  );
}
