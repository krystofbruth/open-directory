import { Request, Response, NextFunction, Router } from "express";
import { ConflictException, Exception } from "../base/Exceptions.js";
import { NotFoundException } from "../base/Exceptions.js";
import createHttpError, { HttpError } from "http-errors";
import { UserService } from "../services/UserService.js";
import { UserRouterFactory } from "./api/UserRouter.js";
import { isHttpError } from "http-errors";
import { Logger } from "pino";
import { AuthMiddlewareFactory } from "../middlewares/AuthMiddleware.js";

function mapExceptionToHttpError(err: unknown): HttpError {
  if (err instanceof ConflictException) return createHttpError(409);
  if (err instanceof NotFoundException) return createHttpError(404);
  return createHttpError(500, "Unexpected error occured", { err });
}

export function ApiRouterFactory(
  userService: UserService,
  logger: Logger
): Router {
  const router = Router();
  const authMiddleware = AuthMiddlewareFactory();

  router.use("/", UserRouterFactory(userService, authMiddleware));

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
        res.status(httpError.status).send(httpError.message);
      } else {
        logger.error(httpError);
        res.status(500).send("Internal server error occured.");
      }
    }
  );

  return router;
}
