import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use STARTTLS (upgrade connection to TLS after connecting)
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    },
});

export const sendMail = async ({ email, emailSubject, mailBody }) => {
    try {
        const info = await transporter.sendMail({
            from: `"Sleek Review" <${process.env.AUTH_EMAIL}>`, // sender address
            to: email, // list of recipients
            subject: emailSubject, // subject line
            html: mailBody, // HTML body
        });

        console.log("Email sent: ", info.messageId);
    }
    catch (error) {
        console.error("Error sending email: ", error);
    }
}
// export const sendMail = async ({ email}) => {
//     try {
//         const info = await transporter.sendMail({
//             from: `amazonindia@gmail.com`, // sender address
//             to: email, // list of recipients
//             subject: "Alert", // subject line
//             html: `
//     <div style="font-family: Arial, Helvetica, sans-serif; max-width: 650px; margin: 0 auto; color: #333;">
      
//       <!-- HEADER: Uses a table to push logo left and title right -->
//       <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-bottom: 1px solid #e0e0e0; padding-bottom: 10px; margin-bottom: 20px;">
//         <tr>
//           <td align="left">
//             <!-- Replace the src with a hosted link to your actual logo -->
//             <img src="https://download.logo.wine/logo/Amazon_(company)/Amazon_(company)-Logo.wine.png" alt="Your Service Logo" style="display: block; width: 150px; height: auto;">
//           </td>
//           <td align="right" style="font-size: 22px; color: #444; font-weight: normal;">
//             Password assistance
//           </td>
//         </tr>
//       </table>

//       <!-- MAIN BODY: Using <p> for paragraphs and <strong> for bold text -->
//       <p style="font-size: 15px; line-height: 1.4; margin-bottom: 10px;">
//         Someone tried to reset your password from <strong>Dayton, Ohio</strong>, If you have not requested this code<br>
//         <strong>Please Call Us on <a href="tel:1-800-000-0000" style="color: #0055cc; text-decoration: underline;">1-800-000-0000</a>.</strong><br>
//         <strong>And Please provide this code and your email address to verify your identity</strong>
//       </p>

//       <!-- THE OTP CODE -->
//       <h2 style="font-size: 26px; font-weight: bold; margin: 25px 0;">161145</h2>

//       <!-- FOOTER: Smaller text for legal/security disclaimers -->
//       <p style="font-size: 12px; color: #555; line-height: 1.5; margin-bottom: 20px;">
//         Amazon India takes your account security very seriously. Amazon will never email you and ask you to disclose or verify your Amazon password, credit card, or banking account number. If you receive a suspicious email with a link to update your account information, do not click on the link—instead, report the email to Amazon for investigation.
//       </p>

//       <p style="font-size: 15px;">
//         We hope to see you again soon.<br>
//         <strong>amazon.in</strong>
//       </p>

//     </div>
//   `
//         });

//         console.log("Email sent: ", info.messageId);
//     }
//     catch (error) {
//         console.error("Error sending email: ", error);
//     }
// }