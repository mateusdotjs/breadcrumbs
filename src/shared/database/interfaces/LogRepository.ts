import { Log } from "../../../modules/log/log.model.js";

export interface LogRepository {
  insertLog(payload: unknown, userAgent: string | undefined, referer: string | undefined): Promise<void>;
  getLogById(id: string): Promise<InstanceType<typeof Log> | null>;
  getLogsByProjectId(projectId: string, ownerClerkUserId: string): Promise<InstanceType<typeof Log>[]>;
  getLogsBySessionId(sessionId: string, ownerClerkUserId: string): Promise<InstanceType<typeof Log>[]>;
  deleteLogsByProjectId(projectId: string): Promise<void>;
}
