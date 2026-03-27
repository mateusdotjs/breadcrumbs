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
