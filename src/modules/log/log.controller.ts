import type { FastifyReply, FastifyRequest } from "fastify";
import mongoose from "mongoose";
import { LogService } from "./log.service.js";

type GetLogParams = { Params: { id: string } };

export class LogController {
  constructor(private readonly logService: LogService) {}

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
      await this.logService.insertLog(request.body, request.headers["user-agent"]);
    } catch (error) {
      if (
        error instanceof mongoose.Error.ValidationError ||
        error instanceof mongoose.Error.CastError
      ) {
        return reply.status(400).send({ ok: false, error: "Invalid payload format." });
      }
      throw error;
    }

    return reply.status(201).send({ ok: true });
  };
}
