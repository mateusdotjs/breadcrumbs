import { getAuth } from "@clerk/fastify";
import type { FastifyReply, FastifyRequest } from "fastify";
import { ProjectsService } from "./projects.service.js";
import type { CreateProjectBody, UpdateProjectBody } from "./projects.types.js";

type CreateProjectRequest = { Body: CreateProjectBody };
type UpdateProjectRequest = { Body: UpdateProjectBody };

export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  getByCurrentUser = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const { userId } = getAuth(request);
    if (!userId) {
      return reply.status(401).send({ ok: false, error: "Unauthorized." });
    }

    const project = await this.projectsService.getByCurrentUser(userId);
    if (!project) {
      return reply.status(404).send({ ok: false, error: "Project not found." });
    }

    return reply.send({ ok: true, project });
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

    try {
      const project = await this.projectsService.create(userId, name);
      return reply.status(201).send({ ok: true, project });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "PROJECT_ALREADY_EXISTS"
      ) {
        return reply
          .status(409)
          .send({ ok: false, error: "Project already exists for this user." });
      }
      throw error;
    }
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
}
