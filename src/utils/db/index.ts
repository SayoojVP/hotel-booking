// src/utils/db/index.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in .env");
}

const sql = neon(connectionString);

// Exporting 'db' so you can use it like: import { db } from '@utils/db'
export const db = drizzle(sql, { schema });
