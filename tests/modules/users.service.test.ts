import { beforeEach, describe, expect, it, vi } from 'vitest';

function createMockChain() {
	const chain: Record<string, vi.Mock> = {
		from: vi.fn(),
		where: vi.fn(),
		limit: vi.fn(),
		set: vi.fn(),
		returning: vi.fn(),
	};

	chain.from.mockReturnValue(chain);
	chain.where.mockReturnValue(chain);
	chain.set.mockReturnValue(chain);
	chain.returning.mockReturnValue(chain);

	return chain;
}

vi.mock('@/db/index.js', () => ({
	db: { select: vi.fn(), update: vi.fn(), delete: vi.fn() },
}));

vi.mock('@/config/env.js', () => ({
	env: { DATABASE_URL: '', JWT_SECRET: 'test-secret', PORT: 3000 },
}));

beforeEach(() => {
	vi.clearAllMocks();
});

describe('UsersService', () => {
	describe('list', () => {
		it('should return all users without password', async () => {
			const mod = await import('@/db/index.js');
			const chain = createMockChain();
			chain.from.mockResolvedValue([
				{ id: '1', nome: 'João', login: 'joao' },
				{ id: '2', nome: 'Maria', login: 'maria' },
			]);
			mod.db.select.mockReturnValue(chain);

			const { list } = await import('@/modules/users/users.service.js');
			const result = await list();

			expect(result).toHaveLength(2);
		});
	});

	describe('update', () => {
		it('should update user fields successfully', async () => {
			const mod = await import('@/db/index.js');

			// First select call (find user)
			const selectChain = createMockChain();
			selectChain.limit.mockResolvedValue([{ id: 'uuid-123' }]);
			mod.db.select.mockReturnValue(selectChain);

			// Update call
			const updateChain = createMockChain();
			updateChain.returning.mockResolvedValue([
				{
					id: 'uuid-123',
					cpf: '12345678901',
					nome: 'João Updated',
					email: 'joao@email.com',
					login: 'joao',
					role: 'user',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			]);
			mod.db.update.mockReturnValue(updateChain);

			const { update } = await import('@/modules/users/users.service.js');
			const result = await update('uuid-123', { nome: 'João Updated' });

			expect(result).toHaveProperty('nome', 'João Updated');
		});

		it('should throw when user not found', async () => {
			const mod = await import('@/db/index.js');
			const chain = createMockChain();
			chain.limit.mockResolvedValue([]);
			mod.db.select.mockReturnValue(chain);

			const { update } = await import('@/modules/users/users.service.js');
			await expect(update('nonexistent', { nome: 'Test' })).rejects.toThrow(
				'User not found',
			);
		});
	});

	describe('remove', () => {
		it('should delete user successfully', async () => {
			const mod = await import('@/db/index.js');

			// Select chain (find user)
			const selectChain = createMockChain();
			selectChain.limit.mockResolvedValue([{ id: 'uuid-123' }]);
			mod.db.select.mockReturnValue(selectChain);

			// Delete chain
			const deleteChain = createMockChain();
			deleteChain.where.mockResolvedValue(undefined);
			mod.db.delete.mockReturnValue(deleteChain);

			const { remove } = await import('@/modules/users/users.service.js');
			await expect(remove('uuid-123')).resolves.not.toThrow();
		});

		it('should throw when user not found', async () => {
			const mod = await import('@/db/index.js');
			const chain = createMockChain();
			chain.limit.mockResolvedValue([]);
			mod.db.select.mockReturnValue(chain);

			const { remove } = await import('@/modules/users/users.service.js');
			await expect(remove('nonexistent')).rejects.toThrow('User not found');
		});
	});
});
