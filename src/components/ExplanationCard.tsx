type ExplanationCardProps = {
  explanation: string;
  example: string;
};

export function ExplanationCard({
  explanation,
  example,
}: ExplanationCardProps) {
  return (
    <section
      aria-labelledby="explanation-heading"
      className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
    >
      <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">
        The big idea
      </p>
      <h2
        className="mt-2 text-xl font-semibold tracking-tight text-stone-950"
        id="explanation-heading"
      >
        A simple explanation
      </h2>
      <p className="mt-4 whitespace-pre-line text-base leading-7 text-stone-700">
        {explanation}
      </p>
      <div className="mt-5 rounded-xl bg-stone-50 p-4">
        <h3 className="text-sm font-semibold text-stone-900">
          A real-world example
        </h3>
        <p className="mt-2 text-base leading-7 text-stone-700">{example}</p>
      </div>
    </section>
  );
}
