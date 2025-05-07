import { Request, Response, NextFunction, RequestHandler } from "express";

export function AuthMiddlewareFactory(): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    // TODO
    next();
  };
}
