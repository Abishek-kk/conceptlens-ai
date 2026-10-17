import express from "express";
import { resolve } from "node:path";
import { getServerConfig } from "./config.js";
import generateRouter from "./routes/generate.js";

const { useFixture } = getServerConfig();

const app = express();
const port = Number(process.env.PORT ?? 3001);

if (useFixture) {
  console.warn(
    "Development fixture enabled: only the Neural Networks lesson is served; Gemini is bypassed.",
  );
}

app.use(express.json({ limit: "16kb" }));
app.use("/api", generateRouter);

if (process.env.NODE_ENV === "production") {
  const clientBuildPath = resolve(process.cwd(), "dist");
  app.use(express.static(clientBuildPath));
  app.get("/{*path}", (_request, response) => {
    response.sendFile(resolve(clientBuildPath, "index.html"));
  });
}

app.listen(port, "0.0.0.0", () => {
  console.log(`ConceptLens server listening on port ${port}`);
});
