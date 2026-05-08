import express from 'express';
import * as aiController from '../controllers/ai_controller.js'
import * as userAuth from '../middlewares/auth.js'

const router = express.Router();

router.post('/getAiResult', userAuth.authMiddleware,aiController.generateResponse)
router.post('/getAiDocument', userAuth.authMiddleware, aiController.getDocument)

router.get('/getAllResponses', aiController.getAllResponses)

router.get('/getHistory', userAuth.authMiddleware, aiController.getUserHistory)

export default router;