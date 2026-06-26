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

export type SaveSubmissionInput = {
  groupId: string;
  exerciseId: string;
  exerciseVersion: number;
  responsesJson: Record<string, unknown>;
  filesJson?: Record<string, unknown>;
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
};
