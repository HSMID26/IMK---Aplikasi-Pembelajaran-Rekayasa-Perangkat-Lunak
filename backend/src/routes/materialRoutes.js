import { Router } from 'express';
import {
  getMeetings,
  getMeetingByNumber,
  getSubmaterialById,
} from '../controllers/materialController.js';

const router = Router();

router.get('/meetings', getMeetings);
router.get('/meetings/:meetingNumber', getMeetingByNumber);
router.get('/submaterials/:id', getSubmaterialById);

export default router;
