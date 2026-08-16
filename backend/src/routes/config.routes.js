import express from 'express';
import { getEnums } from '../controllers/config.controller.js';

const router = express.Router();

router.get('/enums', getEnums);

export default router;
