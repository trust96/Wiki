import { execFile } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { GenericContainer, Wait, type StartedTestContainer } from "testcontainers";
import type { TestProject } from "vitest/node";

const execFileAsync = promisify(execFile);
const require = createRequire(import.meta.url);
const backendRoot = fileURLToPath(new URL("../", import.meta.url));

export default async function setup(project: TestProject) {
  const containers: StartedTestContainer[] = [];
  const stop = async () => {
    const results = await Promise.allSettled(containers.map((container) => container.stop()));
    const failures = results.filter((result) => result.status === "rejected");
    if (failures.length) {
      throw new AggregateError(failures.map((result) => result.reason), "Failed to stop test containers");
    }
  };

  try {
    const postgres = await new PostgreSqlContainer("postgres:16-alpine")
      .withDatabase("wiki_test")
      .withUsername("wiki_test")
      .withPassword("integration-test-only")
      .withStartupTimeout(120_000)
      .start();
    containers.push(postgres);

    const redis = await new GenericContainer("redis:7-alpine")
      .withExposedPorts(6379)
      .withWaitStrategy(Wait.forLogMessage("Ready to accept connections"))
      .withStartupTimeout(120_000)
      .start();
    containers.push(redis);

    const redisUrl = new URL("redis://localhost");
    redisUrl.hostname = redis.getHost();
    redisUrl.port = String(redis.getMappedPort(6379));
    const services = { databaseUrl: postgres.getConnectionUri(), redisUrl: redisUrl.toString() };
    const env = { ...process.env, NODE_ENV: "test", DATABASE_URL: services.databaseUrl, REDIS_URL: services.redisUrl };
    const prismaCli = require.resolve("prisma/build/index.js");

    for (const args of [["generate"], ["migrate", "deploy"]]) {
      await execFileAsync(process.execPath, [prismaCli, ...args], { cwd: backendRoot, env, timeout: 120_000 });
    }

    project.provide("services", services);
    return stop;
  } catch (error) {
    try {
      await stop();
    } catch (cleanupError) {
      throw new AggregateError([error, cleanupError], "Test setup and cleanup failed");
    }
    throw error;
  }
}
