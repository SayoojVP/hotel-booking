import { pgTable, serial, text, varchar, timestamp } from 'drizzle-orm/pg-core';
import { t } from 'elysia';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(), 
  role: text('role').$type<'GUEST' | 'OWNER' >().default('GUEST'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const registerSchema = t.Object({
  name: t.String({ minLength: 2 }),
  email: t.String({ format: 'email' }),
  password: t.String({ minLength: 8 }),
  role: t.Optional(t.Union([t.Literal('GUEST'), t.Literal('OWNER')]))
});

export const loginSchema = t.Object({
  email: t.String({ format: 'email' }),
  password: t.String()
});