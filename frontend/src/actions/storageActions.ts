'use server'

import { createClient } from '@/utils/supabase/server'

export async function uploadFile(formData: FormData, bucket: string = 'products') {
    try {
        const file = formData.get('file') as File

        if (!file || file.size === 0) {
            return { success: false, error: 'No file provided' }
        }

        const supabase = await createClient()

        // Create a unique filename
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `uploads/${fileName}`

        // Auto-provisioning: Check if bucket exists, create if not
        const { data: bucketData, error: bucketError } = await supabase.storage.getBucket(bucket)

        if (bucketError && bucketError.message.includes('not found') || !bucketData) {
            console.log(`Bucket '${bucket}' not found. Attempting to auto-create...`)
            const { error: createError } = await supabase.storage.createBucket(bucket, { public: true })
            if (createError) {
                console.warn('Auto-create bucket failed:', createError.message)
            }
        }

        // Upload to the bucket
        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file)

        if (uploadError) {
            console.error('Upload Error:', uploadError)
            return { success: false, error: uploadError.message }
        }

        // Get the public URL
        const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath)

        return {
            success: true,
            publicUrl: data.publicUrl
        }

    } catch (error) {
        console.error('Storage action failed:', error)
        return { success: false, error: 'Internal Server Error during upload' }
    }
}
