import { ApiRouterFactory } from "./routers/ApiRouter.js";
import { BcryptHashSuite } from "./crypto/PasswordHashSuite.js";
import { PostgresDbFactory } from "./databases/postgres.js";
import { Logger } from "./logger.js";
import { PostgresUserRepositoryFactory } from "./repositories/UserRepository.js";
import { UserService } from "./services/UserService.js";
import express from "express";
import "dotenv/config";
import { SessionService } from "./services/SessionService.js";
import { PostgresSessionRepositoryFactory } from "./repositories/SessionRepository.js";
import { Sha512TokenGenerator } from "./crypto/TokenGenerator.js";
import { AuthenticationService } from "./services/AuthenticationService.js";
import { AuthorizationService } from "./services/AuthorizationService.js";

(async () => {
  const pgClient = await PostgresDbFactory();

  // Utilities
  const bcryptSuite = new BcryptHashSuite();
  const sha512TokenGenerator = new Sha512TokenGenerator();

  // Repositories
  const userRepository = await PostgresUserRepositoryFactory(pgClient);
  const sessionRepository = await PostgresSessionRepositoryFactory(pgClient);

  // Services
  const userService = new UserService(userRepository, bcryptSuite);
  const sessionService = new SessionService(
    sessionRepository,
    sha512TokenGenerator
  );
  const authenticationService = new AuthenticationService(
    sessionService,
    userService
  );
  const authorizationService = new AuthorizationService(
    sessionService,
    userService
  );

  // Routers
  const httpRouter = ApiRouterFactory(
    userService,
    authenticationService,
    authorizationService,
    sessionService,
    Logger
  );

  // App setup
  const app = express();

  // App routes
  app.use("/api/v1", httpRouter);

  // App finalization
  const port = parseInt(process.env.PORT || "3000");
  app.listen(port);
  Logger.info(`--- OpenDirectory UP on port ${port} ---`);
})();
