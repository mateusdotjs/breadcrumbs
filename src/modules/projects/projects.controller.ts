import { getAuth } from "@clerk/fastify";
import type { FastifyReply, FastifyRequest } from "fastify";
import { ProjectsService } from "./projects.service.js";
import type { CreateProjectBody, UpdateProjectBody } from "./projects.types.js";

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
      return reply.status(401).send({ ok: false, error: "Unauthorized." });
    }

    const projects = await this.projectsService.getByCurrentUser(userId);
    if (!projects || projects.length === 0) {
      return reply.status(404).send({ ok: false, error: "No projects found." });
    }

    return reply.send({ ok: true, projects });
  };

  create = async (
    request: FastifyRequest<CreateProjectRequest>,
    reply: FastifyReply,
  ): Promise<void> => {
    const { userId } = getAuth(request);
    if (!userId) {
      return reply.status(401).send({ ok: false, error: "Unauthorized." });
    }

    const name = request.body?.name?.trim();
    if (!name) {
      return reply.status(400).send({ ok: false, error: "name is required." });
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
      return reply.status(401).send({ ok: false, error: "Unauthorized." });
    }

    const name = request.body?.name?.trim();
    if (!name) {
      return reply.status(400).send({ ok: false, error: "name is required." });
    }

    const project = await this.projectsService.updateByCurrentUser(
      userId,
      name,
    );
    if (!project) {
      return reply.status(404).send({ ok: false, error: "Project not found." });
    }

    return reply.send({ ok: true, project });
  };

  delete = async (
    request: FastifyRequest<DeleteProjectRequest>,
    reply: FastifyReply,
  ): Promise<void> => {
    const { userId } = getAuth(request);
    if (!userId) {
      return reply.status(401).send({ ok: false, error: "Unauthorized." });
    }

    const projectId = request.params?.id;
    if (!projectId) {
      return reply.status(400).send({ ok: false, error: "Project ID is required." });
    }

    const project = await this.projectsService.deleteByCurrentUser(userId, projectId);
    if (!project) {
      return reply.status(404).send({ ok: false, error: "Project not found." });
    }

    return reply.send({ ok: true, message: "Project deleted successfully." });
  };
}
