import { RequestHandler, Router, json } from "express";
import { checkRequestBody } from "../../utils/HttpUtils.js";
import createHttpError from "http-errors";
import { AuthenticationService } from "../../services/AuthenticationService.js";
import { AuthorizationMiddlewareFactory } from "../../middlewares/AuthorizationMiddleware.js";
import { SessionService } from "../../services/SessionService.js";
import { Permissions } from "../../models/Authorization.js";

export function SessionRouterFactory(
  authorizationMiddlewareFactory: AuthorizationMiddlewareFactory,
  authenticationService: AuthenticationService,
  sessionService: SessionService
): Router {
  const router = Router();

  router.post("/session", json(), async (req, res, next) => {
    try {
      checkRequestBody(req.body);
      const { username, password } = req.body;

      if (typeof username !== "string")
        throw createHttpError(400, { cause: { target: "username" } });
      if (typeof password !== "string")
        throw createHttpError(400, { cause: { target: "password" } });

      const session = await authenticationService.authenticate(
        username,
        password
      );

      res.setHeader("Content-Type", "text/plain").send(session.token);
    } catch (err) {
      next(err);
    }
  });

  router.delete(
    "/session",
    authorizationMiddlewareFactory(Permissions["users.self.read"]),
    async (req, res, next) => {
      try {
        if (!req.authorization)
          throw new Error("No authorization on the request.");

        await sessionService.removeSessionByToken(req.authorization.identifier);
        res.status(204).send();
      } catch (err) {
        next(err);
      }
    }
  );

  return router;
}
