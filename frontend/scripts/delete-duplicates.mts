import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

async function main() {
    console.log("Cleaning up duplicate builder options using .env.local...");

    if (!process.env.DATABASE_URL) {
        throw new Error("Missing DATABASE_URL in .env.local");
    }

    const client = postgres(process.env.DATABASE_URL);

    // UUID cannot be MIN(), so we use an array and delete all except the first one
    await client`
        DELETE FROM builder_options WHERE id IN (
            SELECT id FROM (
                SELECT id, ROW_NUMBER() OVER (PARTITION BY category, name ORDER BY id) as rn
                FROM builder_options
            ) t WHERE rn > 1
        );
    `;

    // Final sanity check
    const count = await client`SELECT COUNT(*) FROM builder_options`;
    console.log(`Current builder option count: ${count[0].count}`);

    console.log("Cleanup complete!");
    process.exit(0);
}

main().catch(console.error);
