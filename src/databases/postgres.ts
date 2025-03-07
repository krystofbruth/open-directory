import pg from "pg";
const { Client } = pg;
import { Logger } from "../logger.js";
import { DatabaseException } from "../base/Exceptions.js";

export async function PostgresDbFactory(): Promise<pg.Client> {
  try {
    Logger.info(`Connecting to postgreSQL deployment ${process.env.PGHOST}`);
    const client = new Client({
      database: "openad",
    });
    await client.connect();
    Logger.info(
      `Successfully connected to postgreSQL deployment ${process.env.PGHOST}`
    );
    return client;
  } catch (err) {
    throw new DatabaseException(
      err,
      `Failed to establish the initial connection to PostgreSQL.`
    );
  }
}
