import { Log } from "./log.model.js";
import { LogRepository } from "../../shared/database/interfaces/LogRepository.js";

export class LogService {
  constructor(private readonly logRepository: LogRepository) { }

  async insertLog(payload: unknown, userAgent: string | undefined, referer: string | undefined): Promise<void> {
    return this.logRepository.insertLog(payload, userAgent, referer);
  }

  async getLogById(id: string): Promise<InstanceType<typeof Log> | null> {
    return this.logRepository.getLogById(id);
  }

  async getLogsByProjectId(projectId: string, ownerClerkUserId: string): Promise<InstanceType<typeof Log>[]> {
    return this.logRepository.getLogsByProjectId(projectId, ownerClerkUserId);
  }

  async getLogsBySessionId(sessionId: string, ownerClerkUserId: string): Promise<InstanceType<typeof Log>[]> {
    return this.logRepository.getLogsBySessionId(sessionId, ownerClerkUserId);
  }

  async deleteLogsByProjectId(projectId: string): Promise<void> {
    return this.logRepository.deleteLogsByProjectId(projectId);
  }
}
