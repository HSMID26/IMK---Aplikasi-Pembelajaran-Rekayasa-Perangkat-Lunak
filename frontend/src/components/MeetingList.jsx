export default function MeetingList({ meetings, loading }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>📚</span> Silabus 12 Pertemuan Materi RPL (Task 3 HTA)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Struktur materi pembelajaran Rekayasa Perangkat Lunak sesuai RPS & HTA
            </p>
          </div>
          <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-1 rounded-md border border-indigo-200">
            {meetings.length} Pertemuan Tersedia
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm">Memuat daftar pertemuan dari PostgreSQL...</div>
        ) : meetings.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            Belum ada data materi. Jalankan migrasi dan seed: <code>npm run db:seed</code>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
            {meetings.map((m) => (
              <div
                key={m.id}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-slate-50/70 transition flex flex-col justify-between text-left"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-indigo-600 tracking-wide uppercase">
                      Pertemuan {m.meeting_number}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                      {m.submaterials_count} Submateri
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">{m.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{m.description}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="text-emerald-700 font-medium">✓ Exam Check Ready</span>
                  <span className="text-indigo-600 hover:underline font-medium cursor-pointer">Lihat Materi →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Sumber: <strong>RPS & HTA RPLearn</strong></span>
        <span>Database Table: <strong>meetings & submaterials</strong></span>
      </div>
    </div>
  );
}
