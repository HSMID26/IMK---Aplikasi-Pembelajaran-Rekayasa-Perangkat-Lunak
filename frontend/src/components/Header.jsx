import reactLogo from '../assets/react.svg';
import viteLogo from '../assets/vite.svg';

export default function Header({ onRefresh, loading }) {
  return (
    <header className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4 text-left">
        <div className="flex gap-2 items-center bg-indigo-50 p-2.5 rounded-xl border border-indigo-100">
          <img src={viteLogo} alt="Vite Logo" className="w-8 h-8 object-contain" />
          <img src={reactLogo} alt="React Logo" className="w-8 h-8 object-contain" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">RPLearn</h1>
            <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-100 text-indigo-700 rounded-md">
              v1.0 • HTA Aligned
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Aplikasi Pembelajaran Rekayasa Perangkat Lunak • React 19 + Express 5 + PostgreSQL 17 (Laragon)
          </p>
        </div>
      </div>
      <button
        onClick={onRefresh}
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 active:scale-95 text-white rounded-lg text-sm font-medium transition cursor-pointer flex items-center gap-2"
      >
        <span>🔄</span> {loading ? 'Memuat...' : 'Segarkan Data'}
      </button>
    </header>
  );
}
