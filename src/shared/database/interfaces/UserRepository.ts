import { User } from "../../../modules/users/users.model.js";

export interface UserRepository {
  getByClerkUserId(clerkUserId: string): Promise<InstanceType<typeof User> | null>;
  getOrCreateByClerkUserId(clerkUserId: string): Promise<InstanceType<typeof User>>;
}
