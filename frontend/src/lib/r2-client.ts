import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3'

/**
 * Cloudflare R2 Client Configuration
 * Uses S3-compatible API for R2 storage
 */
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

/**
 * Upload file to R2 bucket
 */
export async function uploadToR2(
  file: File | ArrayBuffer | Buffer,
  key: string,
  contentType?: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const bucket = process.env.R2_BUCKET_NAME

    if (!bucket) {
      return {
        success: false,
        error: 'R2_BUCKET_NAME not configured',
      }
    }

    // Convert to Buffer
    let buffer: Buffer
    if (Buffer.isBuffer(file)) {
      buffer = file
    } else if (file instanceof ArrayBuffer) {
      buffer = Buffer.from(file)
    } else {
      // File type - has arrayBuffer method
      const arrayBuffer = await (file as File).arrayBuffer()
      buffer = Buffer.from(arrayBuffer)
    }

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType || (file instanceof File ? file.type : undefined),
    })

    await r2Client.send(command)

    // Generate public URL
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`

    return {
      success: true,
      url: publicUrl,
    }
  } catch (error: any) {
    console.error('R2 upload error:', error)
    return {
      success: false,
      error: error.message || 'Failed to upload to R2',
    }
  }
}

/**
 * Download file from R2 bucket
 */
export async function downloadFromR2(key: string): Promise<Buffer | null> {
  try {
    const bucket = process.env.R2_BUCKET_NAME

    if (!bucket) {
      return null
    }

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })

    const response = await r2Client.send(command)
    const arrayBuffer = await response.Body?.transformToByteArray()

    if (!arrayBuffer) {
      return null
    }

    return Buffer.from(arrayBuffer)
  } catch (error: any) {
    console.error('R2 download error:', error)
    return null
  }
}

/**
 * Delete file from R2 bucket
 */
export async function deleteFromR2(key: string): Promise<boolean> {
  try {
    const bucket = process.env.R2_BUCKET_NAME

    if (!bucket) {
      return false
    }

    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })

    await r2Client.send(command)
    return true
  } catch (error: any) {
    console.error('R2 delete error:', error)
    return false
  }
}

/**
 * List files in R2 bucket (optional, for admin dashboard)
 */
export async function listR2Files(prefix?: string): Promise<
  Array<{ key: string; size: number; lastModified: Date }>
> {
  try {
    const bucket = process.env.R2_BUCKET_NAME

    if (!bucket) {
      return []
    }

    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
    })

    const response = await r2Client.send(command)
    const files = response.Contents?.map((obj) => ({
      key: obj.Key!,
      size: obj.Size || 0,
      lastModified: obj.LastModified || new Date(),
    }))

    return files || []
  } catch (error: any) {
    console.error('R2 list error:', error)
    return []
  }
}

/**
 * Generate signed URL for private file access (optional)
 * Note: R2 doesn't support signed URLs natively yet
 * Use Cloudflare Workers for signed URL generation if needed
 */
export function getR2PublicUrl(key: string): string {
  return `${process.env.R2_PUBLIC_URL}/${key}`
}
