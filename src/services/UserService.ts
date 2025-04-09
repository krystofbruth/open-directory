import { ConflictException, NotFoundException } from "../base/Exceptions.js";
import { PasswordHashSuite } from "../crypto/PasswordHashSuite.js";
import { User } from "../models/User.js";
import { UserRepository } from "../repositories/UserRepository.js";

export interface CreateUser {
  username: string;
  password: string;
}

export interface UpdateUser {
  username?: string;
  password?: string;
}

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

  public async createUser(createUser: CreateUser): Promise<User> {
    if (await this.userRepository.checkConflict(createUser.username)) {
      throw new ConflictException();
    }

    const passwordHash = await this.passwordHashSuite.hash(createUser.password);

    return await this.userRepository.create({
      username: createUser.username,
      passwordHash,
    });
  }

  public async updateUser(
    userid: string,
    updateUser: UpdateUser
  ): Promise<User> {
    const username = updateUser.username || undefined;
    const passwordHash = updateUser.password
      ? await this.passwordHashSuite.hash(updateUser.password)
      : undefined;

    return await this.userRepository.update(userid, username, passwordHash);
  }

  public async deleteUser(userid: string): Promise<void> {
    await this.userRepository.delete(userid);
    return;
  }
}
