import imageCompression from 'browser-image-compression';
import { createClient } from '@/utils/supabase/client';

export const COMPRESSION_OPTIONS = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/webp'
};

/**
 * Compresses an image file using browser-image-compression.
 */
export async function compressImage(file: File): Promise<File> {
    try {
        return await imageCompression(file, COMPRESSION_OPTIONS);
    } catch (error) {
        console.error('Image compression failed:', error);
        return file; // Fallback to original file
    }
}

/**
 * Uploads a file to Supabase Storage.
 */
export async function uploadFile(
    file: File, 
    bucket: string, 
    pathPrefix: string = 'uploads'
): Promise<string> {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${pathPrefix}/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

    if (uploadError) {
        throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

    return publicUrl;
}
