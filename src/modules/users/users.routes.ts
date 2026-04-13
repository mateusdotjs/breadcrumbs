import type { FastifyInstance } from "fastify";
import { UsersController } from "./users.controller.js";
import { UsersService } from "./users.service.js";
import { DatabaseFactory } from "../../shared/database/factory/DatabaseFactory.js";

export function registerUsersRoutes(app: FastifyInstance): void {
  // Create repository and service
  const userRepository = DatabaseFactory.createUserRepository();
  const usersService = new UsersService(userRepository);
  const controller = new UsersController(usersService);

  app.get("/users/me", controller.getByCurrentUser);
  app.post("/users/me", controller.updateByCurrentUser);
}
