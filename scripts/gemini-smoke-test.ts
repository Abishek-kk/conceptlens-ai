import { ZodError } from "zod";
import { getServerConfig } from "../server/src/config.js";
import { generateLesson } from "../server/src/services/gemini.js";

async function main() {
  const { useFixture } = getServerConfig();
  if (useFixture) {
    throw new Error(
      "Set USE_FIXTURE=false in server/.env before running the live Gemini smoke test.",
    );
  }

  const lesson = await generateLesson("Neural Networks", "beginner");

  console.log(
    `Gemini smoke test passed: ${lesson.conceptMap.nodes.length} map nodes and ${lesson.quiz.length} linked quiz questions validated.`,
  );
}

function getHttpStatus(error: unknown): number | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof error.status === "number"
  ) {
    return error.status;
  }

  return undefined;
}

main().catch((error: unknown) => {
  const status = getHttpStatus(error);

  if (error instanceof Error && error.message.startsWith("Set ")) {
    console.error(error.message);
  } else if (status !== undefined) {
    console.error(
      `Gemini API returned HTTP ${status}. Check key permissions, model availability, quota, and schema support; provider details are not printed.`,
    );
  } else if (error instanceof ZodError) {
    const issuePaths = error.issues
      .map((issue) => issue.path.join(".") || "response")
      .join(", ");
    console.error(
      `Gemini output failed response validation at: ${issuePaths}. Generated content is omitted.`,
    );
  } else if (error instanceof SyntaxError) {
    console.error("Gemini returned invalid JSON. Provider output is omitted.");
  } else {
    console.error(
      `Gemini smoke test failed (${error instanceof Error ? error.name : "unknown error"}). Check the configured key, model, network, and structured-output support; provider details are not printed.`,
    );
  }

  process.exitCode = 1;
});
