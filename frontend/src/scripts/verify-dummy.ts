import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { products, orders } from '../db/schema.js';
import { eq, or, count } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString!, { prepare: false });
const db = drizzle(client);

async function verify() {
    console.log('🔍 Hasil Verifikasi Produk:');
    const targetNames = [
        'Standard Pastel Dream',
        'Mini Forest Bloom',
        'Standard Red Romance'
    ];

    const prodResults = await db.select().from(products).where(
        or(...targetNames.map(name => eq(products.name, name)))
    );

    prodResults.forEach(p => {
        console.log(`${p.name} | Terjual: ${p.soldCount} | Stok: ${p.stock}`);
    });

    console.log('\n🔍 Total Pesanan per Status:');
    const statusCounts = await db.select({ 
        status: orders.status, 
        val: count() 
    }).from(orders).groupBy(orders.status);
    
    statusCounts.forEach(s => {
        console.log(`${s.status}: ${s.val}`);
    });

    await client.end();
}

verify();
