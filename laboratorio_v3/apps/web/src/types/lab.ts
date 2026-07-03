export type Group = {
  id: string;
  name: string;
  role: "student" | "admin";
};

export type Lab = {
  id: string;
  title: string;
  description: string;
  status: "available" | "locked" | "completed" | "coming_soon";
  route?: string;
};

export type Exercise = {
  id: string;
  labId: string;
  title: string;
  objective: string;
  status: "locked" | "available" | "draft" | "submitted" | "completed";
  requiredStateVersion: string;
  nextStateVersion: string;
};

export type LabCheckpoint = {
  id: string;
  groupId: string;
  labId: string;
  exerciseId: string;
  status: "draft" | "submitted";
  workbookName?: string;
  reportName?: string;
  fields: Record<string, string>;
  confirmations: Record<string, boolean>;
  validationMessages: ValidationMessage[];
  createdAt: string;
  updatedAt: string;
};

export type ValidationMessage = {
  type: "error" | "warning" | "info" | "success";
  message: string;
};

export type SubmissionConfirmations = {
  completedSkuDecisions: boolean;
  completedStudentScoreboard: boolean;
  reviewedExecutiveCriteria: boolean;
  completedExecutiveRecommendation: boolean;
  completedProjection90Days?: boolean;
};

export type Submission = {
  id: string;
  groupId: string;
  labId: string;
  exerciseId: string;
  version: number;
  thesis: string;
  initialHypothesis: string;
  decisionCriteria: string;
  risksTradeoffs: string;
  uploadedExcelName?: string;
  uploadedReportName?: string;
  status: "draft" | "submitted" | "validated" | "rejected";
  validationMessages: ValidationMessage[];
  confirmations: SubmissionConfirmations;
  createdAt: string;
  updatedAt: string;
};

export type SystemScoreboard = {
  groupId: string;
  labId: string;
  stateVersion: string;
  totalSkus: number;
  coreSkus: number;
  reviewSkus: number;
  eliminateSkus: number;
  revenueBase: number;
  revenueProjected: number;
  revenueImpact: number;
  revenueAtRisk: number;
  grossMarginBase: number;
  grossMarginProjected: number;
  grossMarginImpact: number;
  expectedMarginRate: number;
  workingCapitalBase: number;
  workingCapitalProjected: number;
  capitalReleased: number;
  ebitdaImpact: number;
  ddiCurrent?: number;
  ddiTarget?: number;
  checkpointCount?: number;
  lastWorkbookName?: string | null;
};

export type TrendProjectionPoint = {
  label: string;
  phase: "historical" | "projected";
  revenue: number;
  margin: number;
  units: number;
};
