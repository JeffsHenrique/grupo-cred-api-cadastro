import { z } from 'zod';

export const updateUserSchema = z.object({
	cpf: z.string().length(11).optional(),
	rg: z.string().min(1).optional(),
	nome: z.string().min(2).optional(),
	idade: z.number().int().min(18).max(120).optional(),
	email: z.string().email().optional(),
	senha: z.string().min(6).optional(),
});

export const userParamsSchema = z.object({
	id: z.string().uuid('Invalid user ID'),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
