import "dotenv/config";
import { app } from "./app.js";
import { closeMongoConnection, connectToMongo } from "./config/database.js";

const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? "0.0.0.0";
const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017";
const MONGO_DB_NAME = process.env.MONGO_DB_NAME ?? "breadcrumbs";

const start = async (): Promise<void> => {
  try {
    await connectToMongo(MONGO_URI, MONGO_DB_NAME);
    await app.listen({ port: PORT, host: HOST });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();

// Close Fastify and Mongo when the process is asked to stop.
const shutdown = async (): Promise<void> => {
  await app.close();
  await closeMongoConnection();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
