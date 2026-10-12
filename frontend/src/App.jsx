import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  const [supabaseStatus, setSupabaseStatus] = useState('Memeriksa...');
  const [backendStatus, setBackendStatus] = useState('Memeriksa...');

  const isSupabaseConfigured =
    import.meta.env.VITE_SUPABASE_URL &&
    !import.meta.env.VITE_SUPABASE_URL.includes('your-project-id');

  useEffect(() => {
    // Cek konfigurasi Supabase
    if (isSupabaseConfigured) {
      setSupabaseStatus('Terkonfigurasi (Kredensial terdeteksi di .env)');
    } else {
      setSupabaseStatus('Belum dikonfigurasi (Isi VITE_SUPABASE_URL dan KEY di frontend/.env)');
    }

    // Cek koneksi ke Express backend
    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    fetch(`${backendUrl}/health`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok') {
          setBackendStatus('Aktif (Terkoneksi ke Express API)');
        } else {
          setBackendStatus('Respon tidak dikenal');
        }
      })
      .catch(() => {
        setBackendStatus('Tidak aktif (Jalankan server backend: npm run dev:backend)');
      });
  }, [isSupabaseConfigured]);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#2563eb', marginBottom: '0.5rem' }}>
          Aplikasi Pembelajaran Rekayasa Perangkat Lunak
        </h1>
        <p style={{ color: '#64748b' }}>
          Interaksi Manusia & Komputer (IMK) • React.js (Vite) + Express.js + Supabase
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {/* Card Frontend */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', background: '#f8fafc' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#0f172a', marginTop: 0 }}>🎨 Frontend (React + Vite)</h2>
          <p style={{ fontSize: '0.9rem', color: '#334155' }}>
            Status: <span style={{ color: '#16a34a', fontWeight: 'bold' }}>Siap & Aktif</span>
          </p>
          <ul style={{ paddingLeft: '1.2rem', color: '#475569', fontSize: '0.85rem' }}>
            <li>React 19 + Vite</li>
            <li>Supabase JS Client terpasang</li>
            <li>File env: <code>frontend/.env</code></li>
          </ul>
        </div>

        {/* Card Backend */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', background: '#f8fafc' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#0f172a', marginTop: 0 }}>⚙️ Backend (Express.js)</h2>
          <p style={{ fontSize: '0.9rem', color: '#334155' }}>
            Status:{' '}
            <span
              style={{
                color: backendStatus.includes('Aktif') ? '#16a34a' : '#ea580c',
                fontWeight: 'bold',
              }}
            >
              {backendStatus}
            </span>
          </p>
          <ul style={{ paddingLeft: '1.2rem', color: '#475569', fontSize: '0.85rem' }}>
            <li>Express 5 + CORS + Dotenv</li>
            <li>Port default: 5000</li>
            <li>Jalankan: <code>npm run dev:backend</code></li>
          </ul>
        </div>

        {/* Card Supabase */}
        <div style={{ gridColumn: '1 / -1', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', background: '#f8fafc' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#0f172a', marginTop: 0 }}>🗄️ Database (Supabase)</h2>
          <p style={{ fontSize: '0.9rem', color: '#334155' }}>
            Status:{' '}
            <span
              style={{
                color: isSupabaseConfigured ? '#16a34a' : '#d97706',
                fontWeight: 'bold',
              }}
            >
              {supabaseStatus}
            </span>
          </p>
          <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.5rem' }}>
            Untuk mengaktifkan fitur autentikasi & database Supabase, masukkan URL dan Anon Key proyek Supabase Anda ke dalam file <code>.env</code> di frontend dan backend.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
