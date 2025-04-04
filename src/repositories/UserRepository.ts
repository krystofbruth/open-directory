import pg from "pg";
import { User, UserModifiable } from "../models/User.js";
import { ConflictException, DatabaseException } from "../base/Exceptions.js";
import { Logger } from "../logger.js";

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  create(userModifiable: UserModifiable): Promise<User>;
  get(limit: number, offset: number): Promise<User[]>;
  checkConflict(username: string): Promise<boolean>;
}

class PostgresUserRepository implements UserRepository {
  constructor(private pgClient: pg.Client) {}

  public async create(userModifiable: UserModifiable): Promise<User> {
    const query =
      "INSERT INTO users(username, passwordhash) VALUES ($1, $2) RETURNING *;";
    const params = [userModifiable.username, userModifiable.passwordHash];
    try {
      const res = await this.pgClient.query(query, params);
      return res.rows[0];
    } catch (err) {
      throw new DatabaseException(err);
    }
  }

  public async findById(id: string): Promise<User | null> {
    const query = "SELECT * FROM users WHERE userid=$1;";
    const params = [id];
    try {
      const res = await this.pgClient.query(query, params);
      if (typeof res.rows[0] === "undefined") {
        return null;
      }
      return res.rows[0];
    } catch (err) {
      throw new DatabaseException(err);
    }
  }

  public async findByUsername(username: string): Promise<User | null> {
    const query = "SELECT * FROM users WHERE username=$1;";
    const params = [username];
    try {
      const res = await this.pgClient.query(query, params);
      if (typeof res.rows[0] === "undefined") {
        return null;
      }
      return res.rows[0];
    } catch (err) {
      throw new DatabaseException(err);
    }
  }

  public async get(limit: number, offset: number): Promise<User[]> {
    const query = "SELECT * FROM users LIMIT $1 OFFSET $2";
    const params = [limit, offset];
    try {
      const res = await this.pgClient.query(query, params);
      return res.rows;
    } catch (err) {
      throw new DatabaseException(err);
    }
  }

  public async checkConflict(username: string): Promise<boolean> {
    const query = "SELECT * FROM users WHERE username=$1";
    const params = [username];
    try {
      const res = await this.pgClient.query(query, params);
      if (res.rowCount !== 0) return true;
      return false;
    } catch (err) {
      throw new DatabaseException(err);
    }
  }
}

async function createUserPostgresTable(pgClient: pg.Client) {
  try {
    await pgClient.query(
      `CREATE TABLE users(userid uuid PRIMARY KEY DEFAULT gen_random_uuid(), username TEXT UNIQUE, passwordhash TEXT);`
    );
  } catch (err) {
    throw new DatabaseException(err, "User table initialization failed.");
  }
}

export async function PostgresUserRepositoryFactory(pgClient: pg.Client) {
  try {
    const table = (
      await pgClient.query("SELECT * FROM pg_tables WHERE tablename='users';")
    ).rows[0];
    if (typeof table === "undefined") {
      Logger.warn("Table users missing, initializing new one");
      await createUserPostgresTable(pgClient);
      Logger.info("Table users successfully created");
    }
    return new PostgresUserRepository(pgClient);
  } catch (err) {
    throw new DatabaseException(err, "User table initialization failed.");
  }
}
