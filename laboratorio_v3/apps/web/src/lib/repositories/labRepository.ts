import { amplifyLabRepository } from "./labRepository.amplify";
import { localLabRepository } from "./labRepository.local";
import type { LabRepository } from "./labRepository.types";

export function getLabRepository(): LabRepository {
  const mode = process.env.NEXT_PUBLIC_DATA_MODE ?? "local";
  if (mode === "amplify") return amplifyLabRepository;
  return localLabRepository;
}

export { localLabRepository, amplifyLabRepository };
export type { LabRepository } from "./labRepository.types";
