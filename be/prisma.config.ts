import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Prefer env; fallback lets `prisma generate` run in Docker builds without secrets.
    url:
      process.env.DATABASE_URL ??
      "postgresql://wiki:wiki@localhost:5432/wiki?schema=public",
  },
});
