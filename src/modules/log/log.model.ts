import mongoose, { Schema } from "mongoose";

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

const sdkEventSchema = new Schema(
  {
    // `type` is both the field name and the Mongoose type keyword
    type: { type: String, required: true },
    timestamp: { type: Number, required: true },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false }
);

const logSchema = new Schema(
  {
    error: {
      message: { type: String, required: true },
      stack: { type: String, required: true },
    },
    events: {
      type: [sdkEventSchema],
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
    userAgent: { type: String },
  },
  { collection: "logs" }
);

export const Log = mongoose.model("Log", logSchema);
