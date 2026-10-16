import { Router } from "express";
import { GenerateRequestSchema } from "../../../shared/generateSchema.js";
import { getServerConfig } from "../config.js";
import { generateLesson } from "../services/gemini.js";
import { validateGenerateResponse } from "../services/validateResponse.js";

const router = Router();
const fixtureTopic = "neural networks";

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

router.post("/generate", async (request, response) => {
  const parsedRequest = GenerateRequestSchema.safeParse(request.body);

  if (!parsedRequest.success) {
    response.status(400).json({ error: { code: "INVALID_REQUEST" } });
    return;
  }

  try {
    const { useFixture } = getServerConfig();

    if (useFixture) {
      if (parsedRequest.data.topic.toLowerCase() !== fixtureTopic) {
        response.status(503).json({ error: { code: "GENERATION_FAILED" } });
        return;
      }

      const { neuralNetworksLesson } = await import(
        "../fixtures/neuralNetworksLesson.js"
      );
      response.json(validateGenerateResponse(neuralNetworksLesson));
      return;
    }

    const lesson = await generateLesson(
      parsedRequest.data.topic,
      parsedRequest.data.level,
    );

    response.json(lesson);
  } catch (error) {
    const status = getHttpStatus(error);
    if (status === 429) {
      response.status(429).json({ error: { code: "RATE_LIMITED" } });
      return;
    }

    console.error("Lesson generation failed.", {
      name: error instanceof Error ? error.name : "unknown error",
      status,
    });
    response.status(502).json({ error: { code: "GENERATION_FAILED" } });
  }
});

export default router;
