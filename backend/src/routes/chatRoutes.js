import { Router } from 'express';
import {
  sendMessage,
  getConversations,
  getConversationById,
  deleteConversation,
} from '../controllers/chatController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Semua fitur AI Chatbot memerlukan autentikasi mahasiswa
router.post('/chat/messages', authenticateToken, sendMessage);
router.get('/chat/conversations', authenticateToken, getConversations);
router.get('/chat/conversations/:id', authenticateToken, getConversationById);
router.delete('/chat/conversations/:id', authenticateToken, deleteConversation);

export default router;
