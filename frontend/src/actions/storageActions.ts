'use server'

import { createClient } from '@/utils/supabase/server'
import { fileTypeFromBuffer } from 'file-type'
import { logger } from '@/utils/logger'
import { createSafeAction } from '@/actions/safe-action'
import { z } from 'zod'

/**
 * Security Configuration for File Uploads
 */
const UPLOAD_CONFIG = {
    // Maximum file size: 5MB
    maxFileSize: 5 * 1024 * 1024,
    
    // Allowed MIME types per bucket
    allowedTypes: {
        products: ['image/jpeg', 'image/png', 'image/webp'],
        'product-models': ['model/gltf-binary'], // .glb files
    } as Record<string, string[]>,
    
    // Allowed file extensions
    allowedExtensions: {
        products: ['.jpg', '.jpeg', '.png', '.webp'],
        'product-models': ['.glb'],
    } as Record<string, string[]>,
}

/**
 * Secure file upload with comprehensive validation
 * ROUTING: Product images/models → R2, User uploads → Supabase
 * Note: Only admins should upload to 'products' or 'product-models'.
 */
export const uploadFile = createSafeAction(
    'uploadFile',
    z.instanceof(FormData),
    async (formData) => {
        const bucket = (formData.get('bucket') as string) || 'products';
        const storage = (formData.get('storage') as 'auto' | 'r2' | 'supabase') || 'auto';

        // ✅ Auto-routing: Products to R2, User uploads to Supabase
        const useR2 =
            storage === 'r2' ||
            (storage === 'auto' && ['products', 'product-models'].includes(bucket));

        if (useR2) {
            // Route to R2 for product images and 3D models
            const type = bucket === 'product-models' ? 'model' : 'product';
            const { uploadToR2Action } = await import('@/actions/uploadToR2');
            formData.append('type', type);
            return await uploadToR2Action(formData);
        }

        // Fall back to Supabase for user uploads (with RLS)
        return await uploadToSupabase(formData, bucket);
    },
    { 
        // We handle granular bucket permissions inside or via RLS
        // But for 'products' bucket, we should ideally require admin
        // For now, allow auth and handle logic internally or rely on RLS
        requireAdmin: false 
    }
);

/**
 * Upload to Supabase Storage (for user uploads with RLS)
 */
async function uploadToSupabase(formData: FormData, bucket: string) {
  const ACTION = 'uploadFile'
  
  try {
    const file = formData.get('file') as File

    // ✅ Validate file exists
    if (!file || file.size === 0) {
      return { success: false, error: 'No file provided' }
    }

    // ✅ Validate file size
    if (file.size > UPLOAD_CONFIG.maxFileSize) {
      const maxSizeMB = (UPLOAD_CONFIG.maxFileSize / 1024 / 1024).toFixed(2)
      return {
        success: false,
        error: `File size exceeds maximum allowed size of ${maxSizeMB}MB`,
      }
    }

    // ✅ Validate file extension
    const fileExt = file.name.split('.').pop()?.toLowerCase() || ''
        const allowedExts = UPLOAD_CONFIG.allowedExtensions[bucket] || [];
        const extMatch = allowedExts.some(ext => file.name.toLowerCase().endsWith(ext));
        
        if (!extMatch) {
            return { 
                success: false, 
                error: `File type .${fileExt} not allowed. Allowed types: ${allowedExts.join(', ')}` 
            }
        }

        // ✅ Read file buffer for magic number validation
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // ✅ Validate MIME type using magic numbers (not just file extension)
        const fileType = await fileTypeFromBuffer(buffer);
        const actualMimeType = fileType?.mime || file.type;
        
        const allowedTypes = UPLOAD_CONFIG.allowedTypes[bucket] || [];
        const typeMatch = allowedTypes.includes(actualMimeType);
        
        if (!typeMatch) {
            logger.warn(ACTION, 'MIME type mismatch', {
                bucket,
                fileName: file.name,
                claimedType: file.type,
                actualType: actualMimeType,
            });
            
            return { 
                success: false, 
                error: `File type ${actualMimeType} not allowed. Allowed types: ${allowedTypes.join(', ')}` 
            }
        }

        // ✅ Sanitize filename (remove path traversal attempts)
        const safeFileName = sanitizeFileName(file.name);
        
        // ✅ Generate unique filename with UUID-like pattern
        const fileName = `${Date.now()}-${crypto.randomUUID().replace(/-/g, '')}.${fileExt}`;
        const filePath = `${fileName}`;

        const supabase = await createClient()

        // Auto-provisioning: Check if bucket exists, create if not
        const { data: bucketData, error: bucketError } = await supabase.storage.getBucket(bucket)

        if ((bucketError && bucketError.message.includes('not found')) || !bucketData) {
            logger.info(ACTION, 'Bucket not found, attempting auto-create', { bucket });
            
            const { error: createError } = await supabase.storage.createBucket(bucket, { 
                public: true,
                fileSizeLimit: UPLOAD_CONFIG.maxFileSize,
            })
            
            if (createError) {
                logger.warn(ACTION, 'Auto-create bucket failed', { bucket, error: createError.message });
            }
        }

        // Upload to the bucket with proper metadata
        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, buffer, {
                contentType: actualMimeType,
                cacheControl: '3600',
                upsert: false,
            })

        if (uploadError) {
            logger.error(ACTION, 'Upload failed', { bucket, filePath, error: uploadError.message });
            return { success: false, error: uploadError.message }
        }

        // Get the public URL
        const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath)

        logger.info(ACTION, 'File uploaded successfully', {
            bucket,
            fileName,
            size: file.size,
            mimeType: actualMimeType,
        });

        return {
            success: true,
            publicUrl: data.publicUrl,
            fileName: fileName,
            size: file.size,
        }

    } catch (error) {
        logger.error(ACTION, 'Upload error', error);
        return { success: false, error: 'Internal Server Error during upload' }
    }
}

/**
 * Sanitize filename to prevent path traversal and other attacks
 */
function sanitizeFileName(filename: string): string {
    // Remove path traversal attempts
    let sanitized = filename.replace(/[/\\?%*:|"<>]/g, '-');
    
    // Remove null bytes
    sanitized = sanitized.replace(/\0/g, '');
    
    // Limit length (max 100 chars)
    if (sanitized.length > 100) {
        const ext = sanitized.split('.').pop() || '';
        const name = sanitized.split('.').slice(0, -1).join('.');
        sanitized = name.substring(0, 100 - ext.length - 1) + '.' + ext;
    }
    
    return sanitized;
}
