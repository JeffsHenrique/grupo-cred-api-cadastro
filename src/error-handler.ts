import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { BadRequestError } from "./modules/_errors/bad-request-error.js";
import { NotFoundError } from "./modules/_errors/not-found-error.js";

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, _, reply) => {
    if (error instanceof ZodError) {
        return reply.status(400).send({
            message: 'Validation error',
            issues: error.format()
        })
    }

    if (error instanceof BadRequestError) {
        return reply.status(400).send({
            message: error.message
        })
    }

    if (error instanceof NotFoundError) {
        return reply.status(404).send({
            message: error.message
        })
    }

    return reply.status(500).send({
        message: 'Internal server error'
    })
}