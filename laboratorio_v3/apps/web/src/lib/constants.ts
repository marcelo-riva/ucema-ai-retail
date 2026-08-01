import type { Lab01ExerciseId } from "./lab01Content";
import type { Lab02ExerciseId } from "./lab02Content";

export const LAB01_EXERCISE_WORKBOOKS: Record<Lab01ExerciseId, string> = {
  "ex-00": "NEXUS_RETAIL_LAB01_EJ00_01.xlsx",
  "ex-01": "NEXUS_RETAIL_LAB01_EJ00_01.xlsx",
  ex02: "NEXUS_RETAIL_LAB01_EJ02_v4.xlsx",
  "ex-03": "NEXUS_RETAIL_LAB01_EJ03_FORECAST.xlsx",
  "ex-04": "NEXUS_RETAIL_LAB01_EJ04_INVENTARIO.xlsx"
};

export const LAB02_EXERCISE_WORKBOOKS: Partial<Record<Lab02ExerciseId, string>> = {
  "lab02-ex01": "NEXUS_LAB02_EJ01_SEGMENTACION.xlsx"
};

export const LAB01_WORKBOOK_FILENAME = "NEXUS_RETAIL_LAB01_WORKBOOK_COMPLETO.xlsx";
export const LAB01_EJ02_WORKBOOK_FILENAME = "NEXUS_RETAIL_LAB01_EJ02_v4.xlsx";
