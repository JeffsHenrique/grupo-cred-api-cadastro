import { describe, expect, it, vi } from 'vitest';

function createMockChain() {
	const chain: Record<string, vi.Mock> = {
		from: vi.fn(),
		where: vi.fn(),
		limit: vi.fn(),
		values: vi.fn(),
		returning: vi.fn(),
	};

	chain.from.mockReturnValue(chain);
	chain.where.mockReturnValue(chain);
	chain.values.mockReturnValue(chain);
	chain.returning.mockReturnValue(chain);

	return chain;
}

vi.mock('@/db/index.js', () => ({
	db: { select: vi.fn(), insert: vi.fn() },
}));

vi.mock('@/config/env.js', () => ({
	env: { DATABASE_URL: '', JWT_SECRET: 'test-secret', PORT: 3000 },
}));

vi.mock('bcryptjs', () => ({
	default: {
		hash: vi.fn().mockResolvedValue('$2a$10$hashedpassword'),
		compare: vi.fn(),
	},
}));

vi.mock('jsonwebtoken', () => ({
	default: {
		sign: vi.fn().mockReturnValue('mock-jwt-token'),
	},
}));

describe('AuthService', () => {
	describe('register', () => {
		it('should register a new user successfully', async () => {
			const chain = createMockChain();
			chain.limit.mockResolvedValue([]);
			chain.returning.mockResolvedValue([
				{
					id: 'uuid-123',
					cpf: '12345678901',
					rg: 'MG123456',
					nome: 'João',
					idade: 30,
					email: 'joao@email.com',
					login: 'joao',
					role: 'user',
					createdAt: new Date(),
				},
			]);

			const mod = await import('@/db/index.js');
			mod.db.select.mockReturnValue(chain);
			mod.db.insert.mockReturnValue(chain);

			const { register } = await import('@/modules/auth/auth.service.js');
			const result = await register({
				cpf: '12345678901',
				rg: 'MG123456',
				nome: 'João',
				idade: 30,
				email: 'joao@email.com',
				login: 'joao',
				senha: '123456',
			});

			expect(result).toHaveProperty('id', 'uuid-123');
			expect(result).toHaveProperty('nome', 'João');
		});

		it('should throw when CPF/email/login already exists', async () => {
			const chain = createMockChain();
			chain.limit.mockResolvedValue([{ id: 'existing-uuid' }]);

			const mod = await import('@/db/index.js');
			mod.db.select.mockReturnValue(chain);

			const { register } = await import('@/modules/auth/auth.service.js');
			await expect(
				register({
					cpf: '12345678901',
					rg: 'MG123456',
					nome: 'João',
					idade: 30,
					email: 'joao@email.com',
					login: 'joao',
					senha: '123456',
				}),
			).rejects.toThrow('already registered');
		});
	});

	describe('login', () => {
		it('should return token and user on valid credentials', async () => {
			const chain = createMockChain();
			chain.limit.mockResolvedValue([
				{
					id: 'uuid-123',
					nome: 'João',
					email: 'joao@email.com',
					login: 'joao',
					senha: '$2a$10$hash',
					role: 'user',
				},
			]);

			const mod = await import('@/db/index.js');
			mod.db.select.mockReturnValue(chain);

			const bcrypt = await import('bcryptjs');
			bcrypt.default.compare.mockResolvedValue(true);

			const { login } = await import('@/modules/auth/auth.service.js');
			const result = await login({ login: 'joao', senha: '123456' });

			expect(result).toHaveProperty('token', 'mock-jwt-token');
			expect(result.user).toHaveProperty('nome', 'João');
		});

		it('should throw on wrong password', async () => {
			const chain = createMockChain();
			chain.limit.mockResolvedValue([
				{
					id: 'uuid-123',
					nome: 'João',
					email: 'joao@email.com',
					login: 'joao',
					senha: '$2a$10$hash',
					role: 'user',
				},
			]);

			const mod = await import('@/db/index.js');
			mod.db.select.mockReturnValue(chain);

			const bcrypt = await import('bcryptjs');
			bcrypt.default.compare.mockResolvedValue(false);

			const { login } = await import('@/modules/auth/auth.service.js');
			await expect(login({ login: 'joao', senha: 'wrong' })).rejects.toThrow(
				'Invalid credentials',
			);
		});

		it('should throw when user not found', async () => {
			const chain = createMockChain();
			chain.limit.mockResolvedValue([]);

			const mod = await import('@/db/index.js');
			mod.db.select.mockReturnValue(chain);

			const { login } = await import('@/modules/auth/auth.service.js');
			await expect(
				login({ login: 'unknown', senha: '123456' }),
			).rejects.toThrow('Invalid credentials');
		});
	});
});
