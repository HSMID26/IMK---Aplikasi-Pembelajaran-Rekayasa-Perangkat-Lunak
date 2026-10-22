export function notFoundHandler(req, res) {
  res.status(404).json({
    status: 'error',
    message: `Endpoint tidak ditemukan: ${req.method} ${req.originalUrl}`,
  });
}

export function errorHandler(err, req, res, next) {
  // Cegah kebocoran kredensial atau connection string sensitif
  const safeMessage = err.message
    ? err.message.replace(/:[^:@/]+@/, ':***@')
    : 'Terjadi kesalahan internal pada server';

  const statusCode = err.status || err.statusCode || 500;

  if (process.env.NODE_ENV !== 'test') {
    console.error(`[Error ${statusCode}] ${req.method} ${req.originalUrl}:`, safeMessage);
  }

  res.status(statusCode).json({
    status: 'error',
    message: safeMessage,
  });
}
