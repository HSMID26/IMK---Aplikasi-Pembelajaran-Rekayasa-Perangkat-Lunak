import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 3000,
  DB_HOST: process.env.DB_HOST || '127.0.0.1',
  DB_PORT: parseInt(process.env.DB_PORT, 10) || 5432,
  DB_NAME: process.env.DB_NAME || 'rplearn',
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  JWT_SECRET: process.env.JWT_SECRET || 'rplearn_fallback_secret_key_change_in_production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  AI_API_KEY: process.env.AI_API_KEY || null,
};

// Validasi environment penting saat startup
export function validateEnv() {
  const warnings = [];

  if (!process.env.PORT) {
    warnings.push('PORT tidak disetel, menggunakan port default 3000');
  }
  if (!process.env.DB_NAME) {
    warnings.push('DB_NAME tidak disetel, menggunakan default "rplearn"');
  }
  if (!process.env.JWT_SECRET) {
    warnings.push('JWT_SECRET tidak disetel di .env, menggunakan default dev key');
  }

  if (warnings.length > 0 && env.NODE_ENV !== 'test') {
    warnings.forEach((warn) => console.info(`[RPLearn Config Info] ${warn}`));
  }
}
