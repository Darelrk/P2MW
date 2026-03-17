import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/auth-middleware'
import { rateLimitMiddleware } from './middleware/rateLimit'

export async function middleware(request: NextRequest) {
    // Apply rate limiting first (before session management)
    const rateLimitResponse = await rateLimitMiddleware(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }
    
    // Then apply session management
    return await updateSession(request);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
