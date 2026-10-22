# RPLearn - Aplikasi Pembelajaran Rekayasa Perangkat Lunak

Aplikasi pembelajaran berbasis web untuk mendukung pemahaman materi kuliah **Rekayasa Perangkat Lunak (RPL)** mahasiswa, dirancang mengacu pada **Hierarchical Task Analysis (HTA) RPLearn**.

---

## 🛠️ Arsitektur & Teknologi

- **Runtime & Bahasa**: Node.js v24 LTS (JavaScript ES6+ / ES Modules)
- **Backend Framework**: Express.js 5
- **Database Engine**: PostgreSQL v17 (v17.2 lokal via Laragon, Port 5432)
- **Database Driver**: `pg` Connection Pool
- **Frontend Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 & CSS3
- **Keamanan**: Bcrypt password hashing, JWT Bearer Token, Server-side Exam Evaluation

---

## 📋 Struktur HTA RPLearn (Hierarchical Task Analysis)

Sistem dibangun berdasarkan 5 Task utama HTA:
1. **Task 1: Registrasi** — Pembuatan akun baru dengan validasi data dan pengecekan keunikan email.
2. **Task 2: Login** — Autentikasi mahasiswa menggunakan email dan kata sandi dengan token JWT.
3. **Task 3: Materi RPL** — Pembelajaran 12 Pertemuan sesuai RPS (Introduction to SE, Agility, Requirements Modeling, Architecture, UX & Component Design, SQA, Security, Component & Integration Testing).
4. **Task 4: Latihan dan Evaluasi** — 12 Exam Check per pertemuan dan 1 Final Exam komprehensif, dengan penilaian skor server-side dan evaluasi kunci jawaban/pembahasan pasca-submit.
5. **Task 5: AI Chatbot** — Asisten interaktif tanya-jawab materi RPL dan riwayat percakapan.

---

## 📁 Struktur Direktori

```text
IMK---Aplikasi-Pembelajaran-Rekayasa-Perangkat-Lunak/
├── frontend/                     # Client Application (React 19 + Vite 8 + Tailwind CSS v4)
│   ├── src/
│   │   ├── components/           # Komponen modular UI (Header, StatusCards, MeetingList, Chatbot)
│   │   ├── services/             # api.js terpusat untuk komunikasi REST API
│   │   ├── App.jsx               # Orchestrator halaman utama
│   │   └── main.jsx
│   ├── .env                      # VITE_API_BASE_URL=http://localhost:3000/api
│   └── package.json
│
├── backend/                      # Server Application (Node.js 24 + Express 5)
│   ├── database/                 # Migrasi & Seeding Data RPLearn
│   │   ├── migrations/           # 001_create_rplearn_schema.sql
│   │   ├── seeds/                # 001_seed_rplearn.sql (12 Pertemuan, Ujian, Soal)
│   │   ├── migrate.js            # Runner migrasi SQL
│   │   └── seed.js               # Runner seed data
│   ├── src/
│   │   ├── config/               # db.js (pg Pool) & env.js
│   │   ├── controllers/          # authController, materialController, examController, chatController
│   │   ├── middleware/           # auth.js (JWT), cors.js, errorHandler.js
│   │   ├── routes/               # index.js, authRoutes, materialRoutes, examRoutes, chatRoutes
│   │   └── services/             # healthService.js, aiService.js
│   ├── test/
│   │   └── rplearn.test.js       # Test suite otomatis (7/7 skenario lulus)
│   ├── server.js                 # Entry point Express API
│   ├── .env                      # DB_NAME=rplearn, JWT_SECRET, PORT=3000
│   └── package.json
│
├── package.json                  # Root runner scripts untuk seluruh tim
└── README.md
```

---

## 🚀 Panduan Eksekusi

### 1. Prasyarat
- **Laragon**: Pastikan service PostgreSQL aktif di port 5432 (Klik *Start All*).
- **Node.js**: v24.x LTS.

### 2. Setup Database Otomatis
```bash
# Jalankan migrasi tabel skema RPLearn
npm run db:migrate

# Masukkan 12 materi pertemuan, ujian, dan soal awal
npm run db:seed
```

### 3. Menjalankan Backend & Frontend
Buka 2 terminal:
```bash
# Terminal 1 - Backend REST API (Port 3000)
npm run dev:backend

# Terminal 2 - Frontend Client (Port 5173)
npm run dev:frontend
```

### 4. Menjalankan Pengujian (Testing)
```bash
npm run test:backend
```
---

## 📡 Dokumentasi Endpoint REST API

| Domain | Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|---|
| **System** | `GET` | `/api/health` | Uji kesehatan Express & PostgreSQL | Public |
| **Auth** | `POST` | `/api/auth/register` | Pendaftaran akun mahasiswa/dosen | Public |
| **Auth** | `POST` | `/api/auth/login` | Login dan penerbitan token JWT | Public |
| **Auth** | `GET` | `/api/auth/me` | Profil pengguna saat ini | Bearer JWT |
| **Materials** | `GET` | `/api/meetings` | Daftar 12 Pertemuan RPL | Public |
| **Materials** | `GET` | `/api/meetings/:num` | Detail pertemuan & seluruh submateri | Public |
| **Materials** | `GET` | `/api/submaterials/:id` | Isi submateri & navigasi Prev/Next | Public |
| **Exams** | `GET` | `/api/exams` | Daftar Exam Check & Final Exam | Public |
| **Exams** | `GET` | `/api/exams/:id/questions` | Soal ujian (Kunci jawaban di-masking aman) | Bearer JWT |
| **Exams** | `POST` | `/api/exams/:id/start` | Memulai sesi pengerjaan ujian | Bearer JWT |
| **Exams** | `POST` | `/api/exams/:id/submit` | Kirim jawaban & terima nilai + evaluasi | Bearer JWT |
| **Exams** | `GET` | `/api/exams/history/my` | Riwayat nilai ujian mahasiswa | Bearer JWT |
| **Chatbot** | `POST` | `/api/chat/messages` | Konsultasi materi RPL ke AI Chatbot | Bearer JWT |
| **Chatbot** | `GET` | `/api/chat/conversations` | Riwayat sesi percakapan | Bearer JWT |
