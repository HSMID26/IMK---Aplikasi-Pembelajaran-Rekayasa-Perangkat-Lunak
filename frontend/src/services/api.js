const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

function getAuthHeader() {
  const token = localStorage.getItem('rplearn_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // 1. Health
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Health check server gagal');
    return res.json();
  },

  // 2. Auth (Task 1 & 2)
  async register(name, email, password) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registrasi gagal');
    if (data.data?.token) localStorage.setItem('rplearn_token', data.data.token);
    return data;
  },

  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login gagal');
    if (data.data?.token) localStorage.setItem('rplearn_token', data.data.token);
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Sesi autentikasi telah berakhir');
    return res.json();
  },

  // 3. Materi RPL (Task 3: 12 Pertemuan)
  async getMeetings() {
    const res = await fetch(`${API_BASE}/meetings`);
    if (!res.ok) throw new Error('Gagal memuat materi pertemuan RPL');
    return res.json();
  },

  async getMeetingDetail(meetingNumber) {
    const res = await fetch(`${API_BASE}/meetings/${meetingNumber}`);
    if (!res.ok) throw new Error('Gagal memuat detail pertemuan');
    return res.json();
  },

  // 4. Latihan dan Evaluasi (Task 4: Exam Check & Final Exam)
  async getExams() {
    const res = await fetch(`${API_BASE}/exams`);
    if (!res.ok) throw new Error('Gagal memuat daftar ujian');
    return res.json();
  },

  async getExamQuestions(examId) {
    const res = await fetch(`${API_BASE}/exams/${examId}/questions`, {
      headers: { ...getAuthHeader() },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal memuat soal ujian');
    return data;
  },

  async startExam(examId) {
    const res = await fetch(`${API_BASE}/exams/${examId}/start`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal memulai ujian');
    return data;
  },

  async submitExam(examId, attemptId, answers) {
    const res = await fetch(`${API_BASE}/exams/${examId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ attempt_id: attemptId, answers }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengirim jawaban');
    return data;
  },

  // 5. AI Chatbot (Task 5)
  async sendChatMessage(message, conversationId = null) {
    const res = await fetch(`${API_BASE}/chat/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ message, conversation_id: conversationId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengirim pesan ke AI');
    return data;
  },

  async getChatConversations() {
    const res = await fetch(`${API_BASE}/chat/conversations`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Gagal memuat riwayat percakapan');
    return res.json();
  },
};

export default api;
