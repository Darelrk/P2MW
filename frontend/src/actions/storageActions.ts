'use server'

import { createClient } from '@/utils/supabase/server'

export async function uploadImage(formData: FormData) {
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
        const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('products')

        if (bucketError && bucketError.message.includes('not found') || !bucketData) {
            console.log("Bucket 'products' not found. Attempting to auto-create...")
            const { error: createError } = await supabase.storage.createBucket('products', { public: true })
            if (createError) {
                console.warn('Auto-create bucket failed (Ensure your API Key has admin privileges):', createError.message)
            } else {
                console.log("Bucket 'products' created successfully!")
            }
        }

        // Upload to the 'products' bucket
        const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(filePath, file)

        if (uploadError) {
            console.error('Upload Error:', uploadError)
            return { success: false, error: uploadError.message }
        }

        // Get the public URL for the uploaded file
        const { data } = supabase.storage
            .from('products')
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
