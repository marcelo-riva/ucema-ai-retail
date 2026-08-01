"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ExerciseStepLayout } from "./ExerciseStepLayout";
import { ConceptExplainer } from "./ConceptExplainer";
import { AIPromptCards } from "./AIPromptCards";
import { CheckpointForm, type CheckpointField } from "./labs/CheckpointForm";
import { ExerciseLab02E01View } from "./ExerciseLab02E01View";
import { lab02ExerciseContent, type Lab02ExerciseId } from "../lib/lab02Content";
import type { ExerciseMeta, Session, Submission } from "../lib/repositories/labRepository.types";
import { getLabRepository } from "../lib/repositories/labRepository";
import type { Group } from "../types/lab";

const repo = getLabRepository();

const customViews: Partial<Record<Lab02ExerciseId, React.ComponentType<any>>> = {
  "lab02-ex01": ExerciseLab02E01View
};

export function Lab02ExerciseClient({ exerciseId }: { exerciseId: Lab02ExerciseId }) {
  const router = useRouter();
  const content = lab02ExerciseContent[exerciseId];
  const [session, setSession] = useState<Session | null>(null);
  const [exerciseMeta, setExerciseMeta] = useState<ExerciseMeta | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSubmission = useCallback(async (groupId: string) => {
    try {
      const sub = await repo.getSubmission({ groupId, exerciseId, exerciseVersion: 1 });
      setSubmission(sub);
    } catch {
      setSubmission(null);
    }
  }, [exerciseId]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const currentSession = await repo.getSession();
        if (cancelled) return;
        setSession(currentSession);

        if (!currentSession) {
          router.push("/login");
          return;
        }

        const meta = await repo.getExerciseMeta({ exerciseId });
        if (cancelled) return;
        setExerciseMeta(meta);

        if (currentSession.role === "group" && meta && meta.status !== "active") {
          return;
        }

        if (currentSession.groupId) {
          await loadSubmission(currentSession.groupId);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error loading Lab02 exercise:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [exerciseId, router, loadSubmission]);

  if (loading) {
    return (
      <ExerciseStepLayout
        eyebrow="Laboratorio 2"
        title={content.title}
        subtitle="Cargando..."
        meta={[]}
      >
        <section className="card">
          <p className="muted">Cargando ejercicio...</p>
        </section>
      </ExerciseStepLayout>
    );
  }

  if (session && exerciseMeta && session.role === "group" && exerciseMeta.status !== "active") {
    return (
      <ExerciseStepLayout
        eyebrow="Laboratorio 2"
        title="Ejercicio no habilitado"
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

  const checkpointStatus = submission?.status ?? "borrador";
  const groupName = session?.role === "admin" ? session.username : (session?.groupId ?? "Sin grupo");

  const effectiveGroup: Group = {
    id: session?.groupId ?? "admin",
    name: session?.role === "admin" ? (session?.username ?? "Admin") : (session?.groupId ?? "Sin grupo"),
    role: session?.role === "admin" ? "admin" : "student"
  };

  const CustomView = customViews[exerciseId];
  if (CustomView) {
    return (
      <CustomView
        checkpoint={null}
        group={effectiveGroup}
        stateVersion="state_v0"
        onSave={async () => {}}
        onSubmit={async () => {}}
      />
    );
  }

  const checkpointFields: CheckpointField[] = content.fields.map((field) => ({
    id: field.key,
    label: field.label,
    type: "textarea",
    placeholder: field.placeholder,
    required: true
  }));

  return (
    <ExerciseStepLayout
      eyebrow="Customer Profitability Copilot"
      title={content.title}
      subtitle={content.subtitle}
      meta={[
        { label: "Grupo", value: groupName },
        { label: "Laboratorio", value: "Lab 2" },
        { label: "Checkpoint", value: checkpointStatus }
      ]}
    >
      <section className="card">
        <div className="eyebrow">Objetivo</div>
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
        <div className="eyebrow">Inputs / Contexto</div>
        <h2>Datos disponibles para el análisis</h2>
        <p className="muted">
          El workbook del Laboratorio 2 contiene la base de clientes y las variables necesarias para
          construir la segmentación, simular estrategias y consolidar el ROI promocional.
        </p>
      </section>

      <section className="card">
        <div className="eyebrow">Análisis IA</div>
        <h2>Preguntas para orientar el análisis</h2>
        <div className="questionGrid">
          {content.questions.map((question) => (
            <div className="questionItem" key={question}>{question}</div>
          ))}
        </div>
      </section>

      <AIPromptCards prompts={[...content.prompts]} />

      <section className="card">
        <div className="eyebrow">Outputs esperados</div>
        <h2>Qué debe quedar claro</h2>
        <ul className="simpleList">
          {content.required.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <CheckpointForm
        exerciseId={exerciseId}
        exerciseVersion={1}
        fields={checkpointFields}
        saveLabel="Guardar borrador"
        submitLabel="Enviar checkpoint"
      />
    </ExerciseStepLayout>
  );
}
