import express from "express";
import { getServerConfig } from "./config.js";
import generateRouter from "./routes/generate.js";

const { useFixture } = getServerConfig();

const app = express();
const port = 3001;

if (useFixture) {
  console.warn(
    "Development fixture enabled: only the Neural Networks lesson is served; Gemini is bypassed.",
  );
}

app.use(express.json({ limit: "16kb" }));
app.use("/api", generateRouter);
app.listen(port, "127.0.0.1", () => {
  console.log(`ConceptLens API listening on http://127.0.0.1:${port}`);
});
