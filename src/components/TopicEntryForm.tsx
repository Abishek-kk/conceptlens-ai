const exampleTopics = ["Neural Networks", "Photosynthesis", "Supply and Demand"];

type TopicEntryFormProps = {
  topic: string;
  loading: boolean;
  onTopicChange: (topic: string) => void;
  onGenerate: () => void;
};

export function TopicEntryForm({
  topic,
  loading,
  onTopicChange,
  onGenerate,
}: TopicEntryFormProps) {
  return (
    <form
      className="topic-form rounded-2xl border border-stone-200 bg-white p-3 shadow-sm sm:flex sm:items-center sm:gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        onGenerate();
      }}
    >
      <label className="sr-only" htmlFor="topic">
        Topic to explore
      </label>
      <input
        autoComplete="off"
        className="min-h-14 w-full rounded-xl border-0 bg-transparent px-3 text-base text-stone-900 outline-none placeholder:text-stone-400 focus:ring-2 focus:ring-indigo-500"
        id="topic"
        maxLength={160}
        onChange={(event) => onTopicChange(event.target.value)}
        placeholder="Enter a topic, e.g. Neural Networks"
        value={topic}
      />
      <span className="mx-3 my-2 inline-flex min-h-10 shrink-0 items-center rounded-full bg-indigo-50 px-4 text-sm font-medium text-indigo-800 sm:my-0">
        Level: Beginner
      </span>
      <button
        className="min-h-12 w-full shrink-0 rounded-xl bg-indigo-600 px-6 text-base font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300 sm:w-auto"
        disabled={loading || !topic.trim()}
        type="submit"
      >
        {loading ? "Generating..." : "Generate"}
      </button>
      <div className="flex flex-wrap gap-2 px-1 pb-1 pt-3 sm:hidden">
        {exampleTopics.map((example) => (
          <button
            className="rounded-full border border-stone-200 px-3 py-2 text-sm text-stone-600 transition hover:border-indigo-300 hover:text-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
            key={example}
            onClick={() => onTopicChange(example)}
            type="button"
          >
            {example}
          </button>
        ))}
      </div>
    </form>
  );
}

export { exampleTopics };
