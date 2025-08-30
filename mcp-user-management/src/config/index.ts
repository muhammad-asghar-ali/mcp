import { z } from "zod";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z
    .string()
    .transform((val: string) => Number(val))
    .default("3000"),

  MCP_SERVER_NAME: z.string().default("mcp-user-management"),
  MCP_SERVER_VERSION: z.string().default("1.0.0"),

  DATA_FILE_PATH: z.string().default("src/data/users.json"),

  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  LOG_FORMAT: z.enum(["json", "text"]).default("text"),

  ENABLE_AUTH: z
    .string()
    .transform((val: string) => val === "true")
    .default("false"),
  DANGEROUSLY_OMIT_AUTH: z
    .string()
    .transform((val: string) => val === "true")
    .default("false"),
});

const config = configSchema.parse(process.env);

export function getDataFilePath(): string {
  return path.resolve(__dirname, "..", config.DATA_FILE_PATH);
}

export default config;
