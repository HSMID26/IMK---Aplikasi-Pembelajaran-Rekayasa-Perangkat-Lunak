import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * Middleware untuk memverifikasi JWT Bearer Token
 * Digunakan untuk memproteksi endpoint yang memerlukan autentikasi mahasiswa/dosen
 */
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Akses ditolak: Token autentikasi tidak ditemukan. Silakan login terlebih dahulu.',
    });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    return res.status(403).json({
      status: 'error',
      message: 'Akses ditolak: Token autentikasi tidak valid atau sudah kedaluwarsa.',
    });
  }
}

/**
 * Middleware opsional: jika token disertakan, proses user; jika tidak, tetap lanjutkan sebagai guest
 */
export function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (token) {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      req.user = decoded;
    } catch {
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
}
