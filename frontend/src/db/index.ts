import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { config } from 'dotenv';

config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL is missing in environment variables');
}

// Disable prefetch as it is not supported for "Transaction" pool mode (typically used with Supabase IPv4 limits/PgBouncer)
// max: 10 prevents serverless functions from exhausting connection pool
export const client = postgres(connectionString, { prepare: false, max: 10, idle_timeout: 20 });

export const db = drizzle(client, { schema });
