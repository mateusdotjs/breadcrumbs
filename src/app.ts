// HTTP API for receiving browser error reports and breadcrumb trails from sdk.js.
import path from "node:path";
import { fileURLToPath } from "node:url";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { clerkPlugin } from "@clerk/fastify";
import { registerLogRoutes } from "./modules/log/log.routes.js";
import { registerAuthRoutes } from "./modules/auth/auth.routes.js";
import { registerUsersRoutes } from "./modules/users/users.routes.js";
import { registerProjectsRoutes } from "./modules/projects/projects.routes.js";
import cors from "@fastify/cors";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const app = Fastify({ logger: true });

await app.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

await app.register(clerkPlugin);

// Global API prefix (v1).
await app.register(async (apiV1) => {
  registerAuthRoutes(apiV1);
  registerUsersRoutes(apiV1);
  registerProjectsRoutes(apiV1);
  registerLogRoutes(apiV1);
}, { prefix: "/api/v1" });

await app.register(fastifyStatic, {
  root: path.join(__dirname, "../public"),
});
