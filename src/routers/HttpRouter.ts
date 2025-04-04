import { Router, Response, Request, NextFunction } from "express";
import createHttpError, { isHttpError } from "http-errors";
import { Logger } from "pino";

export function HttpRouterFactory(port: number, logger: Logger) {
  const router = Router();

  router.use((req, res, next) => {
    throw createHttpError(404);
  });

  router.use(
    (err: unknown, req: Request, res: Response, next: NextFunction) => {
      if (isHttpError(err) && err.expose) {
        res.status(err.status).json(err);
      } else {
        logger.error(err);
        res.status(500);
      }
    }
  );
}
