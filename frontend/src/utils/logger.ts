/**
 * Structured logger for AMOUREA backend actions.
 * Provides consistent formatting and metadata for easier debugging.
 */

type LogLevel = 'info' | 'warn' | 'error';

class Logger {
    private formatMessage(level: LogLevel, action: string, message: string, meta?: any) {
        const timestamp = new Date().toISOString();
        const metaStr = meta ? ` | Meta: ${JSON.stringify(meta)}` : '';
        return `[${timestamp}] [${level.toUpperCase()}] [${action}] ${message}${metaStr}`;
    }

    info(action: string, message: string, meta?: any) {
        console.log(this.formatMessage('info', action, message, meta));
    }

    warn(action: string, message: string, meta?: any) {
        console.warn(this.formatMessage('warn', action, message, meta));
    }

    error(action: string, message: string, error?: any, meta?: any) {
        const errorMsg = error instanceof Error ? error.stack || error.message : JSON.stringify(error);
        console.error(this.formatMessage('error', action, message, { ...meta, error: errorMsg }));
    }

    security(action: string, message: string, meta?: any) {
        // Security logs are treated as warnings but with a special prefix
        console.warn(this.formatMessage('warn', `SECURITY:${action}`, message, meta));
    }
}

export const logger = new Logger();
