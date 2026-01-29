import dotenv from 'dotenv';
import { createServer } from './infrastructure/http/server';
import { config } from './shared/constants/config';

// Load environment variables
dotenv.config();

const startServer = async () => {
  try {
    const app = createServer();

    const server = app.listen(config.port, () => {
      console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║     Analytics Dashboard API Server                     ║
║                                                        ║
║     Environment: ${config.nodeEnv.padEnd(36)}║
║     Port: ${config.port.toString().padEnd(43)}║
║     URL: http://localhost:${config.port.toString().padEnd(27)}║
║                                                        ║
║     Mock Data: ${config.mockDataSize.toString().padEnd(38)}events ║
║     Cache TTL: ${config.cacheTTL.toString().padEnd(38)}seconds ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
