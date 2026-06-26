export type Role = "admin" | "group";

export type ExerciseStatus = "draft" | "active" | "archived";

export type SubmissionStatus = "draft" | "submitted" | "reset";

export type Session = {
  role: Role;
  groupId?: string;
  username: string;
  token?: string;
};

export type ExerciseMeta = {
  id: string;
  labId: string;
  title: string;
  path: string;
  order: number;
  status: ExerciseStatus;
  version: number;
  workbookBaseKey?: string;
};

export type Submission = {
  id: string;
  groupId: string;
  exerciseId: string;
  exerciseVersion: number;
  status: SubmissionStatus;
  responsesJson: Record<string, unknown>;
  filesJson?: Record<string, unknown>;
  workbookUploadKey?: string;
  reportUploadKey?: string;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
};

export type LoginInput = {
  username: string;
  password: string;
};

export type LoginResult = {
  ok: boolean;
  session?: Session;
  error?: string;
};

export type WorkbookUploadInput = {
  file: File;
  groupId: string;
  labId: string;
  exerciseId: string;
  exerciseVersion: number;
};

export type WorkbookUploadResult = {
  key: string;
  url?: string;
};

export type SaveSubmissionInput = {
  groupId: string;
  exerciseId: string;
  exerciseVersion: number;
  responsesJson: Record<string, unknown>;
  filesJson?: Record<string, unknown>;
  workbookUploadKey?: string;
  reportUploadKey?: string;
  status?: SubmissionStatus;
};

export type SubmitSubmissionInput = SaveSubmissionInput;

export type LabRepository = {
  login(input: LoginInput): Promise<LoginResult>;

  getSession(): Promise<Session | null>;
  setSession(session: Session): Promise<void>;
  logout(): Promise<void>;

  listExercises(input: { role: Role }): Promise<ExerciseMeta[]>;
  getExerciseMeta(input: { exerciseId: string }): Promise<ExerciseMeta | null>;
  updateExerciseStatus(input: {
    exerciseId: string;
    status: ExerciseStatus;
  }): Promise<void>;

  getSubmission(input: {
    groupId: string;
    exerciseId: string;
    exerciseVersion: number;
  }): Promise<Submission | null>;

  saveSubmission(input: SaveSubmissionInput): Promise<Submission>;
  submitSubmission(input: SubmitSubmissionInput): Promise<Submission>;

  listSubmissions(input?: {
    exerciseId?: string;
    groupId?: string;
  }): Promise<Submission[]>;

  resetSubmission(input: {
    groupId: string;
    exerciseId: string;
    exerciseVersion?: number;
  }): Promise<void>;

  resetExerciseSubmissions(input: {
    exerciseId: string;
  }): Promise<void>;

  /**
   * Upload a workbook file to storage. In local mode this should not upload
   * the actual file and instead return a metadata-only result or null.
   */
  uploadWorkbook(input: WorkbookUploadInput): Promise<WorkbookUploadResult | null>;

  /**
   * Get a temporary download URL for a previously uploaded workbook.
   * Returns null in local mode or if the key is not available.
   */
  getWorkbookDownloadUrl?(key: string): Promise<string | null>;
};
