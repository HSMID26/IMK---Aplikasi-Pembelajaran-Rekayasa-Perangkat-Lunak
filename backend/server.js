import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import supabase from './config/supabaseClient.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Backend API IMK - Aplikasi Pembelajaran RPL berjalan aktif'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Endpoint uji coba koneksi Supabase
app.get('/api/supabase-test', async (req, res) => {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      return res.status(500).json({
        status: 'error',
        message: 'Variabel SUPABASE_URL atau SUPABASE_ANON_KEY belum diisi di file .env'
      });
    }

    // Melakukan query ringan untuk verifikasi koneksi Supabase
    const { data, error } = await supabase.from('users').select('*').limit(1);

    if (error && error.code !== 'PGRST116') {
      return res.status(200).json({
        status: 'connected_with_notice',
        message: 'Koneksi ke Supabase berhasil, namun tabel "users" belum dibuat atau izin akses dibatasi.',
        supabaseError: error.message
      });
    }

    return res.status(200).json({
      status: 'connected',
      message: 'Berhasil terhubung ke Supabase!',
      data
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal terhubung ke Supabase',
      error: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server Express berjalan pada port ${PORT} (http://localhost:${PORT})`);
});
