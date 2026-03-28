// HTTP API for receiving browser error reports and breadcrumb trails from sdk.js.
import path from "node:path";
import { fileURLToPath } from "node:url";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { registerLogRoutes } from "./modules/log/log.routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const app = Fastify({ logger: true });

registerLogRoutes(app);

await app.register(fastifyStatic, {
  root: path.join(__dirname, "../public")
});
