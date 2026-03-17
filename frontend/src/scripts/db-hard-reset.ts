import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { orders, products, orderItems } from '../db/schema.js';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('❌ DATABASE_URL tidak ditemukan di .env');
    process.exit(1);
}

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

async function performHardReset() {
    console.log('🚀 Memulai Hard Reset Database...');

    try {
        // 1. Hapus semua data pesanan (order_items akan terhapus jika ada cascade, 
        // tapi kita hapus manual untuk keamanan jika cascade belum terpasang sempurna)
        console.log('--- Menghapus Order Items...');
        await db.delete(orderItems);
        
        console.log('--- Menghapus Pesanan...');
        await db.delete(orders);

        // 2. Riset statistik produk
        console.log('--- Meriset Stok & Penjualan Produk...');
        await db.update(products).set({
            stock: 50,
            soldCount: 0
        });

        console.log('✅ Hard Reset Berhasil!');
    } catch (error) {
        console.error('❌ Terjadi kesalahan saat Hard Reset:', error);
    } finally {
        await client.end();
        process.exit(0);
    }
}

performHardReset();
