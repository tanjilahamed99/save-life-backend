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
	const payment_request_template_url =
		__dirname + "../../../static/email/payment.request.template.ejs";
	const welcome_template_url =
		__dirname + "../../../static/email/welcome.template.ejs";
	const otp_template_url = __dirname + "../../../static/email/otp.template.ejs";

	let template;

	if (template_name == "otp_template") {
		template = otp_template_url;
	} else if (template_name == "welcome_template") {
		template = welcome_template_url;
	} else if (template_name == "payment_request_template") {
		template = payment_request_template_url;
	}

	const transporter = nodemailer.createTransport({
		host: "smtp.gmail.com.",
		port: 587,
		auth: {
			user: "zolpidemkopen.net@gmail.com",
			// pass: "immouoveevzbttrj",
			pass: "hgvklvpuczvxvjln",
		},
	});

	ejs.renderFile(
		template,
		{
			name,
			pay_amount,
			payment_url,
			expiry_date,
			otp,
		},
		function (err, data) {
			if (err) {
				console.log(err);
			} else {
				var mainOptions = {
					from: "zolpidemkopen.net@gmail.com",
					to: email,
					subject,
					html: data,
				};
				transporter.sendMail(mainOptions, function (err, info) {
					if (err) {
						console.log(err);
					} else {
						console.log("Message sent: " + info.response);
					}
				});
			}
		}
	);
};

export default sendEmail;
