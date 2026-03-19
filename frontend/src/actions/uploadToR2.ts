'use server'

import { uploadToR2 } from '@/lib/r2-client'
import { fileTypeFromBuffer } from 'file-type'
import { logger } from '@/utils/logger'
import { createSafeAction } from '@/actions/safe-action'
import { z } from 'zod'
import { AuthError } from '@/lib/errors'

/**
 * Upload Configuration for R2
 */
const R2_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB (higher than Supabase)
  allowedTypes: {
    products: ['image/jpeg', 'image/png', 'image/webp'],
    'product-models': ['model/gltf-binary'],
  } as Record<string, string[]>,
  allowedExtensions: {
    products: ['.jpg', '.jpeg', '.png', '.webp'],
    'product-models': ['.glb'],
    'payment-proofs': ['.jpg', '.jpeg', '.png', '.webp'],
  } as Record<string, string[]>,
}

/**
 * Upload file to Cloudflare R2 with validation
 * @param formData - FormData with 'file' field
 */
export const uploadToR2Action = createSafeAction(
    'uploadToR2Action',
    z.instanceof(FormData),
    async (formData, metadata) => {
        const type = (formData.get('type') as 'product' | 'model' | 'proof') || 'product';
        const bucket = type === 'product' ? 'products' : type === 'model' ? 'product-models' : 'payment-proofs';

        // ✅ Additional Security: product/model uploads require admin
        if (['product', 'model'].includes(type)) {
            const { createClient } = await import('@/utils/supabase/server');
            const supabase = await createClient();
            const { data: { user } } = await supabase.auth.getUser();
            
            // This is a safety check because requireAdmin in safe-action might be false 
            // if we want to allow 'proof' for non-admins.
            const isAdmin = user?.email?.endsWith('@admin.com') || false; // Or your admin check logic
            if (!isAdmin) {
                throw new AuthError('Hanya admin yang dapat mengunggah produk atau model 3D.');
            }
        }

        const file = formData.get('file') as File;

        // ✅ Validate file exists
        if (!file || file.size === 0) {
            throw new Error('File tidak ditemukan');
        }

        // ✅ Validate file size
        if (file.size > R2_CONFIG.maxFileSize) {
            const maxSizeMB = (R2_CONFIG.maxFileSize / 1024 / 1024).toFixed(1);
            throw new Error(`File terlalu besar (Maksimal ${maxSizeMB}MB)`);
        }

        // ✅ Validate file extension
        const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
        const allowedExts = R2_CONFIG.allowedExtensions[bucket] || [];
        const extMatch = allowedExts.some((ext) => file.name.toLowerCase().endsWith(ext));

        if (!extMatch) {
            throw new Error(`Format file .${fileExt} tidak didukung. Harap gunakan: ${allowedExts.join(', ')}`);
        }

        // ✅ Read file buffer for magic number validation
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // ✅ Validate MIME type using magic numbers
        const fileType = await fileTypeFromBuffer(buffer);
        const actualMimeType = fileType?.mime || file.type;

        const allowedTypes = R2_CONFIG.allowedTypes[bucket] || [];
        const typeMatch = allowedTypes.includes(actualMimeType);

        if (!typeMatch) {
            throw new Error(`Tipe file ${actualMimeType} tidak diperbolehkan untuk bucket ini.`);
        }

        const fileName = `${Date.now()}-${crypto.randomUUID().replace(/-/g, '')}.${fileExt}`;
        const key = `${bucket}/${fileName}`;

        const result = await uploadToR2(buffer, key, actualMimeType);

        if (!result.success) {
            throw new Error(result.error || 'Gagal mengunggah ke R2');
        }

        return {
            url: result.url,
            fileName: fileName,
            size: file.size,
            storage: 'r2',
        };
    },
    { 
        // We allow 'proof' for non-admins, but we handle the 'product'/'model' check explicitly above
        requireAdmin: false 
    }
);

/**
 * Delete file from R2 (for admin dashboard)
 */
/**
 * Delete file from R2 (for admin dashboard)
 */
export const deleteFromR2Action = createSafeAction(
    'deleteFromR2Action',
    z.string(),
    async (key) => {
        const { deleteFromR2 } = await import('@/lib/r2-client');
        const success = await deleteFromR2(key);

        if (!success) {
            throw new Error('Gagal menghapus file dari R2');
        }

        return { success: true };
    }
);
