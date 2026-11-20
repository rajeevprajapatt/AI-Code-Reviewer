import nodemailer from 'nodemailer';

const createTransporter = (user, pass) => {
    return nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: { user, pass },
    });
};

export const sendMail = async ({ email, emailSubject, mailBody }) => {
    const user = process.env.EMAIL_USER?.trim();
    const pass = process.env.EMAIL_PASS?.trim();

    if (!user || !pass) {
        throw new Error('Email credentials are missing. Set EMAIL_USER and EMAIL_PASS in the environment.');
    }

    const transporter = createTransporter(user, pass);

    return transporter.sendMail({
        from: `"Sleek Review" <${user}>`,
        to: email,
        subject: emailSubject,
        html: mailBody,
    });
}
