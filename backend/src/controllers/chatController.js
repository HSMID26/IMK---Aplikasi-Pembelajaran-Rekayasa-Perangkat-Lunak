import { query } from '../config/db.js';
import { generateRPLAnswer } from '../services/aiService.js';

/**
 * Mengirim pertanyaan ke AI Chatbot (Konsultasi Materi RPL)
 */
export async function sendMessage(req, res, next) {
  try {
    const userId = req.user.id;
    const { message, conversation_id } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Pesan pertanyaan wajib diisi.',
      });
    }

    const trimmedMessage = message.trim();
    let conversationId = conversation_id ? parseInt(conversation_id, 10) : null;

    // 1. Buat atau validasi sesi percakapan
    if (!conversationId) {
      // Buat judul otomatis dari 40 karakter pertama pertanyaan
      const autoTitle = trimmedMessage.length > 40 ? `${trimmedMessage.substring(0, 40)}...` : trimmedMessage;
      const convResult = await query(
        `INSERT INTO chat_conversations (user_id, title)
         VALUES ($1, $2)
         RETURNING id, title, created_at`,
        [userId, autoTitle]
      );
      conversationId = convResult.rows[0].id;
    } else {
      // Pastikan percakapan milik user yang sedang aktif
      const convCheck = await query(
        'SELECT id FROM chat_conversations WHERE id = $1 AND user_id = $2',
        [conversationId, userId]
      );
      if (convCheck.rows.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Sesi percakapan tidak ditemukan atau Anda tidak memiliki akses.',
        });
      }
    }

    // 2. Simpan pesan user ke database
    await query(
      `INSERT INTO chat_messages (conversation_id, sender, message)
       VALUES ($1, 'user', $2)`,
      [conversationId, trimmedMessage]
    );

    // 3. Ambil riwayat percakapan sebelumnya untuk konteks
    const historyResult = await query(
      `SELECT sender, message FROM chat_messages 
       WHERE conversation_id = $1 
       ORDER BY created_at ASC LIMIT 10`,
      [conversationId]
    );

    // 4. Generate jawaban dari AI Service
    const aiResponse = await generateRPLAnswer(trimmedMessage, historyResult.rows);

    // 5. Simpan respon bot ke database
    const botMsgResult = await query(
      `INSERT INTO chat_messages (conversation_id, sender, message)
       VALUES ($1, 'bot', $2)
       RETURNING id, sender, message, created_at`,
      [conversationId, aiResponse.reply]
    );

    // 6. Update updated_at percakapan
    await query('UPDATE chat_conversations SET updated_at = NOW() WHERE id = $1', [conversationId]);

    res.status(200).json({
      status: 'success',
      data: {
        conversation_id: conversationId,
        user_message: trimmedMessage,
        bot_response: botMsgResult.rows[0],
        ai_metadata: {
          provider: aiResponse.provider,
          is_live_cloud: aiResponse.isLiveCloud,
          note: aiResponse.note || null,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Mengambil daftar riwayat percakapan mahasiswa
 */
export async function getConversations(req, res, next) {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT 
         c.id, 
         c.title, 
         c.created_at, 
         c.updated_at,
         COUNT(m.id)::int AS message_count
       FROM chat_conversations c
       LEFT JOIN chat_messages m ON m.conversation_id = c.id
       WHERE c.user_id = $1
       GROUP BY c.id, c.title, c.created_at, c.updated_at
       ORDER BY c.updated_at DESC`,
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
 * Membuka riwayat percakapan sebelumnya beserta isi seluruh pesan
 */
export async function getConversationById(req, res, next) {
  try {
    const conversationId = parseInt(req.params.id, 10);
    const userId = req.user.id;

    // Pastikan percakapan ada dan milik user
    const convResult = await query(
      'SELECT id, title, created_at, updated_at FROM chat_conversations WHERE id = $1 AND user_id = $2',
      [conversationId, userId]
    );

    if (convResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Percakapan tidak ditemukan atau Anda tidak memiliki akses.',
      });
    }

    // Ambil daftar pesan
    const messagesResult = await query(
      `SELECT id, sender, message, created_at 
       FROM chat_messages 
       WHERE conversation_id = $1 
       ORDER BY created_at ASC`,
      [conversationId]
    );

    res.status(200).json({
      status: 'success',
      data: {
        conversation: convResult.rows[0],
        messages: messagesResult.rows,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Menghapus riwayat percakapan
 */
export async function deleteConversation(req, res, next) {
  try {
    const conversationId = parseInt(req.params.id, 10);
    const userId = req.user.id;

    const result = await query(
      'DELETE FROM chat_conversations WHERE id = $1 AND user_id = $2 RETURNING id',
      [conversationId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Percakapan tidak ditemukan atau Anda tidak memiliki akses.',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Riwayat percakapan berhasil dihapus.',
    });
  } catch (err) {
    next(err);
  }
}
