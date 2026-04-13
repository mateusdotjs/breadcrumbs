import { Project } from "./projects.model.js";
import { ProjectRepository } from "../../shared/database/interfaces/ProjectRepository.js";
import { LogService } from "../log/log.service.js";

export class ProjectsService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly logService: LogService
  ) { }

  async getByCurrentUser(ownerClerkUserId: string): Promise<any[]> {
    return this.projectRepository.getByCurrentUser(ownerClerkUserId);
  }

  async create(ownerClerkUserId: string, name: string): Promise<InstanceType<typeof Project>> {
    return this.projectRepository.create(ownerClerkUserId, name);
  }

  async updateByCurrentUser(ownerClerkUserId: string, name: string): Promise<InstanceType<typeof Project> | null> {
    return this.projectRepository.updateByCurrentUser(ownerClerkUserId, name);
  }

  async deleteByCurrentUser(ownerClerkUserId: string, projectId: string): Promise<InstanceType<typeof Project> | null> {
    // First delete all logs related to this project
    await this.logService.deleteLogsByProjectId(projectId);

    // Then delete the project
    return this.projectRepository.deleteByCurrentUser(ownerClerkUserId, projectId);
  }
}
