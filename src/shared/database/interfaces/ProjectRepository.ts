import { Project } from "../../../modules/projects/projects.model.js";

export interface ProjectRepository {
  getByCurrentUser(ownerClerkUserId: string): Promise<any[]>;
  create(ownerClerkUserId: string, name: string): Promise<InstanceType<typeof Project>>;
  updateByCurrentUser(ownerClerkUserId: string, name: string): Promise<InstanceType<typeof Project> | null>;
  deleteByCurrentUser(ownerClerkUserId: string, projectId: string): Promise<InstanceType<typeof Project> | null>;
}
