import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;

export const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('[DB Error] Unexpected error on idle PostgreSQL client:', err.message);
});

/**
 * Uji koneksi aktif ke PostgreSQL
 * Mengembalikan informasi database, versi, dan latensi tanpa membocorkan kredensial
 */
export async function testConnection() {
  const startTime = Date.now();
  try {
    const result = await pool.query(
      'SELECT current_database() as database, current_user as user, version() as version, NOW() as server_time;'
    );
    const latencyMs = Date.now() - startTime;
    const row = result.rows[0];

    return {
      connected: true,
      latencyMs,
      database: row.database,
      user: row.user,
      version: row.version.split(' on ')[0] || row.version,
      serverTime: row.server_time,
    };
  } catch (err) {
    return {
      connected: false,
      latencyMs: Date.now() - startTime,
      error: 'Gagal terhubung ke database PostgreSQL lokal',
      details: err.code || 'CONNECTION_ERROR',
    };
  }
}

export async function query(text, params) {
  return pool.query(text, params);
}
