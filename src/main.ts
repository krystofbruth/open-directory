import { ApiRouterFactory } from "./routers/ApiRouter.js";
import { BcryptHashSuite } from "./crypto/PasswordHashSuite.js";
import { PostgresDbFactory } from "./databases/postgres.js";
import { Logger } from "./logger.js";
import { PostgresUserRepositoryFactory } from "./repositories/UserRepository.js";
import { HttpRouterFactory } from "./routers/HttpRouter.js";
import { UserService } from "./services/UserService.js";
import express from "express";
import "dotenv/config";

(async () => {
  const pgClient = await PostgresDbFactory();

  // Utilities
  const bcryptSuite = new BcryptHashSuite();

  // Repositories
  const userRepository = await PostgresUserRepositoryFactory(pgClient);

  // Services
  const userService = new UserService(userRepository, bcryptSuite);

  // Routers
  const httpRouter = ApiRouterFactory(userService, Logger);

  // App setup
  const app = express();

  // App routes
  app.use("/api/v1", httpRouter);

  // App finalization
  const port = parseInt(process.env.PORT || "3000");
  app.listen(port);
  Logger.info(`--- OpenDirectory UP on port ${port} ---`);
})();
