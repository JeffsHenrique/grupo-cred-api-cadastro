import { authenticate, authorizeRole, verifyUser } from '@/shared/middleware/auth.js';
import type { FastifyInstance } from 'fastify';
import {
	listHandler,
	removeHandler,
	updateHandler,
} from './users.controller.js';

export async function usersRoutes(app: FastifyInstance) {
	app.get(
		'/users',
		{
			preHandler: [authenticate],
			schema: {
				tags: ['Users'],
				summary: 'List all users',
				description:
					'Returns a list of all registered users. Requires authentication.',
				response: {
					'200': {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								id: { type: 'string', format: 'uuid' },
								cpf: { type: 'string' },
								rg: { type: 'string' },
								nome: { type: 'string' },
								idade: { type: 'number' },
								email: { type: 'string' },
								login: { type: 'string' },
								role: { type: 'string' },
								createdAt: { type: 'string', format: 'date-time' },
								updatedAt: { type: 'string', format: 'date-time' },
							},
						},
					},
				}
			},
		},
		listHandler,
	);

	app.put(
		'/users/:id',
		{
			preHandler: [authenticate, verifyUser],
			schema: {
				tags: ['Users'],
				summary: 'Update user',
				description: 'Updates user data. Login cannot be changed.',
				params: {
					type: 'object',
					properties: { id: { type: 'string', format: 'uuid' } },
					required: ['id'],
				},
				body: {
					type: 'object',
					properties: {
						cpf: { type: 'string' },
						rg: { type: 'string' },
						nome: { type: 'string' },
						idade: { type: 'number' },
						email: { type: 'string' },
						senha: { type: 'string' },
					},
				},
				response: {
					'200': {
						type: 'object',
						properties: {
							id: { type: 'string', format: 'uuid' },
							cpf: { type: 'string' },
							rg: { type: 'string' },
							nome: { type: 'string' },
							idade: { type: 'number' },
							email: { type: 'string' },
							login: { type: 'string' },
							role: { type: 'string' },
							createdAt: { type: 'string', format: 'date-time' },
							updatedAt: { type: 'string', format: 'date-time' },
						},
					},
					'400': {
						type: 'object',
						properties: {
							message: { type: 'string' },
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
		updateHandler,
	);

	app.delete(
		'/users/:id',
		{
			preHandler: [authenticate, authorizeRole('admin')],
			schema: {
				tags: ['Users'],
				summary: 'Delete user (admin only)',
				description:
					'Deletes a user. Only users with admin role can perform this action.',
				params: {
					type: 'object',
					properties: { id: { type: 'string', format: 'uuid' } },
					required: ['id'],
				},
				response: {
					'200': {
						type: 'object',
						properties: {
							id: { type: 'string', format: 'uuid' },
							cpf: { type: 'string' },
							rg: { type: 'string' },
							nome: { type: 'string' },
							idade: { type: 'number' },
							email: { type: 'string' },
							login: { type: 'string' },
							role: { type: 'string' },
							createdAt: { type: 'string', format: 'date-time' },
							updatedAt: { type: 'string', format: 'date-time' },
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
		removeHandler,
	);
}
