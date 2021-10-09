const nodemailer = require('nodemailer');

const { nodemailer: nm, frontend } = require('../config/config');

const transporter = nodemailer.createTransport({
    host: nm.hostname,
    port: nm.port,
    auth: {
        user: nm.username,
        pass: nm.password
    }
});

module.exports.sendEmail = (recipient, subject, htmlContent) =>
    new Promise((resolve, reject) => {
        transporter.sendMail(
            {
                from: {
                    name: 'eISO',
                    address: `system@${nm.domain}`
                },
                to: recipient,
                subject,
                html: htmlContent
            },
            (error, info) => {
                if (error) reject(error);
                else resolve(info);
            }
        );
    });

// ============================================================

// EMAIL TEMPLATES

module.exports.templates = {
    forgotPassword: (name, token) => `
        <h4>Hello ${name},</h4>
        <p>You have recently clicked on "forgot password".</p>
        <p><a href="${frontend}/${token}">Click here to change your password.</a></p>
        <p>This attempt will expire in 5 minutes.</p>
    `,
    passwordChanged: (name) => `
        <h4>Hello ${name},</h4>
        <p>You have recently changed your password.</p>
    `
};
