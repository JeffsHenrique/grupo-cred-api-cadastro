import { db } from '@/db/index.js';
import { users } from '@/db/schema/users.js';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { BadRequestError } from '../_errors/bad-request-error.js';
import { NotFoundError } from '../_errors/not-found-error.js';
import type { UpdateUserInput } from './users.schema.js';

export async function list() {
	return db
		.select({
			id: users.id,
			cpf: users.cpf,
			rg: users.rg,
			nome: users.nome,
			idade: users.idade,
			email: users.email,
			login: users.login,
			role: users.role,
			createdAt: users.createdAt,
			updatedAt: users.updatedAt,
		})
		.from(users);
}

export async function update(id: string, data: UpdateUserInput) {
	const [existing] = await db
		.select({ id: users.id })
		.from(users)
		.where(eq(users.id, id))
		.limit(1);
	if (!existing) {
		throw new NotFoundError({ message: 'User not found' });
	}

	const updateData: Record<string, unknown> = {};
	if (data.cpf !== undefined) updateData.cpf = data.cpf;
	if (data.rg !== undefined) updateData.rg = data.rg;
	if (data.nome !== undefined) updateData.nome = data.nome;
	if (data.idade !== undefined) updateData.idade = data.idade;
	if (data.email !== undefined) updateData.email = data.email;
	if (data.senha !== undefined)
		updateData.senha = await bcrypt.hash(data.senha, 10);

	if (Object.keys(updateData).length === 0) {
		throw new BadRequestError({ message: 'No valid fields to update' });
	}

	updateData.updatedAt = new Date();

	const [updated] = await db
		.update(users)
		.set(updateData)
		.where(eq(users.id, id))
		.returning({
			id: users.id,
			cpf: users.cpf,
			rg: users.rg,
			nome: users.nome,
			idade: users.idade,
			email: users.email,
			login: users.login,
			role: users.role,
			createdAt: users.createdAt,
			updatedAt: users.updatedAt,
		});

	return updated;
}

export async function remove(id: string) {
	const [existing] = await db
		.select({ id: users.id })
		.from(users)
		.where(eq(users.id, id))
		.limit(1);
	if (!existing) {
		throw new NotFoundError({ message: 'User not found' });
	}

	await db.delete(users).where(eq(users.id, id));
}
