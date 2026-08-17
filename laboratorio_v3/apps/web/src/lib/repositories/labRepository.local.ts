import type {
  ExerciseMeta,
  ExerciseStatus,
  LabRepository,
  LoginInput,
  LoginResult,
  Role,
  SaveSubmissionInput,
  Session,
  SubmitSubmissionInput,
  Submission,
  WorkbookUploadInput,
  WorkbookUploadResult
} from "./labRepository.types";


const SESSION_KEY = "nexus:session";
const EXERCISE_META_KEY = "nexus:exercise-meta";
const SUBMISSION_KEY_PREFIX = "nexus:submission:";

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

function submissionKey(groupId: string, exerciseId: string, exerciseVersion: number): string {
  return `${SUBMISSION_KEY_PREFIX}${groupId}:${exerciseId}:v${exerciseVersion}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function buildUsers(): Array<{ id: string; username: string; password: string; role: Role }> {
  const prefixes = ["iaec", "ero", "test"];
  const groups = prefixes.flatMap((prefix) =>
    Array.from({ length: 20 }, (_, index) => {
      const num = String(index + 1).padStart(2, "0");
      const id = `${prefix}-grupo${num}`;
      return {
        id,
        username: `${prefix.toUpperCase()} Grupo ${num}`,
        password: `laboratorio#${id}`,
        role: "group" as Role
      };
    })
  );

  return [
    ...groups,
    { id: "admin", username: "Admin", password: "admin#admin#messi", role: "admin" as Role }
  ];
}

const USERS = buildUsers();

export const INITIAL_EXERCISES: ExerciseMeta[] = [
  {
    id: "ex-00",
    labId: "lab-01",
    title: "Ejercicio 0: Exploración Inicial",
    path: "/labs/lab-01/exercises/ex-00",
    order: 0,
    status: "active",
    version: 1,
    workbookBaseKey: "NEXUS_RETAIL_LAB01_WORKBOOK_COMPLETO.xlsx"
  },
  {
    id: "ex-01",
    labId: "lab-01",
    title: "Ejercicio 1: Portfolio Optimization",
    path: "/labs/lab-01/exercises/ex-01",
    order: 1,
    status: "active",
    version: 1,
    workbookBaseKey: "NEXUS_RETAIL_LAB01_WORKBOOK_COMPLETO.xlsx"
  },
  {
    id: "ex02",
    labId: "lab-01",
    title: "Ejercicio 2: Pricing Optimization",
    path: "/labs/lab-01/exercises/ex-02",
    order: 2,
    status: "active",
    version: 1,
    workbookBaseKey: "NEXUS_RETAIL_LAB01_EJ02_v2.xlsx"
  },
  {
    id: "ex-03",
    labId: "lab-01",
    title: "Ejercicio 3: Forecast Engine",
    path: "/labs/lab-01/exercises/ex-03",
    order: 3,
    status: "active",
    version: 1,
    workbookBaseKey: "NEXUS_RETAIL_LAB01_EJ03_FORECAST.xlsx"
  },
  {
    id: "ex-04",
    labId: "lab-01",
    title: "Ejercicio 4: Inventory Optimization",
    path: "/labs/lab-01/exercises/ex-04",
    order: 4,
    status: "active",
    version: 1,
    workbookBaseKey: "NEXUS_RETAIL_LAB01_EJ04_INVENTARIO.xlsx"
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
    title: "Ejercicio 3: Integrador P1",
    path: "/labs/lab-02/exercises/ex-03",
    order: 3,
    status: "active",
    version: 1
  },
  {
    id: "lab02-ex04",
    labId: "lab-02",
    title: "Ejercicio 4: Integrador P2",
    path: "/labs/lab-02/exercises/ex-04",
    order: 4,
    status: "active",
    version: 1
  }
];

function ensureExerciseMeta(): ExerciseMeta[] {
  const existing = readJson<ExerciseMeta[]>(EXERCISE_META_KEY, []);
  const validIds = new Set(INITIAL_EXERCISES.map((ex) => ex.id));
  const byId = new Map(existing.map((ex) => [ex.id, ex]));

  // Eliminar ejercicios obsoletos (ej. ex-02 reemplazado por ex02).
  Array.from(byId.keys()).forEach((id) => {
    if (!validIds.has(id)) {
      byId.delete(id);
    }
  });

  for (const initial of INITIAL_EXERCISES) {
    const current = byId.get(initial.id);
    if (!current) {
      byId.set(initial.id, initial);
    } else if (current.title !== initial.title || current.path !== initial.path || initial.status === "active") {
      // Sincronizar título y path; activar ejercicios que deben estar activos por defecto.
      byId.set(initial.id, {
        ...current,
        title: initial.title,
        path: initial.path,
        status: initial.status === "active" ? "active" : current.status
      });
    }
  }

  const merged = Array.from(byId.values()).sort((a, b) => {
    if (a.labId !== b.labId) return a.labId.localeCompare(b.labId);
    return a.order - b.order;
  });
  writeJson(EXERCISE_META_KEY, merged);
  return merged;
}

function getExerciseMetaStorage(): ExerciseMeta[] {
  return readJson<ExerciseMeta[]>(EXERCISE_META_KEY, ensureExerciseMeta());
}

function saveExerciseMetaStorage(meta: ExerciseMeta[]): void {
  writeJson(EXERCISE_META_KEY, meta);
}

function saveSubmissionCore(input: SaveSubmissionInput): Submission {
  const key = submissionKey(input.groupId, input.exerciseId, input.exerciseVersion);
  const existing = readJson<Submission | null>(key, null);
  const now = nowIso();
  const submission: Submission = {
    id: existing?.id ?? `sub_${input.groupId}_${input.exerciseId}_v${input.exerciseVersion}`,
    groupId: input.groupId,
    exerciseId: input.exerciseId,
    exerciseVersion: input.exerciseVersion,
    status: input.status ?? existing?.status ?? "draft",
    responsesJson: { ...existing?.responsesJson, ...input.responsesJson },
    filesJson: { ...existing?.filesJson, ...input.filesJson },
    workbookUploadKey: input.workbookUploadKey ?? (input.filesJson?.workbookUploadKey as string | undefined) ?? existing?.workbookUploadKey,
    reportUploadKey: input.reportUploadKey ?? (input.filesJson?.reportUploadKey as string | undefined) ?? existing?.reportUploadKey,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    submittedAt: existing?.submittedAt
  };
  writeJson(key, submission);
  return submission;
}

export const localLabRepository: LabRepository = {
  async login(input: LoginInput): Promise<LoginResult> {
    const user = USERS.find((u) => u.id === input.username);
    if (!user || user.password !== input.password) {
      return { ok: false, error: "Usuario o contraseña incorrectos." };
    }

    const session: Session = {
      role: user.role,
      username: user.username,
      groupId: user.role === "group" ? user.id : undefined,
      token: `local-token-${user.id}-${Date.now()}`
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

  async listExercises(): Promise<ExerciseMeta[]> {
    return getExerciseMetaStorage().sort((a, b) => a.order - b.order);
  },

  async getExerciseMeta(input: { exerciseId: string }): Promise<ExerciseMeta | null> {
    return getExerciseMetaStorage().find((ex) => ex.id === input.exerciseId) ?? null;
  },

  async updateExerciseStatus(input: {
    exerciseId: string;
    status: ExerciseStatus;
  }): Promise<void> {
    const meta = getExerciseMetaStorage();
    const next = meta.map((ex) =>
      ex.id === input.exerciseId ? { ...ex, status: input.status } : ex
    );
    saveExerciseMetaStorage(next);
  },

  async getSubmission(input: {
    groupId: string;
    exerciseId: string;
    exerciseVersion: number;
  }): Promise<Submission | null> {
    return readJson<Submission | null>(
      submissionKey(input.groupId, input.exerciseId, input.exerciseVersion),
      null
    );
  },

  async saveSubmission(input: SaveSubmissionInput): Promise<Submission> {
    return saveSubmissionCore(input);
  },

  async submitSubmission(input: SubmitSubmissionInput): Promise<Submission> {
    const submission = saveSubmissionCore({ ...input, status: "submitted" });
    submission.submittedAt = nowIso();
    const key = submissionKey(submission.groupId, submission.exerciseId, submission.exerciseVersion);
    writeJson(key, submission);
    return submission;
  },

  async listSubmissions(input?: { exerciseId?: string; groupId?: string }): Promise<Submission[]> {
    if (!hasStorage()) return [];
    const prefix = SUBMISSION_KEY_PREFIX;
    const items: Submission[] = [];
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (!key || !key.startsWith(prefix)) continue;
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;
      try {
        const submission = JSON.parse(raw) as Submission;
        if (input?.exerciseId && submission.exerciseId !== input.exerciseId) continue;
        if (input?.groupId && submission.groupId !== input.groupId) continue;
        items.push(submission);
      } catch {
        // skip malformed entries
      }
    }
    return items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },

  async resetSubmission(input: {
    groupId: string;
    exerciseId: string;
    exerciseVersion?: number;
  }): Promise<void> {
    const version = input.exerciseVersion ?? 1;
    const key = submissionKey(input.groupId, input.exerciseId, version);
    const existing = readJson<Submission | null>(key, null);
    if (!existing) return;
    const now = nowIso();
    const reset: Submission = {
      ...existing,
      status: "reset",
      updatedAt: now
    };
    writeJson(key, reset);
  },

  async resetExerciseSubmissions(input: { exerciseId: string }): Promise<void> {
    if (!hasStorage()) return;
    const prefix = SUBMISSION_KEY_PREFIX;
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (!key || !key.startsWith(prefix)) continue;
      if (!key.includes(`:${input.exerciseId}:`)) continue;
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;
      try {
        const submission = JSON.parse(raw) as Submission;
        submission.status = "reset";
        submission.updatedAt = nowIso();
        window.localStorage.setItem(key, JSON.stringify(submission));
      } catch {
        // skip malformed entries
      }
    }
  },

  async uploadWorkbook(_input: WorkbookUploadInput): Promise<WorkbookUploadResult | null> {
    // Modo local: no subimos el archivo real. La metadata se guarda en filesJson.
    return null;
  },

  async getWorkbookDownloadUrl(_key: string): Promise<string | null> {
    // Modo local: no hay URLs de descarga de Storage.
    return null;
  }
};

export type VerificationResult = {
  name: string;
  ok: boolean;
  error?: string;
};

export async function verifyLocalRepository(): Promise<VerificationResult[]> {
  const results: VerificationResult[] = [];
  const repo = localLabRepository;

  try {
    await repo.logout();
    const badLogin = await repo.login({ username: "iaec-grupo01", password: "wrong" });
    results.push({
      name: "login rechaza contraseña incorrecta",
      ok: !badLogin.ok && Boolean(badLogin.error)
    });
  } catch (error) {
    results.push({ name: "login rechaza contraseña incorrecta", ok: false, error: String(error) });
  }

  try {
    const groupLogin = await repo.login({ username: "iaec-grupo01", password: "laboratorio#iaec-grupo01" });
    results.push({
      name: "login acepta iaec-grupo01",
      ok: groupLogin.ok && groupLogin.session?.role === "group" && groupLogin.session?.groupId === "iaec-grupo01"
    });
  } catch (error) {
    results.push({ name: "login acepta iaec-grupo01", ok: false, error: String(error) });
  }

  try {
    const adminLogin = await repo.login({ username: "admin", password: "admin#admin#messi" });
    results.push({
      name: "login acepta admin",
      ok: adminLogin.ok && adminLogin.session?.role === "admin" && !adminLogin.session?.groupId
    });
  } catch (error) {
    results.push({ name: "login acepta admin", ok: false, error: String(error) });
  }

  try {
    const session = await repo.getSession();
    results.push({ name: "getSession devuelve admin activo", ok: session?.role === "admin" });
  } catch (error) {
    results.push({ name: "getSession devuelve admin activo", ok: false, error: String(error) });
  }

  try {
    const exercises = await repo.listExercises({ role: "admin" });
    results.push({
      name: "listExercises devuelve 5 ejercicios ordenados",
      ok: exercises.length === 5 && exercises[0].id === "ex-00" && exercises[4].id === "ex-04"
    });
  } catch (error) {
    results.push({ name: "listExercises devuelve 5 ejercicios ordenados", ok: false, error: String(error) });
  }

  try {
    const meta = await repo.getExerciseMeta({ exerciseId: "ex-01" });
    results.push({
      name: "getExerciseMeta devuelve ex-01 activo",
      ok: meta?.id === "ex-01" && meta.status === "active"
    });
  } catch (error) {
    results.push({ name: "getExerciseMeta devuelve ex-01 activo", ok: false, error: String(error) });
  }

  try {
    await repo.updateExerciseStatus({ exerciseId: "ex02", status: "active" });
    const meta = await repo.getExerciseMeta({ exerciseId: "ex02" });
    results.push({ name: "updateExerciseStatus cambia ex02 a active", ok: meta?.status === "active" });
    await repo.updateExerciseStatus({ exerciseId: "ex02", status: "draft" });
  } catch (error) {
    results.push({ name: "updateExerciseStatus cambia ex02 a active", ok: false, error: String(error) });
  }

  try {
    const saved = await repo.saveSubmission({
      groupId: "iaec-grupo01",
      exerciseId: "ex-01",
      exerciseVersion: 1,
      responsesJson: { respuesta: "test" },
      filesJson: { workbookUploadKey: "book.xlsx" }
    });
    results.push({
      name: "saveSubmission crea borrador",
      ok: saved.status === "draft" && saved.responsesJson.respuesta === "test" && saved.workbookUploadKey === "book.xlsx"
    });
  } catch (error) {
    results.push({ name: "saveSubmission crea borrador", ok: false, error: String(error) });
  }

  try {
    const submitted = await repo.submitSubmission({
      groupId: "iaec-grupo01",
      exerciseId: "ex-01",
      exerciseVersion: 1,
      responsesJson: { respuesta: "enviada" }
    });
    results.push({
      name: "submitSubmission marca submitted",
      ok: submitted.status === "submitted" && Boolean(submitted.submittedAt)
    });
  } catch (error) {
    results.push({ name: "submitSubmission marca submitted", ok: false, error: String(error) });
  }

  try {
    const found = await repo.getSubmission({ groupId: "iaec-grupo01", exerciseId: "ex-01", exerciseVersion: 1 });
    results.push({
      name: "getSubmission recupera el envío",
      ok: found?.status === "submitted" && found.responsesJson.respuesta === "enviada"
    });
  } catch (error) {
    results.push({ name: "getSubmission recupera el envío", ok: false, error: String(error) });
  }

  try {
    const list = await repo.listSubmissions({ groupId: "iaec-grupo01" });
    results.push({ name: "listSubmissions filtra por grupo", ok: list.length >= 1 && list.every((s) => s.groupId === "iaec-grupo01") });
  } catch (error) {
    results.push({ name: "listSubmissions filtra por grupo", ok: false, error: String(error) });
  }

  try {
    await repo.resetSubmission({ groupId: "iaec-grupo01", exerciseId: "ex-01", exerciseVersion: 1 });
    const reset = await repo.getSubmission({ groupId: "iaec-grupo01", exerciseId: "ex-01", exerciseVersion: 1 });
    results.push({ name: "resetSubmission cambia status a reset", ok: reset?.status === "reset" });
  } catch (error) {
    results.push({ name: "resetSubmission cambia status a reset", ok: false, error: String(error) });
  }

  try {
    await repo.submitSubmission({
      groupId: "ero-grupo01",
      exerciseId: "ex-01",
      exerciseVersion: 1,
      responsesJson: {}
    });
    await repo.resetExerciseSubmissions({ exerciseId: "ex-01" });
    const list = await repo.listSubmissions({ exerciseId: "ex-01" });
    results.push({
      name: "resetExerciseSubmissions resetea todas las de un ejercicio",
      ok: list.length >= 2 && list.every((s) => s.status === "reset")
    });
  } catch (error) {
    results.push({
      name: "resetExerciseSubmissions resetea todas las de un ejercicio",
      ok: false,
      error: String(error)
    });
  }

  return results;
}
