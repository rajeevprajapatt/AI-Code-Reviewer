import express from 'express';
import * as aiController from '../controllers/ai_controller.js'
import * as userAuth from '../middlewares/auth.js'

const router = express.Router();

router.post('/getAiResult', userAuth.authMiddleware, aiController.generateResponse)
router.get('/getAiDocument', userAuth.authMiddleware, aiController.getDocument)

router.get('/getAllResponses', userAuth.authMiddleware, aiController.getAllResponses)

router.get('/getHistory', userAuth.authMiddleware, aiController.getUserHistory)

router.post('/updateDocument', userAuth.authMiddleware, aiController.updateDocument)

export default router;