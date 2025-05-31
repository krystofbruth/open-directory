import { Request, Response, NextFunction, Router } from "express";
import {
  AuthenticationException,
  AuthorizationException,
  ConflictException,
  Exception,
  ForbiddenException,
} from "../base/Exceptions.js";
import { NotFoundException } from "../base/Exceptions.js";
import createHttpError, { HttpError } from "http-errors";
import { UserService } from "../services/UserService.js";
import { UserRouterFactory } from "./api/UserRouter.js";
import { isHttpError } from "http-errors";
import { Logger } from "pino";
import { SessionRouterFactory } from "./api/SessionRouter.js";
import { AuthenticationService } from "../services/AuthenticationService.js";
import { AuthorizationService } from "../services/AuthorizationService.js";
import { AuthorizationMiddlewareFactoryFactory } from "../middlewares/AuthorizationMiddleware.js";
import { SessionService } from "../services/SessionService.js";

function mapExceptionToHttpError(err: unknown): HttpError {
  if (err instanceof ConflictException) return createHttpError(409);
  if (err instanceof NotFoundException) return createHttpError(404);
  if (err instanceof AuthenticationException)
    return createHttpError(400, "Invalid credentials.");
  if (err instanceof AuthorizationException) return createHttpError(401);
  if (err instanceof ForbiddenException) return createHttpError(403);
  return createHttpError(500, "Unexpected error occured", { err });
}

export function ApiRouterFactory(
  userService: UserService,
  authenticationService: AuthenticationService,
  authorizationService: AuthorizationService,
  sessionService: SessionService,
  logger: Logger
): Router {
  const router = Router();
  const authorizationMiddlewareFactory =
    AuthorizationMiddlewareFactoryFactory(authorizationService);

  router.use(
    "/",
    SessionRouterFactory(
      authorizationMiddlewareFactory,
      authenticationService,
      sessionService
    )
  );
  router.use(
    "/",
    UserRouterFactory(authorizationMiddlewareFactory, userService)
  );

  router.use((req: Request, res: Response, next: NextFunction) => {
    next(new NotFoundException());
  });

  router.use(
    (err: unknown, req: Request, res: Response, next: NextFunction) => {
      let httpError: HttpError;
      if (isHttpError(err)) httpError = err;
      else if (err instanceof Exception)
        httpError = mapExceptionToHttpError(err);
      else httpError = createHttpError(500, { err });

      if (httpError.expose) {
        res.status(httpError.status).send(httpError.cause || httpError.message);
      } else {
        logger.error(httpError);
        res.status(500).send("Internal server error occured.");
      }
    }
  );

  return router;
}
