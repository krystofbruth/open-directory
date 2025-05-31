import { PostgresDb } from "../databases/postgres.js";
import pg from "pg";
import { Session } from "../models/Session.js";

export interface SessionRepository {
  findByToken(token: string): Promise<Session | null>;
  findByUserid(userid: string): Promise<Session[]>;
  create(userid: string, token: string): Promise<Session>;
  deleteByToken(token: string): Promise<boolean>;
}

class PostgresSessionRepository implements SessionRepository {
  constructor(private db: PostgresDb) {}

  public async findByToken(token: string): Promise<Session | null> {
    const query = 'SELECT * FROM "session" WHERE token = $1;';
    const params = [token];
    return (await this.db.performQuery(query, params)).rows[0] || null;
  }

  public async findByUserid(userid: string): Promise<Session[]> {
    const query = 'SELECT * FROM "session" WHERE userid = $1;';
    const params = [userid];
    return (await this.db.performQuery(query, params)).rows;
  }

  public async create(userid: string, token: string): Promise<Session> {
    const timestampNow = new Date().toISOString();
    const query =
      'INSERT INTO "session" (token, userid, created) VALUES ($1,$2,$3) RETURNING *;';
    const params = [token, userid, timestampNow];
    return (await this.db.performQuery(query, params)).rows[0];
  }

  public async deleteByToken(token: string): Promise<boolean> {
    const query = 'DELETE FROM "session" WHERE token=$1';
    const params = [token];

    const deletedCount = (await this.db.performQuery(query, params)).rowCount;
    if (deletedCount === 0) return false;
    return true;
  }
}

export async function PostgresSessionRepositoryFactory(db: PostgresDb) {
  return new PostgresSessionRepository(db);
}
