import { verifyAmplifyRepositoryScaffold } from "../apps/web/src/lib/repositories/labRepository.amplify";

async function main() {
  const results = await verifyAmplifyRepositoryScaffold();

  console.log("Amplify repository scaffold verification:");
  for (const result of results) {
    console.log(`${result.ok ? "PASS" : "FAIL"}: ${result.name}`);
    if (!result.ok && result.error) {
      console.log(`  error: ${result.error}`);
    }
  }

  const allOk = results.every((r) => r.ok);
  process.exit(allOk ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
