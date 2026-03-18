import { NextRequest, NextResponse } from 'next/server';
import { r2Client, R2_BUCKET_NAME } from '@/lib/r2-client';
import { GetObjectCommand } from '@aws-sdk/client-s3';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const resolvedParams = await params;
        const key = resolvedParams.path.join('/');
        
        console.log(`[R2 Proxy] Fetching from S3 API: ${key} in bucket ${R2_BUCKET_NAME}`);

        if (!R2_BUCKET_NAME) {
            console.error('[R2 Proxy] R2_BUCKET_NAME is not defined');
            return new NextResponse('R2 Configuration Missing', { status: 500 });
        }

        const command = new GetObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
        });

        const { Body, ContentType } = await r2Client.send(command);

        if (!Body) {
            console.error(`[R2 Proxy] Asset ${key} not found in bucket`);
            return new NextResponse('Asset Not Found', { status: 404 });
        }

        // Convert the readable stream to a response
        // @ts-ignore - The stream type from SDK can be converted to readable stream
        return new NextResponse(Body.transformToWebStream(), {
            headers: {
                'Content-Type': ContentType || 'application/octet-stream',
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error: any) {
        if (error.name === 'NoSuchKey') {
            return new NextResponse('Asset Not Found', { status: 404 });
        }
        console.error('[R2 Proxy] S3 Error:', error);
        return new NextResponse(`Internal Server Error: ${error.message || 'Unknown error'}`, { status: 500 });
    }
}
