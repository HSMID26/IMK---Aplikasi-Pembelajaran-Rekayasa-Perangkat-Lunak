import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  const migrationsDir = path.join(__dirname, 'migrations');
  console.log('🚀 Memulai proses migrasi database...');

  try {
    const files = fs.readdirSync(migrationsDir).filter((file) => file.endsWith('.sql')).sort();

    if (files.length === 0) {
      console.log('ℹ️ Tidak ada file migrasi yang ditemukan di folder migrations.');
      return;
    }

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      console.log(`⏳ Menjalankan migrasi: ${file}`);
      const sql = fs.readFileSync(filePath, 'utf-8');
      await pool.query(sql);
      console.log(`✅ Berhasil: ${file}`);
    }

    console.log('🎉 Semua migrasi berhasil dijalankan!');
  } catch (err) {
    console.error('❌ Terjadi kesalahan saat migrasi:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();
