import nodemailer from 'nodemailer';
import fs from 'fs';

const sendEmail = async (options) => {
  try {
    console.log("Sending email to:", options.email);
    import('fs').then(fs => fs.appendFileSync('email_debug.log', `ATTEMPT for: ${JSON.stringify(options)}\n`));

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.verify();
    console.log("SMTP Ready");

    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: options.email,
      subject: options.subject,
      text: options.message,
    });

    console.log("SUCCESS:", info.response);
    fs.appendFileSync('email_debug.log', `SUCCESS: ${info.response}\n`);
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    fs.appendFileSync('email_debug.log', `ERROR: ${error.stack || error.message}\n`);
  }
};

export default sendEmail;