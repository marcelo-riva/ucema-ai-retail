# Data Contracts

## Group

```ts
export type Group = {
  id: string;
  name: string;
  role: "student" | "admin";
};
```

## Lab

```ts
export type Lab = {
  id: string;
  title: string;
  description: string;
  status: "available" | "locked" | "completed";
};
```

## Exercise

```ts
export type Exercise = {
  id: string;
  labId: string;
  title: string;
  objective: string;
  status: "locked" | "available" | "draft" | "submitted" | "completed";
  requiredStateVersion: string;
  nextStateVersion: string;
};
```

## Submission

```ts
export type Submission = {
  id: string;
  groupId: string;
  labId: string;
  exerciseId: string;
  version: number;
  thesis: string;
  uploadedExcelName?: string;
  uploadedReportName?: string;
  status: "draft" | "submitted" | "validated" | "rejected";
  validationMessages: ValidationMessage[];
  confirmations: SubmissionConfirmations;
  createdAt: string;
  updatedAt: string;
};
```

## SubmissionConfirmations

```ts
export type SubmissionConfirmations = {
  completedSkuDecisions: boolean;
  completedStudentScoreboard: boolean;
  completedExecutiveRecommendation: boolean;
  reviewedExecutiveCriteria: boolean;
  completedProjection90Days?: boolean;
};
```

## ValidationMessage

```ts
export type ValidationMessage = {
  type: "error" | "warning" | "info" | "success";
  message: string;
};
```

## SystemScoreboard

```ts
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
};
```
