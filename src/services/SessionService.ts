import { NotFoundException } from "../base/Exceptions.js";
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
    const session = await this.sessionRepository.create(userid, token);
    return session;
  }

  public async removeSessionByToken(token: string): Promise<void> {
    const res = await this.sessionRepository.deleteByToken(token);
    if (!res) throw new NotFoundException();
  }

  public async retrieveSessionByToken(token: string): Promise<Session> {
    const session = await this.sessionRepository.findByToken(token);
    if (!session) throw new NotFoundException();
    return session;
  }
}
