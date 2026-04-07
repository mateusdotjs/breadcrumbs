import { Log } from "./log.model.js";
import { Project } from "../projects/projects.model.js";

export class LogService {
  // Persists one document; Mongoose validates shape against the Log schema.
  async insertLog(payload: unknown, userAgent: string | undefined, referer: string | undefined): Promise<void> {
    const doc: any =
      typeof payload === "object" && payload !== null
        ? { ...payload, userAgent, referer }
        : { userAgent, referer };

    // Validate that projectId exists
    if (!doc.projectId || typeof doc.projectId !== "string") {
      throw new Error("projectId is required and must be a string");
    }

    await Log.create(doc);
  }

  async getLogById(id: string): Promise<InstanceType<typeof Log> | null> {
    return Log.findById(id).exec();
  }

  async getLogsByProjectId(projectId: string, ownerClerkUserId: string): Promise<InstanceType<typeof Log>[]> {
    const project = await Project.findOne({ _id: projectId, ownerClerkUserId }).exec();
    if (!project) {
      throw new Error("PROJECT_NOT_FOUND_OR_UNAUTHORIZED");
    }

    return Log.find({ projectId }).sort({ createdAt: -1 }).exec();
  }

  async getLogsBySessionId(sessionId: string, ownerClerkUserId: string): Promise<InstanceType<typeof Log>[]> {
    const logs = await Log.find({ sessionId }).sort({ createdAt: -1 }).exec();

    if (logs.length === 0) {
      return [];
    }

    const projectId = logs[0].projectId;
    const project = await Project.findOne({ _id: projectId, ownerClerkUserId }).exec();
    if (!project) {
      throw new Error("PROJECT_NOT_FOUND_OR_UNAUTHORIZED");
    }

    return logs;
  }
}
