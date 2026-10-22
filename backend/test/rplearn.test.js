import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { testConnection, pool, query } from '../src/config/db.js';
import { checkHealth } from '../src/services/healthService.js';
import { generateRPLAnswer } from '../src/services/aiService.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../src/config/env.js';

after(async () => {
  await pool.end();
});

test('1. Database Connection to RPLearn', async () => {
  const result = await testConnection();
  assert.equal(result.connected, true, 'Database should be connected');
  assert.equal(result.database, 'rplearn', 'Database name must be rplearn');
  assert.ok(result.latencyMs >= 0, 'Latency should be a positive number');
  assert.ok(result.version.includes('PostgreSQL 17'), 'Database version should be PostgreSQL 17');
});

test('2. Health Service Check for RPLearn', async () => {
  const health = await checkHealth();
  assert.equal(health.status, 'ok');
  assert.equal(health.service, 'rplearn-backend');
  assert.equal(health.database.status, 'connected');
  assert.equal(health.database.name, 'rplearn');
});

test('3. Verification of 12 Meetings (HTA Task 3)', async () => {
  const meetings = await query('SELECT meeting_number, title FROM meetings ORDER BY meeting_number ASC');
  assert.equal(meetings.rowCount, 12, 'Harus terdapat tepat 12 pertemuan sesuai RPS dan HTA');
  assert.equal(meetings.rows[0].meeting_number, 1);
  assert.ok(meetings.rows[0].title.includes('Pengantar dan Konsep Perangkat Lunak'));
  assert.equal(meetings.rows[11].meeting_number, 12);
  assert.equal(meetings.rows[11].title, 'Integration Testing');
});

test('4. Verification of Submaterials Mapping (HTA Task 3)', async () => {
  const submaterials = await query(
    'SELECT s.title, m.meeting_number FROM submaterials s JOIN meetings m ON m.id = s.meeting_id WHERE m.meeting_number = 1 ORDER BY s.order_index ASC'
  );
  assert.equal(submaterials.rowCount, 2);
  assert.equal(submaterials.rows[0].title, 'Introduction to Software Engineering');
  assert.equal(submaterials.rows[1].title, 'Software Process Model');
});

test('5. Verification of Exams and Security Masking (HTA Task 4)', async () => {
  const exams = await query('SELECT count(*)::int as count FROM exams WHERE type = $1', ['exam_check']);
  assert.equal(exams.rows[0].count, 12, 'Harus ada 12 Exam Check per pertemuan');

  const finalExam = await query('SELECT id, title, type FROM exams WHERE type = $1', ['final_exam']);
  assert.equal(finalExam.rowCount, 1, 'Harus ada 1 Final Exam');
});

test('6. Password Hashing and JWT Verification (HTA Task 1 & 2)', async () => {
  const rawPassword = 'secretPassword123';
  const hashed = await bcrypt.hash(rawPassword, 10);
  const isValid = await bcrypt.compare(rawPassword, hashed);
  assert.equal(isValid, true, 'Bcrypt compare harus valid');

  const token = jwt.sign({ id: 999, email: 'test@rplearn.ac.id' }, env.JWT_SECRET, { expiresIn: '1h' });
  const decoded = jwt.verify(token, env.JWT_SECRET);
  assert.equal(decoded.id, 999);
  assert.equal(decoded.email, 'test@rplearn.ac.id');
});

test('7. AI Chatbot Knowledge Service (HTA Task 5)', async () => {
  const response = await generateRPLAnswer('Apa perbedaan Waterfall dan Agile?');
  assert.ok(response.reply, 'Harus mengembalikan teks balasan');
  assert.ok(response.reply.includes('Waterfall') && response.reply.includes('Agile'), 'Jawaban harus relevan dengan topik RPL');
  assert.ok(response.provider, 'Provider harus terdefinisi secara transparan');
});
