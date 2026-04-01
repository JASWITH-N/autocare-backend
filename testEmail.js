import nodemailer from 'nodemailer';

const test = async () => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'jaswithnimmala1811@gmail.com',
                pass: 'zdjzdyepknfpvzzf'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // FORCE node to use IPv4 instead of timing out on broken IPv6 networks.
        import('dns').then(dns => dns.setDefaultResultOrder('ipv4first'));

        console.log('Attempting alternative strictly IPv4 DNS delivery...');
        const info = await transporter.sendMail({
            from: '"AutoCare App" <jaswithnimmala1811@gmail.com>',
            to: 'jaswithnimmala1811@gmail.com',
            subject: 'Direct Delivery Test',
            text: 'This is a test OTP.'
        });
        console.log('SUCCESS! Sent verification to', info.messageId);
        process.exit();
    } catch (e) {
        console.error('SMTP Error Output:', e);
        process.exit(1);
    }
};

test();
