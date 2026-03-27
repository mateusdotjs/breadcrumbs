import { getLogsCollection } from "../../config/database.js";
import type { SdkLogPayload } from "./log.model.js";

export class LogService {
  // Runtime check that the JSON body matches what sdk.js sends (no schema lib yet).
  isValidPayload(body: unknown): body is SdkLogPayload {
    if (!body || typeof body !== "object") return false;

    const parsed = body as Record<string, unknown>;
    const error = parsed.error as Record<string, unknown> | undefined;
    const events = parsed.events;

    if (!error || typeof error.message !== "string" || typeof error.stack !== "string") {
      return false;
    }

    if (!Array.isArray(events)) return false;

    return events.every((event) => {
      if (!event || typeof event !== "object") return false;
      const e = event as Record<string, unknown>;
      return (
        typeof e.type === "string" &&
        typeof e.timestamp === "number" &&
        !!e.data &&
        typeof e.data === "object"
      );
    });
  }

  // Receives error + events from the SDK and appends one document to the logs collection.
  async insertLog(payload: SdkLogPayload, userAgent: string | undefined): Promise<void> {
    const logs = getLogsCollection();
    await logs.insertOne({
      ...payload,
      createdAt: new Date(),
      userAgent
    });
  }
}
