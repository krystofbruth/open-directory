import { ConflictException } from "../base/Exceptions.js";
import { PasswordHashSuite } from "../crypto/PasswordHashSuite.js";
import { User } from "../models/User.js";
import { UserRepository } from "../repositories/UserRepository.js";

export class UserService {
  constructor(
    private userRepository: UserRepository,
    private passwordHashSuite: PasswordHashSuite
  ) {}

  public async retrieveUserById(id: string) {
    // Business logic like permissions
    return await this.userRepository.findById(id);
  }

  public async createUser(username: string, password: string): Promise<User> {
    if (await this.userRepository.checkConflict(username)) {
      throw new ConflictException();
    }

    const passwordHash = await this.passwordHashSuite.hash(password);

    return await this.userRepository.create({ username, passwordHash });
  }
}
