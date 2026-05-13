import { defineConfig } from 'drizzle-kit';
import { env } from "./src/config/env";

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  dbCredentials: {
    url: env?.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5433/api-teste',
  },
  verbose: true,
  strict: true,
});
