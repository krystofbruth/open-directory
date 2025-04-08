import { ConflictException, NotFoundException } from "../base/Exceptions.js";
import { PasswordHashSuite } from "../crypto/PasswordHashSuite.js";
import { User } from "../models/User.js";
import { UserRepository } from "../repositories/UserRepository.js";

export class UserService {
  constructor(
    private userRepository: UserRepository,
    private passwordHashSuite: PasswordHashSuite
  ) {}

  public async retrieveUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (user === null) throw new NotFoundException();
    return user;
  }

  public async retrieveUsers(
    limit: number = 50,
    offset: number = 0
  ): Promise<User[]> {
    return await this.userRepository.get(limit, offset);
  }

  public async createUser(username: string, password: string): Promise<User> {
    if (await this.userRepository.checkConflict(username)) {
      throw new ConflictException();
    }

    const passwordHash = await this.passwordHashSuite.hash(password);

    return await this.userRepository.create({ username, passwordHash });
  }
}
