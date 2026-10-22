-- ========================================================
-- RPLearn Seed Data
-- Sesuai dengan Hierarchical Task Analysis (HTA) RPLearn
-- ========================================================

-- 1. Demo Users (Password: password123)
INSERT INTO users (id, name, email, password_hash, role)
VALUES
    (1, 'Mahasiswa RPL', 'mahasiswa@rplearn.ac.id', '$2b$10$ThZdH8t60Zw/mdf3J0.Tf.EjF80dG46H2vpzwBasaA.t.4WboxrKe', 'student'),
    (2, 'Dosen Pengampu RPL', 'dosen@rplearn.ac.id', '$2b$10$ThZdH8t60Zw/mdf3J0.Tf.EjF80dG46H2vpzwBasaA.t.4WboxrKe', 'instructor')
ON CONFLICT (id) DO NOTHING;

-- 2. 12 Pertemuan sesuai HTA
INSERT INTO meetings (id, meeting_number, title, description)
VALUES
    (1, 1, 'Pengantar dan Konsep Perangkat Lunak & Model Proses Pengembangan Perangkat Lunak', 'Memahami definisi software engineering, karakteristik perangkat lunak, serta evolusi software process model.'),
    (2, 2, 'Penggalian Kebutuhan Perangkat Lunak melalui Komunikasi', 'Mempelajari prinsip Agile, komunikasi efektif dengan stakeholder, dan recommended process model.'),
    (3, 3, 'Pemodelan Analisis Kebutuhan Perangkat Lunak', 'Prinsip panduan praktik rekayasa perangkat lunak dan aspek manusia dalam tim pengembang.'),
    (4, 4, 'Pemodelan Analisis Kebutuhan Perangkat Lunak 2', 'Teknik penggalian kebutuhan tingkat lanjut, analisis skenario, dan pemodelan kebutuhan terstruktur.'),
    (5, 5, 'Konsep Perancangan Perangkat Lunak', 'Dasar-dasar perancangan perangkat lunak, arsitektur sistem, modularitas, dan pola arsitektur.'),
    (6, 6, 'Alat Bantu Analisis dan Perancangan (DFD dan UML)', 'Perancangan tingkat komponen, UX Design, Data Flow Diagram (DFD), dan Use Case Diagram.'),
    (7, 7, 'Alat Bantu Analisis dan Perancangan (DFD dan UML) 2', 'Desain berorientasi mobilitas (Design for Mobility) dan Pattern-Based Design.'),
    (8, 8, 'Quality Concept', 'Konsep kualitas perangkat lunak, metrik kualitas, serta teknik formal software reviews.'),
    (9, 9, 'SQA (Software Quality Assurance)', 'Aktivitas jaminan kualitas perangkat lunak dan pengantar Software Security Engineering.'),
    (10, 10, 'Software Security Engineering', 'Prinsip keamanan dalam siklus pengembangan perangkat lunak beserta studi kasus nyata.'),
    (11, 11, 'Software Testing Component Level', 'Pengujian perangkat lunak pada tingkat komponen, unit testing, dan alat bantu (tools) otomatisasi testing.'),
    (12, 12, 'Integration Testing', 'Strategi integration testing (top-down, bottom-up, sandwich) dan verifikasi antarmuka komponen.')
ON CONFLICT (id) DO NOTHING;

-- 3. Submateri per Pertemuan sesuai HTA
INSERT INTO submaterials (meeting_id, order_index, title, content)
VALUES
    -- Pertemuan 1
    (1, 1, 'Introduction to Software Engineering', 'Rekayasa Perangkat Lunak (Software Engineering) adalah disiplin ilmu yang membahas semua aspek produksi perangkat lunak, mulai dari tahap awal spesifikasi sistem hingga pemeliharaan sistem setelah digunakan.'),
    (1, 2, 'Software Process Model', 'Software Process Model adalah representasi abstrak dari proses pengembangan perangkat lunak, seperti Waterfall Model, V-Model, dan Prototyping.'),

    -- Pertemuan 2
    (2, 1, 'Agility', 'Prinsip Agility menekankan pada respons terhadap perubahan daripada mengikuti rencana kaku, dengan kolaborasi tim dan rilis iteratif yang cepat.'),
    (2, 2, 'Recommended Process Model', 'Model proses yang direkomendasikan untuk proyek modern yang membutuhkan fleksibilitas, seperti Scrum, Kanban, dan Extreme Programming (XP).'),

    -- Pertemuan 3
    (3, 1, 'Principle That Guide Practice', 'Prinsip-prinsip dasar yang membimbing praktik rekayasa perangkat lunak, meliputi pemisahan kepentingan, modularitas, dan konsistensi.'),
    (3, 2, 'Human Aspects', 'Aspek manusia dalam tim rekayasa perangkat lunak, dinamika kelompok, kepemimpinan, dan komunikasi antar anggota tim.'),

    -- Pertemuan 4
    (4, 1, 'Understanding Requirements', 'Proses memahami kebutuhan pengguna melalui wawancara, observasi, survei, dan pembuatan persona serta user stories.'),
    (4, 2, 'Requirements Modeling', 'Teknik pemodelan kebutuhan menggunakan diagram berbasis skenario, diagram berbasis aliran, dan diagram berbasis kelas.'),

    -- Pertemuan 5
    (5, 1, 'Design Concepts', 'Konsep perancangan meliputi abstraksi, arsitektur, pola (patterns), pemisahan kepentingan, dan modularitas.'),
    (5, 2, 'Software Architecture', 'Software Architecture menggambarkan struktur tingkat tinggi dari sistem, subsistem, dan relasi antarkomponen.'),

    -- Pertemuan 6
    (6, 1, 'Component Level Design', 'Perancangan tingkat komponen mendefinisikan struktur data internal, algoritma, dan antarmuka komponen individual.'),
    (6, 2, 'UX Design', 'User Experience (UX) Design berfokus pada interaksi pengguna, kemudahan penggunaan (usability), dan kepuasan pengguna akhir.'),

    -- Pertemuan 7
    (7, 1, 'Design for Mobility', 'Pertimbangan khusus saat merancang aplikasi mobile: konsumsi daya, jaringan dinamis, ukuran layar, dan responsivitas.'),
    (7, 2, 'Pattern-Based Design', 'Penerapan pola desain perangkat lunak (Design Patterns) seperti Creational, Structural, dan Behavioral patterns untuk menyelesaikan masalah umum.'),

    -- Pertemuan 8
    (8, 1, 'Quality Concept', 'Kualitas perangkat lunak diukur dari kesesuaian terhadap kebutuhan fungsional dan non-fungsional, keandalan, dan maintainability.'),
    (8, 2, 'Reviews', 'Teknik tinjauan perangkat lunak (Software Reviews), inspeksi kode, dan walkthrough untuk mendeteksi cacat sedini mungkin.'),

    -- Pertemuan 9
    (9, 1, 'SQA (Software Quality Assurance)', 'Aktivitas terencana dan sistematis untuk memastikan perangkat lunak memenuhi standar kualitas yang telah ditentukan.'),
    (9, 2, 'Software Security Engineering', 'Pendekatan rekayasa untuk membangun perangkat lunak yang aman dari kerentanan dan serangan siber sedari awal perancangan.'),

    -- Pertemuan 10
    (10, 1, 'Software Security Engineering Principles', 'Prinsip keamanan perangkat lunak: Least Privilege, Defense in Depth, Fail-Safe Defaults, dan Sanitasi Input.'),
    (10, 2, 'Contoh Software Security Engineering', 'Analisis kasus keamanan: pencegahan SQL Injection, Cross-Site Scripting (XSS), dan manajemen session yang aman.'),

    -- Pertemuan 11
    (11, 1, 'Software Testing Component Level', 'Pengujian tingkat unit dan komponen untuk memverifikasi logika kode internal menggunakan teknik White-box dan Black-box testing.'),
    (11, 2, 'Software Engineering Tools', 'Peralatan otomatisasi testing, static code analysis, continuous integration, dan test runner.'),

    -- Pertemuan 12
    (12, 1, 'Integration Testing', 'Teknik pengujian terintegrasi untuk mendeteksi kesalahan saat modul-modul digabungkan, mencakup pendekatan Big Bang, Incremental Top-down, dan Bottom-up.')
ON CONFLICT DO NOTHING;

-- 4. Ujian: Exam Check (Pertemuan 1 - 12) & Final Exam
INSERT INTO exams (id, type, meeting_id, title, description, duration_minutes, passing_score)
VALUES
    (1, 'exam_check', 1, 'Exam Check: Pertemuan 1', 'Evaluasi pemahaman konsep pengantar perangkat lunak & model proses.', 15, 70.00),
    (2, 'exam_check', 2, 'Exam Check: Pertemuan 2', 'Evaluasi pemahaman agility & recommended process model.', 15, 70.00),
    (3, 'exam_check', 3, 'Exam Check: Pertemuan 3', 'Evaluasi pemahaman prinsip praktik & aspek manusia dalam tim RPL.', 15, 70.00),
    (4, 'exam_check', 4, 'Exam Check: Pertemuan 4', 'Evaluasi pemahaman requirements engineering & pemodelan kebutuhan.', 15, 70.00),
    (5, 'exam_check', 5, 'Exam Check: Pertemuan 5', 'Evaluasi pemahaman konsep perancangan & arsitektur perangkat lunak.', 15, 70.00),
    (6, 'exam_check', 6, 'Exam Check: Pertemuan 6', 'Evaluasi pemahaman perancangan komponen, UX, DFD & UML.', 15, 70.00),
    (7, 'exam_check', 7, 'Exam Check: Pertemuan 7', 'Evaluasi pemahaman design for mobility & pattern-based design.', 15, 70.00),
    (8, 'exam_check', 8, 'Exam Check: Pertemuan 8', 'Evaluasi pemahaman konsep kualitas & software reviews.', 15, 70.00),
    (9, 'exam_check', 9, 'Exam Check: Pertemuan 9', 'Evaluasi pemahaman SQA & software security engineering.', 15, 70.00),
    (10, 'exam_check', 10, 'Exam Check: Pertemuan 10', 'Evaluasi pemahaman prinsip dan implementasi keamanan perangkat lunak.', 15, 70.00),
    (11, 'exam_check', 11, 'Exam Check: Pertemuan 11', 'Evaluasi pemahaman pengujian tingkat komponen & automated tools.', 15, 70.00),
    (12, 'exam_check', 12, 'Exam Check: Pertemuan 12', 'Evaluasi pemahaman strategi integration testing.', 15, 70.00),
    (13, 'final_exam', NULL, 'Final Exam: Rekayasa Perangkat Lunak', 'Ujian evaluasi akhir komprehensif mencakup keseluruhan 12 pertemuan materi RPL.', 60, 75.00)
ON CONFLICT (id) DO NOTHING;

-- 5. Soal-soal Ujian & Pilihan Jawaban
-- Soal Exam Check Pertemuan 1
INSERT INTO exam_questions (id, exam_id, question_order, question_text, explanation)
VALUES
    (1, 1, 1, 'Apa yang membedakan Rekayasa Perangkat Lunak (Software Engineering) dari sekadar pemrograman (programming)?', 'Software Engineering mencakup seluruh siklus hidup pengembangan (SDLC), analisis, perancangan, jaminan kualitas, hingga pemeliharaan sistem, bukan hanya penulisan kode.'),
    (2, 1, 2, 'Model proses pengembangan perangkat lunak manakah yang bersifat sekuensial linier klasik?', 'Waterfall model adalah model sekuensial linier di mana setiap fase harus selesai sebelum fase berikutnya dimulai.');

INSERT INTO question_options (question_id, option_key, option_text, is_correct)
VALUES
    (1, 'A', 'Software engineering hanya fokus pada penulisan sintaks kode yang cepat.', false),
    (1, 'B', 'Software engineering mencakup seluruh siklus hidup sistem, analisis, kualitas, hingga pemeliharaan.', true),
    (1, 'C', 'Software engineering tidak memerlukan pengujian perangkat lunak.', false),
    (1, 'D', 'Programming lebih luas cakupannya dibanding Software Engineering.', false),

    (2, 'A', 'Scrum', false),
    (2, 'B', 'Extreme Programming', false),
    (2, 'C', 'Waterfall Model', true),
    (2, 'D', 'Kanban', false);

-- Soal Final Exam
INSERT INTO exam_questions (id, exam_id, question_order, question_text, explanation)
VALUES
    (3, 13, 1, 'Prinsip Agile manifesto menekankan pada nilai apa dalam pengembangan perangkat lunak?', 'Agile lebih menghargai kolaborasi dengan pelanggan dan respons terhadap perubahan daripada sekadar mengikuti rencana kaku.'),
    (4, 13, 2, 'Apa tujuan utama dari dilakukannya Software Quality Assurance (SQA)?', 'SQA bertujuan memastikan proses dan produk perangkat lunak memenuhi standar kualitas yang ditetapkan secara terencana dan sistematis.');

INSERT INTO question_options (question_id, option_key, option_text, is_correct)
VALUES
    (3, 'A', 'Dokumentasi menyeluruh di atas perangkat lunak yang berfungsi.', false),
    (3, 'B', 'Proses dan alat kerja di atas interaksi individu.', false),
    (3, 'C', 'Kolaborasi dengan pelanggan dan respons terhadap perubahan di atas rencana kaku.', true),
    (3, 'D', 'Negosiasi kontrak di atas kolaborasi.', false),

    (4, 'A', 'Menghilangkan kebutuhan pengujian unit.', false),
    (4, 'B', 'Memastikan proses dan produk memenuhi standar kualitas yang ditetapkan secara sistematis.', true),
    (4, 'C', 'Mempercepat rilis produk tanpa memperhatikan bug.', false),
    (4, 'D', 'Menggantikan peran pengembang dalam menulis kode.', false);

-- 6. Demo Percakapan AI Chatbot
INSERT INTO chat_conversations (id, user_id, title)
VALUES
    (1, 1, 'Konsultasi Model Proses Agile vs Waterfall')
ON CONFLICT (id) DO NOTHING;

INSERT INTO chat_messages (conversation_id, sender, message)
VALUES
    (1, 'user', 'Halo, bisa jelaskan kapan sebaiknya kita menggunakan Waterfall dibanding Agile?'),
    (1, 'bot', 'Halo! Waterfall sangat cocok jika kebutuhan sistem sudah sangat jelas, stabil, dan jarang berubah sejak awal. Sedangkan Agile sangat direkomendasikan untuk proyek dinamis dengan kebutuhan yang terus berkembang bersama feedback pengguna.')
ON CONFLICT DO NOTHING;

-- Sinkronisasi urutan sequence PostgreSQL
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('meetings_id_seq', (SELECT MAX(id) FROM meetings));
SELECT setval('submaterials_id_seq', (SELECT MAX(id) FROM submaterials));
SELECT setval('exams_id_seq', (SELECT MAX(id) FROM exams));
SELECT setval('exam_questions_id_seq', (SELECT MAX(id) FROM exam_questions));
SELECT setval('chat_conversations_id_seq', (SELECT MAX(id) FROM chat_conversations));
