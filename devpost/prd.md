---
doc: prd
status: approved
---

# ConceptLens AI — Product Requirements

ConceptLens AI helps school and college students turn a difficult topic into a visual, explorable learning loop.
Source: `scope.md > Who It's For`, `scope.md > The Core Loop`.

## The Core Journey

1. The student opens a single-page ConceptLens AI screen with the tagline “Turn a hard topic into something you can explore,” an empty topic field, a Beginner level indicator, and clickable example topics.
2. The student enters a topic or selects an example such as “Neural Networks,” then clicks **Generate**. Generate is unavailable while the topic field is empty.
3. The page shows a loading state while the explanation, concept map, and quiz are prepared. If generation succeeds with valid, connected content, all three appear together; partial results are never shown.
4. The student reads the short explanation and real-world example, explores the concept map, and takes a three-question quiz one question at a time.
5. After each answer, the student sees immediate feedback. A wrong answer explains the mistake and highlights and brings the corresponding map node into view. The student advances with **Next**.
6. After the final question, the student sees the score and the nodes marked for review. **Try another topic** returns to the initial state.

The demo's proof is a wrong answer visibly highlighting its matching map node.
Source: `scope.md > The Unique Kernel`, `scope.md > What "Working" Looks Like`.

## Screens and Layout

ConceptLens AI is a single-page experience; generation replaces the initial empty state with the results state.

- **Initial state:** A centered, prominent topic input, a single Beginner level indicator, a primary **Generate** button, and two or three clickable example topics. “Neural Networks” is the pre-tested demo topic. No explanation, map, or quiz is shown before generation.
- **Results state at tablet and wider sizes (768px and up):** Explanation card above the quiz in the left column; concept map in the right column. The map stays visible while the student scrolls through the quiz so feedback and its highlighted node can be seen together.
- **Results state on narrow screens (under 768px):** Stack the explanation, map, then quiz.
- **Quiz completion:** The quiz area shows the score and review-node summary, with a **Try another topic** action.

## Look and Feel

- Clean, calm, modern study-tool aesthetic, with the polish of Notion or Linear for learning.
- Light theme only. Soft off-white `#FAFAF9` page background, white cards, and subtle borders.
- Deep indigo/blue `#4F46E5` for primary actions and selected map nodes; green for correct answers; red for wrong answers; warm amber for review markers. The amber review state must be distinguishable from an error and clearly visible against indigo nodes.
- A clean sans-serif such as Inter, high-contrast near-black body text, mid-gray secondary text, readable body text at 16px or larger, and a clear heading hierarchy.
- Generous spacing and rounded cards, buttons, and inputs (about 12px). Avoid decorative illustrations and heavy gradients.
- The map uses rounded, labeled node cards, with the main topic node larger and central. Selected nodes have an indigo outline. Review nodes have an amber fill and a “Review this” tag. A short pan-and-pulse animation draws attention to a newly review-marked node.

## Features and Behavior

### Topic Entry and Generation

Source: `scope.md > The Core Loop`, `scope.md > The POC Boundary`.

- The topic field accepts a topic to explore. Selecting an example fills the field; it does not generate until the student presses **Generate**.
- The only supported level in this POC is Beginner, selected by default and shown as a single label or selected chip. No unavailable level options are displayed.
- Empty input keeps **Generate** disabled.
- While generation is in progress, show a skeleton or spinner and “Building your explanation, map, and quiz...” (or equivalent). Disable **Generate** to prevent duplicate submissions.
- On successful generation, show the explanation, map, and quiz together only when the complete response is usable and their relationships are valid.
- The response content must be structured so quiz questions reference map node IDs. A reference to a missing node makes the response unusable.

**Acceptance criteria**
- On first load, only the topic-entry state is visible; no generated content is present.
- Clicking an example fills the topic field. With an empty field, **Generate** cannot be activated.
- During generation, the loading message is visible and a second submission cannot be triggered.
- After a successful request, the explanation, map, and three-question quiz all appear together for the entered topic at Beginner level.
- A response with malformed content or a quiz reference to a nonexistent map node does not produce partial or broken results.

### Explanation and Concept Map

Source: `scope.md > The Unique Kernel`, `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`.

- The explanation contains a short, beginner-friendly explanation and a real-world example.
- The map visualizes concepts related to the same topic as the explanation and quiz.
- Clicking a map node displays a short explanation of that sub-concept. This works before and during the quiz.
- Selecting a node gives it an indigo outline.
- When quiz feedback marks a node for review, the map pans or scrolls that node into view, gives it an amber fill and “Review this” tag, and briefly animates it.
- Review markers remain visible for the rest of the session and agree with the final quiz summary.

**Acceptance criteria**
- The explanation, example, and map are present after successful generation and refer to the entered topic.
- Clicking a node displays its sub-concept explanation.
- A node linked to a wrong answer is visibly marked for review and brought into view.
- Earlier review markers remain visible after advancing through later questions.

### Quiz and Review Feedback

Source: `scope.md > The Unique Kernel`, `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`.

- The quiz has exactly three questions, in a fixed order, with three or four answer options per question.
- Show one question at a time with a progress indicator such as “Question 1 of 3.” Questions cannot be skipped, revisited, or reordered.
- After the student selects an answer, lock the options, show feedback immediately, and bring it into view.
- For a correct answer, mark the chosen option green, show a short “Correct” message, and explain why it is right in one or two sentences.
- For a wrong answer, mark the chosen option red and identify the correct option. Show two short, plain-language sentences explaining why the selected option is wrong, followed by two short sentences explaining why the correct option is right. Keep both explanations specific to the question and topic, with no filler or repeated question. Put **Review this: `<concept>`** on a separate line naming the linked map node.
- Each question includes a two-sentence explanation of why its correct answer is right and a short, option-specific explanation for every answer choice, in the same order as the options. Each wrong option's explanation has exactly two short sentences; the correct option's entry is one concise sentence.
- The question's `nodeId` points to the most specific map concept it tests. Use the main topic node only when the question genuinely tests the topic as a whole.
- Keep the feedback, **Next**, and reviewed map node usable together. If the rationale needs more room, let its panel scroll or tighten spacing; never clip the explanation. At tablet and wider sizes, keep the map sticky beside the quiz.
- In both cases, show **Next**. Do not auto-advance; the student advances only by clicking it.
- After question three, show the score out of three and the list of nodes marked for review. **Try another topic** resets to the initial state.

**Acceptance criteria**
- Exactly one question and a “Question n of 3” indicator are visible at a time; each has three or four choices.
- Selecting an answer locks the choices and brings correct/wrong feedback into view without advancing automatically.
- Correct feedback marks the answer green and explains why it is right in one or two short sentences. Wrong feedback marks the selected answer red, identifies the correct answer, gives two short sentences for why the selected option is wrong and two for why the correct option is right, then shows a separate **Review this: `<concept>`** pointer to the tested node.
- Every quiz question has a non-empty two-sentence correct-answer explanation and a non-empty `optionExplanations` entry for each answer option, in matching order. Wrong-option explanations have two short sentences and the correct-option entry has one concise sentence. Missing or wrong-length option explanations invalidate the complete response.
- Each question links to its most specific tested map concept; the main topic node is used only for a genuinely whole-topic question. The feedback layout does not clip explanations or displace **Next** and the amber review marker; long rationale text can scroll within its panel.
- **Next** advances to the next question; no skip or back action is available.
- After question three, the score is out of three and the review list matches the nodes marked on the map.
- **Try another topic** returns to the initial state and clears the current topic's generated content and quiz progress.

## States and Boundaries

- **First use / empty topic:** Show the topic field, Beginner indicator, examples, and disabled **Generate**; no generated results.
- **Loading:** Show a skeleton or spinner and concise progress message; disable **Generate**.
- **Successful result:** Show all three connected learning sections together only after the complete result is valid.
- **Generation failure:** Show a friendly, non-technical message in the results area, retain the entered topic and Beginner selection, and offer **Try again**. Do not show stack traces, status codes, raw provider errors, or partial results.
- **Rate limit:** Explain in plain language that requests are busy and ask the student to wait a moment; temporarily disable **Try again**.
- **Malformed response:** Validate the structured result before presenting it. Retry once automatically if the model response is malformed; if it remains invalid, show the generation failure state. A quiz question that references an unknown map node is invalid.
- **Session boundary:** No login, database, saved history, or persistence after the session. Review marks last only for the current topic/session. The **Try another topic** action clears them.
- **Credential boundary:** The API key is never exposed in the user interface or included in server logs. Technical failure details may be logged without the key.

## Product Decisions

- Beginner is the only level offered in the POC; Intermediate and Advanced are deferred so the UI does not promise unsupported behavior.
- Keep the full loop on one page, with all results visible together and the map beside the explanation/quiz on wide screens. This keeps wrong-answer feedback and its map highlight visible together.
- Use one question at a time with immediate feedback and manual **Next** progression so the learner can inspect the map highlight.
- Keep feedback and quiz-to-node links in the same structured result; if any of the explanation, map, or quiz is invalid, do not display partial results.
- Use “Neural Networks” as the pre-tested demo topic. A one-minute demo should show the wrong-answer-to-map-node connection.
- Keep the experience in-session only; no login, database, or saved history.

## What We're Building

- A single-page topic-entry and learning experience for one topic at a time.
- Beginner-level explanation with a real-world example.
- An interactive concept map with explorable nodes.
- A three-question quiz linked to map nodes, with immediate feedback and review highlighting on wrong answers.
- A completion score and review-node summary, plus a reset action for another topic.
- Loading, retry, rate-limit, and invalid-result states that preserve the topic, avoid partial output, and do not expose technical errors or credentials.

## Deferred From the POC

- Intermediate and Advanced levels: not needed to prove the Beginner learning loop; add only in a later iteration.
- A separate “what to study next” list: the wrong-answer explanation and review-marked map node already point to what to revisit.
- Accounts, databases, and saved history: outside the in-session proof of concept.

## Possible Later Enhancements

Add Intermediate and Advanced explanation and quiz levels if the core Beginner flow is reliable. Explore richer study recommendations or progress tracking only after the connected explanation-map-quiz loop is proven.

## Non-Goals

- Multiple simultaneous topics, saved sessions, or returning-user progress; there is no persistence in this POC.
- A separate study-recommendation system; the quiz feedback and marked node are the review guidance.
- A dark theme or unsupported level choices; the initial demo is light theme and Beginner only.
- Showing partial generated results, raw provider errors, or secrets in user-facing messages or logs.

## Open Questions

- None that block `4-spec`. The exact retry cool-down duration can be selected while specifying the failure behavior.
