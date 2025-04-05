import nodemailer from 'nodemailer';
import pug from 'pug';
import { convert } from 'html-to-text';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default class Email {
  constructor(user) {
    this.to = user?.email || 'me.mrsajib@gmail.com';
    this.email = user?.email || 'me.mrsajib@gmail.com';
    this.from = `Benzobestellen <${process.env.EMAIL_FROM}>`;
    // this.url = url;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return 1;
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject, data = {}) {
    // Render HTML based on a pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstname: this.email,
        url: this.url,
        subject,
        ...data,
      }
    );

    // define mailOptions
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };
    // craete a transport and send mail
    const info = await this.newTransport().sendMail(mailOptions);
  }

  async sendEmailTemplate(template, subject) {
    // Render HTML based on a pug template
    const html = template;

    // define mailOptions
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(template),
    };
    // craete a transport and send mail
    const info = await this.newTransport().sendMail(mailOptions);
    console.log(info);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to our family!');
  }

  async sendResetToken() {
    await this.send('resetPassword', 'Reset your password');
  }

  async sendNotifySeller(data) {
    await this.send('notifySeller', 'Accept order', data);
  }
}
