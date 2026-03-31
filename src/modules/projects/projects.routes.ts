import type { FastifyInstance } from "fastify";
import { ProjectsController } from "./projects.controller.js";
import { ProjectsService } from "./projects.service.js";

export function registerProjectsRoutes(app: FastifyInstance): void {
  const controller = new ProjectsController(new ProjectsService());

  app.get("/projects/me", controller.getByCurrentUser);
  app.post("/projects", controller.create);
  app.put("/projects/me", controller.updateByCurrentUser);
}
