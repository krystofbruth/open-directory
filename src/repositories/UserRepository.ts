import { User, UserFilter, UserModifiable } from "../models/User.js";
import { Repository } from "./Repository.js";
import { DatabaseSync } from "node:sqlite";

export type UserRepository = Repository<User, UserModifiable, UserFilter>;

export class PostgresUserRepository implements UserRepository {
  constructor(private postgres: DatabaseSync) {}

  public find(filter?: UserFilter | undefined): User[] {
    // TODO
  }
}
