import express from 'express';
import * as aiController from '../controllers/ai_controller.js'
import * as userAuth from '../middlewares/auth.js'

const router = express.Router();

router.post('/getAiResult', userAuth.authMiddleware,aiController.generateResponse)

export default router;