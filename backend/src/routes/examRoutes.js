import { Router } from 'express';
import {
  getExams,
  getExamById,
  getExamQuestions,
  startExam,
  submitExam,
  getMyExamHistory,
  getAttemptDetails,
} from '../controllers/examController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Endpoint publik / metadata ujian
router.get('/exams', getExams);
router.get('/exams/:id', getExamById);

// Endpoint pengerjaan ujian (Wajib login mahasiswa)
router.get('/exams/:id/questions', authenticateToken, getExamQuestions);
router.post('/exams/:id/start', authenticateToken, startExam);
router.post('/exams/:id/submit', authenticateToken, submitExam);

// Endpoint riwayat dan evaluasi
router.get('/exams/history/my', authenticateToken, getMyExamHistory);
router.get('/exams/attempts/:attemptId', authenticateToken, getAttemptDetails);

export default router;
