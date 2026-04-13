import { User } from "../../../../modules/users/users.model.js";
import { UserRepository } from "../../interfaces/UserRepository.js";

export class MongoUserRepository implements UserRepository {
  async getByClerkUserId(clerkUserId: string): Promise<InstanceType<typeof User> | null> {
    return User.findOne({ clerkUserId }).exec();
  }

  async getOrCreateByClerkUserId(clerkUserId: string): Promise<InstanceType<typeof User>> {
    const existingUser = await this.getByClerkUserId(clerkUserId);

    if (existingUser) {
      return existingUser;
    }

    // Create new user with just clerkUserId
    return User.findOneAndUpdate(
      { clerkUserId },
      { clerkUserId },
      { new: true, upsert: true, runValidators: true }
    ).exec() as Promise<InstanceType<typeof User>>;
  }
}
