import nodemailer from 'nodemailer';

const test = async () => {
    try {
        let testAccount = await nodemailer.createTestAccount();
        console.log('Ethereal Test account created:', testAccount.user);

        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });

        console.log('Attempting Ethereal pseudo-delivery...');
        const info = await transporter.sendMail({
            from: '"AutoCare App" <admin@autocare.com>',
            to: 'test@example.com',
            subject: 'Direct Delivery Test',
            text: 'This is a test OTP.'
        });
        console.log('SUCCESS! Sent verification to', nodemailer.getTestMessageUrl(info));
        process.exit();
    } catch (e) {
        console.error('SMTP Error Output:', e);
        process.exit(1);
    }
};

test();
