'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { products, builderOptions } from '@/db/schema'
import { logger } from '@/utils/logger'
import { ProductSchema, BuilderOptionSchema } from '@/lib/validations'
import { createSafeAction } from '@/actions/safe-action'
import { z } from 'zod'

// ==========================================
// PRODUCTS (EXPRESS CATALOG)
// ==========================================

export const createProduct = createSafeAction(
    'createProduct',
    ProductSchema,
    async (validated) => {
        const result = await db.insert(products).values({
            ...validated,
            allowAffordable: validated.mainTier === 'affordable',
            allowStandard: validated.mainTier === 'standard',
            allowPremium: validated.mainTier === 'premium',
            allowSpecial: validated.allowSpecial || false,
            isDeleted: false,
        }).returning({ id: products.id });

        revalidateTag('products', 'default');
        revalidateTag('dashboard-stats', 'default');
        revalidatePath('/express');
        revalidatePath('/admin/products');
        revalidatePath('/');
        
        return { id: result[0].id };
    }
);

export const updateProduct = createSafeAction(
    'updateProduct',
    ProductSchema.extend({ id: z.string().uuid() }),
    async (validated) => {
        const { id, ...data } = validated;
        await db.update(products).set({
            ...data,
            allowAffordable: data.mainTier === 'affordable',
            allowStandard: data.mainTier === 'standard',
            allowPremium: data.mainTier === 'premium',
            allowSpecial: data.allowSpecial || false,
        }).where(eq(products.id, id));

        revalidateTag('products', 'default');
        revalidateTag('dashboard-stats', 'default');
        revalidatePath('/express');
        revalidatePath('/admin/products');
        revalidatePath('/');
        
        return { id };
    }
);

export const deleteProduct = createSafeAction(
    'deleteProduct',
    z.object({ id: z.string().uuid() }),
    async ({ id }) => {
        await db.update(products).set({ isDeleted: true }).where(eq(products.id, id));

        revalidateTag('products', 'default');
        revalidateTag('dashboard-stats', 'default');
        revalidatePath('/express');
        revalidatePath('/admin/products');
        revalidatePath('/');
        
        return { id };
    }
);

// ==========================================
// BUILDER OPTIONS (CUSTOM PATH)
// ==========================================

export const createBuilderOption = createSafeAction(
    'createBuilderOption',
    BuilderOptionSchema,
    async (validated) => {
        const result = await db.insert(builderOptions).values({
            ...validated,
            isDeleted: false,
        }).returning({ id: builderOptions.id });

        revalidateTag('builder-options', 'default');
        revalidateTag('dashboard-stats', 'default');
        revalidatePath('/custom');
        revalidatePath('/admin/builder');
        revalidatePath('/');
        
        return { id: result[0].id };
    }
);

export const updateBuilderOption = createSafeAction(
    'updateBuilderOption',
    BuilderOptionSchema.extend({ id: z.string().uuid() }),
    async (validated) => {
        const { id, ...data } = validated;
        await db.update(builderOptions).set({
            ...data,
        }).where(eq(builderOptions.id, id));

        revalidateTag('builder-options', 'default');
        revalidateTag('dashboard-stats', 'default');
        revalidatePath('/custom');
        revalidatePath('/admin/builder');
        revalidatePath('/');
        
        return { id };
    }
);

export const deleteBuilderOption = createSafeAction(
    'deleteBuilderOption',
    z.object({ id: z.string().uuid() }),
    async ({ id }) => {
        await db.update(builderOptions).set({ isDeleted: true }).where(eq(builderOptions.id, id));

        revalidateTag('builder-options', 'default');
        revalidateTag('dashboard-stats', 'default');
        revalidatePath('/custom');
        revalidatePath('/admin/builder');
        revalidatePath('/');
        
        return { id };
    }
);
