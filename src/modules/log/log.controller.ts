import { getAuth } from "@clerk/fastify";
import type { FastifyReply, FastifyRequest } from "fastify";
import mongoose from "mongoose";
import { LogService } from "./log.service.js";
import { UnauthorizedError, NotFoundError, ValidationError } from "../../shared/errors.js";

type GetLogParams = { Params: { id: string; }; };
type GetLogsByProjectParams = { Params: { projectId: string; }; };
type GetLogsBySessionParams = { Params: { sessionId: string; }; };

export class LogController {
  constructor(private readonly logService: LogService) { }

  getLog = async (
    request: FastifyRequest<GetLogParams>,
    reply: FastifyReply
  ): Promise<void> => {
    const log = await this.logService.getLogById(request.params.id);
    if (!log) {
      throw new NotFoundError("Log not found");
    }
    return reply.send({ data: log });
  };

  postLog = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    await this.logService.insertLog(request.body, request.headers["user-agent"], request.headers.referer);
    return reply.status(201).send({ data: { message: "Log created successfully." } });
  };

  getLogsByProject = async (
    request: FastifyRequest<GetLogsByProjectParams>,
    reply: FastifyReply
  ): Promise<void> => {
    const { userId } = getAuth(request);
    if (!userId) {
      throw new UnauthorizedError();
    }

    const logs = await this.logService.getLogsByProjectId(request.params.projectId, userId);
    return reply.send({ data: logs });
  };

  getLogsBySession = async (
    request: FastifyRequest<GetLogsBySessionParams>,
    reply: FastifyReply
  ): Promise<void> => {
    const { userId } = getAuth(request);
    if (!userId) {
      throw new UnauthorizedError();
    }

    const logs = await this.logService.getLogsBySessionId(request.params.sessionId, userId);
    return reply.send({ data: logs });
  };
}
