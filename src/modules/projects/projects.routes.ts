import type { FastifyInstance } from "fastify";
import { ProjectsController } from "./projects.controller.js";
import { ProjectsService } from "./projects.service.js";
import { LogService } from "../log/log.service.js";

export function registerProjectsRoutes(app: FastifyInstance): void {
  const logService = new LogService();
  const controller = new ProjectsController(new ProjectsService(logService));

  app.get("/projects/me", controller.getByCurrentUser);
  app.post("/projects", controller.create);
  app.put("/projects/me", controller.updateByCurrentUser);
  app.delete("/projects/:id", controller.delete);
}
