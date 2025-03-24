import nodemailer from "nodemailer";
import ejs from "ejs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sendEmail = async ({
	subject,
	template_name,
	pay_amount,
	payment_url,
	expiry_date,
	email,
	name,
	otp,
}) => {
	const transporter = nodemailer.createTransport({
		host: "smtp.gmail.com.",
		port: 587,
		secure: false,
		auth: {
			user: "zolpidemkopen.net@gmail.com",
			// pass: "immouoveevzbttrj",
			pass: "hgvklvpuczvxvjln",
		},
		tls: {
			rejectUnauthorized: false,
		},
	});

	let mailOptions;

	if (template_name == "payment_request_template") {
		const data = await ejs.renderFile(
			__dirname + "/../../static/email/payment.request.template.ejs",
			{ pay_amount, payment_url, expiry_date }
		);

		mailOptions = {
			from: "zolpidemkopen.net@gmail.com",
			to: email,
			subject: "Payment Request from Zolpidem-kopen",
			html: data,
		};
	}

	if (template_name == "welcome_template") {
		const data = await ejs.renderFile(
			__dirname + "/../../static/email/welcome.template.ejs",
			{ name }
		);

		mailOptions = {
			from: "zolpidemkopen.net@gmail.com",
			to: email,
			subject: "Welkom bij Zolpidem-kopen",
			html: data,
		};
	}

	if (template_name == "otp_template") {
		const data = await ejs.renderFile(
			__dirname + "/../../static/email/otp.template.ejs",
			{ name, otp }
		);

		mailOptions = {
			from: "zolpidemkopen.net@gmail.com",
			to: email,
			subject: "Uw OTP-verificatiecode",
			html: data,
		};
	}

	await new Promise((resolve, reject) => {
		transporter.sendMail(mailOptions, (err, info) => {
			if (err) {
				console.error(err);
				reject(err);
			} else {
				resolve(info);
				console.log("sended");
			}
		});
	});
};

export default sendEmail;
