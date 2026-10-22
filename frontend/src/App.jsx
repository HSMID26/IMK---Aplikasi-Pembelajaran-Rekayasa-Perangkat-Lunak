import { useState, useEffect } from 'react';
import Header from './components/Header';
import StatusCards from './components/StatusCards';
import MeetingList from './components/MeetingList';
import ChatbotPreview from './components/ChatbotPreview';
import { api } from './services/api';

export default function App() {
  const [healthData, setHealthData] = useState(null);
  const [backendError, setBackendError] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  useEffect(() => {
    let isCurrent = true;

    async function fetchData() {
      // 1. Ambil status Express & PostgreSQL RPLearn
      try {
        const health = await api.getHealth();
        if (isCurrent) {
          setHealthData(health);
          setBackendError(null);
        }
      } catch (err) {
        if (isCurrent) {
          setBackendError(err.message || 'Gagal terhubung ke backend Express RPLearn');
          setHealthData(null);
        }
      }

      // 2. Ambil 12 Pertemuan Materi RPL
      try {
        const meetingsRes = await api.getMeetings();
        if (isCurrent) {
          setMeetings(meetingsRes.data || []);
        }
      } catch {
        // Abaikan jika server sedang offline
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isCurrent = false;
    };
  }, [refreshTrigger]);

  const handleRefresh = () => {
    setLoading(true);
    setRefreshTrigger((prev) => prev + 1);
  };

  const isDbConnected = healthData?.database?.status === 'connected';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Header onRefresh={handleRefresh} loading={loading} />

        <StatusCards
          healthData={healthData}
          isDbConnected={isDbConnected}
          apiBaseUrl={apiBaseUrl}
        />

        {backendError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl text-sm flex items-start gap-3">
            <span className="text-lg">⚠️</span>
            <div>
              <p className="font-semibold">Backend Express RPLearn belum terhubung!</p>
              <p className="text-xs mt-0.5 text-rose-700">
                Pastikan server backend telah dijalankan menggunakan perintah:{' '}
                <code className="font-mono bg-rose-100 px-1 rounded">npm run dev:backend</code>
              </p>
            </div>
          </div>
        )}

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MeetingList meetings={meetings} loading={loading} />
          <ChatbotPreview isDbConnected={isDbConnected} />
        </main>
      </div>
    </div>
  );
}
