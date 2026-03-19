import 'server-only';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';
import { AuthError, ValidationError, AppError } from '@/lib/errors';
import { logger } from '@/utils/logger';

/**
 * Metadata untuk logging audit keamanan.
 */
interface ActionMetadata {
    actionName: string;
    userId?: string;
}

/**
 * Wrapper untuk membuat Server Action yang aman.
 * Menangani Autentikasi, Validasi, Logging, dan Error Masking.
 */
export function createSafeAction<TInput, TOutput>(
    actionName: string,
    schema: z.Schema<TInput>,
    handler: (data: TInput, metadata: ActionMetadata) => Promise<TOutput>,
    options: { requireAdmin?: boolean } = { requireAdmin: true }
) {
    return async (rawInput?: unknown): Promise<{ data?: TOutput; error?: string }> => {
        try {
            // 1. Get User Session
            const supabase = await createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (options.requireAdmin && !user) {
                throw new AuthError('Sesi tidak valid atau telah berakhir. Silakan login kembali.');
            }

            // 2. Input Validation (Zod)
            const result = schema.safeParse(rawInput);
            if (!result.success) {
                const message = result.error.issues.map((e: any) => e.message).join(', ');
                throw new ValidationError(message);
            }

            // 3. Metadata for Logging
            const metadata: ActionMetadata = {
                actionName,
                userId: user?.id
            };

            // 4. Action Execution
            const output = await handler(result.data, metadata);

            // 5. Success Audit Log
            logger.info(`SECURITY_AUDIT:${actionName}`, 'Action sukses', { userId: user?.id });

            return { data: output };

        } catch (error: any) {
            const errorMessage = error instanceof AppError ? error.message : 'Terjadi kesalahan internal server';
            
            // Log full error on server
            logger.error(`SECURITY_AUDIT:${actionName}`, 'Action gagal', error, { 
                type: error.name,
                code: error.code 
            });

            return { error: errorMessage };
        }
    };
}
