import { getAuth } from "@clerk/fastify";
import type { FastifyReply, FastifyRequest } from "fastify";
import { ProjectsService } from "./projects.service.js";
import type { CreateProjectBody, UpdateProjectBody } from "./projects.types.js";
import { UnauthorizedError, NotFoundError, ValidationError } from "../../shared/errors.js";

type CreateProjectRequest = { Body: CreateProjectBody; };
type UpdateProjectRequest = { Body: UpdateProjectBody; };
type DeleteProjectRequest = { Params: { id: string; }; };

export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  getByCurrentUser = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const { userId } = getAuth(request);
    if (!userId) {
      throw new UnauthorizedError();
    }

    const projects = await this.projectsService.getByCurrentUser(userId);

    return reply.send({ ok: true, projects: projects || [] });
  };

  create = async (
    request: FastifyRequest<CreateProjectRequest>,
    reply: FastifyReply,
  ): Promise<void> => {
    const { userId } = getAuth(request);
    if (!userId) {
      throw new UnauthorizedError();
    }

    const name = request.body?.name?.trim();
    if (!name) {
      throw new ValidationError("name is required");
    }

    const project = await this.projectsService.create(userId, name);
    return reply.status(201).send({ ok: true, project });
  };

  updateByCurrentUser = async (
    request: FastifyRequest<UpdateProjectRequest>,
    reply: FastifyReply,
  ): Promise<void> => {
    const { userId } = getAuth(request);
    if (!userId) {
      throw new UnauthorizedError();
    }

    const name = request.body?.name?.trim();
    if (!name) {
      throw new ValidationError("name is required");
    }

    const project = await this.projectsService.updateByCurrentUser(
      userId,
      name,
    );
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    return reply.send({ ok: true, project });
  };

  delete = async (
    request: FastifyRequest<DeleteProjectRequest>,
    reply: FastifyReply,
  ): Promise<void> => {
    const { userId } = getAuth(request);
    if (!userId) {
      throw new UnauthorizedError();
    }

    const projectId = request.params?.id;
    if (!projectId) {
      throw new ValidationError("Project ID is required");
    }

    const project = await this.projectsService.deleteByCurrentUser(userId, projectId);
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    return reply.send({ ok: true, message: "Project deleted successfully." });
  };
}
