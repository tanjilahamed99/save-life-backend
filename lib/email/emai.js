import { Resend } from 'resend';
import { convert } from 'html-to-text';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY); // your Resend API key

export default class Email {
  constructor(user, site = 'https://benzobestellen.com') {
    this.to = user?.email || 'me.mrsajib@gmail.com';
    this.email = user?.email || 'me.mrsajib@gmail.com';
    this.from = `${site === 'https://zolpidem-kopen.net' ? `zolpidem-kopen <contact@zolpidem-kopen.net>` : `Benzobestellen <contact@benzobestellen.com>`}`;
  }

  async sendEmailTemplate(template, subject) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html: template,
      text: convert(template),
    };

    const { data, error } = await resend.emails.send(mailOptions);
    if (error) {
      console.log(error);
    }

    console.log('email', data);
  }
}
