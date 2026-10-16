import {
  GenerateResponseSchema,
  type GenerateResponse,
} from "../../shared/generateSchema.js";

export type GenerateErrorCode =
  | "INVALID_REQUEST"
  | "RATE_LIMITED"
  | "GENERATION_FAILED";

export class GenerateError extends Error {
  constructor(readonly code: GenerateErrorCode) {
    super(code);
    this.name = "GenerateError";
  }
}

function getErrorCode(value: unknown): GenerateErrorCode {
  if (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof value.error === "object" &&
    value.error !== null &&
    "code" in value.error
  ) {
    const code = value.error.code;
    if (
      code === "INVALID_REQUEST" ||
      code === "RATE_LIMITED" ||
      code === "GENERATION_FAILED"
    ) {
      return code;
    }
  }

  return "GENERATION_FAILED";
}

export async function requestLesson(topic: string): Promise<GenerateResponse> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, level: "beginner" }),
  });

  const payload: unknown = await response.json();

  if (!response.ok) {
    throw new GenerateError(getErrorCode(payload));
  }

  return GenerateResponseSchema.parse(payload);
}
