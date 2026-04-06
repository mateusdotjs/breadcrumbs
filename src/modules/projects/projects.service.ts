import { Project } from "./projects.model.js";

export class ProjectsService {
  async getByCurrentUser(
    ownerClerkUserId: string,
  ): Promise<any[]> {
    const projects = await Project.find({ ownerClerkUserId }).exec();
    return projects.map(project => ({
      id: project._id,
      name: project.name,
      userId: project.ownerClerkUserId,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    }));
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
