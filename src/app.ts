import { env } from '@/config/env.js';
import { authRoutes } from '@/modules/auth/auth.routes.js';
import { ordersRoutes } from '@/modules/orders/orders.routes.js';
import { usersRoutes } from '@/modules/users/users.routes.js';
import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import ScalarApiReference from '@scalar/fastify-api-reference';
import Fastify from 'fastify';
import { errorHandler } from './error-handler.js';

export const app = Fastify({ logger: true });

await app.register(fastifyCors);
app.setErrorHandler(errorHandler)

await app.register(fastifySwagger, {
	openapi: {
		openapi: '3.0.0',
		info: {
			title: 'API Clientes e Pedidos',
			description:
				'API para gerenciamento de clientes e pedidos com autenticação JWT e controle de permissões.',
			version: '1.0.0',
		},
		servers: [
			{ url: `http://localhost:${env.PORT}`, description: 'Development server' },
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
		tags: [
			{ name: 'Auth', description: 'Autenticação e cadastro' },
			{ name: 'Users', description: 'Gerenciamento de usuários' },
			{ name: 'Orders', description: 'Gerenciamento de pedidos' },
		],
	},
	stripBasePath: true,
});

await app.register(ScalarApiReference, {
	routePrefix: '/api-docs',
	configuration: {
		title: 'API Clientes e Pedidos',
		theme: 'bluePlanet',
	},
});

await app.register(authRoutes);
await app.register(usersRoutes);
await app.register(ordersRoutes);
