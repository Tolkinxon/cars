import nodemailer from 'nodemailer';
import { config } from 'dotenv'
config();

const emailService = async (email, otp) => {
    const transport = nodemailer.createTransport({
        service: "gmail",
        auth:{
            user: process.env.MY_EMAIL,
            pass: process.env.MY_EMAIL_PASS
        }
    });
    await transport.sendMail({
        from: process.env.MY_EMAIL,
        to: email,
        subject: "Library email verify",
        text: `OTP:${otp} ushbu parol faqat 3 daqiqa amal qiladi`
    })
};

export default emailService;