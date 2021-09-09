const nodemailer = require("nodemailer");

const { nodemailer: nm, frontend } = require("../config/config");

const transporter = nodemailer.createTransport({
    host: nm.hostname,
    port: nm.port,
    auth: {
        user: nm.username,
        pass: nm.password
    }
});

module.exports.sendEmail = (recipient, subject, content) => new Promise((resolve, reject) => {
    transporter.sendMail({
        from: {
            name: "eISO",
            address: `system@${nm.domain}`
        },
        to: recipient,
        subject,
        html: content
    }, (error, info) => {
        if (error) reject(error);
        else resolve(info);
    });
});

// ============================================================

module.exports.sendBulkEmail = (recipients, contents) => new Promise((resolve, reject) => {

});

// ============================================================

// EMAIL TEMPLATES

const inviteUserHTML = (name, token) => `
    <h4>Hi ${name}!</h4>
    <p>You have been invited by a fellow colleague to join them in using eISO.</p>
    <p><strong><a href="${frontend.baseUrl}/create-account/${token}">Join Now</a></strong></p>
`;

const inviteFirstSysadminHTML = (name, token) => `
    <h4>Hi ${name}!</h4>
    <p>Welcome to eISO!</p>
    <p>You are being invited to setup your organisation's eISO.</p>
    <p><strong><a href="${frontend.baseUrl}/create-account/${token}">Setup Now</a></strong></p>
`;

const invitePlatformAdminHTML = (name, token) => `
    <h4>Hi ${name}!</h4>
    <p>You are being invited to administrate the eISO platform.</p>
    <p><strong><a href="${frontend.baseUrl}/create-account/${token}">Begin Now</a></strong></p>
`;

const requestOtpHTML = (name, otp) => `
    <h4>Hi ${name},</h4>
    <p>You have recently requested for an OTP. Your OTP is <strong>${otp}</strong>.</p>
    <p>The OTP will expire in 5 minutes.</p>
`;

const passwordChangedHTML = (name) => `
    <h4>Hi ${name},</h4>
    <p>You have recently changed your password for your eISO account.</p>
`;

const documentApprovalHTML = (name, document, author) => `
    <h4>Hi ${name},</h4>
    <p>The document <strong>${document}</strong> by ${author} requires your approval.</p>
`;

// ============================================================

module.exports.templates = {
    inviteUser: inviteUserHTML,
    inviteSystemAdmin: inviteFirstSysadminHTML,
    invitePlatformAdmin: invitePlatformAdminHTML,
    requestOtp: requestOtpHTML,
    passwordChanged: passwordChangedHTML,
    documentApproval: documentApprovalHTML
}
