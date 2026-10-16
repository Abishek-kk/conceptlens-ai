---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

- [x] **1. Prove Gemini structured output against the shared contract**
  Becomes usable: A runnable local Gemini smoke test confirms that the configured key and model can produce a complete “Neural Networks” Beginner response accepted by the shared Zod schema and the quiz-to-map relationship checks.
  Why now: The SDK's structured-output method, the selected model, and schema compatibility are the highest-risk unknowns. This is the planned runnable-evidence exception; project setup and the test harness are included here rather than becoming a standalone scaffolding step.
  PRD ref: `prd.md > Topic Entry and Generation`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Stack`, `spec.md > Gemini smoke test`, `spec.md > Shared GenerateResponseSchema`, `spec.md > Server response validation`, `spec.md > External Services and Dependencies`
  Build: Bootstrap the root TypeScript/Vite/Express project and scripts; implement the shared Zod response contract and cross-reference validation; check current `@google/genai` docs for the installed version; add `server/.env.example` and the Gemini smoke-test command; require `GEMINI_MODEL` from the environment with no source-code default; call Gemini's structured-output Interactions API with `store: false`.
  Verify (mechanical): Configure the key and verified model locally without sharing them; run `npm run smoke:gemini`; confirm it exits successfully after validating exactly three questions, 3–4 options each, valid correct-answer indexes, unique map IDs, valid edge endpoints, and question node references. Confirm the smoke output contains no key or raw provider response.
  Learner check: Add your own Gemini key and verified model ID to `server/.env`, run the smoke test, and confirm it reports a concise pass for the Neural Networks Beginner result without revealing the key.
  Commit: `Add Gemini structured-output smoke test`

- [x] **2. Generate a lesson and connect wrong answers to map nodes**
  Becomes usable: A student can enter or select a topic, generate the validated explanation, concept map, and three-question quiz, explore a map node, answer a question, and see a wrong answer highlight and pan to its linked map node.
  Why now: This is the distinctive kernel and the first full browser-to-Gemini-to-browser journey. Building it immediately after the smoke test ensures that the riskiest behavior is proven before secondary polish.
  PRD ref: `prd.md > The Core Journey`, `prd.md > Screens and Layout`, `prd.md > Topic Entry and Generation`, `prd.md > Explanation and Concept Map`, `prd.md > Quiz and Review Feedback`
  Spec ref: `spec.md > The Core Journey Through the System`, `spec.md > Components`, `spec.md > Data Model`, `spec.md > File Structure`, `spec.md > Where It Runs and How Someone Tries It`
  Build: Implement the Express generation route and Gemini service using the verified SDK method and shared schema; add the opt-in, development-only Neural Networks fixture described in `spec.md > Development fixture`, with no automatic fallback; build the single-page React flow, topic form, explanation, React Flow map, and one-question-at-a-time quiz; connect wrong-answer feedback to persistent in-session review node IDs and map pan/highlight; keep generated and quiz state in memory only.
  Verify (mechanical): Run `npm run build`; start the app with `USE_FIXTURE=true`; exercise `POST /api/generate` and validate the complete fixture response against the shared schema, including exactly three questions and existing map-node references. Confirm the fixture is rejected in production mode and that `npm run smoke:gemini` bypasses the fixture.
  Learner check: With `USE_FIXTURE=true`, open `http://localhost:5173`, choose “Neural Networks,” generate the lesson, expand a map node, answer one quiz question incorrectly, and confirm the matching node gets an amber “Review this” marker and moves into view.
  Commit: `Connect quiz feedback to concept map`

- [x] **3. Finish responsive and failure states, setup docs, and demo readiness**
  Becomes usable: The POC handles loading, rate limits, malformed model output, timeout/network failures, retry/reset, narrow screens, and quiz completion cleanly, with reproducible local setup instructions.
  Why now: After the core loop is usable and early feedback is collected, complete the remaining PRD behavior and polish without delaying validation of the kernel.
  PRD ref: `prd.md > Look and Feel`, `prd.md > Topic Entry and Generation`, `prd.md > Explanation and Concept Map`, `prd.md > Quiz and Review Feedback`, `prd.md > States and Boundaries`, `prd.md > What We're Building`
  Spec ref: `spec.md > Look and Feel`, `spec.md > Components`, `spec.md > Important Failure Modes`, `spec.md > Where It Runs and How Someone Tries It`
  Build: Add safe user-facing error states and five-second rate-limit cooldown; retry malformed output once while not retrying provider throttles or transport errors; apply the 60-second timeout; preserve topic and level across failures; finish review-node summary and try-another-topic reset; tune responsive layout, loading treatment, map animation, and accessible high-contrast labels; write README key/setup/run/demo instructions.
  Verify (mechanical): Run `npm run build`; verify no Gemini key or fixture content is present in frontend output, `server/.env` is ignored, and `server/.env.example` remains trackable. With `USE_FIXTURE=true`, validate the fixture API/UI flow and friendly unsupported-topic failure. With `USE_FIXTURE=false`, verify real provider errors do not fall back to the fixture and rate-limit retry is disabled for five seconds; inspect the Gemini request's 60-second timeout, one malformed-output retry, and no retry for transport/rate-limit errors. Exercise the documented start command and the browser's network-failure state.
  Learner check: Try the complete fixture-backed demo at desktop and narrow viewport sizes; test a blank topic, a wrong quiz answer, reset, and friendly failure/retry states. Confirm the project is ready for the one-minute video.
  Commit: `Complete ConceptLens demo states and setup`

## Hands-on Checkpoints

- [x] Early usable behavior explored — fixture-backed explanation, map, and quiz worked; the learner confirmed that a wrong answer marked and panned to its linked node, with no changes requested.
- [x] Final kick-the-tires exploration and feedback completed — learner tried the fixture-backed app and requested clearer guidance for unsupported fixture topics; the refinement is tracked under Final Review.

## Final Review

- [ ] Live Gemini verification before final review — set `USE_FIXTURE=false`; run `npm run smoke:gemini`; then generate “Neural Networks” in the browser against the configured real model, expand a map node, answer one question incorrectly, and confirm its linked node is highlighted. Confirm all three valid questions and map references appear; do not complete final review unless these checks pass.
- [ ] Fixture-only unsupported-topic guidance and retry verified — with `USE_FIXTURE=true`, request a different topic, confirm the dedicated explanation and editable topic, then change to “Neural Networks” and retry successfully; confirm Generate is enabled again and Gemini-mode behavior is unchanged with the flag off.
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
- Gemini returned HTTP 429 during Slice 2 smoke and API verification even after the learner updated local configuration. Added an explicit, development-only Neural Networks fixture so the UI and connected-learning kernel can be verified deterministically; it is schema-validated, cannot be selected in production, and never masks a Gemini failure. Before final review, disable the fixture and verify both the real smoke test and complete real-model browser journey.
- Final hands-on review requested a clearer fixture-only unsupported-topic error, confirmation that Generate recovers and retry works, and unchanged Gemini-mode behavior. Added this as a tracked final-review refinement before implementing it.
- Implemented the fixture-only explanation and dedicated error code; confirmed the input/Generate state recovers and retrying Neural Networks loads the fixture. With `USE_FIXTURE=false`, a real API request still returned Gemini's `429 RATE_LIMITED` and no fixture content. Per learner request, restarted the local dev server with `USE_FIXTURE=false`; live Gemini remains quota-blocked, so the pre-final-review smoke and full real-model journey are still pending.
