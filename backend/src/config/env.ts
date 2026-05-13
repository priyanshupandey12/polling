export const env = {
    PORT: process.env.PORT || 5000,
    DATABASE_URL: process.env.DATABASE_URL!,
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET!,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
    ACCESS_TOKEN_EXPIRES_IN: (process.env.ACCESS_TOKEN_EXPIRES_IN || '15m') as string,
    REFRESH_TOKEN_EXPIRES_IN: (process.env.REFRESH_TOKEN_EXPIRES_IN || '7d') as string,
} as const;