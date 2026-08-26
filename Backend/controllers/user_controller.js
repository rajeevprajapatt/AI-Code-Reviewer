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
        delete user._doc.password;

        await sendMail({
            email,
            emailSubject: 'Welcome to SleekReview! 🚀',
            mailBody: `
            <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to SleekReview</title>
    <style type="text/css">
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f7f9; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333;">

    <!-- Wrapper -->
    <div style="width: 100%; background-color: #f4f7f9; padding: 40px 15px; box-sizing: border-box;">
        
        <!-- Container -->
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
            
            <!-- Brand Header: Left Text, Right Logo -->
            <div style="background-color: #111827; padding: 25px 30px;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td align="left" valign="middle">
                            <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700; letter-spacing: 0.5px;">
                                Sleek<span style="color: #3b82f6;">Review</span>
                            </h1>
                        </td>
                        <td align="right" valign="middle">
                            <img src="https://cdn.postimage.me/2026/08/26/brain-circuit-1.png" alt="SleekReview Logo" width="80" style="display: block; max-width: 80px; height: auto; border: 0;" />
                        </td>
                    </tr>
                </table>
            </div>

            <!-- Email Body -->
            <div style="padding: 40px 30px; text-align: left;">
                
                <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 24px; font-weight: 700; text-align: center;">
                    Welcome to SleekReview! 🚀
                </h2>
                
                <!-- Replace ${name} with your backend variable -->
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin: 0 0 20px 0;">
                    Hi ${name},
                </p>
                
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin: 0 0 24px 0;">
                    We are thrilled to have you on board. SleekReview acts as your personal AI coding assistant—instantly analyzing your logic, explaining complex snippets, and delivering production-ready optimizations.
                </p>

                <!-- Call to Action Button -->
                <div style="text-align: center; margin: 35px 0;">
                    <!-- Replace ${dashboard_url} with your actual login or dashboard link -->
                    <a href="${sleekreview.vercel.app}" style="background-color: #3b82f6; color: #ffffff; padding: 14px 32px; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px; display: inline-block;">
                        Start Your First Code Review
                    </a>
                </div>

                <!-- Quick Start Guide inside a soft grey box -->
                <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px; margin-bottom: 30px;">
                    <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #111827; font-weight: 600;">
                        How it works:
                    </h3>
                    <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 15px; line-height: 1.6;">
                        <li style="margin-bottom: 10px;"><strong>Upload or Paste:</strong> Drop your raw code directly into our smart editor.</li>
                        <li style="margin-bottom: 10px;"><strong>Let the AI Scan:</strong> Our engine will instantly review your logic and catch hidden bugs.</li>
                        <li style="margin-bottom: 0;"><strong>Get the Fix:</strong> Receive clear explanations, performance tips, and a fully optimized, ready-to-copy version of your code.</li>
                    </ul>
                </div>

                <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin: 0 0 24px 0;">
                    Ready to write cleaner, faster code? Log in and run your first scan today. If you have any questions, just reply to this email.
                </p>

                <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin: 0;">
                    Happy coding,<br>
                    <strong style="color: #111827;">The SleekReview Team</strong>
                </p>

            </div>

            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 24px; text-align: center; font-size: 13px; line-height: 1.5; color: #9ca3af; border-top: 1px solid #f3f4f6;">
                <p style="margin: 0 0 10px 0;">
                    &copy; 2026 SleekReview. All rights reserved.
                </p>
                <p style="margin: 0;">
                    Need help? Contact our <a href="mailto:support@sleekreview.com" style="color: #3b82f6; text-decoration: none;">Support Team</a>.
                </p>
            </div>

        </div>
    </div>
</body>
</html>
          `,
        });

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

// export const updatePassword = async(req,res) =>{
//     const {email} = req.body;
// }