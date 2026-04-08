import { getAuth } from "@clerk/fastify";
import type { FastifyReply, FastifyRequest } from "fastify";
import { UsersService } from "./users.service.js";
import type { UpdateCurrentUserBody } from "./users.types.js";
import { UnauthorizedError } from "../../shared/errors.js";

type UpdateCurrentUserRequest = { Body: UpdateCurrentUserBody; };

export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  getByCurrentUser = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const { userId } = getAuth(request);
    if (!userId) {
      throw new UnauthorizedError();
    }

    const user = await this.usersService.getOrCreateByClerkUserId(userId);
    return reply.send({ data: user });
  };

  updateByCurrentUser = async (
    request: FastifyRequest<UpdateCurrentUserRequest>,
    reply: FastifyReply
  ): Promise<void> => {
    const { userId } = getAuth(request);
    if (!userId) {
      throw new UnauthorizedError();
    }

    // No user fields to update for now
    const user = await this.usersService.getOrCreateByClerkUserId(userId);
    return reply.status(200).send({ data: user });
  };
}
