import * as userService from '../services/user_service.js'
import User from '../models/user.js';



export const handleRegister = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashPassword = await User.hashPassword(password)
        const user = await userService.createUser({
            name,
            email,
            password: hashPassword
        });

        const token = await user.generateJWT();
        delete user._doc.password
        res.status(200).json({ user, token })
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

        delete user._doc.password
        res.status(200).send({ user, token })
    } catch (error) {
        console.error(error)
        res.status(400).send({ msg: 'No user found' })
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