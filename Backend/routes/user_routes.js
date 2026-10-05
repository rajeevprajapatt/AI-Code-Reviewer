import express from 'express'

import * as userController from '../controllers/user_controller.js'
import * as auth from '../middlewares/auth.js'

const router = express.Router();

router.post('/login', userController.handleLogin);

router.post('/register', userController.handleRegister)

router.get('/allUsers', auth.authMiddleware, userController.getAllUsers)

router.get('/profile', auth.authMiddleware, userController.getProfile)

router.patch('/profile', auth.authMiddleware, userController.updateProfile)

router.post('/getUserByEmail', userController.getUserByEmail)

// router.patch('/updatePassword',userController.updatePassword)

export default router;