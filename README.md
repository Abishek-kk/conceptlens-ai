# ConceptLens AI

ConceptLens AI turns a learning topic into a short explanation, an interactive concept map, and a three-question quiz. A wrong answer points the learner to the matching map concept to review.

## Requirements

- Node.js and npm
- A Gemini API key and a model ID enabled for that key in Google AI Studio

## Local setup

From the project root:

```powershell
npm install
Copy-Item .\server\.env.example .\server\.env
```

Edit `server/.env` locally:

- Set `GEMINI_API_KEY` to your API key.
- Set `GEMINI_MODEL` to the exact model ID available to your project.
- Leave `USE_FIXTURE` unset or set it to `false` for Gemini-backed generation.

Never put the key in frontend variables, source code, chat, or Git. `server/.env` is ignored by Git; `server/.env.example` contains placeholders only.

Start both local servers:

```powershell
npm run dev
```

Open <http://localhost:5173>.

## Development fixture

When Gemini quota is unavailable, set `USE_FIXTURE=true` in `server/.env` and restart the dev server. This serves a fixed, schema-validated “Neural Networks” lesson so the UI and wrong-answer-to-map flow can be explored without calling Gemini. Other topics show a clear message that the fixture only supports Neural Networks and that turning off `USE_FIXTURE` uses Gemini. The topic remains editable so you can change it and retry. The fixture is development-only, is refused when `NODE_ENV=production`, and is never used as a fallback after a Gemini failure.

The live Gemini smoke test intentionally refuses to run while the fixture is enabled. Before final review or recording the real demo, set `USE_FIXTURE=false`, restart the server, and run:

```powershell
npm run smoke:gemini
```

Then verify the complete “Neural Networks” lesson and wrong-answer map highlight in the browser against the configured model. The smoke test prints only a concise result or safe error category; it never prints the key or provider response.

## Demo flow

1. Enter or select “Neural Networks” and click **Generate**.
2. Read the explanation and example, then select a map node to explore it.
3. Answer a quiz question incorrectly and show the corresponding amber **Review this** map node.
4. Complete the quiz to show the score and review summary.

The app keeps lesson and quiz state in memory only. It has no login, database, or deployment requirement.
