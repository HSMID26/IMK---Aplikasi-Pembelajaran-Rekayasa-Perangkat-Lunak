import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSeeds() {
  const seedsDir = path.join(__dirname, 'seeds');
  console.log('🌱 Memulai proses seeding data...');

  try {
    const files = fs.readdirSync(seedsDir).filter((file) => file.endsWith('.sql')).sort();

    if (files.length === 0) {
      console.log('ℹ️ Tidak ada file seed yang ditemukan di folder seeds.');
      return;
    }

    for (const file of files) {
      const filePath = path.join(seedsDir, file);
      console.log(`⏳ Menjalankan seed: ${file}`);
      const sql = fs.readFileSync(filePath, 'utf-8');
      await pool.query(sql);
      console.log(`✅ Berhasil seeding: ${file}`);
    }

    console.log('🎉 Semua data seed berhasil dimasukkan!');
  } catch (err) {
    console.error('❌ Terjadi kesalahan saat seeding:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runSeeds();
