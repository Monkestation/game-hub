import { z } from "zod";
import path from "node:path";
import dotenv from "dotenv";

dotenv.configDotenv({
  path: path.join(import.meta.dirname, "../../.backend.env"),
});

const envSchema = z.object({
  BACKEND_PORT: z.coerce.number(),
  // BACKEND_PLEXORA_APIPORT: z
  //   .string()
  //   .trim()
  //   .min(1, "Missing backend Plexora API port"),
  // BACKEND_PLEXORA_APIKEY: z.string().trim().min(1, "Missing Plexora API key"),
});

export const env = envSchema.parse(process.env);
