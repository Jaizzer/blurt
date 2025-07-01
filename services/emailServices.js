const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

async function sendEmailVerification({
	emailAddress,
	emailVerificationString,
}) {
	const Transport = nodemailer.createTransport({
		service: "Gmail",
		auth: {
			user: process.env.EMAIL_ADDRESS,
			pass: process.env.EMAIL_APP_PASSWORD,
		},
		secure: true,
		tls: {
			rejectUnauthorized: false,
		},
	});

	const baseUrl = `${
		process.env.NODE_ENVIRONMENT === "PRODUCTION"
			? process.env.PRODUCTION_URL
			: `http://localhost:${process.env.PORT || 5000}`
	}/auth`;

	const verificationLinkUrl = `${baseUrl}/verify/${emailVerificationString}`;

	const resendVerificationLinkUrl = `${baseUrl}/resendVerificationLink`;

	const mailOptions = {
		from: "Blurt",
		to: emailAddress,
		subject: "Email Verification",
		html: `
                <p>Hi,</p>
                <p>Thanks for signing up to <strong>Blurt</strong>!</p>
                <p>Please verify your email address by clicking the link below:</p>
                <p><a href="${verificationLinkUrl}">Verify Email</a></p>
                <p style="color: #d9534f; font-weight: bold;">⚠️ Note: This link is only valid for 5 minutes.</p>
                <hr>
                <p>If the link is not working or has expired, you can request a new one by visiting <a href="${resendVerificationLinkUrl}">this page</a>.</p>
            `,
	};

	try {
		await Transport.sendMail(mailOptions);
		console.log("Email sent");
	} catch (error) {
		console.error("Error sending email.");
		throw err;
	} finally {
		Transport.close();
	}
}

module.exports = { sendEmailVerification };
