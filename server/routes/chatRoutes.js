import express from 'express';
import {
  sendMessage,
  getChatHistory,
  getChatById,
  deleteChatById,
  clearChatHistory,
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/send', protect, sendMessage);
router.get('/history', protect, getChatHistory);
router.delete('/', protect, clearChatHistory);
router.route('/:id')
  .get(protect, getChatById)
  .delete(protect, deleteChatById);

export default router;
