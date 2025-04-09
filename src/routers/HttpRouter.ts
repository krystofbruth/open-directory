import {
  Router,
  Response,
  Request,
  NextFunction,
  json as jsonMiddleware,
} from "express";
import createHttpError, { isHttpError } from "http-errors";
import { Logger } from "pino";
import { HttpController } from "../controllers/HttpController.js";

export function HttpRouterFactory(
  httpController: HttpController,
  logger: Logger
): Router {
  const router = Router();

  router.get(
    "/user",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await httpController.getUsers(req, res);
      } catch (err) {
        next(err);
      }
    }
  );

  router.post(
    "/user",
    jsonMiddleware(),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await httpController.createUser(req, res);
      } catch (err) {
        next(err);
      }
    }
  );

  router.patch(
    "/user/:userid",
    jsonMiddleware(),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await httpController.updateUser(req, res);
      } catch (err) {
        next(err);
      }
    }
  );

  router.use((req, res, next) => {
    throw createHttpError(404);
  });

  router.use(
    (err: unknown, req: Request, res: Response, next: NextFunction) => {
      if (isHttpError(err) && err.expose) {
        res.status(err.status).json(err.cause);
      } else {
        logger.error(err);
        res.status(500).send();
      }
    }
  );

  return router;
}
