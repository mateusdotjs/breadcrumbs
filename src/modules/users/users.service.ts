import { User } from "./users.model.js";
import { UserRepository } from "../../shared/database/interfaces/UserRepository.js";

export class UsersService {
  constructor(private readonly userRepository: UserRepository) { }

  async getByClerkUserId(clerkUserId: string): Promise<InstanceType<typeof User> | null> {
    return this.userRepository.getByClerkUserId(clerkUserId);
  }

  async getOrCreateByClerkUserId(clerkUserId: string): Promise<InstanceType<typeof User>> {
    return this.userRepository.getOrCreateByClerkUserId(clerkUserId);
  }
}
