import { Container } from "./base/Container.js";
import { MongoDbFactoryFactory } from "./databases/Mongo.js";
import { MongoUserRepositoryFactory } from "./repositories/UserRepository.js";

(async () => {
  const container = new Container();

  (
    await container.register(
      "mongod",
      MongoDbFactoryFactory("mongodb://localhost:27017")
    )
  ).register("userRepository", MongoUserRepositoryFactory);
})();
