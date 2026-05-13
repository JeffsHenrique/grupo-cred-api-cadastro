import type { FastifyReply, FastifyRequest } from 'fastify';
import { loginSchema, registerSchema } from './auth.schema.js';
import * as authService from './auth.service.js';

export async function registerHandler(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const data = registerSchema.parse(request.body);
	const user = await authService.register(data);
	return reply.status(201).send(user);
}

export async function loginHandler(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const data = loginSchema.parse(request.body);
	const result = await authService.login(data);
	return reply.send(result);
}
