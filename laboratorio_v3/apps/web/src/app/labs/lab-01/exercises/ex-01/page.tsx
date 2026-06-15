"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { AIToolkitPrompts } from "../../../../../components/AIToolkitPrompts";
import { AppShell } from "../../../../../components/AppShell";
import { BusinessCaseIntro } from "../../../../../components/BusinessCaseIntro";
import { ExerciseHeader } from "../../../../../components/ExerciseHeader";
import { ExplorationGuide } from "../../../../../components/ExplorationGuide";
import { FileDownloadCard } from "../../../../../components/FileDownloadCard";
import { FileUploadBox } from "../../../../../components/FileUploadBox";
import { ProjectionSheetGuide } from "../../../../../components/ProjectionSheetGuide";
import { StudentScoreboardExplainer } from "../../../../../components/StudentScoreboardExplainer";
import { SubmissionStatus } from "../../../../../components/SubmissionStatus";
import { SystemScoreboard } from "../../../../../components/SystemScoreboard";
import { TeamHypothesisForm } from "../../../../../components/TeamHypothesisForm";
import { TrendProjectionChart } from "../../../../../components/TrendProjectionChart";
import type {
  Exercise,
  Group,
  Submission,
  SubmissionConfirmations,
  SystemScoreboard as SystemScoreboardType
} from "../../../../../types/lab";
import {
  getCurrentGroup,
  getExercise,
  getSubmission,
  getSystemScoreboard,
  saveDraftSubmission,
  submitExercise
} from "../../../../../services/mockLabService";

const labId = "lab-01";
const exerciseId = "ex-01";

type RequiredConfirmationKey =
  | "completedSkuDecisions"
  | "completedStudentScoreboard"
  | "completedExecutiveRecommendation"
  | "reviewedExecutiveCriteria";

const confirmationLabels: Record<RequiredConfirmationKey, string> = {
  completedSkuDecisions: "Completé la hoja 05_DECISIONES_SKU.",
  completedStudentScoreboard: "Actualicé la hoja 06_SCOREBOARD_ALUMNO.",
  completedExecutiveRecommendation: "Escribí diagnóstico, criterios y riesgos.",
  reviewedExecutiveCriteria: "Revisé la recomendación con criterio ejecutivo, no solo con la AI."
};

const initialConfirmations: SubmissionConfirmations = {
  completedSkuDecisions: false,
  completedStudentScoreboard: false,
  completedProjection90Days: false,
  reviewedExecutiveCriteria: false,
  completedExecutiveRecommendation: false
};

export default function ExercisePage() {
  const router = useRouter();
  const [group, setGroup] = useState<Group | null>(null);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [scoreboard, setScoreboard] = useState<SystemScoreboardType | null>(null);
  const [initialHypothesis, setInitialHypothesis] = useState("");
  const [decisionCriteria, setDecisionCriteria] = useState("");
  const [risksTradeoffs, setRisksTradeoffs] = useState("");
  const [excelName, setExcelName] = useState<string | undefined>();
  const [reportName, setReportName] = useState<string | undefined>();
  const [confirmations, setConfirmations] = useState<SubmissionConfirmations>(initialConfirmations);

  useEffect(() => {
    async function load() {
      const currentGroup = await getCurrentGroup();
      if (!currentGroup) {
        router.push("/login");
        return;
      }

      const currentExercise = await getExercise(labId, exerciseId);
      const currentSubmission = await getSubmission(currentGroup.id, exerciseId);
      const currentScoreboard = await getSystemScoreboard(currentGroup.id, labId);

      setGroup(currentGroup);
      setExercise(currentExercise);
      setSubmission(currentSubmission);
      setScoreboard(currentScoreboard);
      setInitialHypothesis(currentSubmission?.initialHypothesis ?? "");
      setDecisionCriteria(currentSubmission?.decisionCriteria ?? "");
      setRisksTradeoffs(currentSubmission?.risksTradeoffs ?? "");
      setExcelName(currentSubmission?.uploadedExcelName);
      setReportName(currentSubmission?.uploadedReportName);
      setConfirmations(currentSubmission?.confirmations ?? initialConfirmations);
    }

    load();
  }, [router]);

  async function saveDraft() {
    if (!group) return;

    const nextSubmission = await saveDraftSubmission({
      groupId: group.id,
      labId,
      exerciseId,
      thesis: buildExecutiveRecommendation(),
      initialHypothesis,
      decisionCriteria,
      risksTradeoffs,
      uploadedExcelName: excelName,
      uploadedReportName: reportName,
      confirmations
    });

    setSubmission(nextSubmission);
  }

  async function submit() {
    if (!group) return;

    const nextSubmission = await submitExercise({
      groupId: group.id,
      labId,
      exerciseId,
      thesis: buildExecutiveRecommendation(),
      initialHypothesis,
      decisionCriteria,
      risksTradeoffs,
      uploadedExcelName: excelName,
      uploadedReportName: reportName,
      confirmations
    });

    setSubmission(nextSubmission);
    setScoreboard(await getSystemScoreboard(group.id, labId));
  }

  function updateConfirmation(key: keyof SubmissionConfirmations, value: boolean) {
    setConfirmations((current) => ({ ...current, [key]: value }));
  }

  function buildExecutiveRecommendation() {
    return [
      `Diagnóstico: ${initialHypothesis}`,
      `Criterios de decisión: ${decisionCriteria}`,
      `Riesgos y cuidados: ${risksTradeoffs}`
    ].join("\n\n");
  }

  if (!group || !exercise || !scoreboard) {
    return (
      <AppShell>
        <p className="lead">Cargando ejercicio...</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ExerciseHeader
        exercise={exercise}
        groupName={group.name}
        stateVersion={scoreboard.stateVersion}
        submissionStatus={submission?.status === "submitted" ? "enviado" : submission ? "borrador" : "borrador"}
      />
      <div className="grid" style={{ gap: 22 }}>
        <section className="stepSection">
          <div className="stepTitle">
            <span>1</span>
            <div>
              <h2>Entender el caso</h2>
              <p>Nexus Retail necesita una recomendación simple de portfolio.</p>
            </div>
          </div>
          <BusinessCaseIntro />
          <FileDownloadCard />
        </section>

        <section className="stepSection">
          <div className="stepTitle">
            <span>2</span>
            <div>
              <h2>Explorar la base</h2>
              <p>Buscá señales simples antes de clasificar productos.</p>
            </div>
          </div>
          <ExplorationGuide />
          <AIToolkitPrompts />
        </section>

        <section className="stepSection">
          <div className="stepTitle">
            <span>3</span>
            <div>
              <h2>Decidir portfolio</h2>
              <p>Completá la hoja 05 y explicá cómo decidió el equipo.</p>
            </div>
          </div>
          <TeamHypothesisForm
            decisionCriteria={decisionCriteria}
            initialHypothesis={initialHypothesis}
            onDecisionCriteriaChange={setDecisionCriteria}
            onInitialHypothesisChange={setInitialHypothesis}
            onRisksTradeoffsChange={setRisksTradeoffs}
            risksTradeoffs={risksTradeoffs}
          />
          <StudentScoreboardExplainer />
        </section>

        <section className="stepSection">
          <div className="stepTitle">
            <span>4</span>
            <div>
              <h2>Ver impacto y entregar</h2>
              <p>Revisá el impacto estimado, subí archivos y enviá la entrega.</p>
            </div>
          </div>

          <section className="card">
            <div className="eyebrow">Output esperado</div>
            <h2>Para terminar este ejercicio tenés que entregar</h2>
            <div className="deliverableList">
              <article>
                <strong>Hoja 05_DECISIONES_SKU completa</strong>
                <p>CORE / REVIEW / ELIMINAR, acción sugerida, motivo y riesgo.</p>
              </article>
              <article>
                <strong>Hoja 06_SCOREBOARD_ALUMNO actualizada</strong>
                <p>SKUs eliminados, capital liberado, revenue en riesgo y margen esperado.</p>
              </article>
              <article>
                <strong>Recomendación ejecutiva</strong>
                <p>Diagnóstico, criterios de decisión y riesgos principales.</p>
              </article>
              <article>
                <strong>Reporte AI opcional</strong>
                <p>Puede ayudar a mostrar cómo trabajaron, pero no reemplaza la decisión.</p>
              </article>
            </div>
            <div className="optionalNote">
              07_PLAN_90_DIAS es recomendado. 09_PROYECCION_90_DIAS es preview y se
              profundiza más adelante en Forecast.
            </div>
          </section>

          <ProjectionSheetGuide />
          <SystemScoreboard scoreboard={scoreboard} />
          <TrendProjectionChart />
          <FileUploadBox
            excelName={excelName}
            onExcelChange={setExcelName}
            onReportChange={setReportName}
            reportName={reportName}
          />

          <section className="card">
            <div className="eyebrow">Confirmaciones</div>
            <h2>Control del equipo antes de enviar</h2>
            <div className="checkList">
              {(Object.keys(confirmationLabels) as RequiredConfirmationKey[]).map((key) => (
                <label className="checkItem" key={key}>
                  <input
                    checked={Boolean(confirmations[key])}
                    onChange={(event) => updateConfirmation(key, event.target.checked)}
                    type="checkbox"
                  />
                  <span>{confirmationLabels[key]}</span>
                </label>
              ))}
              <label className="checkItem optionalCheck">
                <input
                  checked={Boolean(confirmations.completedProjection90Days)}
                  onChange={(event) => updateConfirmation("completedProjection90Days", event.target.checked)}
                  type="checkbox"
                />
                <span>Opcional: completé una primera versión de la hoja 09_PROYECCION_90_DIAS.</span>
              </label>
            </div>
          </section>

          <SubmissionStatus submission={submission} />

          <section className="panel">
            <div className="buttonRow">
              <button
                className="button secondary"
                onClick={saveDraft}
                type="button"
              >
                Guardar borrador
              </button>
              <button
                className="button primary"
                onClick={submit}
                type="button"
              >
                <Send size={17} /> Enviar entrega
              </button>
            </div>
          </section>
        </section>
      </div>
    </AppShell>
  );
}
