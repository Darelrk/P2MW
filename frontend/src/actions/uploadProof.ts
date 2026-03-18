'use server'

import { createClient } from '@/utils/supabase/server'
import { db } from '@/db'
import { orders } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath, revalidateTag } from 'next/cache'
import { PaymentProofSchema } from '@/lib/validations'
import { logger } from '@/utils/logger'
import { AppError } from '@/lib/errors'

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function uploadPaymentProof(orderId: string, formData: FormData, isFinal: boolean = false) {
    const ACTION = 'uploadPaymentProof'
    try {
        // Validation using Zod for non-file data
        PaymentProofSchema.parse({ orderId, isFinal })

        const file = formData.get('file') as File
        if (!file) {
            return { success: false, error: 'File tidak ditemukan' }
        }

        // Server-side file validation
        if (file.size > MAX_FILE_SIZE) {
            return { success: false, error: 'File terlalu besar (Maksimal 5MB)' }
        }
        if (!ALLOWED_TYPES.includes(file.type)) {
            return { success: false, error: 'Format file tidak didukung (Gunakan JPG, PNG, atau WEBP)' }
        }

        logger.info(ACTION, 'Uploading payment proof to R2', { orderId, size: file.size, type: file.type })

        const { uploadToR2Action } = await import('@/actions/uploadToR2')
        const uploadResult = await uploadToR2Action(formData, 'proof')

        if (!uploadResult.success || !uploadResult.fileName) {
            logger.error(ACTION, 'R2 upload error', uploadResult.error, { orderId })
            return { success: false, error: uploadResult.error || 'Gagal mengunggah file. Silakan hubungi admin.' }
        }

        // Generate proxy URL: /api/assets/payment-proofs/[filename]
        const proxyUrl = `/api/assets/payment-proofs/${uploadResult.fileName}`

        const updateData = isFinal 
            ? { finalPaymentProofUrl: proxyUrl }
            : { paymentProofUrl: proxyUrl }

        await db.update(orders).set(updateData).where(eq(orders.id, orderId))

        logger.info(ACTION, 'Payment proof updated with proxy URL', { orderId, proxyUrl })
        revalidateTag('orders', 'default')
        revalidatePath(`/orders/${orderId}`)
        revalidatePath('/admin/orders')

        return { success: true, url: proxyUrl }
    } catch (error: any) {
        logger.error(ACTION, 'Internal system error', error, { orderId })
        const message = error.name === 'ZodError' ? 'Data input tidak valid' : 'Terjadi kesalahan sistem'
        return { success: false, error: message }
    }
}
