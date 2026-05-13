import { env } from '@/config/env.js';
import { userParamsSchema } from '@/modules/users/users.schema.js';
import type { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';

interface JwtPayload {
	id: string;
	role: 'admin' | 'user';
}

declare module 'fastify' {
	interface FastifyRequest {
		user?: JwtPayload;
	}
}

export async function authenticate(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const authHeader = request.headers.authorization;
	if (!authHeader?.startsWith('Bearer ')) {
		reply.status(401).send({ message: 'Missing or invalid token' });
		return;
	}

	const token = authHeader.slice(7);
	try {
		const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
		request.user = payload;
	} catch {
		reply.status(401).send({ message: 'Invalid or expired token' });
	}
}

export function authorizeRole(...roles: string[]) {
	return (request: FastifyRequest, reply: FastifyReply, next: () => void) => {
		const user = request.user as JwtPayload

		if (!roles.includes(user.role)) {
			reply.status(403).send({ message: 'Insufficient permissions' });
		}

		return next()
	};
}

export function verifyUser(
	request: FastifyRequest,
	reply: FastifyReply,
	next: () => void
) {
	const { id } = userParamsSchema.parse(request.params);
	const user = request.user as JwtPayload

	if (user.role === 'admin') {
		return next()
	}

	if (user.id !== id) {
		reply.status(403).send({ message: 'Insufficient permissions' });
	}

	return next()
}