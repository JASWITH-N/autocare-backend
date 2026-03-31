import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      // Using raw Google IP to bypass local Antivirus/Firewall DNS interception!
      host: '192.178.211.108',
      port: 587,
      secure: false, 
      requireTLS: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
       rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: `"AutoCare App" <${process.env.SMTP_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default sendEmail;
