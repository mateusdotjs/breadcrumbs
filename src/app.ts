// HTTP API for receiving browser error reports and breadcrumb trails from sdk.js.
import path from "node:path";
import { fileURLToPath } from "node:url";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { registerLogRoutes } from "./modules/log/log.routes.js";
import cors from "@fastify/cors";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const app = Fastify({ logger: true });

await app.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

// Global API prefix (v1).
await app.register(async (apiV1) => {
  registerLogRoutes(apiV1);
}, { prefix: "/api/v1" });

await app.register(fastifyStatic, {
  root: path.join(__dirname, "../public"),
});
