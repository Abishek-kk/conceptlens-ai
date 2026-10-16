---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

- [ ] **1. Prove Gemini structured output against the shared contract**
  Becomes usable: A runnable local Gemini smoke test confirms that the configured key and model can produce a complete “Neural Networks” Beginner response accepted by the shared Zod schema and the quiz-to-map relationship checks.
  Why now: The SDK's structured-output method, the selected model, and schema compatibility are the highest-risk unknowns. This is the planned runnable-evidence exception; project setup and the test harness are included here rather than becoming a standalone scaffolding step.
  PRD ref: `prd.md > Topic Entry and Generation`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Stack`, `spec.md > Gemini smoke test`, `spec.md > Shared GenerateResponseSchema`, `spec.md > Server response validation`, `spec.md > External Services and Dependencies`
  Build: Bootstrap the root TypeScript/Vite/Express project and scripts; implement the shared Zod response contract and cross-reference validation; check current `@google/genai` docs for the installed version; add `server/.env.example` and the Gemini smoke-test command; require `GEMINI_MODEL` from the environment with no source-code default; call Gemini's structured-output Interactions API with `store: false`.
  Verify (mechanical): Configure the key and verified model locally without sharing them; run `npm run smoke:gemini`; confirm it exits successfully after validating exactly three questions, 3–4 options each, valid correct-answer indexes, unique map IDs, valid edge endpoints, and question node references. Confirm the smoke output contains no key or raw provider response.
  Learner check: Add your own Gemini key and verified model ID to `server/.env`, run the smoke test, and confirm it reports a concise pass for the Neural Networks Beginner result without revealing the key.
  Commit: `Add Gemini structured-output smoke test`

- [ ] **2. Generate a lesson and connect wrong answers to map nodes**
  Becomes usable: A student can enter or select a topic, generate the validated explanation, concept map, and three-question quiz, explore a map node, answer a question, and see a wrong answer highlight and pan to its linked map node.
  Why now: This is the distinctive kernel and the first full browser-to-Gemini-to-browser journey. Building it immediately after the smoke test ensures that the riskiest behavior is proven before secondary polish.
  PRD ref: `prd.md > The Core Journey`, `prd.md > Screens and Layout`, `prd.md > Topic Entry and Generation`, `prd.md > Explanation and Concept Map`, `prd.md > Quiz and Review Feedback`
  Spec ref: `spec.md > The Core Journey Through the System`, `spec.md > Components`, `spec.md > Data Model`, `spec.md > File Structure`, `spec.md > Where It Runs and How Someone Tries It`
  Build: Implement the Express generation route and Gemini service using the verified SDK method and shared schema; build the single-page React flow, topic form, explanation, React Flow map, and one-question-at-a-time quiz; connect wrong-answer feedback to persistent in-session review node IDs and the map pan/highlight; keep generated and quiz state in memory only.
  Verify (mechanical): Run `npm run build`; run `npm run smoke:gemini`; start the app and exercise a real generation through `POST /api/generate`; confirm the result contains three valid questions and every quiz node reference exists in its map.
  Learner check: Open `http://localhost:5173`, choose “Neural Networks,” generate the lesson, expand a map node, answer one quiz question incorrectly, and confirm the matching node gets an amber “Review this” marker and moves into view.
  Commit: `Connect quiz feedback to concept map`

- [ ] **3. Finish responsive and failure states, setup docs, and demo readiness**
  Becomes usable: The POC handles loading, rate limits, malformed model output, timeout/network failures, retry/reset, narrow screens, and quiz completion cleanly, with reproducible local setup instructions.
  Why now: After the core loop is usable and early feedback is collected, complete the remaining PRD behavior and polish without delaying validation of the kernel.
  PRD ref: `prd.md > Look and Feel`, `prd.md > Topic Entry and Generation`, `prd.md > Explanation and Concept Map`, `prd.md > Quiz and Review Feedback`, `prd.md > States and Boundaries`, `prd.md > What We're Building`
  Spec ref: `spec.md > Look and Feel`, `spec.md > Components`, `spec.md > Important Failure Modes`, `spec.md > Where It Runs and How Someone Tries It`
  Build: Add safe user-facing error states and five-second rate-limit cooldown; retry malformed output once while not retrying provider throttles or transport errors; apply the 60-second timeout; preserve topic and level across failures; finish review-node summary and try-another-topic reset; tune responsive layout, loading treatment, map animation, and accessible high-contrast labels; write README key/setup/run/demo instructions.
  Verify (mechanical): Run `npm run build` and `npm run smoke:gemini`; verify the production build completes, no Gemini key is present in frontend output, `server/.env` is ignored, and `server/.env.example` remains trackable. Exercise the documented start command.
  Learner check: Try the complete demo at desktop and narrow viewport sizes; test a blank topic, a wrong quiz answer, reset, and—where reproducible without exposing credentials—generation failure and retry. Confirm the project is ready for the one-minute video.
  Commit: `Complete ConceptLens demo states and setup`

## Hands-on Checkpoints

- [ ] Early usable behavior explored — after Slice 2, before finishing responsive and failure-state work; use feedback to adjust Slice 3 without changing the approved kernel.
- [ ] Final kick-the-tires exploration and feedback completed — after Slice 3, try the documented app and record any fixes under Final Review.

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — focused alternative grounded in the learner's structured-output safety goal and actual build evidence
- [ ] Optional edit and transfer reflection addressed — offer one safe, non-kernel edit or accept a decline; offer one optional transfer reflection
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: [complete after final review]
Route and stops: [actual code paths and symbols; focused route or reference-only route]
Edit outcome: [offered and tried/kept/reverted/declined; verification if changed]
Reflection: [offered/answered/declined/already covered; personal response belongs only in ignored profile]
Activity mode: [live app, static fallback, focused alternative, prior practice, or recap]

## Revisions

- Use Gemini's documented Interactions API with `response_format` and `store: false` — current official docs confirm this is the recommended structured-output method and that interaction records are stored by default; disabling storage preserves the approved no-history behavior.
