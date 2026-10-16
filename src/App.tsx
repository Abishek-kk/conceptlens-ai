import { useState } from "react";
import { GenerateError, requestLesson } from "./api/generateClient.js";
import { ConceptMap } from "./components/ConceptMap.js";
import { ExplanationCard } from "./components/ExplanationCard.js";
import { QuizPanel } from "./components/QuizPanel.js";
import { TopicEntryForm, exampleTopics } from "./components/TopicEntryForm.js";
import type { GenerateResponse } from "../shared/generateSchema.js";

export default function App() {
  const [topic, setTopic] = useState("");
  const [lesson, setLesson] = useState<GenerateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<number | null>>([]);
  const [reviewedNodeIds, setReviewedNodeIds] = useState<string[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  async function generate() {
    if (!topic.trim() || loading) {
      return;
    }

    setLoading(true);
    setErrorCode(null);
    setLesson(null);
    setQuestionIndex(0);
    setAnswers([]);
    setReviewedNodeIds([]);
    setSelectedNodeId(null);

    try {
      const result = await requestLesson(topic.trim());
      setLesson(result);
      setSelectedNodeId(result.conceptMap.nodes[0]?.id ?? null);
    } catch (error) {
      setErrorCode(
        error instanceof GenerateError ? error.code : "GENERATION_FAILED",
      );
    } finally {
      setLoading(false);
    }
  }

  function answerQuestion(answerIndex: number) {
    if (!lesson || answers[questionIndex] !== undefined) {
      return;
    }

    setAnswers((previous) => {
      const next = [...previous];
      next[questionIndex] = answerIndex;
      return next;
    });

    const question = lesson.quiz[questionIndex];
    if (answerIndex !== question.correctAnswerIndex) {
      setReviewedNodeIds((previous) =>
        previous.includes(question.nodeId)
          ? previous
          : [...previous, question.nodeId],
      );
    }
  }

  function reset() {
    setTopic("");
    setLesson(null);
    setErrorCode(null);
    setQuestionIndex(0);
    setAnswers([]);
    setReviewedNodeIds([]);
    setSelectedNodeId(null);
  }

  const errorMessage =
    errorCode === "RATE_LIMITED"
      ? "We're getting a lot of requests. Please wait a moment and try again."
      : "We couldn't generate this topic right now. Please try again.";

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
        <a
          className="text-sm font-bold tracking-[0.14em] text-indigo-700"
          href="/"
          onClick={(event) => {
            event.preventDefault();
            reset();
          }}
        >
          CONCEPTLENS AI
        </a>
        {lesson && (
          <span className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-600">
            Learning: {topic}
          </span>
        )}
      </header>

      <main
        className={`mx-auto max-w-7xl px-5 pb-12 sm:px-8 ${
          lesson ? "" : "pt-12 sm:pt-20"
        }`}
      >
        <section
          className={`mx-auto ${
            lesson ? "mb-8 max-w-5xl" : "mb-12 max-w-3xl text-center"
          }`}
        >
          {!lesson && (
            <>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo-700">
                Learn by seeing how ideas connect
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
                Turn a hard topic into something you can explore.
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-stone-600">
                Get a clear explanation, explore a concept map, and discover
                what to review next.
              </p>
            </>
          )}
          <div className={lesson ? "" : "mt-8"}>
            <TopicEntryForm
              topic={topic}
              loading={loading}
              onTopicChange={setTopic}
              onGenerate={generate}
            />
            {!lesson && (
              <div className="mt-4 hidden flex-wrap justify-center gap-2 sm:flex">
                {exampleTopics.map((example) => (
                  <button
                    className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-600 transition hover:border-indigo-300 hover:text-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
                    key={example}
                    onClick={() => setTopic(example)}
                    type="button"
                  >
                    {example}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {loading && (
          <div
            aria-live="polite"
            className="mx-auto flex max-w-3xl items-center gap-4 rounded-2xl border border-stone-200 bg-white p-6 text-base text-stone-600 shadow-sm"
            role="status"
          >
            <span className="size-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
            Building your explanation, map, and quiz...
          </div>
        )}

        {errorCode && !loading && (
          <div
            aria-live="assertive"
            className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-base text-rose-950"
            role="alert"
          >
            <p>{errorMessage}</p>
            <button
              className="min-h-11 rounded-xl bg-indigo-600 px-4 font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
              onClick={generate}
              type="button"
            >
              Try again
            </button>
          </div>
        )}

        {lesson && !loading && (
          <div className="learning-layout">
            <ExplanationCard
              explanation={lesson.explanation.text}
              example={lesson.explanation.example}
            />
            <div className="learning-map">
              <ConceptMap
                conceptMap={lesson.conceptMap}
                reviewedNodeIds={reviewedNodeIds}
                selectedNodeId={selectedNodeId}
                onSelectNode={setSelectedNodeId}
              />
            </div>
            <QuizPanel
              quiz={lesson.quiz}
              mapNodes={lesson.conceptMap.nodes}
              questionIndex={questionIndex}
              answers={answers}
              reviewedNodeIds={reviewedNodeIds}
              onAnswer={answerQuestion}
              onNext={() => setQuestionIndex((index) => index + 1)}
              onTryAnotherTopic={reset}
            />
          </div>
        )}
      </main>
    </div>
  );
}
