import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/**
 * Amplify Data schema for NEXUS Retail Labs.
 *
 * Authorization: public API key for the MVP closed-course scenario.
 * TODO: replace with Cognito/Auth or a server-side authorization strategy
 * before opening the app to broader audiences.
 */
const schema = a.schema({
  ExerciseMeta: a
    .model({
      id: a.string().required(),
      labId: a.string().required(),
      title: a.string().required(),
      path: a.string().required(),
      order: a.integer().required(),
      status: a.string().required(),
      version: a.integer().required()
    })
    .identifier(["id"])
    .authorization((allow) => [allow.publicApiKey()]),

  Submission: a
    .model({
      id: a.string().required(),
      groupId: a.string().required(),
      exerciseId: a.string().required(),
      exerciseVersion: a.integer().required(),
      status: a.string().required(),
      responsesJson: a.string().required(),
      submittedAt: a.string()
    })
    .identifier(["id"])
    .authorization((allow) => [allow.publicApiKey()])
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30
    }
  }
});
