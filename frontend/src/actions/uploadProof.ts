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

        logger.info(ACTION, 'Uploading payment proof', { orderId, size: file.size, type: file.type })

        const supabase = await createClient()
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${isFinal ? 'final' : 'dp'}.${fileExt}`
        const filePath = `${orderId}/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('payment-proofs')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true,
            })

        if (uploadError) {
            logger.error(ACTION, 'Supabase storage error', uploadError, { orderId })
            return { success: false, error: 'Gagal mengunggah file. Silakan hubungi admin.' }
        }

        const { data: { publicUrl } } = supabase.storage
            .from('payment-proofs')
            .getPublicUrl(filePath)

        const updateData = isFinal 
            ? { finalPaymentProofUrl: publicUrl }
            : { paymentProofUrl: publicUrl }

        await db.update(orders).set(updateData).where(eq(orders.id, orderId))

        logger.info(ACTION, 'Payment proof updated', { orderId, publicUrl })
        revalidateTag('orders', 'default')
        revalidatePath(`/orders/${orderId}`)
        revalidatePath('/admin/orders')

        return { success: true, url: publicUrl }
    } catch (error: any) {
        logger.error(ACTION, 'Internal system error', error, { orderId })
        const message = error.name === 'ZodError' ? 'Data input tidak valid' : 'Terjadi kesalahan sistem'
        return { success: false, error: message }
    }
}
