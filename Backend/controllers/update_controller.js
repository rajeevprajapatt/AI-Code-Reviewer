// import bcrypt from 'bcrypt';

// import PasswordOtp from '../models/passwordOtp.js';
// import User from '../models/user.js';
// import { sendMail } from '../services/mailService.js';

// export const sendOtp = async (req, res) => {
// 	const { email } = req.body;

// 	if (!email) {
// 		return res.status(400).json({ msg: 'Email is required' });
// 	}

// 	try {
// 		const user = await User.findOne({ email });
// 		if (!user) {
// 			return res.status(404).json({ msg: 'No user found with this email' });
// 		}

// 		const otp = String(Math.floor(100000 + Math.random() * 900000));
// 		const hashedOtp = await bcrypt.hash(otp, 10);

// 		await PasswordOtp.findOneAndUpdate(
// 			{ email },
// 			{ email, otp: hashedOtp, createdAt: new Date() },
// 			{ upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
// 		);

// 		await sendMail({
// 			email,
// 			emailSubject: 'Your password reset OTP',
// 			mailBody: `Your password reset OTP is ${otp}. It expires in 1 minute.`,
// 		});

// 		return res.status(200).json({ msg: 'OTP sent successfully' });
// 	} catch (error) {
// 		console.error('Error sending OTP:', error);
// 		return res.status(500).json({ msg: 'Unable to send OTP' });
// 	}
// };

// export const verifyOtp = async (req, res) => {
// 	const { email, otp } = req.body;

// 	if (!email || !otp) {
// 		return res.status(400).json({ msg: 'Email and OTP are required' });
// 	}

// 	try {
// 		const passwordOtp = await PasswordOtp.findOne({ email });
// 		if (!passwordOtp) {
// 			return res.status(400).json({ msg: 'OTP is invalid or expired' });
// 		}

// 		const isValid = await passwordOtp.isValidOtp(String(otp));
// 		if (!isValid) {
// 			return res.status(400).json({ msg: 'OTP is incorrect' });
// 		}

// 		return res.status(200).json({ msg: 'OTP verified successfully' });
// 	} catch (error) {
// 		console.error('Error verifying OTP:', error);
// 		return res.status(500).json({ msg: 'Unable to verify OTP' });
// 	}
// };
