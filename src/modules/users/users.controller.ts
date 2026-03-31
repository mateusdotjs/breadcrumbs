import { getAuth } from "@clerk/fastify";
import type { FastifyReply, FastifyRequest } from "fastify";
import { UsersService } from "./users.service.js";
import type { UpdateCurrentUserBody } from "./users.types.js";

type UpdateCurrentUserRequest = { Body: UpdateCurrentUserBody };

export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  getByCurrentUser = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const { userId } = getAuth(request);
    if (!userId) {
      return reply.status(401).send({ ok: false, error: "Unauthorized." });
    }

    const user = await this.usersService.getOrCreateByClerkUserId(userId);
    return reply.send({ ok: true, user });
  };

  updateByCurrentUser = async (
    request: FastifyRequest<UpdateCurrentUserRequest>,
    reply: FastifyReply
  ): Promise<void> => {
    const { userId } = getAuth(request);
    if (!userId) {
      return reply.status(401).send({ ok: false, error: "Unauthorized." });
    }

    const companyName = request.body?.companyName?.trim();
    if (!companyName) {
      return reply.status(400).send({ ok: false, error: "companyName is required." });
    }

    const user = await this.usersService.updateByClerkUserId(userId, companyName);
    return reply.status(200).send({ ok: true, user });
  };
}
