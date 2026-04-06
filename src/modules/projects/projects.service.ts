import { Project } from "./projects.model.js";

export class ProjectsService {
  async getByCurrentUser(
    ownerClerkUserId: string,
  ): Promise<InstanceType<typeof Project>[]> {
    return Project.find({ ownerClerkUserId }).exec();
  }

  async create(
    ownerClerkUserId: string,
    name: string,
  ): Promise<InstanceType<typeof Project>> {
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
