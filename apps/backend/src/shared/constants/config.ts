export const config = {
  // Server
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // CORS
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],

  // Cache
  cacheTTL: parseInt(process.env.CACHE_TTL_SECONDS || '300', 10),
  cacheCheckPeriod: parseInt(process.env.CACHE_CHECK_PERIOD_SECONDS || '60', 10),

  // Data Generation
  mockDataSize: parseInt(process.env.MOCK_DATA_SIZE || '5000', 10),
  mockDataMonths: parseInt(process.env.MOCK_DATA_MONTHS || '12', 10),
} as const;

export type Config = typeof config;
