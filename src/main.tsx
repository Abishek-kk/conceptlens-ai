import { createRoot } from "react-dom/client";
import "./styles/index.css";

function SetupNotice() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6">
      <p className="text-sm font-semibold tracking-wide text-indigo-700">
        CONCEPTLENS AI
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950">
        Turning difficult topics into something you can explore.
      </h1>
      <p className="mt-4 text-lg text-stone-600">
        First, verify the Gemini connection with <code>npm run smoke:gemini</code>.
      </p>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<SetupNotice />);
