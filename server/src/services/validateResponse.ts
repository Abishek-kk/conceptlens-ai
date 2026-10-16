import {
  GenerateResponseSchema,
  type GenerateResponse,
} from "../../../shared/generateSchema.js";

export function validateGenerateResponse(value: unknown): GenerateResponse {
  const result = GenerateResponseSchema.parse(value);
  const nodeIds = new Set(result.conceptMap.nodes.map((node) => node.id));

  if (nodeIds.size !== result.conceptMap.nodes.length) {
    throw new Error("Generated concept map contains duplicate node IDs.");
  }

  for (const edge of result.conceptMap.edges) {
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
      throw new Error("Generated concept map contains an unknown edge endpoint.");
    }
  }

  for (const question of result.quiz) {
    if (question.correctAnswerIndex >= question.options.length) {
      throw new Error("Generated quiz answer index is outside the option list.");
    }

    if (!nodeIds.has(question.nodeId)) {
      throw new Error("Generated quiz question references an unknown map node.");
    }
  }

  return result;
}
