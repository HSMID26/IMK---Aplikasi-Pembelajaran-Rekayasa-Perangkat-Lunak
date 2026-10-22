import { useState } from 'react';
import { api } from '../services/api';

export default function ChatbotPreview({ isDbConnected }) {
  const [question, setQuestion] = useState('Apa perbedaan Waterfall dan Agile?');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      message: 'Halo! Saya adalah AI Asisten RPLearn. Silakan ajukan pertanyaan seputar materi Rekayasa Perangkat Lunak (Task 5 HTA).',
    },
  ]);
  const [sending, setSending] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userText = question.trim();
    setMessages((prev) => [...prev, { sender: 'user', message: userText }]);
    setQuestion('');
    setSending(true);

    try {
      // Pastikan ada auth token sementara demo jika belum login
      if (!localStorage.getItem('rplearn_token')) {
        // Login default student
        await api.login('mahasiswa@rplearn.ac.id', 'password123');
      }

      const res = await api.sendChatMessage(userText);
      setMessages((prev) => [...prev, { sender: 'bot', message: res.data.bot_response.message }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', message: `[Error]: ${err.message || 'Gagal memanggil chatbot'}` },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>🤖</span> AI Chatbot Konsultasi RPL (Task 5 HTA)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tanya jawab materi RPL & riwayat interaksi percakapan
            </p>
          </div>
          <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-md border border-emerald-200">
            Standby / Live
          </span>
        </div>

        {/* Chat message box */}
        <div className="space-y-3 max-h-[300px] overflow-y-auto p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-xl text-left leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-bl-none'
                }`}
              >
                <div className="text-[10px] opacity-75 mb-1 font-semibold">
                  {m.sender === 'user' ? 'Mahasiswa' : 'RPLearn AI'}
                </div>
                {m.message}
              </div>
            </div>
          ))}
          {sending && (
            <div className="text-left text-slate-400 italic text-[11px]">
              AI Asisten sedang menganalisis pertanyaan...
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSend} className="mt-4 flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Tanyakan topik RPL..."
          disabled={!isDbConnected || sending}
          className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        />
        <button
          type="submit"
          disabled={!isDbConnected || sending}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
        >
          {sending ? '...' : 'Kirim'}
        </button>
      </form>
    </div>
  );
}
