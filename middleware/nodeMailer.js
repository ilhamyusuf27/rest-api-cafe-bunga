const nodemailer = require("nodemailer");

const sendMail = async (data) => {
	const { name, email, email_token, host } = data;

	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: "recipenation.noreply@gmail.com",
			pass: "fluehyrftvljagkr",
		},
		tls: {
			rejectUnauthorized: false,
		},
	});

	await transporter.sendMail({
		from: `'Verify your email' <recipenation.noreply@gmail.com`,
		to: email,
		subject: `Verify your email!`,
		html: `<h2>${name}! Thanks for registering on our site</h2>
							<h4>Please verify your mail to continue...</h4>
							<a href='http://${host}/user/verify-email?token=${email_token}'>Verify Your Email!</a>`,
	});
};

module.exports = sendMail;
