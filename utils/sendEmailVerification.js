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
		subject: "Email verification",
		html: `Press <a href="${verificationLink}"> Here </a> to verify your email. Thanks`,
	};

	Transport.sendMail(mailOptions, (error, response) => {
		if (error) {
			console.log("Error sending verification email.");
			throw error;
		} else {
			console.log("Message sent.");
		}
	});

	Transport.close();
}

module.exports = sendEmailVerification;
