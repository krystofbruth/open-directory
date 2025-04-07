import pg from "pg";
const { Client } = pg;
import { Logger } from "../logger.js";
import { DatabaseException } from "../base/Exceptions.js";

export interface PostgresDb {
  client: pg.Client;
  performQuery(query: string, params: string[]): Promise<any[]>;
}

function performQueryFactory(
  client: pg.Client
): (query: string, params: string[]) => Promise<any[]> {
  return async (query, params) => {
    try {
      const res = await client.query(query, params);
      return res.rows;
    } catch (err) {
      throw new DatabaseException(err);
    }
  };
}

export async function PostgresDbFactory(): Promise<PostgresDb> {
  try {
    Logger.info(`Connecting to postgreSQL deployment ${process.env.PGHOST}`);
    const client = new Client({
      database: "openad",
    });
    await client.connect();
    Logger.info(
      `Successfully connected to postgreSQL deployment ${process.env.PGHOST}`
    );
    return { client, performQuery: performQueryFactory(client) };
  } catch (err) {
    throw new DatabaseException(
      err,
      `Failed to establish the initial connection to PostgreSQL.`
    );
  }
}
