import { defineBackend } from "@aws-amplify/backend";
import { data } from "./data/resource";

/**
 * Amplify Gen 2 backend definition for NEXUS Retail Labs.
 *
 * Currently includes only the Data resource (ExerciseMeta and Submission).
 * Storage and Auth are intentionally left out for this MVP.
 */
export default defineBackend({
  data
});
