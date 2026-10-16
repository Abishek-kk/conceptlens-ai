---
doc: spec
status: approved
---

# ConceptLens AI — Technical Spec

## How This Works, In Plain Language

The browser shows the learning experience and keeps the current topic, quiz answers, selected map node, and review markers in memory. When the student clicks **Generate**, the browser sends only the topic and `level: "beginner"` to a small Node server running on the same computer. The browser never receives the Gemini key.

The server asks Gemini for one JSON result containing the explanation, concept map, and quiz. Gemini's structured-output mode helps shape that response, then the server checks it with the shared Zod schema and verifies that every quiz question points to a real map node. If the response is unusable, the server retries once; if it is still invalid, it returns a safe error instead of broken results. The browser shows the three sections together only after receiving a complete valid result.

Vite runs the browser app and forwards `/api` requests to the Node server, so the browser can use a relative URL. One root command starts both local processes. This keeps the proof of concept to one app, one small API, and one external AI service—without accounts, a database, or deployment.

## The Core Journey Through the System

PRD ref: `prd.md > The Core Journey`, `prd.md > Topic Entry and Generation`, `prd.md > Explanation and Concept Map`, `prd.md > Quiz and Review Feedback`.

```text
Student enters topic
  -> React form sends { topic, level: "beginner" } to POST /api/generate
  -> Express route asks Gemini for one structured JSON result
  -> Shared Zod contract parses the result; server checks node links and quiz rules
  -> Express returns the complete result, or a safe error
  -> React shows explanation + concept map + quiz together
  -> Wrong answer adds its node ID to in-memory review markers
  -> React Flow pans to and highlights that node; quiz summary uses the same markers
```

## Stack

- **TypeScript** across the browser and server: accepted to keep the shared request/response contract consistent.
- **React + Vite** for the single-page browser app and local development server.
  - [React documentation](https://react.dev/learn)
  - [Vite documentation](https://vite.dev/guide/)
- **Tailwind CSS** for the light, responsive visual design.
  - [Tailwind CSS documentation](https://tailwindcss.com/docs)
- **React Flow (`@xyflow/react`)** for the concept map, node selection, and pan/zoom.
  - [React Flow documentation](https://reactflow.dev/learn)
- **Node.js + Express** for the small local API. The server listens only on the local machine; the Vite development proxy forwards `/api` to it.
  - [Node.js documentation](https://nodejs.org/docs/latest/api/)
  - [Express documentation](https://expressjs.com/en/guide/routing.html)
- **Zod** as the one shared runtime contract, with TypeScript types inferred from it. The server also checks cross-record rules that a JSON schema alone does not establish.
  - [Zod documentation](https://zod.dev/)
- **`tsx`** to run the TypeScript Express server in development without a separate compile pipeline.
  - [tsx documentation](https://tsx.is/)
- **`concurrently`** to start Vite and the API server with one root command.
  - [concurrently documentation](https://github.com/open-cli-tools/concurrently)
- **`dotenv`** to load the server-only `server/.env` file. Vite does not receive the Gemini key.
  - [dotenv documentation](https://github.com/motdotla/dotenv)
- **Official Google GenAI JavaScript SDK (`@google/genai`)** for Gemini requests and structured JSON output.
  - [Google GenAI SDK and API libraries](https://ai.google.dev/gemini-api/docs/libraries)
  - [Gemini structured output](https://ai.google.dev/gemini-api/docs/structured-output)

Use mutually compatible current stable dependency versions and commit the generated `package-lock.json` for reproducible installs. Confirm the Node.js LTS version and that the chosen model accepts the generated schema during initial setup.

## Where It Runs and How Someone Tries It

- **Runtime:** Local browser plus two local Node processes (Vite frontend and Express API); no deployment.
- **Requirements:** Node.js LTS and npm; a Gemini API key from [Google AI Studio](https://aistudio.google.com/api-keys).
- **Secret and model configuration:** Copy `server/.env.example` to `server/.env`; set `GEMINI_API_KEY` there. `server/.env` is ignored by Git. Verify the exact model ID in Google AI Studio and set it as `GEMINI_MODEL` in that file. The server must always read `GEMINI_MODEL` from the environment and must not hard-code a model ID. Never put credentials in `VITE_*` variables, source files, or chat.
- **Optional development fixture:** Set `USE_FIXTURE=true` in `server/.env` to serve the clearly separated, schema-validated Neural Networks lesson fixture while developing without Gemini quota. This flag is opt-in, is rejected when `NODE_ENV=production`, and is never activated automatically after a Gemini error. With the flag absent or false, generation uses Gemini as usual and provider errors remain errors. Fixture mode does not require Gemini credentials; turn it off before the required live Gemini smoke test and end-to-end demo verification.
- **Install and start:** From the project root, run `npm install`, copy the example environment file as above, fill in the key, then run `npm run dev`.
- **Open:** Visit `http://localhost:5173`. Vite forwards `/api/*` to the Express server on `http://127.0.0.1:3001`.
- **Demo:** Use the pre-tested “Neural Networks” example at Beginner level. Show a generated explanation and map, expand a map node, answer one question incorrectly, and show the linked node's review marker and final quiz summary.
- **Deliverables:** Record the required short demo video and publish the public GitHub repository. Deployment is optional and is not part of this PoC.

The root `README.md` must include these setup steps, how to obtain a key, how to copy the example environment file, and how to run the demo. Do not include a real key in the repository.

## Look and Feel

Implement `prd.md > Look and Feel` in Tailwind: a light-only, calm study-tool interface with the `#FAFAF9` background, white cards and subtle borders, indigo primary/selected states, green correct feedback, red incorrect feedback, and a distinct amber review marker. Use a clean sans-serif such as Inter, body text at least 16px, generous spacing, and approximately 12px rounded corners. Keep the map node labels and amber “Review this” tag legible at demo scale. Avoid decorative illustrations and heavy gradients. Use responsive CSS to stack explanation, map, then quiz on narrow screens.

## Components

### `App`

Owns the single-page flow and in-memory session state: entered topic, request status, generated result, current question index, submitted answers, selected map node, and review-node IDs. Clears generated state when **Try another topic** is selected.

PRD ref: `prd.md > The Core Journey`, `prd.md > Screens and Layout`, `prd.md > States and Boundaries`.

### `TopicEntryForm`

Renders the topic field, one Beginner indicator, example-topic buttons, **Generate**, and the loading state. Example buttons fill the input without submitting. Prevents empty or duplicate submissions.

PRD ref: `prd.md > Screens and Layout`, `prd.md > Topic Entry and Generation`.

### `ExplanationCard`

Displays the generated beginner-friendly explanation and real-world example.

PRD ref: `prd.md > Explanation and Concept Map`.

### `ConceptMap`

Renders the validated map nodes and edges with React Flow. Clicking a node selects it and displays its sub-concept explanation. A review-node ID adds the amber fill and “Review this” tag and requests a short pan/pulse highlight. On wide screens the map remains sticky beside the explanation and quiz.

PRD ref: `prd.md > Screens and Layout`, `prd.md > Explanation and Concept Map`.

### `QuizPanel`

Shows one of three questions at a time, answer options, progress, feedback, manual **Next**, and the completion score/review-node summary. Submitted answers are locked. A wrong answer updates the shared review-node IDs before the next question is shown.

PRD ref: `prd.md > Quiz and Review Feedback`.

### `generateClient`

Calls relative path `POST /api/generate`, sends only `{ topic, level: "beginner" }`, and maps the server's safe error codes to the friendly UI states. For a `RATE_LIMITED` response it shows the plain-language message and disables **Try again** for five seconds.

PRD ref: `prd.md > Topic Entry and Generation`, `prd.md > States and Boundaries`.

### `POST /api/generate` route

Accepts and validates the topic and level, selects either the explicit development fixture or the Gemini service, validates the complete result, and returns JSON. Fixture selection requires `USE_FIXTURE=true` and is rejected in production; it is not a fallback when Gemini fails. With the flag off, the route responds with a distinct `429`/`RATE_LIMITED` error for provider rate limits and a safe `GENERATION_FAILED` response for other failures. Never sends raw provider details to the browser.

PRD ref: `prd.md > Topic Entry and Generation`, `prd.md > States and Boundaries`.

### Development fixture

`server/src/fixtures/neuralNetworksLesson.ts` contains a fixed, valid Beginner “Neural Networks” `GenerateResponse` used only when `USE_FIXTURE=true` outside production. The route runs it through the same response and cross-reference validation as generated content. In fixture mode, any other topic returns `400` with `FIXTURE_TOPIC_UNSUPPORTED`; the UI explains that the fixture only supports Neural Networks and that turning off `USE_FIXTURE` uses Gemini. The submitted topic remains editable, Generate re-enables when the request ends, and retrying a supported topic works. The fixture is independent of the Gemini service, is never selected after a provider error, and is not included in the browser bundle. `npm run smoke:gemini` always calls Gemini directly and must run with `USE_FIXTURE=false`.

PRD ref: `prd.md > The Core Journey`, `prd.md > Topic Entry and Generation`, `prd.md > Explanation and Concept Map`, `prd.md > Quiz and Review Feedback`.

### `GeminiService`

Uses `@google/genai` on the server only. Reads `GEMINI_API_KEY` and `GEMINI_MODEL` from the server environment and starts each generation request with one Gemini call, asking for structured JSON based on the shared response schema. The currently verified SDK method is `ai.interactions.create(...)` with `response_format`; pass `store: false` so Gemini does not retain an interaction record for later turns. Recheck the method and options against the installed SDK documentation during setup. If the model output cannot be parsed or fails validation, retries generation once. Retries upstream `429` and `503` responses up to two times with one- then two-second delays; does not retry other provider errors, transport failures, or timeouts. SDK automatic retries remain disabled.

PRD ref: `prd.md > Topic Entry and Generation`, `prd.md > States and Boundaries`.

### Gemini smoke test

Before implementing the UI, add `scripts/gemini-smoke-test.ts` and an `npm run smoke:gemini` command. It loads the server environment, uses the documented structured-output method for the installed SDK, asks for a Beginner-level “Neural Networks” result, validates it with the shared Zod schema and cross-reference checks, and prints a concise pass/fail summary without printing the key or raw provider output. Resolve key, model, SDK, or schema issues here before proceeding to UI work.

PRD ref: `prd.md > Topic Entry and Generation`, `prd.md > States and Boundaries`.

### Shared `GenerateResponseSchema`

Defines the API response once in Zod and infers its TypeScript type for both app and server. Its schema describes the explanation and example; concept-map nodes (`id`, label, short explanation) and edges; and quiz questions, options, correct-answer index, feedback explanation, and `nodeId`.

PRD ref: `prd.md > Topic Entry and Generation`, `prd.md > Explanation and Concept Map`, `prd.md > Quiz and Review Feedback`.

### Server response validation

Parses Gemini's JSON with `GenerateResponseSchema`, then verifies unique node IDs, valid edge endpoints, exactly three questions, three or four options per question, a correct-answer index within the option list, and a question `nodeId` that exists in the map. Any failed check invalidates the entire result; no partial results are returned.

PRD ref: `prd.md > Topic Entry and Generation`, `prd.md > States and Boundaries`.

## Data Model

The shared response is the only generated content contract:

```ts
type GenerateResponse = {
  explanation: {
    text: string;
    example: string;
  };
  conceptMap: {
    nodes: Array<{
      id: string;
      label: string;
      explanation: string;
    }>;
    edges: Array<{
      id: string;
      source: string;
      target: string;
    }>;
  };
  quiz: Array<{
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
    nodeId: string;
  }>;
};
```

This is the intended shape; the shared Zod schema is canonical at implementation time. The generated map/quiz data is in browser memory for the current session only. UI state stores the topic, loading/error/success status, selected node ID, current quiz question and submitted answers, and a set of review-node IDs. No user data or generated result is written to a database, file, or browser storage. **Try another topic** clears the current result and quiz state.

The request body is `{ "topic": string, "level": "beginner" }`. Success returns the complete `GenerateResponse`. Errors return a safe JSON code such as `{ "error": { "code": "RATE_LIMITED" } }`, `{ "error": { "code": "GENERATION_FAILED" } }`, or the fixture-only `{ "error": { "code": "FIXTURE_TOPIC_UNSUPPORTED" } }`; do not include raw provider messages.

## File Structure

```text
project/
├── index.html                         # Vite browser entry
├── package.json                       # Root scripts and shared dependencies
├── package-lock.json                  # Reproducible dependency versions
├── vite.config.ts                     # Vite setup and /api proxy to port 3001
├── tsconfig.json                      # Shared TypeScript settings
├── README.md                          # Key setup, local run, demo instructions
├── .gitignore                         # Ignores server/.env and local secrets
├── scripts/
│   └── gemini-smoke-test.ts           # First functional check: Gemini + Zod contract
├── server/
│   ├── .env.example                   # Secret-free key/model placeholders
│   └── src/
│       ├── index.ts                   # Express startup, env loading, local bind
│       ├── fixtures/
│       │   └── neuralNetworksLesson.ts # Opt-in development lesson; never a provider fallback
│       ├── routes/
│       │   └── generate.ts            # POST /api/generate and safe status mapping
│       └── services/
│           ├── gemini.ts              # Gemini structured-output call
│           └── validateResponse.ts   # Zod parse and cross-reference checks
├── shared/
│   └── generateSchema.ts              # Canonical Zod response schema and inferred type
├── src/
│   ├── main.tsx                       # React entry
│   ├── App.tsx                        # Single-page flow and session state
│   ├── api/
│   │   └── generateClient.ts          # Browser request and safe error handling
│   ├── components/
│   │   ├── TopicEntryForm.tsx         # Topic, example, Beginner, Generate
│   │   ├── ExplanationCard.tsx        # Explanation and real-world example
│   │   ├── ConceptMap.tsx             # Interactive map and review highlight
│   │   └── QuizPanel.tsx              # Quiz, feedback, score, review summary
│   └── styles/
│       └── index.css                  # Tailwind import and global styles
└── devpost/                           # Planning documents; learner profile is ignored
```

## External Services and Dependencies

### Gemini API

- **Official client:** `@google/genai`, maintained by Google. Use the official JavaScript SDK rather than a legacy SDK.
- **Model:** Verify the exact model ID in Google AI Studio and store it in `GEMINI_MODEL` in `server/.env`. `gemini-3.8-flash` is a starting candidate only. The model ID must never be hard-coded or silently defaulted in source.
- **Call:** The current Google docs show `ai.interactions.create(...)` with `response_format: { type: "text", mime_type: "application/json", schema: ... }`. Set `store: false` to avoid retaining the interaction for later turns. Reconfirm method and option names for the installed SDK version and exercise the call in `npm run smoke:gemini`.
- **Authentication:** `GEMINI_API_KEY` from `server/.env`; never in browser code, browser requests, source control, or logs.
- **Response:** Read the SDK's generated text output, parse JSON, validate it, and return only the validated `GenerateResponse`.
- **Rate limits and cost:** Depend on current model, account tier, and Google policy. Check [Gemini API rate limits](https://ai.google.dev/gemini-api/docs/rate-limits) and [pricing](https://ai.google.dev/gemini-api/docs/pricing) in Google AI Studio before recording; do not assume a free-tier quota. The app maps provider rate limits to `RATE_LIMITED` and does not expose provider details.
- **References:** [Gemini API quickstart](https://ai.google.dev/gemini-api/docs/get-started), [models](https://ai.google.dev/gemini-api/docs/models), [structured output](https://ai.google.dev/gemini-api/docs/structured-output), [SDK libraries](https://ai.google.dev/gemini-api/docs/libraries).

No other external runtime service, database, or hosting provider is used.

## Important Failure Modes

- **Provider rate limit** → Retry `429` responses up to twice with one- then two-second delays. If still rate-limited, return `429` with `RATE_LIMITED`; show a plain-language busy message and disable retry for five seconds.
- **Provider unavailable** → Retry `503` responses up to twice with one- then two-second delays. If still unavailable, return `GENERATION_FAILED` without provider details; retain the topic and offer **Try again**.
- **Malformed or invalid generated response** → Retry once. If it remains invalid, return `GENERATION_FAILED`; show a friendly message and **Try again**, preserving topic and Beginner selection. Never show partial results.
- **Network error or timeout** → Abort the Gemini request after 60 seconds and return `GENERATION_FAILED` without raw provider details; retain the topic and offer **Try again**. Log only the sanitized HTTP status when available, never the key, full request body, or provider error text.
- **Missing API key or model configuration with fixture disabled** → Fail server startup with an actionable local setup message; never fall back to mock or success-shaped content.
- **Development fixture enabled in production** → Refuse to start or serve the fixture; the flag is for local development only.
- **Unsupported topic in development fixture mode** → Return `FIXTURE_TOPIC_UNSUPPORTED` with guidance to use Neural Networks or turn off the fixture for Gemini; keep the input editable and allow retry. This fixture-only response does not change Gemini-mode behavior.

## What Was Simplified and Why

- **One local Express API** instead of a deployed backend — keeps the Gemini key server-side while avoiding deployment setup; the learner records the demo locally.
- **One shared structured result** instead of separate model calls — keeps explanation, map, and quiz aligned and reduces latency and API usage.
- **One Beginner level and one topic per session** instead of multiple levels or saved learning history — preserves the core wrong-answer-to-node proof within the timebox.
- **In-memory quiz and review state** instead of accounts or persistence — sufficient for the single-session demo.

## Decisions and Open Issues

- **Learner choice — React + Vite, Tailwind, React Flow:** matches the requested browser experience; adds frontend dependencies but no deployment requirement.
- **Learner choice — local Express API and Gemini:** keeps the key on the server and supports one structured generation call; the local demo requires Node.js and a key configured by the learner.
- **Build revision — opt-in development fixture while Gemini quota is unavailable:** a fixed, validated Neural Networks response may be served only with `USE_FIXTURE=true` outside production. It enables deterministic UI and kernel verification without changing normal Gemini behavior, masking Gemini failures, or entering the browser bundle. Before final review, disable it and pass both the live smoke test and the complete real-model flow.
- **Final-review refinement — explicit fixture topic error:** requests for topics other than Neural Networks in fixture mode return a dedicated safe code and user-facing instructions to disable the fixture for Gemini. The input stays available so changing to a supported topic and retrying succeeds; normal Gemini-mode behavior is unchanged.
- **Learner choice — TypeScript and shared Zod contract:** one source defines the response shape and inferred types; runtime checks still explicitly enforce quiz counts, answer indexes, unique map IDs, valid edge endpoints, and question-to-node references.
- **Learner choice — bounded retry behavior:** one retry for invalid model output and up to two retries for transient `429`/`503` responses; other provider and transport errors are not retried automatically.
- **Learner choice — no deployment:** the short demo video and public repository are the submission deliverables; reviewers can follow the documented local setup.
- **Resolved learning question:** structured JSON mode can constrain the model's output format, but it does not prove a question's `nodeId` refers to an existing map node. The server's Zod parse plus explicit cross-reference check provides that guarantee; the build should test both malformed output and a valid-looking response with a missing node ID.
- **Implementation detail — five-second cooldown:** resolves the PRD's open cooldown detail, based on the learner's requested rate-limit behavior.
- **Implementation detail — 60-second provider timeout:** bounds a slow generation attempt; timeout uses the existing friendly failure and retry behavior.
- **Learner choice — configurable model:** verify the exact model ID in Google AI Studio and set it in `GEMINI_MODEL`; `gemini-3.8-flash` is only a candidate. The application must always read the model from the environment, never hard-code it.
- **Learner choice — smoke test first:** before UI work, verify the current `@google/genai` structured-output method and run `npm run smoke:gemini` for “Neural Networks” at Beginner level, validating the response against the shared Zod schema and node references.
- **Verify early in build:** confirm the selected model is enabled for the learner's API key and supports the response schema; check current quota and billing expectations; confirm the installed Node.js LTS and package versions; smoke-test SDK conversion from the shared Zod schema to Gemini's supported JSON Schema before building the full UI.
- **No unresolved product or architecture decision blocks approval.**
