import { PostgresDbFactory } from "./databases/postgres.js";
import { PostgresUserRepositoryFactory } from "./repositories/UserRepository.js";

// TODO
(async () => {
  const pgClient = await PostgresDbFactory();

  const userRepository = await PostgresUserRepositoryFactory(pgClient);
  console.log(
    await userRepository.create({
      username: "somebody",
      passwordHash: "some-plaintext-pass'",
    })
  );
})();
