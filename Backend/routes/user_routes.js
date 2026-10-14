import express from 'express'

import * as userController from '../controllers/user_controller.js'
import * as auth from '../middlewares/auth.js'

const router = express.Router();

router.get('/allUsers', auth.authMiddleware, userController.getAllUsers)
router.get('/profile', auth.authMiddleware, userController.getProfile)
router.get('/auth/me', auth.authMiddleware, userController.authMe)


router.post('/getUserByEmail', userController.getUserByEmail)
router.post('/login', userController.handleLogin);
router.post('/register', userController.handleRegister)
router.post('/logout', userController.handleLogout)

router.patch('/profile', auth.authMiddleware, userController.updateProfile)

// router.patch('/updatePassword',userController.updatePassword)

export default router;

// app.get("/api/auth/me", authenticate, async (req, res) => {
//   const user = await User.findById(req.userId)
//     .select("-password");

//   if (!user) {
//     return res.status(401).json({
//       message: "User not found",
//     });
//   }

//   res.status(200).json({ user });
// });