import pg from "pg";
import { User, UserModifiable } from "../models/User.js";
import { ConflictException, DatabaseException } from "../base/Exceptions.js";
import { Logger } from "../logger.js";
import { PostgresDb } from "../databases/postgres.js";

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  create(userModifiable: UserModifiable): Promise<User>;
  get(limit: number, offset: number): Promise<User[]>;
  checkConflict(username: string): Promise<boolean>;
}

class PostgresUserRepository implements UserRepository {
  constructor(private db: PostgresDb) {}

  public async create(userModifiable: UserModifiable): Promise<User> {
    const query =
      "INSERT INTO users(username, passwordhash) VALUES ($1, $2) RETURNING *;";
    const params = [userModifiable.username, userModifiable.passwordHash];
    return (await this.db.performQuery(query, params))[0];
  }

  public async findById(id: string): Promise<User | null> {
    const query = "SELECT * FROM users WHERE userid=$1;";
    const params = [id];
    return (await this.db.performQuery(query, params))[0] || null;
  }

  public async findByUsername(username: string): Promise<User | null> {
    const query = "SELECT * FROM users WHERE username=$1;";
    const params = [username];
    return (await this.db.performQuery(query, params))[0] || null;
  }

  public async get(limit: number, offset: number): Promise<User[]> {
    const query = "SELECT * FROM users LIMIT $1 OFFSET $2";
    const params = [limit.toString(), offset.toString()];
    return (await this.db.performQuery(query, params))[0];
  }

  public async checkConflict(username: string): Promise<boolean> {
    const query = "SELECT * FROM users WHERE username=$1";
    const params = [username];
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
