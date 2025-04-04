import { Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import { UserService } from "../services/UserService.js";
import { ConflictException } from "../base/Exceptions.js";

interface UserView {
  userid: string;
  username: string;
}

export class HttpController {
  constructor(private userService: UserService) {}

  private mapExceptionToHttpError(err: unknown): HttpError {
    if (err instanceof ConflictException) return createHttpError(409);
    return createHttpError(500);
  }

  public async createUser(req: Request, res: Response) {
    if (!req.body || typeof req.body !== "object")
      throw createHttpError(500, "Invalid request body.");

    const { username, password } = req.body;
    if (typeof username !== "string")
      throw createHttpError(400, { cause: { target: "username" } });
    if (typeof password !== "string")
      throw createHttpError(400, { cause: { target: "password" } });

    try {
      const user = await this.userService.createUser(username, password);
      const userView: UserView = { userid: user.id, username: user.username };
      res.status(201).json(userView);
    } catch (err) {
      throw this.mapExceptionToHttpError(err);
    }
  }
}
