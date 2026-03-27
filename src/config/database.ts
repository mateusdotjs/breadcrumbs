import mongoose from "mongoose";

// Connect once per process; idempotent if already connected.
export async function connectToMongo(uri: string, dbName: string): Promise<void> {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(uri, { dbName });
}

// Clean shutdown for graceful restarts / SIGINT / SIGTERM.
export async function closeMongoConnection(): Promise<void> {
  await mongoose.disconnect();
}
