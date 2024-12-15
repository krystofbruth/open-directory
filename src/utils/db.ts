import { MongoClient, ServerApiVersion } from "mongodb";
import { logger } from "./logger.js";
const terminationEvents = ["SIGTERM", "SIGINT"];
const uri: string = process.env.DB_URI || "mongodb://localhost:27017";
const dbName: string = process.env.DB_NAME || "openad";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

logger.info(`Initializing connection to db ${uri}`);
await client.connect();
await client.db("admin").command({ ping: 1 });
logger.info(`Connection to db ${uri} successfully initialized`);

for (const terminationEvent of terminationEvents) {
  process.on(terminationEvent, () => {
    logger.info(`Closing connection to db ${uri}`);
    client.close();
  });
}

export const db = client.db(dbName);
