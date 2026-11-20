import PasswordOtp from '../models/passwordOtp.js';
import User from '../models/user.js';
import { sendMail } from '../services/mailService.js';
import mails from '../mailTemp.js';

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

export const sendOtp = async (req, res) => {
  const email = normalizeEmail(req.body.email);

  if (!email) return res.status(400).json({ msg: 'Email is required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'No user found with this email' });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const hashedOtp = await PasswordOtp.hashOtp(otp);

    await PasswordOtp.findOneAndUpdate(
      { email },
      { email, otp: hashedOtp, createdAt: new Date(), verifiedAt: null },
      { upsert: true, setDefaultsOnInsert: true }
    );

    await sendMail({
      email,
      emailSubject: 'Your password reset OTP',
      mailBody: mails.otp(otp),
    });

    return res.status(200).json({ msg: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({ msg: 'Unable to send OTP' });
  }
};

export const verifyOtp = async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const otp = String(req.body.otp || '').trim();

  if (!email || !otp) return res.status(400).json({ msg: 'Email and OTP are required' });

  try {
    const passwordOtp = await PasswordOtp.findOne({ email });
    if (!passwordOtp || Date.now() - passwordOtp.createdAt.getTime() > 60 * 1000) {
      return res.status(400).json({ msg: 'OTP is invalid or expired' });
    }

    if (!(await passwordOtp.isValidOtp(otp))) {
      return res.status(400).json({ msg: 'OTP is incorrect' });
    }

    passwordOtp.verifiedAt = new Date();
    await passwordOtp.save();
    return res.status(200).json({ msg: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ msg: 'Unable to verify OTP' });
  }
};

export const updatePassword = async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || '');

  if (!email || !password) return res.status(400).json({ msg: 'Email and password are required' });
  if (password.length < 8) return res.status(400).json({ msg: 'Password must be at least 8 characters' });

  try {
    const passwordOtp = await PasswordOtp.findOne({ email });
    const verificationAge = passwordOtp?.verifiedAt
      ? Date.now() - passwordOtp.verifiedAt.getTime()
      : Infinity;

    if (!passwordOtp || !passwordOtp.verifiedAt || verificationAge > 60 * 1000) {
      return res.status(400).json({ msg: 'Please verify the OTP before resetting your password' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'No user found with this email' });

    user.password = await User.hashPassword(password);
    await user.save();
    await PasswordOtp.deleteOne({ _id: passwordOtp._id });

    return res.status(200).json({ msg: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    return res.status(500).json({ msg: 'Unable to update password' });
  }
};
