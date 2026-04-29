import type { FastifyInstance } from "fastify";
import { UsersController } from "./users.controller.js";
import { UsersService } from "./users.service.js";

export function registerUsersRoutes(app: FastifyInstance): void {
  // Create service
  const usersService = new UsersService();
  const controller = new UsersController(usersService);

  app.get("/users/me", controller.getByCurrentUser);
  app.post("/users/me", controller.updateByCurrentUser);
}
