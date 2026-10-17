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
  Build: Add safe user-facing error states and five-second rate-limit cooldown; retry malformed output once and retry transient 429/503 provider responses up to twice with one- and two-second backoff, without retrying other provider or transport errors; apply the 60-second timeout; preserve topic and level across failures; finish review-node summary and try-another-topic reset; tune responsive layout, loading treatment, map animation, and accessible high-contrast labels; write README key/setup/run/demo instructions.
  Verify (mechanical): Run `npm run build`; verify no Gemini key or fixture content is present in frontend output, `server/.env` is ignored, and `server/.env.example` remains trackable. With `USE_FIXTURE=true`, validate the fixture API/UI flow and friendly unsupported-topic failure. With `USE_FIXTURE=false`, verify real provider errors do not fall back to the fixture and rate-limit retry is disabled for five seconds; inspect the Gemini request's 60-second timeout, one malformed-output retry, up to two retries for 429/503 only, and no retry for other transport/provider errors. Exercise the documented start command and the browser's network-failure state.
  Learner check: Try the complete fixture-backed demo at desktop and narrow viewport sizes; test a blank topic, a wrong quiz answer, reset, and friendly failure/retry states. Confirm the project is ready for the one-minute video.
  Commit: `Complete ConceptLens demo states and setup`

## Hands-on Checkpoints

- [x] Early usable behavior explored — fixture-backed explanation, map, and quiz worked; the learner confirmed that a wrong answer marked and panned to its linked node, with no changes requested.
- [x] Final kick-the-tires exploration and feedback completed — learner tried the fixture-backed app and requested clearer guidance for unsupported fixture topics; the refinement is tracked under Final Review.

## Final Review

- [x] Live Gemini verification before final review — `npm run smoke:gemini` passed; the live “Neural Networks” flow returned three linked questions, and an intentional wrong answer highlighted its matching map node.
- [x] Quiz feedback refinement verified — live Gemini output showed two short sentences for the selected wrong option and two for the correct answer, plus a separate `Review this: Artificial Neurons` line. The matching amber map node and sticky **Next** remained visible at tablet width, with rationale scrolling. The learner reviewed the live result and confirmed it meets the change. Validation tests passed for missing and wrong-length `optionExplanations`.
- [x] Fixture-only unsupported-topic guidance and retry verified — isolated fixture-route checks returned `FIXTURE_TOPIC_UNSUPPORTED` for an unsupported topic and a validated three-question lesson for “Neural Networks”; the existing UI recovery/editable-topic behavior was previously verified. Live Gemini smoke and browser generation with `USE_FIXTURE` unset confirmed there was no fixture fallback.
- [x] Final review complete — feedback resolved and learner confirmed the proof of concept is ready to ship.

## Code Tour and App Map

- [x] Learning activity complete — focused alternative connected the live question-to-node mismatch to the schema/prompt refinement and its verified rerun.
- [x] Optional edit and transfer reflection addressed — no edit was needed for the focused alternative; the optional reflection was answered and recorded only in the ignored learner profile.
- [x] `devpost/app-map.html` generated from finished code, checked offline in the browser, and shown, including a project-grounded practice to reuse

Activity and evidence: The learner spotted a live Gemini question mapped to the root topic rather than its specific tested concept, requested a targeted fix, and reviewed the rerun. The updated live result named `Artificial Neurons` and highlighted that map node. `npm run smoke:gemini`, `npm run test:validation`, and `npm run build` passed.
Route and stops: Reference-only route — `src/components/QuizPanel.tsx > QuizQuestionView`, `src/App.tsx > answerQuestion`, `src/components/ConceptMap.tsx > MapCanvas`.
Edit outcome: Not applicable to the focused alternative; no unrelated or kernel edit was needed.
Reflection: Answered; personal response recorded only in the ignored learner profile.
Activity mode: Focused alternative grounded in the live review and the learner's structured-output safety goal.

## Revisions

- Use Gemini's documented Interactions API with `response_format` and `store: false` — current official docs confirm this is the recommended structured-output method and that interaction records are stored by default; disabling storage preserves the approved no-history behavior.
- Gemini returned HTTP 429 during Slice 2 smoke and API verification even after the learner updated local configuration. Added an explicit, development-only Neural Networks fixture so the UI and connected-learning kernel can be verified deterministically; it is schema-validated, cannot be selected in production, and never masks a Gemini failure. Before final review, disable the fixture and verify both the real smoke test and complete real-model browser journey.
- Final hands-on review requested a clearer fixture-only unsupported-topic error, confirmation that Generate recovers and retry works, and unchanged Gemini-mode behavior. Added this as a tracked final-review refinement before implementing it.
- Implemented the fixture-only explanation and dedicated error code; confirmed the input/Generate state recovers and retrying Neural Networks loads the fixture. With `USE_FIXTURE=false`, a real API request still returned Gemini's `429 RATE_LIMITED` and no fixture content. Per learner request, restarted the local dev server with `USE_FIXTURE=false`; live Gemini remains quota-blocked, so the pre-final-review smoke and full real-model journey are still pending.
- In response to repeated Gemini `503` availability errors, added at most two server retries for upstream `429`/`503` responses with one- and two-second exponential backoff. Other provider and transport errors remain non-retryable; SDK retries remain disabled, errors log only the sanitized HTTP status, and no fixture fallback was added.
- The live smoke test after this retry change received HTTP `503` on all three attempts (initial request plus two retries); real Gemini verification remains pending.
- Final kick-the-tires feedback requested stronger quiz learning feedback: explain why the chosen wrong option fails, why the correct answer is right, identify the linked review node, and also explain correct answers. Updated the PRD and spec before implementation; this refinement preserves the core flow, amber map highlight, and manual Next behavior.
- Live review showed a whole-topic question linked to the main topic node instead of its tested concept. Follow-up feedback also asked for two plain, specific sentences per wrong option and a separate review pointer; updated the PRD/spec and Gemini's schema descriptions and prompt. Bounded the rationale panel for scrolling, brought new feedback into view, pinned **Next** while an answer is active, and moved the sticky-map breakpoint to tablet width so **Next** and the amber node stay in view together. The final review later passed `npm run smoke:gemini` and the live browser flow, superseding the earlier pending status recorded above.
