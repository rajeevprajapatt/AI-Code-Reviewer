import * as userService from '../services/user_service.js'
import User from '../models/user.js';
import {sendMail} from '../services/mailService.js'
import mails from '../mailTemp.js'

export const handleRegister = async (req, res) => {
    const { name, email, password } = req.body;
    const isProduction = process.env.NODE_ENV === 'production';

    try {
        const hashPassword = await User.hashPassword(password)
        const user = await userService.createUser({
            name,
            email,
            password: hashPassword
        });

        const token = await user.generateJWT();
        delete user._doc.password;

        try{
            await sendMail({
                email,
                emailSubject: 'Welcome to SleekReview! 🚀',
                mailBody: mails.register(name),
        });
        } catch (error) {
            console.error("Error sending signup email: ", error);
        }

        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: isProduction,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            sameSite: isProduction ? 'None' : 'Lax',
            path: '/'
        })

        return res.status(200).json({ user})
    } catch (error) {
        console.error("Error creating user: ", error);
        return res.status(500).send({ error: 'Error creating user' });
    }
}

export const handleLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email })
        if (!user) return res.status(400).send({ msg: 'Invalid Credentials' })

        const isMatch = await user.isValidPassword(password)
        if (!isMatch) return res.status(400).send({ msg: 'Invalid Credentials' })

        const token = await user.generateJWT();
        const isProduction = process.env.NODE_ENV === "production";

        delete user._doc.password

        try{
            await sendMail({
                email,
                emailSubject: 'Welcome back to SleekReview! 🚀',
                mailBody: mails.login(user.name),
            })
        }
        catch(error){
            console.error("Error sending login email: ", error);
        }

        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: isProduction, // Set to true in production
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            sameSite: isProduction ? 'None' : 'Lax', // Use 'None' for cross-site cookies in production
            path: '/'
        })
        return res.status(200).send({ user })
    } catch (error) {
        console.error(error)
        return res.status(400).send({ msg: 'No user found' })
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await userService.getAllUser();
        return res.status(200).json({ users: allUsers })
    } catch (err) {
        console.error('Error while fetching users', err)
        return res.status(500).send({ error: 'Error Fetching users' });
    }
}

export const getUserByEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.getUser(email);
        delete user._doc.password
        res.status(200).send({ user })
    } catch (error) {
        console.error(error);
        res.status(400).send({ msg: 'No user found' })
    }
}

export const getProfile = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email }).select('name email');

        if (!user) {
            return res.status(404).json({ msg: 'No user found' });
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.error('Error fetching profile:', error);
        return res.status(500).json({ msg: 'Unable to fetch profile' });
    }
}

export const updateProfile = async (req, res) => {
    if (Object.prototype.hasOwnProperty.call(req.body, 'email')) {
        return res.status(400).json({ msg: 'Email cannot be changed' });
    }

    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';

    if (!name) {
        return res.status(400).json({ msg: 'Name is required' });
    }

    try {
        const user = await User.findOne({ email: req.user.email }).select('name email');

        if (!user) {
            return res.status(404).json({ msg: 'No user found' });
        }

        user.name = name;
        await user.save();

        return res.status(200).json({ user });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ msg: 'Unable to update profile' });
    }
}

export const authMe = async (req, res) => {
    const user = await User.findOne({ email: req.user.email })
        .select("-password");

    if (!user) {
        return res.status(401).json({
            message: "User not found",
        });
    }

    res.status(200).json({ user });
}

export const handleLogout = async (req, res) => {
    try {
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true in production
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // Use 'None' for cross-site cookies in production
            path: '/'
        });

        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error logging out:', error);
        return res.status(500).json({ message: 'Logout failed' });
    }
}
