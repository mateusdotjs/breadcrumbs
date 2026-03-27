import type { FastifyInstance } from "fastify";
import { LogController } from "./log.controller.js";
import { LogService } from "./log.service.js";

export function registerLogRoutes(app: FastifyInstance): void {
  const controller = new LogController(new LogService());
  app.post("/api/log", controller.postLog);
}
