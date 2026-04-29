import type { FastifyInstance } from "fastify";
import { LogController } from "./log.controller.js";
import { LogService } from "./log.service.js";

export function registerLogRoutes(app: FastifyInstance): void {
  // Create service
  const logService = new LogService();
  const controller = new LogController(logService);

  // Routes are mounted under the global API prefix (e.g. `/api/v1`).
  app.get("/log/:id", controller.getLog);
  app.post("/log", controller.postLog);
  app.get("/logs/project/:projectId", controller.getLogsByProject);
  app.get("/logs/session/:sessionId", controller.getLogsBySession);
}
