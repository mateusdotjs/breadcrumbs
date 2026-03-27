// HTTP API for receiving browser error reports and breadcrumb trails from sdk.js.
import Fastify from "fastify";
import { registerLogRoutes } from "./modules/log/log.routes.js";

export const app = Fastify({ logger: true });

registerLogRoutes(app);
