import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { products } from '../db/schema.js';
import { eq, or } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString!, { prepare: false });
const db = drizzle(client);

async function findProducts() {
    const targetNames = [
        'Standard Pastel Dream',
        'Mini Forest Bloom',
        'Standard Red Romance'
    ];

    const results = await db.select().from(products).where(
        or(...targetNames.map(name => eq(products.name, name)))
    );

    const productsData = results.map(p => ({ name: p.name, id: p.id }));
    const fs = await import('fs');
    fs.writeFileSync('./product_ids.json', JSON.stringify(productsData, null, 2));
    console.log('✅ File product_ids.json berhasil dibuat.');
    await client.end();
}

findProducts();
