import type { FastifyReply, FastifyRequest } from 'fastify';
import { updateUserSchema, userParamsSchema } from './users.schema.js';
import * as usersService from './users.service.js';

export async function listHandler(
	_request: FastifyRequest,
	reply: FastifyReply,
) {
	const result = await usersService.list();
	return reply.send(result);
}

export async function updateHandler(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { id } = userParamsSchema.parse(request.params);
	const data = updateUserSchema.parse(request.body);
	const result = await usersService.update(id, data);
	return reply.status(200).send(result);
}

export async function removeHandler(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { id } = userParamsSchema.parse(request.params);

	await usersService.remove(id);
	return reply.status(204).send();
}
