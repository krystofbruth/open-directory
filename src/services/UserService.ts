import { UserRepository } from "../repositories/UserRepository.js";

class UserService {
  constructor(private userRepository: UserRepository) {}

  public async retrieveUserById(id: string) {
    // Business logic like permissions
    return await this.userRepository.findById(id);
  }
}

export async function UserServiceFactory(
  userRepository: UserRepository
): Promise<UserService> {
  return new UserService(userRepository);
}
