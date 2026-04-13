import type { FastifyInstance } from "fastify";
import { ProjectsController } from "./projects.controller.js";
import { ProjectsService } from "./projects.service.js";
import { LogService } from "../log/log.service.js";
import { DatabaseFactory } from "../../shared/database/factory/DatabaseFactory.js";

export function registerProjectsRoutes(app: FastifyInstance): void {
  // Create repositories
  const logRepository = DatabaseFactory.createLogRepository();
  const projectRepository = DatabaseFactory.createProjectRepository();

  // Create services with dependency injection
  const logService = new LogService(logRepository);
  const projectsService = new ProjectsService(projectRepository, logService);

  // Create controller
  const controller = new ProjectsController(projectsService);

  app.get("/projects/me", controller.getByCurrentUser);
  app.post("/projects", controller.create);
  app.put("/projects/me", controller.updateByCurrentUser);
  app.delete("/projects/:id", controller.delete);
}
