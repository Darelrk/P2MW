'use server'

import { uploadToR2 } from '@/lib/r2-client'
import { fileTypeFromBuffer } from 'file-type'
import { logger } from '@/utils/logger'

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
 * @param type - 'product' for images, 'model' for 3D models, 'proof' for payment proofs
 * @returns Upload result with public URL
 */
export async function uploadToR2Action(
  formData: FormData,
  type: 'product' | 'model' | 'proof' = 'product'
) {
  const ACTION = 'uploadToR2Action'
  const bucket = type === 'product' ? 'products' : type === 'model' ? 'product-models' : 'payment-proofs'

  try {
    const file = formData.get('file') as File

    // ✅ Validate file exists
    if (!file || file.size === 0) {
      return { success: false, error: 'No file provided' }
    }

    // ✅ Validate file size (10MB for R2)
    if (file.size > R2_CONFIG.maxFileSize) {
      const maxSizeMB = (R2_CONFIG.maxFileSize / 1024 / 1024).toFixed(1)
      return {
        success: false,
        error: `File size exceeds maximum allowed size of ${maxSizeMB}MB`,
      }
    }

    // ✅ Validate file extension
    const fileExt = file.name.split('.').pop()?.toLowerCase() || ''
    const allowedExts = R2_CONFIG.allowedExtensions[bucket] || []
    const extMatch = allowedExts.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    )

    if (!extMatch) {
      return {
        success: false,
        error: `File type .${fileExt} not allowed. Allowed types: ${allowedExts.join(', ')}`,
      }
    }

    // ✅ Read file buffer for magic number validation
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // ✅ Validate MIME type using magic numbers
    const fileType = await fileTypeFromBuffer(buffer)
    const actualMimeType = fileType?.mime || file.type

    const allowedTypes = R2_CONFIG.allowedTypes[bucket] || []
    const typeMatch = allowedTypes.includes(actualMimeType)

    if (!typeMatch) {
      logger.warn(ACTION, 'MIME type mismatch', {
        bucket,
        fileName: file.name,
        claimedType: file.type,
        actualType: actualMimeType,
      })

      return {
        success: false,
        error: `File type ${actualMimeType} not allowed. Allowed types: ${allowedTypes.join(', ')}`,
      }
    }

    // ✅ Generate unique filename with UUID
    const fileName = `${Date.now()}-${crypto.randomUUID().replace(/-/g, '')}.${fileExt}`
    const key = `${bucket}/${fileName}`

    // ✅ Upload to R2
    const result = await uploadToR2(buffer, key, actualMimeType)

    if (result.success) {
      logger.info(ACTION, 'File uploaded to R2 successfully', {
        bucket,
        fileName,
        key,
        size: file.size,
        mimeType: actualMimeType,
      })

      return {
        success: true,
        publicUrl: result.url,
        fileName: fileName,
        size: file.size,
        storage: 'r2',
      }
    } else {
      return {
        success: false,
        error: result.error,
      }
    }
  } catch (error: any) {
    logger.error(ACTION, 'R2 upload error', error)
    return { success: false, error: 'Internal Server Error during R2 upload' }
  }
}

/**
 * Delete file from R2 (for admin dashboard)
 */
export async function deleteFromR2Action(key: string) {
  const ACTION = 'deleteFromR2Action'

  try {
    const { deleteFromR2 } = await import('@/lib/r2-client')
    const success = await deleteFromR2(key)

    if (success) {
      logger.info(ACTION, 'File deleted from R2', { key })
      return { success: true }
    } else {
      return { success: false, error: 'Failed to delete file from R2' }
    }
  } catch (error: any) {
    logger.error(ACTION, 'R2 delete error', error)
    return { success: false, error: 'Failed to delete file' }
  }
}
