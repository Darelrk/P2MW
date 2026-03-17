import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Rate Limiting Configuration for AMOUREA
 * Optimized for Vercel deployment with low traffic (< 1000 visitors/day)
 */
const RATE_LIMITS = {
    // Authentication endpoints - strict (prevent brute force)
    auth: { windowMs: 15 * 60 * 1000, max: 5 }, // 5 attempts per 15 minutes
    
    // General API endpoints
    api: { windowMs: 15 * 60 * 1000, max: 100 }, // 100 requests per 15 minutes
    
    // Admin actions
    admin: { windowMs: 15 * 60 * 1000, max: 50 }, // 50 requests per 15 minutes
    
    // Order creation (prevent spam)
    orders: { windowMs: 60 * 60 * 1000, max: 20 }, // 20 orders per hour
    
    // File uploads
    upload: { windowMs: 60 * 60 * 1000, max: 10 }, // 10 uploads per hour
};

/**
 * In-memory store for rate limiting
 * Perfect for Vercel serverless + low traffic
 * For high traffic, consider using Redis (Upstash)
 */
const requestStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Get unique client identifier
 * Prioritizes user ID if authenticated, falls back to IP
 */
function getClientId(request: NextRequest): string {
    // Check for user ID from auth middleware
    const userId = request.headers.get('x-user-id');
    if (userId) {
        return `user:${userId}`;
    }
    
    // Fallback to IP address
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    return `ip:${ip}`;
}

/**
 * Determine rate limit category based on request path
 */
function getEndpointCategory(pathname: string): keyof typeof RATE_LIMITS {
    // Auth endpoints - most strict
    if (pathname.includes('/api/auth/') || pathname.includes('/login')) {
        return 'auth';
    }
    
    // File uploads
    if (pathname.includes('/api/upload') || pathname.includes('/api/storage')) {
        return 'upload';
    }
    
    // Order creation
    if (pathname.includes('/api/orders') || pathname.includes('/checkout')) {
        return 'orders';
    }
    
    // Admin endpoints
    if (pathname.includes('/admin/') || pathname.includes('/api/admin')) {
        return 'admin';
    }
    
    // Default API rate limit
    return 'api';
}

/**
 * Rate limiting middleware
 * Returns 429 response if limit exceeded, otherwise continues
 */
export async function rateLimitMiddleware(request: NextRequest): Promise<NextResponse | null> {
    const clientId = getClientId(request);
    const category = getEndpointCategory(request.nextUrl.pathname);
    const limit = RATE_LIMITS[category];
    
    const now = Date.now();
    const stored = requestStore.get(clientId);
    
    // Initialize or reset window if expired
    if (!stored || now > stored.resetTime) {
        requestStore.set(clientId, {
            count: 1,
            resetTime: now + limit.windowMs,
        });
        return null; // Continue to next middleware
    }
    
    // Check if limit exceeded
    if (stored.count >= limit.max) {
        const retryAfter = Math.ceil((stored.resetTime - now) / 1000);
        
        logger.warn('rate_limit', 'Rate limit exceeded', {
            clientId,
            category,
            limit: limit.max,
            retryAfter,
            path: request.nextUrl.pathname,
        });
        
        return new NextResponse(
            JSON.stringify({
                error: 'Too many requests',
                message: `Rate limit exceeded for ${category} endpoints. Please try again later.`,
                retryAfter: retryAfter,
            }),
            {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'X-RateLimit-Limit': limit.max.toString(),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': Math.ceil(stored.resetTime / 1000).toString(),
                    'Retry-After': retryAfter.toString(),
                },
            },
        );
    }
    
    // Increment counter
    stored.count++;
    requestStore.set(clientId, stored);
    
    return null; // Continue to next middleware
}

/**
 * Simple logger for rate limiting events
 */
const logger = {
    warn: (action: string, message: string, data: any) => {
        if (process.env.NODE_ENV === 'development') {
            console.warn(`[RateLimit] ${message}`, data);
        }
        // In production, this would integrate with your logging service
    },
};
