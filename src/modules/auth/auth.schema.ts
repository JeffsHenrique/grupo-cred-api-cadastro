import { z } from 'zod';

export const registerSchema = z.object({
	cpf: z.string().length(11, 'CPF must have 11 characters'),
	rg: z.string().min(1, 'RG is required'),
	nome: z.string().min(2, 'Name must have at least 2 characters'),
	idade: z.number().int().min(18, 'Must be at least 18 years old').max(120),
	email: z.string().email('Invalid email'),
	login: z.string().min(3, 'Login must have at least 3 characters'),
	senha: z.string().min(6, 'Password must have at least 6 characters'),
});

export const loginSchema = z.object({
	login: z.string().min(1, 'Login is required'),
	senha: z.string().min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
