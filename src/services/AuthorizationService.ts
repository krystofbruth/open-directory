import {
  Authorization,
  AuthorizationGrantType,
} from "../models/Authorization.js";
import { SessionService } from "./SessionService.js";
import { UserService } from "./UserService.js";

export class AuthorizationService {
  constructor(
    private sessionService: SessionService,
    private userService: UserService
  ) {}

  public async retrieveAuthorizationBySessionToken(
    sessionToken: string
  ): Promise<Authorization> {
    const session = await this.sessionService.retrieveSessionByToken(
      sessionToken
    );
    const user = await this.userService.retrieveUserById(session.userid);

    return new Authorization(
      AuthorizationGrantType.user,
      user.permissions,
      sessionToken
    );
  }
}
