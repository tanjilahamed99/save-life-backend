import nodemailer from "nodemailer";
import ejs from "ejs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sendEmail = async (
	subject,
	template_name,
	pay_amount,
	payment_url,
	expiry_date
) => {
	const payment_request_template_url =
		__dirname + "../../../static/email/payment.request.template.ejs";
	const welcome_template_url =
		__dirname + "../../../static/email/welcome.template.ejs";

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
		template_name == "welcome_template"
			? welcome_template_url
			: payment_request_template_url,
		{
			name: "sajib",
			pay_amount,
			payment_url,
			expiry_date,
		},
		function (err, data) {
			if (err) {
				console.log(err);
			} else {
				var mainOptions = {
					from: "me.mrsajib@gmail.com",
					// to: "williewonka122@icloud.com",
					to: "sajib.sarker.dev@gmail.com",
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
