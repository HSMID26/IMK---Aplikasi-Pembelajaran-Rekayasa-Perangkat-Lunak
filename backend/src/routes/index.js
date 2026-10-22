import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import materialRoutes from './materialRoutes.js';
import examRoutes from './examRoutes.js';
import chatRoutes from './chatRoutes.js';

const router = Router();

// Endpoint info dokumentasi API RPLearn
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    service: 'RPLearn REST API',
    description: 'Backend API Pembelajaran Rekayasa Perangkat Lunak sesuai HTA',
    modules: {
      health: 'GET /api/health',
      authentication: 'POST /api/auth/register, POST /api/auth/login, GET /api/auth/me',
      learning_materials: 'GET /api/meetings, GET /api/meetings/:meetingNumber, GET /api/submaterials/:id',
      exams: 'GET /api/exams, GET /api/exams/:id, GET /api/exams/:id/questions, POST /api/exams/:id/start, POST /api/exams/:id/submit, GET /api/exams/history/my, GET /api/exams/attempts/:attemptId',
      ai_chatbot: 'POST /api/chat/messages, GET /api/chat/conversations, GET /api/chat/conversations/:id, DELETE /api/chat/conversations/:id',
    },
  });
});

// Daftarkan seluruh modul routes
router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/', materialRoutes);
router.use('/', examRoutes);
router.use('/', chatRoutes);

export default router;
