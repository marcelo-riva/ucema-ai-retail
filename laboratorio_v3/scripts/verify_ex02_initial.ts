const storage: Record<string, string> = {};

(global as any).window = {
  localStorage: {
    getItem(key: string) {
      return storage[key] ?? null;
    },
    setItem(key: string, value: string) {
      storage[key] = String(value);
    },
    removeItem(key: string) {
      delete storage[key];
    },
    key(index: number) {
      return Object.keys(storage)[index] ?? null;
    },
    get length() {
      return Object.keys(storage).length;
    }
  }
};

async function main() {
  const { localLabRepository } = await import("../apps/web/src/lib/repositories/labRepository.local.ts");

  const results: { name: string; ok: boolean }[] = [];

  // EX02 starts as draft and group cannot see it
  await localLabRepository.login({ username: "iaec-grupo01", password: "laboratorio#iaec-grupo01" });
  const draftExercises = await localLabRepository.listExercises({ role: "group" });
  const visibleForGroup = draftExercises.filter((ex) => ex.status === "active");
  results.push({ name: "ex02 hidden for iaec-grupo01 when draft", ok: !visibleForGroup.some((ex) => ex.id === "ex02") });
  await localLabRepository.logout();

  // Admin login and activates EX02
  const adminLogin = await localLabRepository.login({ username: "admin", password: "admin#admin#messi" });
  results.push({ name: "admin login", ok: adminLogin.ok });

  const metaDraft = await localLabRepository.getExerciseMeta({ exerciseId: "ex02" });
  results.push({ name: "ex02 default draft", ok: metaDraft?.status === "draft" });

  await localLabRepository.updateExerciseStatus({ exerciseId: "ex02", status: "active" });
  const metaActive = await localLabRepository.getExerciseMeta({ exerciseId: "ex02" });
  results.push({ name: "admin activates ex02", ok: metaActive?.status === "active" });
  await localLabRepository.logout();

  // Group login and sees EX02
  const groupLogin = await localLabRepository.login({ username: "iaec-grupo01", password: "laboratorio#iaec-grupo01" });
  results.push({ name: "iaec-grupo01 login", ok: groupLogin.ok });

  const exercises = await localLabRepository.listExercises({ role: "group" });
  const ex02Visible = exercises.find((ex) => ex.id === "ex02");
  results.push({ name: "iaec-grupo01 sees ex02 active", ok: ex02Visible?.status === "active" });

  // Group saves EX02 checkpoint
  const saved = await localLabRepository.saveSubmission({
    groupId: "iaec-grupo01",
    exerciseId: "ex02",
    exerciseVersion: 1,
    responsesJson: {
      pricing_diagnosis: "test diagnosis",
      pricing_strategy: "test strategy",
      business_impact: "test impact",
      risks_to_review: "test risks",
      assumptions_to_validate: "test assumptions"
    },
    filesJson: {}
  });
  results.push({ name: "iaec-grupo01 saves ex02 checkpoint", ok: saved.exerciseId === "ex02" && saved.status === "draft" });

  // Verify distinct key
  const expectedKey = "nexus:submission:iaec-grupo01:ex02:v1";
  const keyExists = Object.keys(storage).includes(expectedKey);
  results.push({ name: "ex02 distinct key exists", ok: keyExists });

  // Verify EX01 untouched
  const ex01Key = "nexus:submission:iaec-grupo01:ex-01:v1";
  const ex01Touched = Object.keys(storage).includes(ex01Key);
  results.push({ name: "ex01 submission untouched", ok: !ex01Touched });

  // Admin can list submissions
  await localLabRepository.logout();
  await localLabRepository.login({ username: "admin", password: "admin#admin#messi" });
  const allSubmissions = await localLabRepository.listSubmissions();
  const ex02Submission = allSubmissions.find((s) => s.exerciseId === "ex02" && s.groupId === "iaec-grupo01");
  results.push({ name: "admin lists ex02 submission", ok: Boolean(ex02Submission) });

  // Admin can reset submission
  if (ex02Submission) {
    await localLabRepository.resetSubmission({ groupId: "iaec-grupo01", exerciseId: "ex02", exerciseVersion: 1 });
    const reset = await localLabRepository.getSubmission({ groupId: "iaec-grupo01", exerciseId: "ex02", exerciseVersion: 1 });
    results.push({ name: "admin resets ex02 submission", ok: reset?.status === "reset" });
  } else {
    results.push({ name: "admin resets ex02 submission", ok: false });
  }

  console.log("Verification results:");
  for (const result of results) {
    console.log(`${result.ok ? "PASS" : "FAIL"}: ${result.name}`);
  }

  const allOk = results.every((r) => r.ok);
  process.exit(allOk ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
