import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './esquema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não configurada no ambiente');
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });
