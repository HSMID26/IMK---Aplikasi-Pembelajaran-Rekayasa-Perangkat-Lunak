import { env } from '../config/env.js';

/**
 * Service AI Chatbot RPLearn
 * Mendukung Cloud LLM (Gemini / OpenAI) jika AI_API_KEY disetel di .env,
 * atau Local Knowledge Engine (Standby Mode) jika API key belum tersedia.
 */
export async function generateRPLAnswer(userMessage, conversationHistory = []) {
  // Jika API Key cloud terpasang di .env
  if (env.AI_API_KEY) {
    try {
      return await callGeminiLLM(userMessage, conversationHistory, env.AI_API_KEY);
    } catch (err) {
      console.warn('[AI Service Warning] Gagal memanggil Cloud LLM, beralih ke Standby Engine:', err.message);
    }
  }

  // Standby Knowledge Engine (Berbasis Dokumen RPS & Kurikulum RPLearn)
  return generateStandbyKnowledgeResponse(userMessage);
}

/**
 * Integrasi resmi ke Google Gemini REST API
 */
async function callGeminiLLM(userMessage, conversationHistory, apiKey) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const systemInstruction = 
    'Anda adalah AI Asisten Pembelajaran Rekayasa Perangkat Lunak (RPLearn). ' +
    'Tugas Anda adalah membantu mahasiswa memahami materi Rekayasa Perangkat Lunak ' +
    '(SDLC, Agile, UML, DFD, Software Architecture, SQA, Security, Component & Integration Testing). ' +
    'Berikan jawaban yang edukatif, ramah, terstruktur, dan mudah dipahami mahasiswa.';

  const contents = [
    {
      role: 'user',
      parts: [{ text: `${systemInstruction}\n\nPertanyaan mahasiswa: ${userMessage}` }],
    },
  ];

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API merespons dengan HTTP ${response.status}`);
  }

  const data = await response.json();
  const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  return {
    provider: 'gemini-1.5-flash',
    reply: replyText || 'Maaf, tidak dapat menghasilkan jawaban saat ini.',
    isLiveCloud: true,
  };
}

/**
 * Standby Knowledge Engine untuk pengujian lokal saat API Key belum dipasang
 */
function generateStandbyKnowledgeResponse(userMessage) {
  const query = userMessage.toLowerCase();

  let reply = '';

  if (query.includes('waterfall') && query.includes('agile')) {
    reply = 'Perbedaan Waterfall dan Agile: Waterfall adalah model proses sekuensial linier di mana setiap fase harus selesai sebelum fase berikutnya dimulai, sangat cocok untuk proyek dengan kebutuhan stabil sejak awal. Sedangkan Agile bersifat iteratif, adaptif, dan berfokus pada kolaborasi tim serta pengiriman bertahap yang cepat dalam merespons perubahan kebutuhan.';
  } else if (query.includes('waterfall')) {
    reply = 'Waterfall Model adalah model proses klasik yang bersifat sekuensial linier. ' +
      'Tahapan (Analisis, Desain, Implementasi, Pengujian, Deployment, Pemeliharaan) dilakukan berurutan ' +
      'tanpa tumpang tindih. Sangat cocok jika kebutuhan sistem sudah pasti dan jarang berubah sejak awal.';
  } else if (query.includes('agile') || query.includes('scrum')) {
    reply = 'Agile adalah pendekatan iteratif dan fleksibel yang mengutamakan kolaborasi tim, ' +
      'perangkat lunak yang berfungsi, serta respons cepat terhadap perubahan. Scrum adalah salah satu framework Agile ' +
      'yang membagi pekerjaan ke dalam sprint (biasanya 1–4 minggu) dengan peran Product Owner, Scrum Master, dan Dev Team.';
  } else if (query.includes('testing') || query.includes('pengujian')) {
    reply = 'Pengujian perangkat lunak (Software Testing) terbagi menjadi beberapa tingkatan: ' +
      '1) Unit/Component Testing (menguji fungsi/modul terkecil), ' +
      '2) Integration Testing (menguji antarmuka antarkomponen), ' +
      '3) System Testing (menguji keseluruhan sistem), dan ' +
      '4) Acceptance Testing (menguji kesesuaian dengan kebutuhan pengguna).';
  } else if (query.includes('uml') || query.includes('dfd')) {
    reply = 'UML (Unified Modeling Language) adalah bahasa pemodelan visual berorientasi objek (seperti Use Case, Class, dan Sequence Diagram). ' +
      'Sedangkan DFD (Data Flow Diagram) adalah alat pemodelan terstruktur yang menggambarkan aliran data melalui sistem, proses transformasi data, dan tempat penyimpanan data.';
  } else if (query.includes('sqa') || query.includes('kualitas')) {
    reply = 'SQA (Software Quality Assurance) adalah aktivitas sistematis untuk memantau proses rekayasa perangkat lunak ' +
      'dan memastikan standar kualitas terpenuhi sedari dini melalui reviews, audit, dan verifikasi kepatuhan standar.';
  } else if (query.includes('arsitektur') || query.includes('architecture')) {
    reply = 'Software Architecture adalah cetak biru struktural sistem perangkat lunak, mendefinisikan komponen sistem, ' +
      'tanggung jawab tiap komponen, serta protokol interaksi antarkomponen (misal: Monolith, Microservices, Layered Architecture).';
  } else {
    reply = `Halo! Saya adalah AI Asisten RPLearn. Pertanyaan Anda mengenai "${userMessage}" ` +
      'sangat menarik. Anda dapat menanyakan seputar 12 Pertemuan RPLearn, mulai dari SDLC, Model Proses, ' +
      'Analisis Kebutuhan, Desain UML/DFD, hingga Software Testing dan Jaminan Kualitas (SQA).';
  }

  return {
    provider: 'rplearn-knowledge-engine (local standby mode)',
    reply,
    isLiveCloud: false,
    note: 'Untuk mengaktifkan model LLM Cloud interaktif (Google Gemini), pasang AI_API_KEY di file backend/.env.',
  };
}
