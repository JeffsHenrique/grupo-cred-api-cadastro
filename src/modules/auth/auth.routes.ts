import type { FastifyInstance } from 'fastify';
import { loginHandler, registerHandler } from './auth.controller.js';

export async function authRoutes(app: FastifyInstance) {
	app.post(
		'/auth/register',
		{
			schema: {
				tags: ['Auth'],
				summary: 'Register a new user',
				description:
					'Creates a new user account with CPF, RG, name, age, email, login and password.',
				body: {
					type: 'object',
					properties: {
						cpf: { type: 'string' },
						rg: { type: 'string' },
						nome: { type: 'string' },
						idade: { type: 'number' },
						email: { type: 'string' },
						login: { type: 'string' },
						senha: { type: 'string' },
					},
					required: ['cpf', 'rg', 'nome', 'idade', 'email', 'login', 'senha'],
				},
				response: {
					'201': {
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
						},
					},
					'400': {
						type: 'object',
						properties: {
							message: { type: 'string' },
						},
					}
				}
			},

		},
		registerHandler,
	);

	app.post(
		'/auth/login',
		{
			schema: {
				tags: ['Auth'],
				summary: 'Login',
				description: 'Authenticates a user and returns a JWT token.',
				body: {
					type: 'object',
					properties: {
						login: { type: 'string' },
						senha: { type: 'string' },
					},
					required: ['login', 'senha'],
				},
				response: {
					'200': {
						type: 'object',
						properties: {
							token: { type: 'string' },
							user: {
								type: 'object',
								properties: {
									id: { type: 'string', format: 'uuid' },
									nome: { type: 'string' },
									email: { type: 'string' },
									login: { type: 'string' },
									role: { type: 'string' },
								},
							},
						},
					},
					'400': {
						type: 'object',
						properties: {
							message: { type: 'string' },
						},
					}
				}
			},
		},
		loginHandler,
	);
}
