import { getAuth } from "@clerk/fastify";
import type { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "./auth.service.js";
import type { ClerkCreateUserBody } from "./auth.types.js";

type CreateUserRequest = { Body: ClerkCreateUserBody };

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  me = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const { userId } = getAuth(request);
    const user = this.authService.getAuthenticatedUser(userId);

    if (!user) {
      return reply.status(401).send({ ok: false, error: "Unauthorized." });
    }

    return reply.send({ ok: true, user });
  };

  createUser = async (
    request: FastifyRequest<CreateUserRequest>,
    reply: FastifyReply
  ): Promise<void> => {
    const body = request.body;

    if (!body?.emailAddress || !body?.password) {
      return reply.status(400).send({ ok: false, error: "emailAddress and password are required." });
    }

    try {
      const created = await this.authService.createClerkUser(body);
      return reply.status(201).send({ ok: true, ...created });
    } catch {
      return reply.status(400).send({ ok: false, error: "Could not create Clerk user." });
    }
  };
}
