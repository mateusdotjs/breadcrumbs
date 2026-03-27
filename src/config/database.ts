import { MongoClient, Db, Collection } from "mongodb";
import type { StoredLog } from "../modules/log/log.model.js";

// Singleton Mongo client + db handle so we connect once per process.
let client: MongoClient | null = null;
let database: Db | null = null;

// Connects to MongoDB and caches the database instance for reuse.
export async function connectToMongo(uri: string, dbName: string): Promise<Db> {
  if (database) return database;

  client = new MongoClient(uri);
  await client.connect();
  database = client.db(dbName);
  return database;
}

// Collection for error reports + breadcrumb events (must call connectToMongo first).
export function getLogsCollection(): Collection<StoredLog> {
  if (!database) {
    throw new Error("MongoDB is not connected.");
  }
  return database.collection<StoredLog>("logs");
}

// Clean shutdown for graceful restarts / SIGINT / SIGTERM.
export async function closeMongoConnection(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    database = null;
  }
}
