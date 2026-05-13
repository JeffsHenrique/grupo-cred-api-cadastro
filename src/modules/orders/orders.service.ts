import { db } from '@/db/index.js';
import { orders } from '@/db/schema/orders.js';
import { users } from '@/db/schema/users.js';
import { eq } from 'drizzle-orm';
import { NotFoundError } from '../_errors/not-found-error.js';
import type { CreateOrderInput } from './orders.schema.js';

export async function create(data: CreateOrderInput) {
	const [user] = await db
		.select({ id: users.id })
		.from(users)
		.where(eq(users.id, data.userId))
		.limit(1);
	if (!user) {
		throw new NotFoundError({ message: 'User not found' });
	}

	const [order] = await db
		.insert(orders)
		.values({
			userId: data.userId,
			descricao: data.descricao,
		})
		.returning();

	return order;
}

export async function listAll() {
	return db
		.select({
			id: orders.id,
			userId: orders.userId,
			descricao: orders.descricao,
			createdAt: orders.createdAt,
			updatedAt: orders.updatedAt,
			userName: users.nome,
		})
		.from(orders)
		.leftJoin(users, eq(orders.userId, users.id));
}

export async function listByUser(userId: string) {
	const [user] = await db
		.select({ id: users.id })
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);
	if (!user) {
		throw new NotFoundError({ message: 'User not found' });
	}

	return db
		.select({
			id: orders.id,
			userId: orders.userId,
			descricao: orders.descricao,
			createdAt: orders.createdAt,
			updatedAt: orders.updatedAt,
		})
		.from(orders)
		.where(eq(orders.userId, userId));
}
