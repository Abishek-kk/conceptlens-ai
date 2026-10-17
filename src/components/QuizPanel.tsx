import type { GenerateResponse } from "../../shared/generateSchema.js";

type QuizQuestion = GenerateResponse["quiz"][number];

type QuizPanelProps = {
  quiz: GenerateResponse["quiz"];
  mapNodes: GenerateResponse["conceptMap"]["nodes"];
  questionIndex: number;
  answers: Array<number | null>;
  reviewedNodeIds: string[];
  onAnswer: (answerIndex: number) => void;
  onNext: () => void;
  onTryAnotherTopic: () => void;
};

function QuizSummary({
  quiz,
  mapNodes,
  answers,
  reviewedNodeIds,
  onTryAnotherTopic,
}: Omit<QuizPanelProps, "questionIndex" | "onAnswer" | "onNext">) {
  const score = answers.reduce<number>(
    (total, answer, index) =>
      total + Number(answer === quiz[index]?.correctAnswerIndex),
    0,
  );
  const reviewNodes = mapNodes.filter((node) =>
    reviewedNodeIds.includes(node.id),
  );

  return (
    <section aria-live="polite">
      <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">
        Quiz complete
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
        You got {score} out of {quiz.length} correct
      </h2>
      <div className="mt-5 rounded-xl bg-amber-50 p-4">
        <h3 className="font-semibold text-amber-950">Concepts to review</h3>
        {reviewNodes.length ? (
          <ul className="mt-2 list-inside list-disc space-y-1 text-base text-amber-950">
            {reviewNodes.map((node) => (
              <li key={node.id}>{node.label}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-base text-amber-950">
            No concepts were marked for review this time.
          </p>
        )}
      </div>
      <button
        className="mt-6 min-h-12 rounded-xl bg-indigo-600 px-5 text-base font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
        onClick={onTryAnotherTopic}
        type="button"
      >
        Try another topic
      </button>
    </section>
  );
}

function QuizQuestionView({
  question,
  questionIndex,
  selectedAnswer,
  onAnswer,
  onNext,
  isLastQuestion,
  reviewNodeLabel,
}: {
  question: QuizQuestion;
  questionIndex: number;
  selectedAnswer: number | null;
  onAnswer: (answerIndex: number) => void;
  onNext: () => void;
  isLastQuestion: boolean;
  reviewNodeLabel: string | undefined;
}) {
  const isCorrect = selectedAnswer === question.correctAnswerIndex;

  return (
    <section aria-live="polite">
      <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">
        Quick check
      </p>
      <div className="mt-1 flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight text-stone-950">
          Question {questionIndex + 1} of 3
        </h2>
        <span className="text-sm font-medium text-stone-500">
          {questionIndex + 1} / 3
        </span>
      </div>
      <div
        aria-label={`Question ${questionIndex + 1} of 3`}
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-stone-100"
        role="progressbar"
        aria-valuemax={3}
        aria-valuemin={1}
        aria-valuenow={questionIndex + 1}
      >
        <div
          className="h-full rounded-full bg-indigo-600 transition-all"
          style={{ width: `${((questionIndex + 1) / 3) * 100}%` }}
        />
      </div>
      <h3 className="mt-5 text-lg font-semibold leading-7 text-stone-900">
        {question.question}
      </h3>
      <div className="mt-4 space-y-2">
        {question.options.map((option, index) => {
          const isChosen = selectedAnswer === index;
          const isCorrectOption = index === question.correctAnswerIndex;
          const stateClass =
            selectedAnswer === null
              ? "border-stone-200 bg-white hover:border-indigo-300 hover:bg-indigo-50"
              : isCorrectOption
                ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                : isChosen
                  ? "border-rose-300 bg-rose-50 text-rose-950"
                  : "border-stone-200 bg-white text-stone-500";

          return (
            <button
              aria-pressed={isChosen}
              className={`min-h-12 w-full rounded-xl border px-4 py-3 text-left text-base transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 disabled:cursor-default ${stateClass}`}
              disabled={selectedAnswer !== null}
              key={`${index}-${option}`}
              onClick={() => onAnswer(index)}
              type="button"
            >
              <span className="font-medium">{option}</span>
              {selectedAnswer !== null && isCorrectOption && (
                <span className="ml-2 text-sm font-semibold">Correct answer</span>
              )}
            </button>
          );
        })}
      </div>
      {selectedAnswer !== null && (
        <div
          className={`mt-4 rounded-xl p-4 ${
            isCorrect
              ? "bg-emerald-50 text-emerald-950"
              : "bg-rose-50 text-rose-950"
          }`}
        >
          <p className="font-semibold">{isCorrect ? "Correct" : "Not quite"}</p>
          {isCorrect ? (
            <p className="mt-1 text-base leading-6">{question.explanation}</p>
          ) : (
            <div className="mt-2 space-y-2 text-base leading-6">
              <p>
                <span className="font-semibold">Why your choice doesn’t fit: </span>
                {question.optionExplanations[selectedAnswer]}
              </p>
              <p>
                <span className="font-semibold">
                  Why the correct answer fits:{" "}
                </span>
                {question.explanation}
              </p>
              {reviewNodeLabel && (
                <p className="rounded-lg bg-amber-100 px-3 py-2 font-semibold text-amber-950">
                  Review this: {reviewNodeLabel}
                </p>
              )}
            </div>
          )}
        </div>
      )}
      {selectedAnswer !== null && (
        <button
          className="mt-5 min-h-12 rounded-xl bg-indigo-600 px-5 text-base font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
          onClick={onNext}
          type="button"
        >
          {isLastQuestion ? "See results" : "Next"}
        </button>
      )}
    </section>
  );
}

export function QuizPanel(props: QuizPanelProps) {
  const {
    quiz,
    mapNodes,
    questionIndex,
    answers,
    reviewedNodeIds,
    onAnswer,
    onNext,
    onTryAnotherTopic,
  } = props;

  return (
    <section
      aria-labelledby="quiz-heading"
      className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
      id="quiz"
    >
      {questionIndex >= quiz.length ? (
        <QuizSummary
          quiz={quiz}
          mapNodes={mapNodes}
          answers={answers}
          reviewedNodeIds={reviewedNodeIds}
          onTryAnotherTopic={onTryAnotherTopic}
        />
      ) : (
        <QuizQuestionView
          question={quiz[questionIndex]}
          questionIndex={questionIndex}
          selectedAnswer={answers[questionIndex] ?? null}
          onAnswer={onAnswer}
          onNext={onNext}
          isLastQuestion={questionIndex === quiz.length - 1}
          reviewNodeLabel={mapNodes.find(
            (node) => node.id === quiz[questionIndex].nodeId,
          )?.label}
        />
      )}
    </section>
  );
}
