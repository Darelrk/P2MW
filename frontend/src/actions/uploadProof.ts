'use server'

import { createClient } from '@/utils/supabase/server'
import { db } from '@/db'
import { orders } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath, revalidateTag } from 'next/cache'
import { PaymentProofSchema } from '@/lib/validations'
import { logger } from '@/utils/logger'
import { AppError } from '@/lib/errors'
import { createSafeAction } from '@/actions/safe-action'
import { z } from 'zod'

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Secure upload of payment proof with multi-level validation
 */
export const uploadPaymentProof = createSafeAction(
    'uploadPaymentProof',
    z.instanceof(FormData),
    async (formData) => {
        const orderId = formData.get('orderId') as string;
        const isFinal = formData.get('isFinal') === 'true';

        // Validation using Zod for non-file data
        PaymentProofSchema.parse({ orderId, isFinal });

        const file = formData.get('file') as File;
        if (!file) {
            throw new Error('File tidak ditemukan');
        }

        // Server-side file validation
        if (file.size > MAX_FILE_SIZE) {
            throw new Error('File terlalu besar (Maksimal 5MB)');
        }
        if (!ALLOWED_TYPES.includes(file.type)) {
            throw new Error('Format file tidak didukung (Gunakan JPG, PNG, atau WEBP)');
        }

        const { uploadToR2Action } = await import('@/actions/uploadToR2');
        formData.append('type', 'proof');
        const uploadResult = await uploadToR2Action(formData);

        if (!uploadResult.data || !uploadResult.data.fileName) {
            throw new Error(uploadResult.error || 'Gagal mengunggah file.');
        }

        // Generate proxy URL
        const proxyUrl = `/api/assets/payment-proofs/${uploadResult.data.fileName}`;

        const updateData = isFinal 
            ? { finalPaymentProofUrl: proxyUrl }
            : { paymentProofUrl: proxyUrl };

        await db.update(orders).set(updateData).where(eq(orders.id, orderId));

        revalidateTag('orders', 'default');
        revalidatePath(`/orders/${orderId}`);
        revalidatePath('/admin/orders');

        return { url: proxyUrl };
    },
    { requireAdmin: false }
);
