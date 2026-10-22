import express from 'express';
import { env, validateEnv } from './src/config/env.js';
import { pool } from './src/config/db.js';
import { corsMiddleware } from './src/middleware/cors.js';
import { notFoundHandler, errorHandler } from './src/middleware/errorHandler.js';
import apiRoutes from './src/routes/index.js';

// Validasi konfigurasi environment saat startup
validateEnv();

const app = express();

// Global Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome check
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    service: 'RPLearn Backend Service',
    description: 'Aplikasi Pembelajaran Rekayasa Perangkat Lunak',
    documentation: '/api',
  });
});

// Seluruh REST API terpusat di /api
app.use('/api', apiRoutes);

// Error & 404 Handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Jalankan Express Server
const server = app.listen(env.PORT, () => {
  console.log(`[RPLearn Server] Berjalan pada port ${env.PORT} (http://localhost:${env.PORT})`);
  console.log(`[RPLearn Server] REST API Root: http://localhost:${env.PORT}/api`);
  console.log(`[RPLearn Server] Health check: http://localhost:${env.PORT}/api/health`);
  console.log(`[RPLearn Server] Database: ${env.DB_NAME}@${env.DB_HOST}:${env.DB_PORT}`);
});

// Keepalive timer untuk stabilitas event loop process
const keepAliveTimer = setInterval(() => {}, 1000 * 60 * 60);

// Graceful Shutdown
function handleShutdown(signal) {
  console.log(`\n[RPLearn Server] Menerima sinyal ${signal}. Menutup server dan koneksi pool database...`);
  clearInterval(keepAliveTimer);
  server.close(async () => {
    try {
      await pool.end();
      console.log('[RPLearn Server] Koneksi database berhasil ditutup dengan aman.');
    } catch (err) {
      console.error('[RPLearn Server Error] Gagal menutup koneksi database:', err.message);
    }
    process.exit(0);
  });
}

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

export default app;
