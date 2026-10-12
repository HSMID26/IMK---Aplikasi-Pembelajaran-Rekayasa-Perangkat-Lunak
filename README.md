# IMK - Aplikasi Pembelajaran Rekayasa Perangkat Lunak

Aplikasi pembelajaran berbasis web untuk mata kuliah Interaksi Manusia dan Komputer (IMK), dibangun dengan arsitektur decoupled (Frontend & Backend terpisah) serta terintegrasi dengan database cloud Supabase.

---

## 📁 Struktur Direktori

```text
IMK---Aplikasi-Pembelajaran-Rekayasa-Perangkat-Lunak/
├── frontend/                     # Client Application (React.js + Vite)
│   ├── src/
│   │   ├── assets/               # Gambar dan aset statis
│   │   ├── App.jsx               # Komponen utama React
│   │   ├── main.jsx              # Entry point React
│   │   └── supabaseClient.js     # Inisialisasi klien Supabase di Frontend
│   ├── .env                      # Variabel lingkungan frontend (lokal)
│   ├── .env.example              # Template variabel lingkungan frontend
│   └── package.json              # Dependensi React, Vite, & @supabase/supabase-js
│
├── backend/                      # Server Application (Express.js)
│   ├── config/
│   │   └── supabaseClient.js     # Inisialisasi klien Supabase di Backend
│   ├── server.js                 # Entry point Express API & endpoints
│   ├── .env                      # Variabel lingkungan backend (lokal)
│   ├── .env.example              # Template variabel lingkungan backend
│   └── package.json              # Dependensi Express, CORS, Dotenv, & Supabase
│
├── .gitignore                    # Mengabaikan node_modules, .env, build artifacts
├── package.json                  # Script root untuk menjalankan frontend & backend
└── README.md                     # Dokumentasi proyek
```

---

## 🚀 Cara Menjalankan Proyek

### 1. Prasyarat
- **Node.js** (v18 ke atas, teruji di v24)
- **npm** (v9 ke atas, teruji di v11)

### 2. Menjalankan Backend (Express.js)
```bash
cd backend
npm run dev
# Server berjalan di http://localhost:5000
```

### 3. Menjalankan Frontend (React Vite)
```bash
cd frontend
npm run dev
# Frontend berjalan di http://localhost:5173
```

Atau dari root folder proyek:
```bash
npm run dev:backend   # Menjalankan backend
npm run dev:frontend  # Menjalankan frontend
```

---

## 🔑 Konfigurasi Supabase (.env)

Dapatkan URL dan API Key dari [Supabase Dashboard](https://supabase.com/dashboard) pada menu **Project Settings > API**.

### Frontend (`frontend/.env`)
```env
VITE_SUPABASE_URL=https://<project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
VITE_API_BASE_URL=http://localhost:5000/api
```

### Backend (`backend/.env`)
```env
PORT=5000
SUPABASE_URL=https://<project-id>.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```
