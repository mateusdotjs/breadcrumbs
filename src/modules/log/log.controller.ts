import type { FastifyReply, FastifyRequest } from "fastify";
import mongoose from "mongoose";
import { LogService } from "./log.service.js";

export class LogController {
  constructor(private readonly logService: LogService) {}

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
