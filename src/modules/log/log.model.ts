// Types for the browser SDK payload and what we persist in MongoDB.
// Mirrors the shape built in sdk.js (error + recent events).

/** One captured interaction (click, route, etc.) from the SDK ring buffer. */
export type SdkEvent = {
  type: string;
  timestamp: number;
  data: Record<string, unknown>;
};

/** Body of POST /api/log — same structure the client sends on window.onerror. */
export type SdkLogPayload = {
  error: {
    message: string;
    stack: string;
  };
  events: SdkEvent[];
};

/** Document we store: SDK payload plus server metadata. */
export type StoredLog = SdkLogPayload & {
  createdAt: Date;
  userAgent?: string;
};
