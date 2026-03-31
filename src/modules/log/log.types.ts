/** One captured interaction (click, route, etc.) from the SDK ring buffer. */
export type SdkEvent = {
  type: string;
  timestamp: number;
  data: Record<string, unknown>;
};

/** Body of POST /api/v1/log — same structure the client sends on window.onerror. */
export type SdkLogPayload = {
  projectId: string;
  sessionId: string;
  error: {
    message: string;
    stack: string;
  };
  events: SdkEvent[];
};
