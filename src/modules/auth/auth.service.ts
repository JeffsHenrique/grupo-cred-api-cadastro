import { env } from '@/config/env.js';
import { db } from '@/db/index.js';
import { users } from '@/db/schema/users.js';
import bcrypt from 'bcryptjs';
import { eq, or } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../_errors/bad-request-error.js';
import type { LoginInput, RegisterInput } from './auth.schema.js';

export async function register(data: RegisterInput) {
	const existing = await db
		.select({ id: users.id })
		.from(users)
		.where(
			or(
				eq(users.cpf, data.cpf),
				eq(users.email, data.email),
				eq(users.login, data.login),
			),
		)
		.limit(1);

	if (existing.length > 0) {
		throw new BadRequestError({ message: 'CPF, email or login already registered' });
	}

	const hashedPassword = await bcrypt.hash(data.senha, 10);

	const [user] = await db
		.insert(users)
		.values({
			cpf: data.cpf,
			rg: data.rg,
			nome: data.nome,
			idade: data.idade,
			email: data.email,
			login: data.login,
			senha: hashedPassword,
		})
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
		});

	return user;
}

export async function login(data: LoginInput) {
	const [user] = await db
		.select()
		.from(users)
		.where(eq(users.login, data.login))
		.limit(1);

	if (!user) {
		throw new BadRequestError({ message: 'Invalid credentials' });
	}

	const validPassword = await bcrypt.compare(data.senha, user.senha);
	if (!validPassword) {
		throw new BadRequestError({ message: 'Invalid credentials' });
	}

	const token = jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, {
		expiresIn: '7d',
	});

	return {
		token,
		user: {
			id: user.id,
			nome: user.nome,
			email: user.email,
			login: user.login,
			role: user.role,
		},
	};
}
