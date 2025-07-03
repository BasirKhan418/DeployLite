const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

async function sendFailureEmail({ projectId, reason, suggestion }) {
    const html = `
    <h2>🚨 Project "${projectId}" is DOWN</h2>
    <p><strong>Reason:</strong> ${reason}</p>
    <p><strong>Suggested Fix:</strong> ${suggestion}</p>
    <a href="http://localhost:5000/apply-fix?projectId=${projectId}">Apply Fix</a>
<a href="http://localhost:5000/ignore-fix?projectId=${projectId}">Ignore</a>

  `;

    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: 'ankit245202@gmail.com',//this has to be fetched from the database
        subject: `🚨 [${projectId}] Container Failure Detected`,
        html
    });

    console.log(`[Email] Sent alert for ${projectId}`);
}

module.exports = { sendFailureEmail };
