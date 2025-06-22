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

	const verificationLink = `${
		process.env.NODE_ENVIRONMENT === "PRODUCTION"
			? process.env.PRODUCTION_URL
			: `http://localhost:${process.env.PORT || 5000}`
	}/auth/verify/${emailVerificationString}`;

	const mailOptions = {
		from: "Blurt",
		to: emailAddress,
		subject: "Email Verification",
		html: `
                <p>Hi,</p>
                <p>Thanks for signing up to <strong>Blurt</strong>!</p>
                <p>Please verify your email address by clicking the link below:</p>
                <p><a href="${verificationLink}">Verify Email</a></p>
                <hr>
                <p>If you did not register for this application, please ignore this email and do not click the verification link.</p>
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

module.exports = sendEmailVerification;
