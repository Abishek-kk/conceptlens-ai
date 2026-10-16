import { resolve } from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: resolve(process.cwd(), "server/.env") });

export function getServerConfig() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const model = process.env.GEMINI_MODEL?.trim();

  if (!apiKey || apiKey === "add_your_key_here") {
    throw new Error(
      "Set GEMINI_API_KEY in server/.env. Copy server/.env.example first.",
    );
  }

  if (!model || model === "add_verified_model_id_here") {
    throw new Error(
      "Set GEMINI_MODEL in server/.env to a model ID verified in Google AI Studio.",
    );
  }

  return { apiKey, model };
}
