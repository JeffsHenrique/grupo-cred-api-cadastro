import { authenticate } from '@/shared/middleware/auth.js';
import type { FastifyInstance } from 'fastify';
import {
	createHandler,
	listAllHandler,
	listByUserHandler,
} from './orders.controller.js';

export async function ordersRoutes(app: FastifyInstance) {
	app.post(
		'/orders',
		{
			preHandler: [authenticate],
			schema: {
				tags: ['Orders'],
				summary: 'Create an order',
				description: 'Creates a new order linked to a user.',
				body: {
					type: 'object',
					properties: {
						userId: { type: 'string', format: 'uuid' },
						descricao: { type: 'string' },
					},
					required: ['userId', 'descricao'],
				},
				response: {
					'201': {
						type: 'object',
						properties: {
							id: { type: 'string', format: 'uuid' },
							createdAt: { type: 'string', format: 'date-time' },
							updatedAt: { type: 'string', format: 'date-time' },
							userId: { type: 'string', format: 'uuid' },
							descricao: { type: 'string' },
						},
					},
					'404': {
						type: 'object',
						properties: {
							message: { type: 'string' },
						},
					}
				}
			},
		},
		createHandler,
	);

	app.get(
		'/orders',
		{
			preHandler: [authenticate],
			schema: {
				tags: ['Orders'],
				summary: 'List all orders',
				description: 'Returns all orders with user names.',
				response: {
					'200': {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								id: { type: 'string', format: 'uuid' },
								userId: { type: 'string', format: 'uuid' },
								descricao: { type: 'string' },
								createdAt: { type: 'string', format: 'date-time' },
								updatedAt: { type: 'string', format: 'date-time' },
								userName: { type: 'string', nullable: true },
							},
						},
					},
				}
			},
		},
		listAllHandler,
	);

	app.get(
		'/orders/user/:userId',
		{
			preHandler: [authenticate],
			schema: {
				tags: ['Orders'],
				summary: 'List orders by user',
				description: 'Returns orders for a specific user.',
				params: {
					type: 'object',
					properties: { userId: { type: 'string', format: 'uuid' } },
					required: ['userId'],
				},
				response: {
					'200': {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								id: { type: 'string', format: 'uuid' },
								userId: { type: 'string', format: 'uuid' },
								descricao: { type: 'string' },
								createdAt: { type: 'string', format: 'date-time' },
								updatedAt: { type: 'string', format: 'date-time' },
							},
						},
					},
					'404': {
						type: 'object',
						properties: {
							message: { type: 'string' },
						},
					}
				}
			},
		},
		listByUserHandler,
	);
}
