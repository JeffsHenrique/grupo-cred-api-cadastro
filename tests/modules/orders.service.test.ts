import { beforeEach, describe, expect, it, vi } from 'vitest';

function createMockChain() {
	const chain: Record<string, vi.Mock> = {
		from: vi.fn(),
		where: vi.fn(),
		limit: vi.fn(),
		leftJoin: vi.fn(),
		values: vi.fn(),
		returning: vi.fn(),
	};

	chain.from.mockReturnValue(chain);
	chain.where.mockReturnValue(chain);
	chain.values.mockReturnValue(chain);
	chain.returning.mockReturnValue(chain);
	chain.leftJoin.mockReturnValue(chain);

	return chain;
}

vi.mock('@/db/index.js', () => ({
	db: { select: vi.fn(), insert: vi.fn() },
}));

vi.mock('@/config/env.js', () => ({
	env: { DATABASE_URL: '', JWT_SECRET: 'test-secret', PORT: 3000 },
}));

beforeEach(() => {
	vi.clearAllMocks();
});

describe('OrdersService', () => {
	describe('create', () => {
		it('should create an order successfully', async () => {
			const mod = await import('@/db/index.js');

			const findUserChain = createMockChain();
			findUserChain.limit.mockResolvedValue([{ id: 'user-uuid' }]);
			mod.db.select.mockReturnValue(findUserChain);

			const insertChain = createMockChain();
			insertChain.returning.mockResolvedValue([
				{
					id: 'order-uuid',
					userId: 'user-uuid',
					descricao: 'Headset',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			]);
			mod.db.insert.mockReturnValue(insertChain);

			const { create } = await import('@/modules/orders/orders.service.js');
			const result = await create({
				userId: 'user-uuid',
				descricao: 'Headset',
			});

			expect(result).toHaveProperty('descricao', 'Headset');
		});

		it('should throw when user does not exist', async () => {
			const mod = await import('@/db/index.js');
			const chain = createMockChain();
			chain.limit.mockResolvedValue([]);
			mod.db.select.mockReturnValue(chain);

			const { create } = await import('@/modules/orders/orders.service.js');
			await expect(
				create({ userId: 'nonexistent', descricao: 'Mouse' }),
			).rejects.toThrow('User not found');
		});
	});

	describe('listAll', () => {
		it('should return all orders with user names', async () => {
			const mod = await import('@/db/index.js');
			const chain = createMockChain();
			chain.leftJoin.mockResolvedValue([
				{ id: '1', descricao: 'Teclado', userName: 'João' },
				{ id: '2', descricao: 'Mouse', userName: 'Maria' },
			]);
			mod.db.select.mockReturnValue(chain);

			const { listAll } = await import('@/modules/orders/orders.service.js');
			const result = await listAll();

			expect(result).toHaveLength(2);
		});
	});

	describe('listByUser', () => {
		it('should return orders for a specific user', async () => {
			const mod = await import('@/db/index.js');

			const userCheckChain = createMockChain();
			userCheckChain.limit.mockResolvedValue([{ id: 'uuid-user' }]);

			const ordersChain = createMockChain();
			ordersChain.where.mockResolvedValue([
				{
					id: '1',
					userId: 'uuid-user',
					descricao: 'Monitor',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			]);

			mod.db.select
				.mockReturnValueOnce(userCheckChain)
				.mockReturnValueOnce(ordersChain);

			const { listByUser } = await import('@/modules/orders/orders.service.js');
			const result = await listByUser('uuid-user');
			expect(result).toHaveLength(1);
		});

		it('should throw when user does not exist', async () => {
			const mod = await import('@/db/index.js');
			const chain = createMockChain();
			chain.limit.mockResolvedValue([]);
			mod.db.select.mockReturnValue(chain);

			const { listByUser } = await import('@/modules/orders/orders.service.js');
			await expect(listByUser('nonexistent')).rejects.toThrow('User not found');
		});
	});
});
