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

export const OrderSchema = z.object({
    customerName: z.string().min(1, 'Nama wajib diisi'),
    customerPhone: z.string().regex(/^(?:\+62|62|0)8[1-9][0-9]{7,11}$/, 'Nomor HP tidak valid (gunakan format: 08... atau 628...)'),
    customerAddress: z.string().min(1, 'Alamat wajib diisi'),
    deliveryType: z.string().min(1, 'Tipe pengiriman wajib diisi'),
    totalAmount: z.number().min(0),
    paymentMethod: z.enum(['full', 'dp', 'final']),
    items: z.array(z.object({
        itemType: z.string(),
        productId: z.string().uuid().nullable().optional(),
        customDetails: z.record(z.string(), z.any()).nullable().optional(),
        quantity: z.number().int().min(1),
        subtotal: z.number().min(0),
    })).min(1, 'Minimal harus ada 1 item'),
});

export const PaymentProofSchema = z.object({
    orderId: z.string().uuid('ID Pesanan tidak valid'),
    isFinal: z.boolean().default(false),
});

export type ProductInput = z.infer<typeof ProductSchema>;
export type BuilderOptionInput = z.infer<typeof BuilderOptionSchema>;
export type OrderInput = z.infer<typeof OrderSchema>;
export type PaymentProofInput = z.infer<typeof PaymentProofSchema>;
