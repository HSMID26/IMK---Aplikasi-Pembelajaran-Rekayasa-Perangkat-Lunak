import { query } from '../config/db.js';

/**
 * Mengambil daftar seluruh ujian (Exam Check 1–12 dan Final Exam)
 */
export async function getExams(req, res, next) {
  try {
    const result = await query(
      `SELECT 
         e.id, 
         e.type, 
         e.meeting_id, 
         e.title, 
         e.description, 
         e.duration_minutes, 
         e.passing_score,
         m.meeting_number,
         COUNT(q.id)::int AS total_questions
       FROM exams e
       LEFT JOIN meetings m ON m.id = e.meeting_id
       LEFT JOIN exam_questions q ON q.exam_id = e.id
       GROUP BY e.id, e.type, e.meeting_id, e.title, e.description, e.duration_minutes, e.passing_score, m.meeting_number
       ORDER BY 
         CASE WHEN e.type = 'final_exam' THEN 99 ELSE m.meeting_number END ASC;`
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
 * Mengambil informasi detail ujian tertentu
 */
export async function getExamById(req, res, next) {
  try {
    const examId = parseInt(req.params.id, 10);

    const examResult = await query(
      `SELECT 
         e.id, 
         e.type, 
         e.meeting_id, 
         e.title, 
         e.description, 
         e.duration_minutes, 
         e.passing_score,
         m.meeting_number,
         m.title AS meeting_title
       FROM exams e
       LEFT JOIN meetings m ON m.id = e.meeting_id
       WHERE e.id = $1`,
      [examId]
    );

    if (examResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Ujian tidak ditemukan.',
      });
    }

    const countResult = await query(
      'SELECT COUNT(*)::int AS total_questions FROM exam_questions WHERE exam_id = $1',
      [examId]
    );

    res.status(200).json({
      status: 'success',
      data: {
        ...examResult.rows[0],
        total_questions: countResult.rows[0].total_questions,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Mengambil daftar soal ujian untuk dikerjakan mahasiswa.
 * KEAMANAN: is_correct dan explanation TIDAK DIKIRIM ke frontend sebelum ujian diselesaikan!
 */
export async function getExamQuestions(req, res, next) {
  try {
    const examId = parseInt(req.params.id, 10);

    // Ambil soal
    const questionsResult = await query(
      `SELECT id, question_order, question_text 
       FROM exam_questions 
       WHERE exam_id = $1 
       ORDER BY question_order ASC`,
      [examId]
    );

    if (questionsResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Belum ada soal untuk ujian ini.',
      });
    }

    // Ambil pilihan jawaban (hanya ID, option_key, option_text, TANPA is_correct)
    const questionIds = questionsResult.rows.map((q) => q.id);
    const optionsResult = await query(
      `SELECT id, question_id, option_key, option_text 
       FROM question_options 
       WHERE question_id = ANY($1) 
       ORDER BY question_id ASC, option_key ASC`,
      [questionIds]
    );

    const optionsByQuestion = {};
    optionsResult.rows.forEach((opt) => {
      if (!optionsByQuestion[opt.question_id]) {
        optionsByQuestion[opt.question_id] = [];
      }
      optionsByQuestion[opt.question_id].push({
        id: opt.id,
        option_key: opt.option_key,
        option_text: opt.option_text,
      });
    });

    const questionsWithSafeOptions = questionsResult.rows.map((q) => ({
      ...q,
      options: optionsByQuestion[q.id] || [],
    }));

    res.status(200).json({
      status: 'success',
      total_questions: questionsWithSafeOptions.length,
      data: questionsWithSafeOptions,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Memulai sesi pengerjaan ujian (Start Attempt)
 */
export async function startExam(req, res, next) {
  try {
    const examId = parseInt(req.params.id, 10);
    const userId = req.user.id;

    // Pastikan ujian ada
    const examCheck = await query('SELECT id FROM exams WHERE id = $1', [examId]);
    if (examCheck.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Ujian tidak ditemukan.',
      });
    }

    // Hitung total soal
    const countResult = await query(
      'SELECT COUNT(*)::int AS count FROM exam_questions WHERE exam_id = $1',
      [examId]
    );

    const insertResult = await query(
      `INSERT INTO exam_attempts (user_id, exam_id, status, total_questions, started_at)
       VALUES ($1, $2, 'in_progress', $3, NOW())
       RETURNING id, user_id, exam_id, status, total_questions, started_at`,
      [userId, examId, countResult.rows[0].count]
    );

    res.status(201).json({
      status: 'success',
      message: 'Sesi ujian berhasil dimulai.',
      data: {
        attempt: insertResult.rows[0],
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Menyelesaikan ujian dan menghitung nilai di backend (Finish & Submit Exam)
 */
export async function submitExam(req, res, next) {
  try {
    const examId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    const { attempt_id, answers } = req.body; // answers: [{ question_id, selected_option_id }]

    if (!attempt_id) {
      return res.status(400).json({
        status: 'error',
        message: 'ID sesi pengerjaan (attempt_id) wajib disertakan.',
      });
    }

    // 1. Verifikasi kepemilikan sesi pengerjaan
    const attemptCheck = await query(
      'SELECT id, exam_id, status FROM exam_attempts WHERE id = $1 AND user_id = $2',
      [attempt_id, userId]
    );

    if (attemptCheck.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Sesi pengerjaan tidak ditemukan atau bukan milik Anda.',
      });
    }

    const currentAttempt = attemptCheck.rows[0];
    if (currentAttempt.status === 'completed') {
      return res.status(400).json({
        status: 'error',
        message: 'Sesi ujian ini sudah pernah diselesaikan sebelumnya.',
      });
    }

    // 2. Ambil seluruh kunci jawaban resmi dari database untuk ujian ini
    const officialQuestions = await query(
      `SELECT 
         q.id AS question_id, 
         q.question_text, 
         q.explanation,
         o.id AS correct_option_id,
         o.option_key AS correct_key,
         o.option_text AS correct_text
       FROM exam_questions q
       JOIN question_options o ON o.question_id = q.id AND o.is_correct = true
       WHERE q.exam_id = $1`,
      [examId]
    );

    const questionMap = new Map();
    officialQuestions.rows.forEach((q) => questionMap.set(q.question_id, q));

    const totalQuestions = officialQuestions.rows.length;
    let correctCount = 0;
    const evaluations = [];

    // Map jawaban mahasiswa
    const studentAnswersMap = new Map();
    if (Array.isArray(answers)) {
      answers.forEach((ans) => studentAnswersMap.set(ans.question_id, ans.selected_option_id));
    }

    // 3. Evaluasi setiap soal dan simpan ke database
    for (const [qId, official] of questionMap.entries()) {
      const selectedOptionId = studentAnswersMap.get(qId) || null;
      const isCorrect = selectedOptionId === official.correct_option_id;

      if (isCorrect) correctCount++;

      // Simpan jawaban per soal ke database
      await query(
        `INSERT INTO exam_attempt_answers (attempt_id, question_id, selected_option_id, is_correct)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (attempt_id, question_id) 
         DO UPDATE SET selected_option_id = EXCLUDED.selected_option_id, is_correct = EXCLUDED.is_correct`,
        [attempt_id, qId, selectedOptionId, isCorrect]
      );

      // Detail evaluasi untuk ditampilkan ke mahasiswa
      evaluations.push({
        question_id: qId,
        question_text: official.question_text,
        selected_option_id: selectedOptionId,
        correct_option_id: official.correct_option_id,
        correct_key: official.correct_key,
        correct_text: official.correct_text,
        is_correct: isCorrect,
        explanation: official.explanation,
      });
    }

    // 4. Hitung skor akhir di server
    const score = totalQuestions > 0 ? parseFloat(((correctCount / totalQuestions) * 100).toFixed(2)) : 0;

    // 5. Update attempt status
    const updateResult = await query(
      `UPDATE exam_attempts
       SET status = 'completed',
           total_questions = $1,
           correct_answers = $2,
           score = $3,
           submitted_at = NOW()
       WHERE id = $4
       RETURNING id, user_id, exam_id, status, total_questions, correct_answers, score, started_at, submitted_at`,
      [totalQuestions, correctCount, score, attempt_id]
    );

    // Ambil info passing score
    const examInfo = await query('SELECT passing_score, title FROM exams WHERE id = $1', [examId]);
    const passingScore = parseFloat(examInfo.rows[0]?.passing_score || 70);
    const passed = score >= passingScore;

    res.status(200).json({
      status: 'success',
      message: 'Ujian berhasil diselesaikan.',
      data: {
        attempt: updateResult.rows[0],
        exam_title: examInfo.rows[0]?.title,
        passed,
        passing_score: passingScore,
        evaluations, // Hasil tinjauan jawaban sesuai HTA (Evaluasi Jawaban)
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Mengambil riwayat ujian yang telah diselesaikan mahasiswa saat ini
 */
export async function getMyExamHistory(req, res, next) {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT 
         a.id AS attempt_id,
         a.exam_id,
         e.title AS exam_title,
         e.type AS exam_type,
         e.passing_score,
         a.status,
         a.total_questions,
         a.correct_answers,
         a.score,
         (a.score >= e.passing_score) AS passed,
         a.started_at,
         a.submitted_at
       FROM exam_attempts a
       JOIN exams e ON e.id = a.exam_id
       WHERE a.user_id = $1
       ORDER BY a.started_at DESC`,
      [userId]
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
 * Mengambil detail evaluasi hasil ujian masa lalu milik mahasiswa
 */
export async function getAttemptDetails(req, res, next) {
  try {
    const attemptId = parseInt(req.params.attemptId, 10);
    const userId = req.user.id;

    const attemptResult = await query(
      `SELECT 
         a.id, a.user_id, a.exam_id, a.status, a.total_questions, a.correct_answers, a.score, a.started_at, a.submitted_at,
         e.title AS exam_title, e.type AS exam_type, e.passing_score
       FROM exam_attempts a
       JOIN exams e ON e.id = a.exam_id
       WHERE a.id = $1 AND a.user_id = $2`,
      [attemptId, userId]
    );

    if (attemptResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Hasil pengerjaan tidak ditemukan atau Anda tidak memiliki akses.',
      });
    }

    const attempt = attemptResult.rows[0];

    // Ambil detail jawaban dan review
    const answersResult = await query(
      `SELECT 
         q.id AS question_id,
         q.question_text,
         q.explanation,
         aa.selected_option_id,
         sel.option_key AS selected_key,
         sel.option_text AS selected_text,
         cor.id AS correct_option_id,
         cor.option_key AS correct_key,
         cor.option_text AS correct_text,
         aa.is_correct
       FROM exam_attempt_answers aa
       JOIN exam_questions q ON q.id = aa.question_id
       LEFT JOIN question_options sel ON sel.id = aa.selected_option_id
       LEFT JOIN question_options cor ON cor.question_id = q.id AND cor.is_correct = true
       WHERE aa.attempt_id = $1
       ORDER BY q.question_order ASC`,
      [attemptId]
    );

    res.status(200).json({
      status: 'success',
      data: {
        attempt,
        evaluations: answersResult.rows,
      },
    });
  } catch (err) {
    next(err);
  }
}
