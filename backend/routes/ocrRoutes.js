import express from 'express';
import multer from 'multer';
import { processReceipt } from '../controllers/ocrController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('receipt'), processReceipt);

export default router;
