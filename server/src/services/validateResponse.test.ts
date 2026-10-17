import assert from "node:assert/strict";
import { test } from "node:test";
import { ZodError } from "zod";
import { neuralNetworksLesson } from "../fixtures/neuralNetworksLesson.js";
import { validateGenerateResponse } from "./validateResponse.js";

function assertOptionExplanationsInvalid(value: unknown) {
  assert.throws(() => validateGenerateResponse(value), (error: unknown) => {
    assert.ok(error instanceof ZodError);
    assert.ok(
      error.issues.some(
        (issue) => issue.path.at(-1) === "optionExplanations",
      ),
    );
    return true;
  });
}

test("rejects a quiz question with missing option explanations", () => {
  const firstQuestion = structuredClone(neuralNetworksLesson.quiz[0]);
  Reflect.deleteProperty(firstQuestion, "optionExplanations");

  assertOptionExplanationsInvalid({
    ...neuralNetworksLesson,
    quiz: [firstQuestion, ...neuralNetworksLesson.quiz.slice(1)],
  });
});

test("rejects option explanations that do not match the option count", () => {
  const firstQuestion = neuralNetworksLesson.quiz[0];
  const invalidFirstQuestion = {
    ...firstQuestion,
    optionExplanations: firstQuestion.optionExplanations.slice(1),
  };

  assertOptionExplanationsInvalid({
    ...neuralNetworksLesson,
    quiz: [invalidFirstQuestion, ...neuralNetworksLesson.quiz.slice(1)],
  });
});
