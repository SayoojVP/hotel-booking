import { t } from 'elysia';

// Schema for updating user profile (everything is optional)
export const updateUserSchema = t.Object({
  name: t.Optional(t.String({ minLength: 2 })),
  email: t.Optional(t.String({ format: 'email' })),
});

// Schema for what we return to the public (excluding sensitive data)
export const userResponseSchema = t.Object({
  id: t.Number(),
  name: t.String(),
  email: t.String(),
  role: t.String(),
});