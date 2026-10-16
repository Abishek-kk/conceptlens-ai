import { ApiError } from "@google/genai";
import { getServerConfig } from "../server/src/config.js";
import { generateLesson } from "../server/src/services/gemini.js";

async function main() {
  getServerConfig();
  const lesson = await generateLesson("Neural Networks", "beginner");

  console.log(
    `Gemini smoke test passed: ${lesson.conceptMap.nodes.length} map nodes and ${lesson.quiz.length} linked quiz questions validated.`,
  );
}

main().catch((error: unknown) => {
  if (error instanceof Error && error.message.startsWith("Set GEMINI_")) {
    console.error(error.message);
  } else if (error instanceof ApiError) {
    console.error(
      `Gemini API returned HTTP ${error.status}. Check key permissions, model availability, and schema support; provider details are not printed.`,
    );
  } else {
    console.error(
      "Gemini smoke test failed. Check the configured key, model, network, and structured-output support; provider details are not printed.",
    );
  }

  process.exitCode = 1;
});
