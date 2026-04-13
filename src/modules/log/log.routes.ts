import type { FastifyInstance } from "fastify";
import { LogController } from "./log.controller.js";
import { LogService } from "./log.service.js";
import { DatabaseFactory } from "../../shared/database/factory/DatabaseFactory.js";

export function registerLogRoutes(app: FastifyInstance): void {
  // Create repository and service
  const logRepository = DatabaseFactory.createLogRepository();
  const logService = new LogService(logRepository);
  const controller = new LogController(logService);

  // Routes are mounted under the global API prefix (e.g. `/api/v1`).
  app.get("/log/:id", controller.getLog);
  app.post("/log", {
    config: {
      cors: {
        origin: "*",
        methods: ["POST"],
        allowedHeaders: ["Content-Type"],
      }
    }
  }, controller.postLog);
  app.get("/logs/project/:projectId", controller.getLogsByProject);
  app.get("/logs/session/:sessionId", controller.getLogsBySession);
}
