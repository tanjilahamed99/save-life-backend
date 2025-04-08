export const generateOtpEmail = async ({ name, otp, site }) => {
  return `
    <!DOCTYPE html>
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Uw verificatiecode</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #f2f4f6;
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
            color: #333333;
          }
          .email-wrapper {
            width: 100%;
            padding: 20px 0;
          }
          .email-content {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .content-cell {
            padding: 40px;
          }
          .otp-code {
            font-size: 32px;
            font-weight: bold;
            background-color: #f0f0f0;
            color: #111;
            padding: 15px 25px;
            display: inline-block;
            border-radius: 6px;
            letter-spacing: 4px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #999999;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-content">
            <div class="content-cell">
              <h1>Verificatiecode (OTP)</h1>
              <p>Hallo ${name},</p>
              <p>Gebruik de onderstaande code om uw account te verifiëren:</p>
              <div class="otp-code">${otp}</div>
              <p>Deze code is tijdelijk en verloopt na korte tijd. Deel deze niet met anderen.</p>
              <p>Als u deze aanvraag niet hebt gedaan, kunt u deze e-mail negeren.</p>
              <p>Met vriendelijke groet,<br>Het ${site} Team</p>
            </div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${site}. Alle rechten voorbehouden.</p>
            <p><a href="${site}" style="color: #999999; text-decoration: none;">Bezoek onze website</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
};
