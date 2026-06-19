import type {
  Exercise,
  Group,
  LabCheckpoint,
  Lab,
  Submission,
  SystemScoreboard,
  ValidationMessage
} from "../types/lab";
import exercises from "../../../../data/mock/exercises.json";
import groups from "../../../../data/mock/groups.json";
import labs from "../../../../data/mock/labs.json";
import initialScoreboard from "../../../../data/mock/system_scoreboard_group_01.json";

const CURRENT_GROUP_KEY = "nexus.currentGroupId";
const SUBMISSIONS_KEY = "nexus.submissions";
const SCOREBOARDS_KEY = "nexus.scoreboards";
const CHECKPOINTS_KEY = "nexus.lab01.checkpoints";
const DEMO_MODE_KEY = "nexus.lab01.demoMode";
const SCOREBOARD_VERSION = 2;

const emptyConfirmations = {
  completedSkuDecisions: false,
  completedStudentScoreboard: false,
  completedProjection90Days: false,
  reviewedExecutiveCriteria: false,
  completedExecutiveRecommendation: false
};

const requiredConfirmationKeys = [
  "completedSkuDecisions",
  "completedStudentScoreboard",
  "completedExecutiveRecommendation",
  "reviewedExecutiveCriteria"
] as const;

function hasStorage(): boolean {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readJson<T>(key: string, fallback: T): T {
  if (!hasStorage()) return fallback;

  const rawValue = window.localStorage.getItem(key);
  if (!rawValue) return fallback;

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (!hasStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function submissionKey(groupId: string, exerciseId: string): string {
  return `${groupId}:${exerciseId}`;
}

function getStoredSubmissions(): Record<string, Submission> {
  return readJson<Record<string, Submission>>(SUBMISSIONS_KEY, {});
}

function saveStoredSubmission(submission: Submission): void {
  const submissions = getStoredSubmissions();
  submissions[submissionKey(submission.groupId, submission.exerciseId)] = submission;
  writeJson(SUBMISSIONS_KEY, submissions);
}

function getStoredScoreboards(): Record<string, SystemScoreboard> {
  return readJson<Record<string, SystemScoreboard>>(SCOREBOARDS_KEY, {});
}

function saveStoredScoreboard(scoreboard: SystemScoreboard): void {
  const scoreboards = getStoredScoreboards();
  scoreboards[`${scoreboard.groupId}:${scoreboard.labId}`] = scoreboard;
  writeJson(SCOREBOARDS_KEY, scoreboards);
}

function buildScoreboardV1(groupId: string, labId: string): SystemScoreboard {
  return {
    ...initialScoreboard,
    groupId,
    labId,
    stateVersion: "v1",
    coreSkus: 5120,
    reviewSkus: 2260,
    eliminateSkus: 844,
    revenueProjected: 49503286934,
    revenueImpact: 0,
    revenueAtRisk: 385000000,
    grossMarginProjected: 14019136540,
    grossMarginImpact: 0,
    expectedMarginRate: 28.3,
    workingCapitalProjected: 9500000000,
    capitalReleased: 500000000,
    ebitdaImpact: 72000000
  };
}

const stateOrder = [
  "state_v0",
  "state_v0_explored",
  "state_v1_portfolio",
  "state_v2_pricing",
  "state_v3_forecast",
  "state_v4_inventory",
  "state_final_plan"
];

export const lab01ExerciseSpecs = [
  {
    id: "ex-00",
    order: 0,
    title: "Exploración Inicial",
    route: "/labs/lab-01/exercises/ex-00",
    objective: "Entender el negocio, la base y las variables comerciales antes de decidir.",
    checkpointName: "Checkpoint de exploración",
    mainSheet: "04_DIAGNOSTICO_INICIAL",
    supportSheets: ["00_CASO_NEGOCIO", "01_BASE_SKUS", "02_DICCIONARIO_DATOS", "09_SCOREBOARD_ALUMNO"],
    output: "Diagnóstico inicial, 5 hallazgos, 3 preguntas de negocio y dudas.",
    requiredState: "state_v0",
    nextState: "state_v0_explored"
  },
  {
    id: "ex-01",
    order: 1,
    title: "Portfolio Optimization",
    route: "/labs/lab-01/exercises/ex-01",
    objective: "Clasificar SKUs como CORE, REVIEW o ELIMINAR.",
    checkpointName: "Checkpoint de Portfolio",
    mainSheet: "05_DECISIONES_PORTFOLIO",
    supportSheets: ["01_BASE_SKUS", "04_DIAGNOSTICO_INICIAL", "09_SCOREBOARD_ALUMNO", "10_PLAN_90_DIAS"],
    output: "Decisiones CORE / REVIEW / ELIMINAR, scoreboard portfolio y riesgos.",
    requiredState: "state_v0_explored",
    nextState: "state_v1_portfolio"
  },
  {
    id: "ex-02",
    order: 2,
    title: "Pricing Optimization",
    route: "/labs/lab-01/exercises/ex-02",
    objective: "Definir precios para capturar margen sin destruir volumen.",
    checkpointName: "Checkpoint de Pricing",
    mainSheet: "06_PRICING_DECISIONS",
    supportSheets: ["01_BASE_SKUS", "05_DECISIONES_PORTFOLIO", "09_SCOREBOARD_ALUMNO"],
    output: "Estrategia de pricing, criterios, riesgos de elasticidad y workbook actualizado.",
    requiredState: "state_v1_portfolio",
    nextState: "state_v2_pricing"
  },
  {
    id: "ex-03",
    order: 3,
    title: "Forecast Engine",
    route: "/labs/lab-01/exercises/ex-03",
    objective: "Proyectar M13-M15 con las decisiones de portfolio y pricing.",
    checkpointName: "Checkpoint de Forecast",
    mainSheet: "07_FORECAST_90_DIAS",
    supportSheets: ["01_BASE_SKUS", "05_DECISIONES_PORTFOLIO", "06_PRICING_DECISIONS", "09_SCOREBOARD_ALUMNO"],
    output: "Forecast M13-M15, escenario elegido, supuestos y riesgos.",
    requiredState: "state_v2_pricing",
    nextState: "state_v3_forecast"
  },
  {
    id: "ex-04",
    order: 4,
    title: "Inventory & Working Capital Optimization",
    route: "/labs/lab-01/exercises/ex-04",
    objective: "Definir stock objetivo, DDI y capital liberado.",
    checkpointName: "Checkpoint de Inventario",
    mainSheet: "08_INVENTORY_DECISIONS",
    supportSheets: ["01_BASE_SKUS", "05_DECISIONES_PORTFOLIO", "07_FORECAST_90_DIAS", "09_SCOREBOARD_ALUMNO", "10_PLAN_90_DIAS"],
    output: "Política de inventario, DDI objetivo, capital liberado y riesgos de quiebre.",
    requiredState: "state_v3_forecast",
    nextState: "state_v4_inventory"
  },
  {
    id: "final-plan",
    order: 5,
    title: "Plan de Captura de Valor 90 días",
    route: "/labs/lab-01/final-plan",
    objective: "Consolidar decisiones, impacto económico, quick wins y roadmap.",
    checkpointName: "Workbook final",
    mainSheet: "11_OUTPUT_FINAL",
    supportSheets: ["Todas las hojas del workbook"],
    output: "Tesis final, impacto económico, quick wins, roadmap, riesgos y ROI esperado.",
    requiredState: "state_v4_inventory",
    nextState: "state_final_plan"
  }
];

function checkpointKey(groupId: string, exerciseId: string): string {
  return `${groupId}:${exerciseId}`;
}

function getStoredCheckpoints(): Record<string, LabCheckpoint> {
  return readJson<Record<string, LabCheckpoint>>(CHECKPOINTS_KEY, {});
}

function saveStoredCheckpoint(checkpoint: LabCheckpoint): void {
  const checkpoints = getStoredCheckpoints();
  checkpoints[checkpointKey(checkpoint.groupId, checkpoint.exerciseId)] = checkpoint;
  writeJson(CHECKPOINTS_KEY, checkpoints);
}

function getStateFromCheckpoints(groupId: string): string {
  const checkpoints = getStoredCheckpoints();
  let state = "state_v0";
  for (const spec of lab01ExerciseSpecs) {
    const checkpoint = checkpoints[checkpointKey(groupId, spec.id)];
    if (checkpoint?.status === "submitted") {
      state = spec.nextState;
    }
  }
  return state;
}

function buildScoreboardForState(groupId: string, labId: string, stateVersion: string): SystemScoreboard {
  const step = Math.max(0, stateOrder.indexOf(stateVersion));
  const base = initialScoreboard as SystemScoreboard;
  return {
    ...base,
    groupId,
    labId,
    stateVersion,
    coreSkus: step >= 2 ? 5120 : 0,
    reviewSkus: step >= 2 ? 2260 : 0,
    eliminateSkus: step >= 2 ? 844 : 0,
    revenueProjected: base.revenueBase + step * 200000000,
    revenueImpact: step * 200000000,
    revenueAtRisk: step >= 2 ? 385000000 : 0,
    grossMarginProjected: base.grossMarginBase + step * 100000000,
    grossMarginImpact: step * 100000000,
    expectedMarginRate: base.expectedMarginRate,
    workingCapitalProjected: base.workingCapitalBase - step * 200000000,
    capitalReleased: step * 200000000,
    ebitdaImpact: step * 100000000,
    ddiCurrent: base.ddiCurrent,
    ddiTarget: step >= 5 ? base.ddiTarget : 66,
    checkpointCount: Object.values(getStoredCheckpoints()).filter((item) => item.groupId === groupId && item.status === "submitted").length,
    lastWorkbookName: Object.values(getStoredCheckpoints())
      .filter((item) => item.groupId === groupId && item.workbookName)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0]?.workbookName ?? null
  };
}

export async function getLab01DemoMode(): Promise<boolean> {
  return readJson<boolean>(DEMO_MODE_KEY, true);
}

export async function setLab01DemoMode(enabled: boolean): Promise<void> {
  writeJson(DEMO_MODE_KEY, enabled);
}

export async function getLab01State(groupId: string): Promise<string> {
  return getStateFromCheckpoints(groupId);
}

export async function getLab01Progress(groupId: string) {
  const state = getStateFromCheckpoints(groupId);
  const demoMode = await getLab01DemoMode();
  const checkpoints = getStoredCheckpoints();

  return lab01ExerciseSpecs.map((spec) => {
    const checkpoint = checkpoints[checkpointKey(groupId, spec.id)];
    const requiredIndex = stateOrder.indexOf(spec.requiredState);
    const currentIndex = stateOrder.indexOf(state);
    const unlocked = demoMode || spec.id === "ex-00" || currentIndex >= requiredIndex;
    return {
      ...spec,
      status: checkpoint?.status === "submitted" ? "completed" : checkpoint ? "draft" : unlocked ? "available" : "locked",
      checkpoint
    };
  });
}

export async function getLabCheckpoint(groupId: string, exerciseId: string): Promise<LabCheckpoint | null> {
  return getStoredCheckpoints()[checkpointKey(groupId, exerciseId)] ?? null;
}

export async function saveLabCheckpoint(payload: Partial<LabCheckpoint>): Promise<LabCheckpoint> {
  if (!payload.groupId || !payload.labId || !payload.exerciseId) {
    throw new Error("Faltan datos del checkpoint.");
  }
  const now = new Date().toISOString();
  const existing = getStoredCheckpoints()[checkpointKey(payload.groupId, payload.exerciseId)];
  const checkpoint: LabCheckpoint = {
    id: existing?.id ?? `chk_${payload.groupId}_${payload.exerciseId}`,
    groupId: payload.groupId,
    labId: payload.labId,
    exerciseId: payload.exerciseId,
    status: "draft",
    workbookName: payload.workbookName ?? existing?.workbookName,
    reportName: payload.reportName ?? existing?.reportName,
    fields: { ...existing?.fields, ...payload.fields },
    confirmations: { ...existing?.confirmations, ...payload.confirmations },
    validationMessages: [{ type: "info", message: "Checkpoint guardado como borrador local." }],
    createdAt: existing?.createdAt ?? now,
    updatedAt: now
  };
  saveStoredCheckpoint(checkpoint);
  return checkpoint;
}

export async function submitLabCheckpoint(payload: Partial<LabCheckpoint> & { requiredFields?: string[]; requiredConfirmations?: string[] }): Promise<LabCheckpoint> {
  if (!payload.groupId || !payload.labId || !payload.exerciseId) {
    throw new Error("Faltan datos del checkpoint.");
  }
  const existing = getStoredCheckpoints()[checkpointKey(payload.groupId, payload.exerciseId)];
  const fields = { ...existing?.fields, ...payload.fields };
  const confirmations = { ...existing?.confirmations, ...payload.confirmations };
  const validationMessages: ValidationMessage[] = [];

  for (const field of payload.requiredFields ?? []) {
    if (!fields[field]?.trim()) {
      validationMessages.push({ type: "error", message: `Falta completar: ${field}.` });
    }
  }
  for (const confirmation of payload.requiredConfirmations ?? []) {
    if (!confirmations[confirmation]) {
      validationMessages.push({ type: "error", message: `Falta confirmar: ${confirmation}.` });
    }
  }
  if (!payload.workbookName && !existing?.workbookName) {
    validationMessages.push({ type: "error", message: "Subí tu workbook actualizado del Laboratorio 1 en formato .xlsx." });
  } else if (!(payload.workbookName ?? existing?.workbookName)?.toLowerCase().endsWith(".xlsx")) {
    validationMessages.push({ type: "error", message: "El checkpoint debe ser un workbook .xlsx." });
  }

  const checkpoint = await saveLabCheckpoint({
    ...payload,
    fields,
    confirmations,
    validationMessages
  });
  if (validationMessages.length > 0) {
    checkpoint.validationMessages = validationMessages;
    saveStoredCheckpoint(checkpoint);
    return checkpoint;
  }

  checkpoint.status = "submitted";
  checkpoint.validationMessages = [
    ...(!checkpoint.reportName ? [{ type: "warning" as const, message: "Checkpoint enviado sin reporte AI opcional." }] : []),
    { type: "success", message: "Checkpoint registrado. Dashboard mock actualizado." }
  ];
  checkpoint.updatedAt = new Date().toISOString();
  saveStoredCheckpoint(checkpoint);

  const state = getStateFromCheckpoints(checkpoint.groupId);
  saveStoredScoreboard(buildScoreboardForState(checkpoint.groupId, checkpoint.labId, state));
  return checkpoint;
}

function buildSubmission(payload: Partial<Submission>, status: Submission["status"]): Submission {
  const now = new Date().toISOString();
  const existing =
    payload.groupId && payload.exerciseId
      ? getStoredSubmissions()[submissionKey(payload.groupId, payload.exerciseId)]
      : undefined;

  if (!payload.groupId || !payload.labId || !payload.exerciseId) {
    throw new Error("Faltan datos de grupo, laboratorio o ejercicio.");
  }

  return {
    id: existing?.id ?? `sub_${payload.groupId}_${payload.exerciseId}`,
    groupId: payload.groupId,
    labId: payload.labId,
    exerciseId: payload.exerciseId,
    version: status === "submitted" ? (existing?.version ?? 0) + 1 : existing?.version ?? 0,
    thesis: payload.thesis ?? existing?.thesis ?? "",
    initialHypothesis: payload.initialHypothesis ?? existing?.initialHypothesis ?? "",
    decisionCriteria: payload.decisionCriteria ?? existing?.decisionCriteria ?? "",
    risksTradeoffs: payload.risksTradeoffs ?? existing?.risksTradeoffs ?? "",
    uploadedExcelName: payload.uploadedExcelName ?? existing?.uploadedExcelName,
    uploadedReportName: payload.uploadedReportName ?? existing?.uploadedReportName,
    status,
    validationMessages: payload.validationMessages ?? existing?.validationMessages ?? [],
    confirmations: {
      ...emptyConfirmations,
      ...existing?.confirmations,
      ...payload.confirmations
    },
    createdAt: existing?.createdAt ?? now,
    updatedAt: now
  };
}

export async function getGroups(): Promise<Group[]> {
  return groups as Group[];
}

export async function setCurrentGroup(groupId: string): Promise<void> {
  if (!hasStorage()) return;
  window.localStorage.setItem(CURRENT_GROUP_KEY, groupId);
}

export async function getCurrentGroup(): Promise<Group | null> {
  if (!hasStorage()) return null;
  const groupId = window.localStorage.getItem(CURRENT_GROUP_KEY);
  return ((groups as Group[]).find((group) => group.id === groupId) ?? null);
}

export async function getLabs(): Promise<Lab[]> {
  return labs as Lab[];
}

export async function getExercise(labId: string, exerciseId: string): Promise<Exercise | null> {
  return (
    (exercises as Exercise[]).find(
      (exercise) => exercise.labId === labId && exercise.id === exerciseId
    ) ?? null
  );
}

export async function getSubmission(groupId: string, exerciseId: string): Promise<Submission | null> {
  return getStoredSubmissions()[submissionKey(groupId, exerciseId)] ?? null;
}

export async function saveDraftSubmission(payload: Partial<Submission>): Promise<Submission> {
  const submission = buildSubmission(payload, "draft");
  submission.validationMessages = [
    {
      type: "info",
      message: "Borrador guardado localmente."
    }
  ];
  saveStoredSubmission(submission);
  return submission;
}

export async function submitExercise(payload: Partial<Submission>): Promise<Submission> {
  const validationMessages: ValidationMessage[] = [];

  if (!payload.thesis?.trim()) {
    validationMessages.push({ type: "error" as const, message: "La recomendación ejecutiva es obligatoria." });
  }

  if (!payload.initialHypothesis?.trim()) {
    validationMessages.push({
      type: "error" as const,
      message: "El diagnóstico del equipo es obligatorio."
    });
  }

  if (!payload.decisionCriteria?.trim()) {
    validationMessages.push({
      type: "error" as const,
      message: "Los criterios de decisión son obligatorios."
    });
  }

  if (!payload.risksTradeoffs?.trim()) {
    validationMessages.push({
      type: "error" as const,
      message: "Los riesgos y cuidados son obligatorios."
    });
  }

  if (!payload.uploadedExcelName) {
    validationMessages.push({ type: "error" as const, message: "El Excel completado es obligatorio." });
  } else if (!payload.uploadedExcelName.toLowerCase().endsWith(".xlsx")) {
    validationMessages.push({ type: "error" as const, message: "El Excel debe tener extensión .xlsx." });
  }

  const confirmations = { ...emptyConfirmations, ...payload.confirmations };
  const missingConfirmations = requiredConfirmationKeys.some((key) => !confirmations[key]);
  if (missingConfirmations) {
    validationMessages.push({
      type: "error" as const,
      message: "Faltan confirmaciones obligatorias antes de enviar."
    });
  }

  if (validationMessages.length > 0) {
    const rejectedDraft = buildSubmission({ ...payload, validationMessages }, "draft");
    saveStoredSubmission(rejectedDraft);
    return rejectedDraft;
  }

  if (!payload.uploadedReportName) {
    validationMessages.push({
      type: "warning",
      message: "Entrega enviada sin reporte AI opcional. El comité podrá revisar la tesis y el Excel."
    });
  }

  const submission = buildSubmission(
    {
      ...payload,
      validationMessages: [
        ...validationMessages,
        {
          type: "success",
          message: "Entrega enviada. Estado oficial actualizado a state_v1 mock."
        }
      ]
    },
    "submitted"
  );

  saveStoredSubmission(submission);
  saveStoredScoreboard(buildScoreboardV1(submission.groupId, submission.labId));
  return submission;
}

export async function getSystemScoreboard(groupId: string, labId: string): Promise<SystemScoreboard> {
  const currentState = getStateFromCheckpoints(groupId);
  const stored = getStoredScoreboards()[`${groupId}:${labId}`];
  // Usar el scoreboard almacenado solo si corresponde al estado actual y a la versión actual del mock.
  // Si el estado o la versión cambiaron, se recalcula para reflejar correcciones de datos.
  if (stored && stored.stateVersion === currentState && (stored as any).__version === SCOREBOARD_VERSION) {
    return stored;
  }

  const scoreboard = buildScoreboardForState(groupId, labId, currentState);
  (scoreboard as any).__version = SCOREBOARD_VERSION;
  return scoreboard;
}

export async function getAdminSubmissions(): Promise<Submission[]> {
  return Object.values(getStoredSubmissions()).sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt)
  );
}
