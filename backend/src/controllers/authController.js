import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import { env } from '../config/env.js';

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // 1. Validasi Input Dasar
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        status: 'error',
        message: 'Nama lengkap wajib diisi (minimal 2 karakter).',
      });
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Format email tidak valid.',
      });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: 'Kata sandi wajib diisi (minimal 6 karakter).',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 2. Periksa apakah email sudah terdaftar
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        status: 'error',
        message: 'Email sudah terdaftar. Silakan gunakan email lain atau login.',
      });
    }

    // 3. Hash Password dengan bcrypt
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 4. Simpan ke Database
    const insertResult = await query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'student')
       RETURNING id, name, email, role, created_at`,
      [name.trim(), normalizedEmail, passwordHash]
    );

    const newUser = insertResult.rows[0];

    // 5. Generate JWT Token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      status: 'success',
      message: 'Registrasi akun RPLearn berhasil.',
      data: {
        user: newUser,
        token,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email dan kata sandi wajib diisi.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Cari pengguna berdasarkan email
    const userResult = await query(
      'SELECT id, name, email, password_hash, role, created_at FROM users WHERE email = $1',
      [normalizedEmail]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'Email atau kata sandi tidak sesuai.',
      });
    }

    const user = userResult.rows[0];

    // 2. Verifikasi Password Hash
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Email atau kata sandi tidak sesuai.',
      });
    }

    // 3. Generate JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    // Hilangkan password_hash dari response
    delete user.password_hash;

    res.status(200).json({
      status: 'success',
      message: 'Login berhasil.',
      data: {
        user,
        token,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const result = await query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Data pengguna tidak ditemukan.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: result.rows[0],
      },
    });
  } catch (err) {
    next(err);
  }
}
