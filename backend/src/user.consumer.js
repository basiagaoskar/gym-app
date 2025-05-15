import { consumeMessages } from './lib/rabbitmq.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
});

const handleUserRegistration = async (message) => {
    console.log(`[User Consumer] Received user registration: ${JSON.stringify(message)}`);
    console.log(`Processing user registration for user ID: ${message.userId}`);

    try {
        const info = await transporter.sendMail({
            from: '"Ziutki Gym" <ziutkigym@email.com>',
            to: message.email,
            subject: "Welcome to Ziutki Gym",
            html: `<b>Hello!</b><br><br>Thank you for registering ${message.username}!`,
        });

        console.log("Message sent:", info.messageId);
    } catch (err) {
        console.error("Error sending email:", err);
    }
};

consumeMessages('userRegisteredQueue', handleUserRegistration);