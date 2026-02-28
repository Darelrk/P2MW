import {
    pgTable,
    uuid,
    text,
    integer,
    boolean,
    timestamp,
    varchar,
    jsonb,
    index,
} from 'drizzle-orm/pg-core';

// 1. PRODUCTS TABLE (For Express Path)
export const products = pgTable('products', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    description: text('description'),

    // 4 Pricing Tiers
    priceAffordable: integer('price_affordable').notNull().default(0),
    priceStandard: integer('price_standard').notNull().default(0),
    pricePremium: integer('price_premium').notNull().default(0),
    priceSpecial: integer('price_special').notNull().default(0),

    // Tier Enable/Disable Flags
    allowAffordable: boolean('allow_affordable').default(true).notNull(),
    allowStandard: boolean('allow_standard').default(true).notNull(),
    allowPremium: boolean('allow_premium').default(true).notNull(),
    allowSpecial: boolean('allow_special').default(true).notNull(),

    status: boolean('status').default(true).notNull(), // Active or Inactive (Global Visibility)
    imageUrl: varchar('image_url', { length: 512 }),
    stock: integer('stock').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
    statusIdx: index('product_status_idx').on(table.status),
    createdIdx: index('product_created_idx').on(table.createdAt),
}));

// 2. BUILDER OPTIONS TABLE (For Custom Path)
export const builderOptions = pgTable('builder_options', {
    id: uuid('id').defaultRandom().primaryKey(),
    category: varchar('category', { length: 50 }).notNull(), // 'flower' | 'wrapper' | 'color'
    name: varchar('name', { length: 256 }).notNull(),
    isAvailable: boolean('is_available').default(true).notNull(),
    priceAdjustment: integer('price_adjustment').default(0).notNull(),
    imageUrl: varchar('image_url', { length: 512 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
    categoryIdx: index('builder_category_idx').on(table.category),
}));

// 3. ORDERS TABLE
export const orders = pgTable('orders', {
    id: uuid('id').defaultRandom().primaryKey(),
    customerName: varchar('customer_name', { length: 256 }).notNull(),
    customerAddress: text('customer_address').notNull(),
    deliveryType: varchar('delivery_type', { length: 50 }).notNull(), // 'express' | 'relaxed'
    totalAmount: integer('total_amount').notNull(),
    status: varchar('status', { length: 50 }).default('pending').notNull(), // 'pending', 'completed'
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 4. ORDER ITEMS TABLE
export const orderItems = pgTable('order_items', {
    id: uuid('id').defaultRandom().primaryKey(),
    orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
    itemType: varchar('item_type', { length: 50 }).notNull(), // 'express' | 'custom'
    productId: uuid('product_id').references(() => products.id, { onDelete: 'set null' }), // Nullable if custom
    customDetails: jsonb('custom_details'), // JSON representing custom builder specs
    quantity: integer('quantity').default(1).notNull(),
    subtotal: integer('subtotal').notNull(),
}, (table) => ({
    orderIdIdx: index('order_item_order_id_idx').on(table.orderId),
}));
