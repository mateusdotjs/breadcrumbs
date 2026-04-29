import { Project } from "./projects.model.js";
import { LogService } from "../log/log.service.js";

export class ProjectsService {
  constructor(
    private readonly logService: LogService
  ) { }

  async getByCurrentUser(ownerClerkUserId: string): Promise<any[]> {
    return Project.find({ ownerClerkUserId });
  }

  async create(ownerClerkUserId: string, name: string): Promise<InstanceType<typeof Project>> {
    return Project.create({ ownerClerkUserId, name: name.trim() });
  }

  async updateByCurrentUser(ownerClerkUserId: string, name: string): Promise<InstanceType<typeof Project> | null> {
    return Project.findOneAndUpdate(
      { ownerClerkUserId },
      { name: name.trim() },
      { new: true, runValidators: true }
    );
  }

  async deleteByCurrentUser(ownerClerkUserId: string, projectId: string): Promise<InstanceType<typeof Project> | null> {
    // First delete all logs related to this project
    await this.logService.deleteLogsByProjectId(projectId);

    // Then delete the project
    return Project.findOneAndDelete({
      _id: projectId,
      ownerClerkUserId,
    });
  }
}
