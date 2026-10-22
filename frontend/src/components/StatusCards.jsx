export default function StatusCards({ healthData, isDbConnected, apiBaseUrl }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Frontend Status */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-500">Frontend Client</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Ready
            </span>
          </div>
          <p className="text-xl font-bold text-slate-900">React 19 + Vite 8</p>
          <p className="text-xs text-slate-500 mt-1">Styling: Tailwind CSS v4</p>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
          Dev Server: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">http://localhost:5173</code>
        </div>
      </div>

      {/* Backend Status */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-500">Backend API</span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                healthData
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {healthData ? 'Online' : 'Offline'}
            </span>
          </div>
          <p className="text-xl font-bold text-slate-900">Node.js Express 5</p>
          <p className="text-xs text-slate-500 mt-1">
            {healthData
              ? `Node ${healthData.nodeVersion} • Uptime: ${healthData.uptimeSeconds}s`
              : 'Server Express belum aktif'}
          </p>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
          API Endpoint:{' '}
          <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">{apiBaseUrl}/health</code>
        </div>
      </div>

      {/* Database Status */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-500">Database Engine</span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                isDbConnected
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {isDbConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <p className="text-xl font-bold text-slate-900">PostgreSQL 17</p>
          <p className="text-xs text-slate-500 mt-1">
            {isDbConnected
              ? `DB: ${healthData.database.name} • Latensi: ${healthData.database.latencyMs}ms`
              : 'Koneksi database PostgreSQL tidak aktif'}
          </p>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
          Environment: <span className="font-semibold text-slate-800">Laragon Local</span> (Port 5432)
        </div>
      </div>
    </section>
  );
}
