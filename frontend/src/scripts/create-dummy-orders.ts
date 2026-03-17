import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { orders, orderItems, products } from '../db/schema.js';
import { eq, sql } from 'drizzle-orm';
import { randomUUID } from 'crypto';

const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString!, { prepare: false });
const db = drizzle(client);

const PRODUCTS = {
    PASTEL: { id: 'b5fef7a5-af33-470d-9959-65ee24c336aa', name: 'Standard Pastel Dream', price: 170000, targetSold: 2 },
    FOREST: { id: 'daeed931-8c59-4e57-b929-7c88f25fe8c3', name: 'Mini Forest Bloom', price: 170000, targetSold: 3 },
    ROMANCE: { id: '1d2ffccd-e89c-49a8-b825-d8f1caa22664', name: 'Standard Red Romance', price: 170000, targetSold: 5 }
};

const STATUSE_PAID = ['paid', 'shipped', 'completed'];

async function createDummyOrders() {
    console.log('🚀 Memulai Pembersihan & Pembuatan Data Dummy (10 Pesanan Completed)...');

    try {
        // --- CLEANUP FIRST ---
        await db.delete(orderItems);
        await db.delete(orders);
        await db.update(products).set({ stock: 50, soldCount: 0 });

        // --- DATA UNTUK RED ROMANCE (Target: 5 Orders, 1 Qty each) ---
        const customersRed = ['Andi', 'Budi', 'Cici', 'Dedi', 'Euis'];
        for (const name of customersRed) {
            await createOrderWithItems(name, [
                { id: PRODUCTS.ROMANCE.id, qty: 1, price: PRODUCTS.ROMANCE.price }
            ], 'completed');
        }

        // --- DATA UNTUK PASTEL DREAM (Target: 2 Orders, 1 Qty each) ---
        const customersPastel = ['Fahri', 'Gita'];
        for (const name of customersPastel) {
            await createOrderWithItems(name, [
                { id: PRODUCTS.PASTEL.id, qty: 1, price: PRODUCTS.PASTEL.price }
            ], 'completed');
        }

        // --- DATA UNTUK FOREST BLOOM (Target: 3 Orders, 1 Qty each) ---
        const customersForest = ['Hani', 'Iwan', 'Joko'];
        for (const name of customersForest) {
            await createOrderWithItems(name, [
                { id: PRODUCTS.FOREST.id, qty: 1, price: PRODUCTS.FOREST.price }
            ], 'completed');
        }

        // --- UPDATE PRODUCT STATS ---
        console.log('📈 Memperbarui Statistik Produk...');
        for (const p of Object.values(PRODUCTS)) {
            await db.update(products).set({
                soldCount: p.targetSold,
                stock: sql`${products.stock} - ${p.targetSold}`
            }).where(eq(products.id, p.id));
        }

        console.log('✅ 10 Pesanan Berhasil Dibuat (Status: Completed)!');
    } catch (error) {
        console.error('❌ Gagal membuat data dummy:', error);
    } finally {
        await client.end();
        process.exit(0);
    }
}

async function createOrderWithItems(customerName: string, items: any[], status: string) {
    const orderId = randomUUID();
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const date = new Date();
    const dateStr = date.toISOString().slice(2, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `AMR-${dateStr}-${randomSuffix}`;
    
    // Insert Order
    await db.insert(orders).values({
        id: orderId,
        orderNumber,
        customerName,
        customerPhone: '08123456789',
        customerAddress: 'Jl. Melati No. 123, Jakarta',
        deliveryType: 'express',
        totalAmount,
        status: status as any,
        paymentMethod: 'full',
        paidAmount: (status === 'paid' || status === 'completed' || status === 'shipped') ? totalAmount : 0,
        createdAt: date,
        updatedAt: date
    });

    // Insert Items
    for (const item of items) {
        await db.insert(orderItems).values({
            id: randomUUID(),
            orderId,
            itemType: 'express',
            productId: item.id,
            quantity: item.qty,
            subtotal: item.price * item.qty
        });
    }
}

createDummyOrders();
