import { Log } from "./log.model.js";

export class LogService {
  // Persists one document; Mongoose validates shape against the Log schema.
  async insertLog(payload: unknown, userAgent: string | undefined): Promise<void> {
    const doc =
      typeof payload === "object" && payload !== null
        ? { ...payload, userAgent }
        : { userAgent };
    await Log.create(doc);
  }

  async getLogById(id: string): Promise<InstanceType<typeof Log> | null> {
    return Log.findById(id).exec();
  }
}
