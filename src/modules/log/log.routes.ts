import type { FastifyInstance } from "fastify";
import { LogController } from "./log.controller.js";
import { LogService } from "./log.service.js";

export function registerLogRoutes(app: FastifyInstance): void {
  const controller = new LogController(new LogService());

  // Routes are mounted under the global API prefix (e.g. `/api/v1`).
  app.get("/log/:id", controller.getLog);
  app.post("/log", controller.postLog);
}
