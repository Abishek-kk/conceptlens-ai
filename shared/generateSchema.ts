import { z } from "zod";

export const GenerateRequestSchema = z.object({
  topic: z.string().trim().min(1).max(160),
  level: z.literal("beginner"),
});

const QuizQuestionSchema = z
  .object({
    question: z.string().trim().min(1),
    options: z.array(z.string().trim().min(1)).min(3).max(4),
    correctAnswerIndex: z.number().int().nonnegative(),
    explanation: z.string().trim().min(1),
    optionExplanations: z.array(z.string().trim().min(1)),
    nodeId: z.string().min(1),
  })
  .superRefine(({ options, optionExplanations }, context) => {
    if (optionExplanations.length !== options.length) {
      context.addIssue({
        code: "custom",
        path: ["optionExplanations"],
        message: "Every answer option must have an explanation.",
      });
    }
  });

export const GenerateResponseSchema = z.object({
  explanation: z.object({
    text: z.string().min(1),
    example: z.string().min(1),
  }),
  conceptMap: z.object({
    nodes: z
      .array(
        z.object({
          id: z.string().min(1),
          label: z.string().min(1),
          explanation: z.string().min(1),
        }),
      )
      .min(2),
    edges: z
      .array(
        z.object({
          id: z.string().min(1),
          source: z.string().min(1),
          target: z.string().min(1),
        }),
      )
      .min(1),
  }),
  quiz: z
    .array(QuizQuestionSchema)
    .length(3),
});

export type GenerateRequest = z.infer<typeof GenerateRequestSchema>;
export type GenerateResponse = z.infer<typeof GenerateResponseSchema>;
