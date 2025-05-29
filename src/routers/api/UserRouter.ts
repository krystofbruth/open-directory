import {
  Request,
  Response,
  NextFunction,
  Router,
  json as jsonMiddleware,
  RequestHandler,
} from "express";
import { UserService } from "../../services/UserService.js";
import { parseQueryNumber, checkRequestBody } from "../../utils/HttpUtils.js";
import createHttpError from "http-errors";
import { User } from "../../models/User.js";

interface UserView {
  userid: string;
  username: string;
}

function mapUserToUserView(user: User): UserView {
  return {
    userid: user.userid,
    username: user.username,
  };
}

export function UserRouterFactory(userService: UserService): Router {
  const router = Router();

  router.get(
    "/user",
    async (req: Request, res: Response, next: NextFunction) => {
      const limit = parseQueryNumber(req.query.limit, 50, 100, 0);
      const offset = parseQueryNumber(req.query.offset, 0);

      const users = await userService.retrieveUsers(limit, offset);
      const userViews = users.map((u) => mapUserToUserView(u));
      res.json(userViews);
    }
  );

  router.post(
    "/user",
    jsonMiddleware(),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        checkRequestBody(req.body);
        const { username, password } = req.body;
        if (typeof username !== "string")
          throw createHttpError(400, { cause: { target: "username" } });
        if (typeof password !== "string")
          throw createHttpError(400, { cause: { target: "password" } });

        const user = await userService.createUser({ username, password });
        const userView: UserView = {
          userid: user.userid,
          username: user.username,
        };
        res.status(201).json(userView);
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
        checkRequestBody(req.body);
        const { username, password } = req.body;
        const userid = req.params.userid;

        if (username !== undefined && typeof username !== "string")
          throw createHttpError(400, { cause: { target: "username" } });
        if (password !== undefined && typeof password !== "string")
          throw createHttpError(400, { cause: { target: "password" } });

        const user = await userService.updateUser(userid, {
          username,
          password,
        });
        const userView = mapUserToUserView(user);
        res.status(200).json(userView);
      } catch (err) {
        next(err);
      }
    }
  );

  router.delete(
    "/user/:userid",
    jsonMiddleware(),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userid = req.params.userid;

        await userService.deleteUser(userid);
        res.status(204).send();
      } catch (err) {
        next(err);
      }
    }
  );

  return router;
}
