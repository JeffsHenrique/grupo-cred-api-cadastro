import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
	DATABASE_URL: z.string().url(),
	JWT_SECRET: z.string().min(10),
	PORT: z.coerce.number().int().positive().default(5173),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
	console.error(
		'Invalid environment variables:',
		parsed.error.flatten().fieldErrors,
	);
	process.exit(1);
}

export const env = parsed.data;
