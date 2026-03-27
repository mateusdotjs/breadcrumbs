import type { FastifyReply, FastifyRequest } from "fastify";
import { LogService } from "./log.service.js";

export class LogController {
  constructor(private readonly logService: LogService) {}

  postLog = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    if (!this.logService.isValidPayload(request.body)) {
      return reply.status(400).send({ ok: false, error: "Invalid payload format." });
    }

    await this.logService.insertLog(request.body, request.headers["user-agent"]);

    return reply.status(201).send({ ok: true });
  };
}
