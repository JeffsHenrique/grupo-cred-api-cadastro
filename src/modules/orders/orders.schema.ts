import { z } from 'zod';

export const createOrderSchema = z.object({
	userId: z.string().uuid('Invalid user ID'),
	descricao: z
		.string()
		.min(2, 'Description must have at least 2 characters')
		.max(255),
});

export const orderParamsSchema = z.object({
	userId: z.string().uuid('Invalid user ID'),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
