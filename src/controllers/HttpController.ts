import { Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import { UserService } from "../services/UserService.js";
import { ConflictException, NotFoundException } from "../base/Exceptions.js";
import { User } from "../models/User.js";

interface UserView {
  userid: string;
  username: string;
}

/**
 * Parses the number in the query parameter.
 *
 * @param inp Input from the query param.
 * @param def Default value to return in case of invalid input.
 * @returns Number adhering to the criteria.
 */
function parseQueryNumber(
  inp: unknown,
  def: number,
  max?: number,
  min?: number
): number {
  let num: number = def;

  if (typeof inp === "number" && !isNaN(inp)) num = inp;
  else if (typeof inp === "string") {
    num = parseInt(inp);
    if (isNaN(num)) num = def;
  }

  if (max && num > max) return max;
  if (min && num < min) return min;
  return num;
}

/** Checks if the body is present and is an object. */
function checkRequestBody(body: unknown): void {
  if (!body) throw createHttpError(400, "No request body.");
  if (typeof body !== "object")
    throw createHttpError(500, "Invalid request body.");
}

function mapExceptionToHttpError(err: unknown): HttpError {
  if (err instanceof ConflictException) return createHttpError(409);
  if (err instanceof NotFoundException) return createHttpError(404);
  return createHttpError(500, "Unexpected error occured", { err });
}

export class HttpController {
  constructor(private userService: UserService) {}

  private mapUserToUserView(user: User): UserView {
    return {
      userid: user.userid,
      username: user.username,
    };
  }

  public async createUser(req: Request, res: Response) {
    checkRequestBody(req.body);
    const { username, password } = req.body;
    if (typeof username !== "string")
      throw createHttpError(400, { cause: { target: "username" } });
    if (typeof password !== "string")
      throw createHttpError(400, { cause: { target: "password" } });

    try {
      const user = await this.userService.createUser({ username, password });
      const userView: UserView = {
        userid: user.userid,
        username: user.username,
      };
      res.status(201).json(userView);
    } catch (err) {
      throw mapExceptionToHttpError(err);
    }
  }

  public async getUsers(req: Request, res: Response) {
    const limit = parseQueryNumber(req.query.limit, 50, 100, 0);
    const offset = parseQueryNumber(req.query.offset, 0);

    try {
      const users = await this.userService.retrieveUsers(limit, offset);
      const userViews = users.map((u) => this.mapUserToUserView(u));
      res.json(userViews);
    } catch (err) {
      throw mapExceptionToHttpError(err);
    }
  }

  public async updateUser(req: Request, res: Response) {
    checkRequestBody(req.body);
    const { username, password } = req.body;
    const userid = req.params.userid;

    if (username !== undefined && typeof username !== "string")
      throw createHttpError(400, { cause: { target: "username" } });
    if (password !== undefined && typeof password !== "string")
      throw createHttpError(400, { cause: { target: "password" } });

    try {
      const user = await this.userService.updateUser(userid, {
        username,
        password,
      });
      const userView = this.mapUserToUserView(user);
      res.status(200).json(userView);
    } catch (err) {
      throw mapExceptionToHttpError(err);
    }
  }
}
