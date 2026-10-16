---
doc: scope
status: approved
---

# ConceptLens AI

Turn a difficult topic into a visual, explorable learning loop where quiz feedback points students back to concepts they need to review.

## The Unique Kernel
The concept map is the heart of the experience, connected to the explanation and quiz rather than presented as a separate visual. Each quiz question is tied to a map node; when a student answers incorrectly, the app explains the mistake and highlights that node as a place to review.

## Who It's For
School and college students who find long textbook explanations hard to work through and want a more visual way to explore a difficult topic.

## The Core Loop
A student enters a topic and chooses a level, reads a short explanation with a real-world example, explores the related concept map, and takes a short quiz. Quiz feedback connects back to the map so the student can see which concept to revisit.

## Inspiration & Identity
Clean and polished, like a real product. The experience should feel like one connected learning flow, not three separate AI outputs.

## Why This Matters to the Learner
The learner wants to practice safely wiring an LLM into a complete demo: keeping the API key out of the frontend and repository, handling rate limits and errors, and producing reliable structured output.

## What "Working" Looks Like
In a one-minute demo, enter “Neural Networks,” choose Beginner, and generate a short explanation with a real-world example alongside a concept map. Click a node such as “Backpropagation” to see a short sub-concept explanation, then answer a three-question quiz with one intentional wrong answer. The app explains the mistake and visibly highlights the matching map node with a “review this” marker. That wrong-answer-to-node connection is the proof that the experience works. Use a pre-tested topic for the video, and show clear loading and friendly error states if generation fails.

## The POC Boundary
- One end-to-end, in-session flow for a single topic: explanation, interactive concept map, and quiz.
- Keep the explanation, map nodes, and quiz questions connected to the same topic and to one another.
- Support the Beginner level; the demo uses Beginner.
- Support clicking a map node to expand a short explanation of its sub-concept.
- Make a wrong quiz answer explain the mistake and highlight its corresponding map node for review.
- No login, database, or saved history.
- Keep the API key on the backend, out of the frontend and repository. Handle loading and generation failures clearly enough for the demo.

## Later
- Intermediate and Advanced levels, if implementing them would add meaningful complexity; Beginner is the committed level.
- A “what to study next” list beyond the wrong-answer explanation and map review marker; the learner is open to deferring this.
- Broader learning and progress features beyond this single in-session flow.

## Explicitly Cut
- Login, a database, and saved history: not needed to demonstrate the core learning flow.
- Treating the explanation, concept map, and quiz as independent outputs: their connection is the distinctive point of the project.
