import { getAuth } from "@clerk/fastify";
import type { FastifyReply, FastifyRequest } from "fastify";
import mongoose from "mongoose";
import { LogService } from "./log.service.js";

type GetLogParams = { Params: { id: string; }; };
type GetLogsByProjectParams = { Params: { projectId: string; }; };
type GetLogsBySessionParams = { Params: { sessionId: string; }; };

export class LogController {
  constructor(private readonly logService: LogService) { }

  getLog = async (
    request: FastifyRequest<GetLogParams>,
    reply: FastifyReply
  ): Promise<void> => {
    try {
      const log = await this.logService.getLogById(request.params.id);
      if (!log) {
        return reply.status(404).send({ ok: false, error: "Log not found." });
      }
      return reply.send({ ok: true, log });
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        return reply.status(400).send({ ok: false, error: "Invalid log id." });
      }
      throw error;
    }
  };

  postLog = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      await this.logService.insertLog(request.body, request.headers["user-agent"], request.headers.referer);
    } catch (error) {
      if (
        error instanceof mongoose.Error.ValidationError ||
        error instanceof mongoose.Error.CastError
      ) {
        return reply.status(400).send({ ok: false, error: "Invalid payload format." });
      }
      if (
        error instanceof Error &&
        error.message === "projectId is required and must be a string"
      ) {
        return reply.status(400).send({ ok: false, error: "projectId is required and must be a string." });
      }
      throw error;
    }

    return reply.status(201).send({ ok: true });
  };

  getLogsByProject = async (
    request: FastifyRequest<GetLogsByProjectParams>,
    reply: FastifyReply
  ): Promise<void> => {
    const { userId } = getAuth(request);
    if (!userId) {
      return reply.status(401).send({ ok: false, error: "Unauthorized." });
    }

    try {
      const logs = await this.logService.getLogsByProjectId(request.params.projectId, userId);
      return reply.send({ ok: true, logs });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "PROJECT_NOT_FOUND_OR_UNAUTHORIZED"
      ) {
        return reply.status(404).send({ ok: false, error: "Project not found or unauthorized." });
      }
      throw error;
    }
  };

  getLogsBySession = async (
    request: FastifyRequest<GetLogsBySessionParams>,
    reply: FastifyReply
  ): Promise<void> => {
    const { userId } = getAuth(request);
    if (!userId) {
      return reply.status(401).send({ ok: false, error: "Unauthorized." });
    }

    try {
      const logs = await this.logService.getLogsBySessionId(request.params.sessionId, userId);
      return reply.send({ ok: true, logs });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "PROJECT_NOT_FOUND_OR_UNAUTHORIZED"
      ) {
        return reply.status(404).send({ ok: false, error: "Project not found or unauthorized." });
      }
      throw error;
    }
  };
}
