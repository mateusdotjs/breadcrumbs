import type { FastifyInstance } from "fastify";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";

export function registerAuthRoutes(app: FastifyInstance): void {
  const controller = new AuthController(new AuthService());

  app.get("/auth/me", controller.me);
}
