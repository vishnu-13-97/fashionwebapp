const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    secure: false,
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Function to send email
const sendMail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent:", info.response);
        return info;
    } catch (error) {
        console.error("Error sending mail:", error);
        throw error;
    }
};

module.exports = sendMail;
