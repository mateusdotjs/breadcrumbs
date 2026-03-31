import { Project } from "./projects.model.js";

export class ProjectsService {
  async getByCurrentUser(
    ownerClerkUserId: string,
  ): Promise<InstanceType<typeof Project> | null> {
    return Project.findOne({ ownerClerkUserId }).exec();
  }

  async create(
    ownerClerkUserId: string,
    name: string,
  ): Promise<InstanceType<typeof Project>> {
    const existing = await this.getByCurrentUser(ownerClerkUserId);
    if (existing) {
      throw new Error("PROJECT_ALREADY_EXISTS");
    }

    return Project.create({ ownerClerkUserId, name: name.trim() });
  }

  async updateByCurrentUser(
    ownerClerkUserId: string,
    name: string,
  ): Promise<InstanceType<typeof Project> | null> {
    return Project.findOneAndUpdate(
      { ownerClerkUserId },
      { name: name.trim() },
      { new: true, runValidators: true },
    ).exec();
  }
}
