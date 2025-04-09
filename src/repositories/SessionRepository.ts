import { PostgresDb } from "../databases/postgres.js";
import pg from "pg";
import { Session } from "../models/Session.js";

export interface SessionRepository {
  findByToken(token: string): Promise<Session | null>;
  findByUserid(userid: string): Promise<Session[]>;
}

class PostgresSessionRepository implements SessionRepository {
  constructor(private db: PostgresDb) {}

  public async findByToken(token: string): Promise<Session | null> {
    const query = 'SELECT * FROM "session" WHERE token = $1;';
    const params = [token];
    return (await this.db.performQuery(query, params))[0] || null;
  }

  public async findByUserid(userid: string): Promise<Session[]> {
    const query = 'SELECT * FROM "session" WHERE userid = $1;';
    const params = [userid];
    return await this.db.performQuery(query, params);
  }
}

export async function PostgresSessionRepositoryFactory(db: PostgresDb) {
  return new PostgresSessionRepository(db);
}

export async function setupPostgresSessionTable(client: pg.Client) {
  await client.query(`CREATE TABLE session (
    token TEXT PRIMARY KEY,
    userid UUID NOT NULL,
    created TIMESTAMP,
    CONSTRAINT fk_user
      FOREIGN KEY(userid)
      REFERENCES users(userid)
      ON DELETE CASCADE
  )`);
}
