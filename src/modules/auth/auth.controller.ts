import { getAuth } from "@clerk/fastify";
import type { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "./auth.service.js";

export class AuthController {
  constructor(private readonly authService: AuthService) { }

  me = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const { userId } = getAuth(request);
    const user = this.authService.getAuthenticatedUser(userId);

    if (!user) {
      return reply.status(401).send({ ok: false, error: "Unauthorized." });
    }

    return reply.send({ ok: true, user });
  };
}
