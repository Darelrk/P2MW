import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.warn('⚠️ DATABASE_URL is missing. Database features will be unavailable.');
}

// Disable prefetch as it is not supported for "Transaction" pool mode (typically used with Supabase IPv4 limits/PgBouncer)
// max: 10 prevents serverless functions from exhausting connection pool
const client = connectionString
    ? postgres(connectionString, { prepare: false, max: 10, idle_timeout: 20 })
    : null;

export const db = client ? drizzle(client, { schema }) : (null as any);
