import type {
  ExerciseMeta,
  ExerciseStatus,
  LabRepository,
  LoginInput,
  LoginResult,
  Session,
  Submission,
  SaveSubmissionInput,
  SubmitSubmissionInput
} from "./labRepository.types";

function throwNotImplemented(): never {
  throw new Error("Amplify repository not implemented yet. Use NEXT_PUBLIC_DATA_MODE=local.");
}

export const amplifyLabRepository: LabRepository = {
  async login(_input: LoginInput): Promise<LoginResult> {
    throwNotImplemented();
  },

  async getSession(): Promise<Session | null> {
    throwNotImplemented();
  },

  async setSession(_session: Session): Promise<void> {
    throwNotImplemented();
  },

  async logout(): Promise<void> {
    throwNotImplemented();
  },

  async listExercises(_input: { role: "admin" | "group" }): Promise<ExerciseMeta[]> {
    throwNotImplemented();
  },

  async getExerciseMeta(_input: { exerciseId: string }): Promise<ExerciseMeta | null> {
    throwNotImplemented();
  },

  async updateExerciseStatus(_input: {
    exerciseId: string;
    status: ExerciseStatus;
  }): Promise<void> {
    throwNotImplemented();
  },

  async getSubmission(_input: {
    groupId: string;
    exerciseId: string;
    exerciseVersion: number;
  }): Promise<Submission | null> {
    throwNotImplemented();
  },

  async saveSubmission(_input: SaveSubmissionInput): Promise<Submission> {
    throwNotImplemented();
  },

  async submitSubmission(_input: SubmitSubmissionInput): Promise<Submission> {
    throwNotImplemented();
  },

  async listSubmissions(_input?: {
    exerciseId?: string;
    groupId?: string;
  }): Promise<Submission[]> {
    throwNotImplemented();
  },

  async resetSubmission(_input: {
    groupId: string;
    exerciseId: string;
    exerciseVersion?: number;
  }): Promise<void> {
    throwNotImplemented();
  },

  async resetExerciseSubmissions(_input: { exerciseId: string }): Promise<void> {
    throwNotImplemented();
  }
};
