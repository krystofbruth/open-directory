import pg from "pg";
import { User, UserModifiable } from "../models/User.js";
import {
  ConflictException,
  DatabaseException,
  InvalidParamsException,
  NotFoundException,
} from "../base/Exceptions.js";
import { Logger } from "../logger.js";
import { PostgresDb } from "../databases/postgres.js";
import { validate as validateUUID } from "uuid";

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  create(userModifiable: UserModifiable): Promise<User>;
  get(limit: number, offset: number): Promise<User[]>;
  checkConflict(username: string): Promise<boolean>;
  update(
    userid: string,
    username: string | undefined,
    passwordHash: string | undefined
  ): Promise<User>;
}

class PostgresUserRepository implements UserRepository {
  constructor(private db: PostgresDb) {}

  private mapPostgresUserToUser(inp: any): User {
    return {
      userid: inp.userid,
      username: inp.username,
      passwordHash: inp.passwordhash,
    };
  }

  public async create(userModifiable: UserModifiable): Promise<User> {
    const query =
      "INSERT INTO users(username, passwordhash) VALUES ($1, $2) RETURNING *;";
    const params = [userModifiable.username, userModifiable.passwordHash];
    return (await this.db.performQuery(query, params))[0];
  }

  public async findById(id: string): Promise<User | null> {
    if (!validateUUID(id)) throw new InvalidParamsException();
    const query = "SELECT * FROM users WHERE userid=$1;";
    const params = [id];
    const res = (await this.db.performQuery(query, params))[0];
    if (!res) return null;
    return this.mapPostgresUserToUser(res);
  }

  public async findByUsername(username: string): Promise<User | null> {
    const query = "SELECT * FROM users WHERE username=$1;";
    const params = [username];
    const res = (await this.db.performQuery(query, params))[0];
    if (!res) return null;
    return this.mapPostgresUserToUser(res);
  }

  public async get(limit: number, offset: number): Promise<User[]> {
    const query = "SELECT * FROM users LIMIT $1 OFFSET $2";
    const params = [limit.toString(), offset.toString()];
    return (await this.db.performQuery(query, params)).map((u) =>
      this.mapPostgresUserToUser(u)
    );
  }

  public async checkConflict(username: string): Promise<boolean> {
    const query = "SELECT * FROM users WHERE username=$1";
    const params = [username];
    return (await this.db.performQuery(query, params))[0];
  }

  public async update(
    userid: string,
    username: string | undefined,
    passwordHash: string | undefined
  ): Promise<User> {
    const user = await this.findById(userid);
    if (!user) throw new NotFoundException();

    if (username === undefined && passwordHash === undefined) return user;

    const query = `UPDATE users SET username = $1, passwordHash = $2 WHERE userid = $3 RETURNING *;`;

    const params = [
      username || user.username,
      passwordHash || user.passwordHash,
      userid,
    ];

    return (await this.db.performQuery(query, params))[0];
  }
}

export async function PostgresUserRepositoryFactory(postgresDb: PostgresDb) {
  try {
    return new PostgresUserRepository(postgresDb);
  } catch (err) {
    throw new DatabaseException(err, "User table initialization failed.");
  }
}

export async function setupPostgresUserTable(client: pg.Client) {
  await client.query(`CREATE TABLE users (
    userid uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    passwordHash TEXT NOT NULL)`);
}
