import {
	integer,
	pgTable,
	timestamp,
	uuid,
	varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: uuid('id').defaultRandom().primaryKey(),
	cpf: varchar('cpf', { length: 11 }).notNull().unique(),
	rg: varchar('rg', { length: 20 }).notNull(),
	nome: varchar('nome', { length: 255 }).notNull(),
	idade: integer('idade').notNull(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	login: varchar('login', { length: 100 }).notNull().unique(),
	senha: varchar('senha', { length: 255 }).notNull(),
	role: varchar('role', { length: 10 }).notNull().default('user'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
