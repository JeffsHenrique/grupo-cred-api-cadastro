import type { FastifyReply, FastifyRequest } from 'fastify';
import { createOrderSchema, orderParamsSchema } from './orders.schema.js';
import * as ordersService from './orders.service.js';

export async function createHandler(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const data = createOrderSchema.parse(request.body);
	const order = await ordersService.create(data);
	return reply.status(201).send(order);
}

export async function listAllHandler(
	_request: FastifyRequest,
	reply: FastifyReply,
) {
	const result = await ordersService.listAll();
	return reply.send(result);
}

export async function listByUserHandler(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { userId } = orderParamsSchema.parse(request.params);
	const result = await ordersService.listByUser(userId);
	return reply.send(result);
}
