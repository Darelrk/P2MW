/**
 * Custom error classes for fine-grained error handling.
 */

export class AppError extends Error {
    constructor(public message: string, public code: string = 'INTERNAL_ERROR', public statusCode: number = 500) {
        super(message);
        this.name = 'AppError';
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 'VALIDATION_ERROR', 400);
        this.name = 'ValidationError';
    }
}

export class AuthError extends AppError {
    constructor(message: string = 'Unauthorized access') {
        super(message, 'AUTH_ERROR', 401);
        this.name = 'AuthError';
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string) {
        super(`${resource} not found`, 'NOT_FOUND', 404);
        this.name = 'NotFoundError';
    }
}
