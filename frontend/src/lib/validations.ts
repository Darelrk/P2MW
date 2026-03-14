import { z } from 'zod';

export const ProductSchema = z.object({
    name: z.string().min(1, 'Nama produk wajib diisi'),
    description: z.string().optional().nullable(),
    priceAffordable: z.coerce.number().min(0, 'Harga tidak boleh negatif'),
    priceStandard: z.coerce.number().min(0, 'Harga tidak boleh negatif'),
    pricePremium: z.coerce.number().min(0, 'Harga tidak boleh negatif'),
    priceSpecial: z.coerce.number().min(0, 'Harga tidak boleh negatif'),
    mainTier: z.enum(['affordable', 'standard', 'premium']),
    allowSpecial: z.coerce.boolean().default(false),
    status: z.preprocess((val) => val === 'true' || val === true, z.boolean()).default(true),
    imageUrl: z.preprocess((v) => (v === '' || v === 'null' || v === 'undefined' ? null : v), z.string().nullable().optional()),
    modelUrl: z.preprocess((v) => (v === '' || v === 'null' || v === 'undefined' ? null : v), z.string().nullable().optional()),
    stock: z.coerce.number().int().min(0, 'Stok tidak boleh negatif').default(0),
    soldCount: z.coerce.number().int().min(0, 'Jumlah terjual tidak boleh negatif').default(0),
});

export const BuilderOptionSchema = z.object({
    name: z.string().min(1, 'Nama opsi wajib diisi'),
    category: z.enum(['flower', 'color', 'wrapper']),
    priceAdjustment: z.coerce.number().min(0, 'Tambahan harga tidak boleh negatif').default(0),
    isAvailable: z.preprocess((val) => val === 'true' || val === true, z.boolean()).default(true),
    imageUrl: z.preprocess((v) => (v === '' || v === 'null' || v === 'undefined' ? null : v), z.string().nullable().optional()),
});

export type ProductInput = z.infer<typeof ProductSchema>;
export type BuilderOptionInput = z.infer<typeof BuilderOptionSchema>;
