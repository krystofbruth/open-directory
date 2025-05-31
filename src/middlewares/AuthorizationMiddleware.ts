import { Request, Response, NextFunction, RequestHandler } from "express";
import { AuthorizationService } from "../services/AuthorizationService.js";
import {
  AuthorizationException,
  ForbiddenException,
  NotFoundException,
} from "../base/Exceptions.js";
import { Authorization, Permissions } from "../models/Authorization.js";

export type AuthorizationMiddlewareFactory = (
  permission: Permissions
) => RequestHandler;

export function AuthorizationMiddlewareFactoryFactory(
  authorizationService: AuthorizationService
): AuthorizationMiddlewareFactory {
  return (permission) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      if (typeof req.headers.authorization === "string") {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
          throw new AuthorizationException();
        }

        let authorization: Authorization;
        try {
          authorization =
            await authorizationService.retrieveAuthorizationBySessionToken(
              token
            );
          if (!authorization.checkPermission(permission)) {
            throw new ForbiddenException();
          }
          req.authorization = authorization;

          next();
        } catch (err) {
          if (err instanceof NotFoundException)
            next(new AuthorizationException());
          else next(err);
        }
      } else {
        next(new AuthorizationException());
      }
    };
  };
}
