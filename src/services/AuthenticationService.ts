import {
  AuthenticationException,
  NotFoundException,
} from "../base/Exceptions.js";
import { Session } from "../models/Session.js";
import { User } from "../models/User.js";
import { SessionService } from "./SessionService.js";
import { UserService } from "./UserService.js";

export class AuthenticationService {
  constructor(
    private sessionService: SessionService,
    private userService: UserService
  ) {}

  public async authenticate(
    username: string,
    password: string
  ): Promise<Session> {
    let user: User;
    try {
      user = await this.userService.retrieveUserByUsername(username);
    } catch (err) {
      if (err instanceof NotFoundException) throw new AuthenticationException();
      throw err;
    }

    if (!(await this.userService.verifyPassword(user.userid, password)))
      throw new AuthenticationException();

    return await this.sessionService.createSession(user.userid);
  }
}
