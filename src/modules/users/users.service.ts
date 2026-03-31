import { User } from "./users.model.js";

export class UsersService {
  async updateByClerkUserId(clerkUserId: string, companyName: string): Promise<InstanceType<typeof User>> {
    const safeCompanyName = companyName.trim();

    return User.findOneAndUpdate(
      { clerkUserId },
      { clerkUserId, companyName: safeCompanyName },
      { new: true, upsert: true, runValidators: true }
    ).exec() as Promise<InstanceType<typeof User>>;
  }

  async getByClerkUserId(clerkUserId: string): Promise<InstanceType<typeof User> | null> {
    return User.findOne({ clerkUserId }).exec();
  }

  async getOrCreateByClerkUserId(clerkUserId: string, companyName?: string): Promise<InstanceType<typeof User>> {
    const existingUser = await this.getByClerkUserId(clerkUserId);
    
    if (existingUser) {
      return existingUser;
    }

    // Create user with default company name if not provided
    const defaultCompanyName = companyName || "Default Company";
    
    return User.findOneAndUpdate(
      { clerkUserId },
      { clerkUserId, companyName: defaultCompanyName },
      { new: true, upsert: true, runValidators: true }
    ).exec() as Promise<InstanceType<typeof User>>;
  }
}
