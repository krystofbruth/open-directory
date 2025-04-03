import { PostgresDbFactory } from "./databases/postgres.js";
import { PostgresUserRepositoryFactory } from "./repositories/UserRepository.js";

// TODO
(async () => {
  const pgClient = await PostgresDbFactory();

  const userRepository = await PostgresUserRepositoryFactory(pgClient);
  const res = await userRepository.get(1, 1);
  console.log(res);
})();
