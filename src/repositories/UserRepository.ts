import { DependencyFactory } from "../base/Container.js";
import { Repository } from "./Repository.js";

export interface UserRepository extends Repository {}

export const MongoUserRepositoryFactory: DependencyFactory<
  UserRepository
> = async (container) => {
  const db = container.inject("mongod");

  const res = await db.command({ ping: 1 });
  console.log(res);

  return {
    save() {
      // TODO
    },
  };
};
