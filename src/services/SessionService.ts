import { TokenGenerator } from "../crypto/TokenGenerator.js";
import { Session } from "../models/Session.js";
import { SessionRepository } from "../repositories/SessionRepository.js";

export class SessionService {
  constructor(
    private sessionRepository: SessionRepository,
    private tokenGenerator: TokenGenerator
  ) {}

  public async createSession(userid: string): Promise<Session> {
    const token = await this.tokenGenerator.generate();
    return await this.sessionRepository.create(userid, token);
  }
}
