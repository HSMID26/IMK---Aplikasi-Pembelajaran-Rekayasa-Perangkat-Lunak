import { query } from '../config/db.js';

/**
 * Mengambil daftar 12 pertemuan materi RPL
 */
export async function getMeetings(req, res, next) {
  try {
    const result = await query(
      `SELECT 
         m.id, 
         m.meeting_number, 
         m.title, 
         m.description,
         COUNT(s.id)::int AS submaterials_count,
         e.id AS exam_check_id
       FROM meetings m
       LEFT JOIN submaterials s ON s.meeting_id = m.id
       LEFT JOIN exams e ON e.meeting_id = m.id AND e.type = 'exam_check'
       GROUP BY m.id, m.meeting_number, m.title, m.description, e.id
       ORDER BY m.meeting_number ASC;`
    );

    res.status(200).json({
      status: 'success',
      count: result.rowCount,
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Mengambil detail satu pertemuan beserta seluruh submateri & exam check terkait
 */
export async function getMeetingByNumber(req, res, next) {
  try {
    const meetingNumber = parseInt(req.params.meetingNumber, 10);

    if (isNaN(meetingNumber) || meetingNumber < 1 || meetingNumber > 12) {
      return res.status(400).json({
        status: 'error',
        message: 'Nomor pertemuan harus berupa angka antara 1 dan 12.',
      });
    }

    // 1. Ambil info pertemuan
    const meetingResult = await query(
      'SELECT id, meeting_number, title, description, created_at FROM meetings WHERE meeting_number = $1',
      [meetingNumber]
    );

    if (meetingResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: `Pertemuan ${meetingNumber} tidak ditemukan.`,
      });
    }

    const meeting = meetingResult.rows[0];

    // 2. Ambil daftar submateri pada pertemuan tersebut
    const submaterialsResult = await query(
      'SELECT id, order_index, title, content FROM submaterials WHERE meeting_id = $1 ORDER BY order_index ASC',
      [meeting.id]
    );

    // 3. Ambil exam check terkait
    const examResult = await query(
      'SELECT id, title, duration_minutes, passing_score FROM exams WHERE meeting_id = $1 AND type = $2',
      [meeting.id, 'exam_check']
    );

    res.status(200).json({
      status: 'success',
      data: {
        ...meeting,
        submaterials: submaterialsResult.rows,
        exam_check: examResult.rows[0] || null,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Mengambil satu submateri spesifik dengan info navigasi Next & Previous
 */
export async function getSubmaterialById(req, res, next) {
  try {
    const submaterialId = parseInt(req.params.id, 10);

    if (isNaN(submaterialId)) {
      return res.status(400).json({
        status: 'error',
        message: 'ID submateri tidak valid.',
      });
    }

    const result = await query(
      `SELECT 
         s.id, 
         s.meeting_id, 
         s.order_index, 
         s.title, 
         s.content,
         m.meeting_number,
         m.title AS meeting_title
       FROM submaterials s
       JOIN meetings m ON m.id = s.meeting_id
       WHERE s.id = $1`,
      [submaterialId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Submateri tidak ditemukan.',
      });
    }

    const currentSubmaterial = result.rows[0];

    // Cari navigasi sebelumnya (previous) dan selanjutnya (next)
    const prevResult = await query(
      `SELECT id, title, order_index FROM submaterials 
       WHERE meeting_id = $1 AND order_index < $2 
       ORDER BY order_index DESC LIMIT 1`,
      [currentSubmaterial.meeting_id, currentSubmaterial.order_index]
    );

    const nextResult = await query(
      `SELECT id, title, order_index FROM submaterials 
       WHERE meeting_id = $1 AND order_index > $2 
       ORDER BY order_index ASC LIMIT 1`,
      [currentSubmaterial.meeting_id, currentSubmaterial.order_index]
    );

    res.status(200).json({
      status: 'success',
      data: {
        ...currentSubmaterial,
        navigation: {
          previous: prevResult.rows[0] || null,
          next: nextResult.rows[0] || null,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}
