import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config()
//email can be  blocked on sending too much request
export const sendAlert = async (ip: string, attempts: number) => {
    console.log("mail-send");
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const message = {
        from: process.env.SMTP_USER,
        to: process.env.ALERT_EMAIL,
        subject: "Alert: Suspicious Activity Detected",
        text: `The IP address ${ip} has made ${attempts} failed attempts within the monitoring window.`,
    };

    await transporter.sendMail(message);
};
