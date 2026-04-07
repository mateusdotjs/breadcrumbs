import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import mongoose from "mongoose";
import { AppError } from "./errors.js";

export const errorHandler = async (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  // Log do erro
  request.log.error({
    error: error.message,
    stack: error.stack,
    url: request.url,
    method: request.method,
    body: request.body,
    headers: request.headers,
  });

  // Se já for um AppError, trata diretamente
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      ok: false,
      error: error.message,
    });
  }

  // Tratamento de erros do Mongoose
  if (error instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(error.errors).map(err => err.message);
    return reply.status(400).send({
      ok: false,
      error: "Validation failed",
      details: messages,
    });
  }

  if (error instanceof mongoose.Error.CastError) {
    return reply.status(400).send({
      ok: false,
      error: "Invalid ID format",
    });
  }

  if (error instanceof mongoose.Error.DocumentNotFoundError) {
    return reply.status(404).send({
      ok: false,
      error: "Document not found",
    });
  }

  // Tratamento de erros de sintaxe JSON
  if (error.statusCode === 400 && error.message.includes('Unexpected token')) {
    return reply.status(400).send({
      ok: false,
      error: "Invalid JSON format",
    });
  }

  // Erro padrão para casos não tratados
  const statusCode = error.statusCode || 500;
  const message = statusCode < 500 ? error.message : "Internal server error";

  return reply.status(statusCode).send({
    ok: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};
