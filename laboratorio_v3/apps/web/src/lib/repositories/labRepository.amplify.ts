import { generateClient } from "aws-amplify/api";
import type {
  ExerciseMeta,
  ExerciseStatus,
  LabRepository,
  LoginInput,
  LoginResult,
  Session,
  Submission,
  SaveSubmissionInput,
  SubmitSubmissionInput,
  WorkbookUploadInput,
  WorkbookUploadResult
} from "./labRepository.types";
import type { Schema } from "../../../amplify/data/resource";

/**
 * Amplify-backed implementation of LabRepository.
 *
 * Auth/Session is kept as a simple localStorage-based mock login for the
 * closed-course MVP. Data (ExerciseMeta and Submission) persists in Amplify
 * Data via the public API key authorization mode.
 *
 * TODO: replace the simple login with Cognito/Auth or a server-side endpoint
 * before using this in a broader/production context.
 */

const SESSION_KEY = "nexus:session";

let clientInstance: ReturnType<typeof generateClient<Schema>> | null = null;

function getClient() {
  if (!clientInstance) {
    clientInstance = generateClient<Schema>();
  }
  return clientInstance;
}

function buildSubmissionId(groupId: string, exerciseId: string, exerciseVersion: number): string {
  return `${groupId}_${exerciseId}_v${exerciseVersion}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function hasStorage(): boolean {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readJson<T>(key: string, fallback: T): T {
  if (!hasStorage()) return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (!hasStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function removeKey(key: string): void {
  if (!hasStorage()) return;
  window.localStorage.removeItem(key);
}

function parseResponsesJson(responsesJson: string | null | undefined): Record<string, unknown> {
  if (!responsesJson) return {};
  try {
    return JSON.parse(responsesJson) as Record<string, unknown>;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("Failed to parse responsesJson:", error);
    return {};
  }
}

function stringifyResponsesJson(responsesJson: Record<string, unknown>): string {
  return JSON.stringify(responsesJson);
}

function mapExerciseMeta(item: Schema["ExerciseMeta"]["type"]): ExerciseMeta {
  return {
    id: item.id,
    labId: item.labId,
    title: item.title,
    path: item.path,
    order: item.order,
    status: item.status as ExerciseStatus,
    version: item.version
  };
}

function mapSubmission(item: Schema["Submission"]["type"]): Submission {
  return {
    id: item.id,
    groupId: item.groupId,
    exerciseId: item.exerciseId,
    exerciseVersion: item.exerciseVersion,
    status: item.status as Submission["status"],
    responsesJson: parseResponsesJson(item.responsesJson),
    createdAt: item.createdAt ?? item.updatedAt ?? nowIso(),
    updatedAt: item.updatedAt ?? nowIso(),
    submittedAt: item.submittedAt ?? undefined
  };
}

function buildUsers() {
  const groups = Array.from({ length: 20 }, (_, index) => {
    const num = String(index + 1).padStart(2, "0");
    return {
      id: `grupo${num}`,
      username: `Grupo ${num}`,
      password: `laboratorio#grupo${num}`,
      role: "group" as const
    };
  });
  return [
    ...groups,
    { id: "admin", username: "Admin", password: "admin#admin#messi", role: "admin" as const }
  ];
}

export const amplifyLabRepository: LabRepository = {
  // --------------------------------------------------------------------------
  // Auth / Session (temporary localStorage-based)
  // TODO: replace with real Auth before production.
  // --------------------------------------------------------------------------
  async login(input: LoginInput): Promise<LoginResult> {
    const users = buildUsers();
    const user = users.find((u) => u.id === input.username);
    if (!user || user.password !== input.password) {
      return { ok: false, error: "Usuario o contraseña incorrectos." };
    }

    const session: Session = {
      role: user.role,
      username: user.username,
      groupId: user.role === "group" ? user.id : undefined,
      token: `amplify-token-${user.id}-${Date.now()}`
    };
    writeJson(SESSION_KEY, session);
    return { ok: true, session };
  },

  async getSession(): Promise<Session | null> {
    return readJson<Session | null>(SESSION_KEY, null);
  },

  async setSession(session: Session): Promise<void> {
    writeJson(SESSION_KEY, session);
  },

  async logout(): Promise<void> {
    removeKey(SESSION_KEY);
  },

  // --------------------------------------------------------------------------
  // Exercise metadata (Amplify Data)
  // --------------------------------------------------------------------------
  async listExercises(input: { role: "admin" | "group" }): Promise<ExerciseMeta[]> {
    const { data, errors } = await getClient().models.ExerciseMeta.list();
    if (errors) throw new Error(`Error listando ejercicios: ${errors.map((e) => e.message).join(", ")}`);

    const items = (data ?? []).map(mapExerciseMeta).sort((a, b) => a.order - b.order);
    if (input.role === "group") {
      return items.filter((item) => item.status === "active");
    }
    return items;
  },

  async getExerciseMeta(input: { exerciseId: string }): Promise<ExerciseMeta | null> {
    const { data, errors } = await getClient().models.ExerciseMeta.get({ id: input.exerciseId });
    if (errors) throw new Error(`Error leyendo ejercicio: ${errors.map((e) => e.message).join(", ")}`);
    if (!data) return null;
    return mapExerciseMeta(data);
  },

  async updateExerciseStatus(input: {
    exerciseId: string;
    status: ExerciseStatus;
  }): Promise<void> {
    const { errors } = await getClient().models.ExerciseMeta.update({
      id: input.exerciseId,
      status: input.status
    });
    if (errors) throw new Error(`Error actualizando status: ${errors.map((e) => e.message).join(", ")}`);
  },

  // --------------------------------------------------------------------------
  // Submissions (Amplify Data)
  // --------------------------------------------------------------------------
  async getSubmission(input: {
    groupId: string;
    exerciseId: string;
    exerciseVersion: number;
  }): Promise<Submission | null> {
    const id = buildSubmissionId(input.groupId, input.exerciseId, input.exerciseVersion);
    const { data, errors } = await getClient().models.Submission.get({ id });
    if (errors) throw new Error(`Error leyendo submission: ${errors.map((e) => e.message).join(", ")}`);
    if (!data) return null;
    return mapSubmission(data);
  },

  async saveSubmission(input: SaveSubmissionInput): Promise<Submission> {
    const id = buildSubmissionId(input.groupId, input.exerciseId, input.exerciseVersion);

    const { data: existing } = await getClient().models.Submission.get({ id });

    if (existing) {
      const { data, errors } = await getClient().models.Submission.update({
        id,
        groupId: input.groupId,
        exerciseId: input.exerciseId,
        exerciseVersion: input.exerciseVersion,
        status: input.status ?? existing.status ?? "draft",
        responsesJson: stringifyResponsesJson(input.responsesJson)
      });
      if (errors) throw new Error(`Error guardando submission: ${errors.map((e) => e.message).join(", ")}`);
      if (!data) throw new Error("No se pudo actualizar la submission.");
      return mapSubmission(data);
    }

    const { data, errors } = await getClient().models.Submission.create({
      id,
      groupId: input.groupId,
      exerciseId: input.exerciseId,
      exerciseVersion: input.exerciseVersion,
      status: input.status ?? "draft",
      responsesJson: stringifyResponsesJson(input.responsesJson)
    });
    if (errors) throw new Error(`Error creando submission: ${errors.map((e) => e.message).join(", ")}`);
    if (!data) throw new Error("No se pudo crear la submission.");
    return mapSubmission(data);
  },

  async submitSubmission(input: SubmitSubmissionInput): Promise<Submission> {
    const id = buildSubmissionId(input.groupId, input.exerciseId, input.exerciseVersion);
    const now = nowIso();

    const { data: existing } = await getClient().models.Submission.get({ id });

    if (existing) {
      const { data, errors } = await getClient().models.Submission.update({
        id,
        groupId: input.groupId,
        exerciseId: input.exerciseId,
        exerciseVersion: input.exerciseVersion,
        status: "submitted",
        responsesJson: stringifyResponsesJson(input.responsesJson),
        submittedAt: now
      });
      if (errors) throw new Error(`Error enviando submission: ${errors.map((e) => e.message).join(", ")}`);
      if (!data) throw new Error("No se pudo enviar la submission.");
      return mapSubmission(data);
    }

    const { data, errors } = await getClient().models.Submission.create({
      id,
      groupId: input.groupId,
      exerciseId: input.exerciseId,
      exerciseVersion: input.exerciseVersion,
      status: "submitted",
      responsesJson: stringifyResponsesJson(input.responsesJson),
      submittedAt: now
    });
    if (errors) throw new Error(`Error creando submission enviada: ${errors.map((e) => e.message).join(", ")}`);
    if (!data) throw new Error("No se pudo crear la submission enviada.");
    return mapSubmission(data);
  },

  async listSubmissions(input?: { exerciseId?: string; groupId?: string }): Promise<Submission[]> {
    const { data, errors } = await getClient().models.Submission.list();
    if (errors) throw new Error(`Error listando submissions: ${errors.map((e) => e.message).join(", ")}`);

    let items = (data ?? []).map(mapSubmission);
    if (input?.exerciseId) {
      items = items.filter((item) => item.exerciseId === input.exerciseId);
    }
    if (input?.groupId) {
      items = items.filter((item) => item.groupId === input.groupId);
    }
    return items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },

  async resetSubmission(input: {
    groupId: string;
    exerciseId: string;
    exerciseVersion?: number;
  }): Promise<void> {
    const version = input.exerciseVersion ?? 1;
    const id = buildSubmissionId(input.groupId, input.exerciseId, version);
    const { data: existing } = await getClient().models.Submission.get({ id });
    if (!existing) return;

    const { errors } = await getClient().models.Submission.update({
      id,
      status: "reset",
      responsesJson: "{}",
      submittedAt: null
    });
    if (errors) throw new Error(`Error reseteando submission: ${errors.map((e) => e.message).join(", ")}`);
  },

  async resetExerciseSubmissions(input: { exerciseId: string }): Promise<void> {
    const { data, errors } = await getClient().models.Submission.list({
      filter: { exerciseId: { eq: input.exerciseId } }
    });
    if (errors) throw new Error(`Error listando submissions para reset: ${errors.map((e) => e.message).join(", ")}`);

    const items = data ?? [];
    for (const item of items) {
      await getClient().models.Submission.update({
        id: item.id,
        status: "reset",
        responsesJson: "{}",
        submittedAt: null
      });
    }
  },

  // --------------------------------------------------------------------------
  // Storage: intentionally disabled for this MVP.
  // --------------------------------------------------------------------------
  async uploadWorkbook(_input: WorkbookUploadInput): Promise<WorkbookUploadResult | null> {
    // Storage is not part of this MVP. Workbooks are provided by teachers.
    return null;
  },

  async getWorkbookDownloadUrl(_key: string): Promise<string | null> {
    // Storage is not part of this MVP.
    return null;
  }
};

/**
 * Seed helper: creates the initial ExerciseMeta entries if they do not exist.
 * Can be called from the admin dashboard.
 */
export async function seedExerciseMeta(): Promise<void> {
  const initialExercises: ExerciseMeta[] = [
    {
      id: "ex-00",
      labId: "lab-01",
      title: "Exploración inicial",
      path: "/labs/lab-01/exercises/ex-00",
      order: 0,
      status: "active",
      version: 1
    },
    {
      id: "ex-01",
      labId: "lab-01",
      title: "Portfolio Optimization",
      path: "/labs/lab-01/exercises/ex-01",
      order: 1,
      status: "active",
      version: 1
    },
    {
      id: "ex02",
      labId: "lab-01",
      title: "Pricing Optimization",
      path: "/labs/lab-01/exercises/ex-02",
      order: 2,
      status: "active",
      version: 1
    },
    {
      id: "ex-03",
      labId: "lab-01",
      title: "Forecast Engine",
      path: "/labs/lab-01/exercises/ex-03",
      order: 3,
      status: "draft",
      version: 1
    },
    {
      id: "ex-04",
      labId: "lab-01",
      title: "Inventory & Working Capital",
      path: "/labs/lab-01/exercises/ex-04",
      order: 4,
      status: "draft",
      version: 1
    },
    {
      id: "lab02-ex01",
      labId: "lab-02",
      title: "Ejercicio 1: Customer Segmentation",
      path: "/labs/lab-02/exercises/ex-01",
      order: 1,
      status: "active",
      version: 1
    },
    {
      id: "lab02-ex02",
      labId: "lab-02",
      title: "Ejercicio 2: VIP Strategy Simulator",
      path: "/labs/lab-02/exercises/ex-02",
      order: 2,
      status: "active",
      version: 1
    },
    {
      id: "lab02-ex03",
      labId: "lab-02",
      title: "Ejercicio 3: Churn Recovery Simulator",
      path: "/labs/lab-02/exercises/ex-03",
      order: 3,
      status: "active",
      version: 1
    },
    {
      id: "lab02-ex04",
      labId: "lab-02",
      title: "Ejercicio 4: Opportunistic Customer Simulator",
      path: "/labs/lab-02/exercises/ex-04",
      order: 4,
      status: "active",
      version: 1
    },
    {
      id: "lab02-ex05",
      labId: "lab-02",
      title: "Ejercicio 5: Marketing ROI Consolidator",
      path: "/labs/lab-02/exercises/ex-05",
      order: 5,
      status: "active",
      version: 1
    }
  ];

  for (const exercise of initialExercises) {
    const { data: existing } = await getClient().models.ExerciseMeta.get({ id: exercise.id });

    if (!existing) {
      const { errors } = await getClient().models.ExerciseMeta.create({
        ...exercise
      });
      if (errors) {
        // eslint-disable-next-line no-console
        console.warn(`Error seeding ${exercise.id}:`, errors);
      }
      continue;
    }

    if (exercise.status === "active" && existing.status !== "active") {
      const { errors } = await getClient().models.ExerciseMeta.update({
        id: exercise.id,
        status: "active"
      });
      if (errors) {
        // eslint-disable-next-line no-console
        console.warn(`Error activating ${exercise.id}:`, errors);
      }
    }
  }
}

/**
 * Verification helper. Runs a quick smoke test against the Amplify repository.
 * Requires a running sandbox or deployed backend and NEXT_PUBLIC_DATA_MODE=amplify.
 */
export async function verifyAmplifyRepository(): Promise<
  Array<{ name: string; ok: boolean; error?: string }>
> {
  const results: Array<{ name: string; ok: boolean; error?: string }> = [];
  const repo = amplifyLabRepository;

  async function run(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      results.push({ name, ok: true });
    } catch (error) {
      results.push({ name, ok: false, error: String(error) });
    }
  }

  await run("login admin", async () => {
    const result = await repo.login({ username: "admin", password: "admin#admin#messi" });
    if (!result.ok) throw new Error(result.error);
  });

  await run("seed exercises", async () => {
    await seedExerciseMeta();
  });

  await run("listExercises admin", async () => {
    const exercises = await repo.listExercises({ role: "admin" });
    if (exercises.length < 10) throw new Error("Faltan ejercicios");
  });

  await run("updateExerciseStatus", async () => {
    await repo.updateExerciseStatus({ exerciseId: "ex02", status: "active" });
    const meta = await repo.getExerciseMeta({ exerciseId: "ex02" });
    if (meta?.status !== "active") throw new Error("No se actualizó");
  });

  await run("saveSubmission", async () => {
    await repo.saveSubmission({
      groupId: "grupo01",
      exerciseId: "ex-01",
      exerciseVersion: 1,
      responsesJson: { test: "value" }
    });
  });

  await run("getSubmission", async () => {
    const submission = await repo.getSubmission({ groupId: "grupo01", exerciseId: "ex-01", exerciseVersion: 1 });
    if (!submission) throw new Error("No se encontró");
    if (submission.responsesJson.test !== "value") throw new Error("responsesJson no coincide");
  });

  await run("listSubmissions", async () => {
    const submissions = await repo.listSubmissions({ exerciseId: "ex-01" });
    if (submissions.length === 0) throw new Error("No hay submissions");
  });

  await run("resetSubmission", async () => {
    await repo.resetSubmission({ groupId: "grupo01", exerciseId: "ex-01", exerciseVersion: 1 });
    const submission = await repo.getSubmission({ groupId: "grupo01", exerciseId: "ex-01", exerciseVersion: 1 });
    if (submission?.status !== "reset") throw new Error("No se reseteó");
  });

  return results;
}
