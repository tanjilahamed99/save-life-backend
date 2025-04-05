export const generateOtpEmail = async ({ name, otp }) => {
  return `
    <!DOCTYPE html>
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="x-apple-disable-message-reformatting" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        <title>Uw OTP-verificatiecode</title>
        <style type="text/css" rel="stylesheet" media="all">
          @import url("https://fonts.googleapis.com/css?family=Nunito+Sans:400,700&display=swap");
          body {
            width: 100% !important;
            height: 100%;
            margin: 0;
            -webkit-text-size-adjust: none;
            font-family: "Nunito Sans", Helvetica, Arial, sans-serif;
          }

          .email-wrapper {
            color: #000000;
            background-color: #f2f4f6;
            padding: 20px 0;
          }

          .email-body_inner {
            width: 570px;
            margin: 0 auto;
            background-color: #ffffff;
              color: #000000;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .content-cell {
            padding: 45px;
          }

          .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #000000;
            background-color: #f0f0f0;
            padding: 15px 25px;
            border-radius: 5px;
            display: inline-block;
            margin: 20px 0;
          }

          .footer {
            text-align: center;
            color: #6b7280;
            margin-top: 20px;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td align="center">
              <table class="email-body_inner" width="570" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td class="content-cell">
                    <h1>Uw OTP-verificatiecode</h1>
                    <p>Beste ${name},</p>
                    <p>Gebruik de volgende eenmalige wachtwoord (OTP) om uw account te verifiëren:</p>
                    <div class="otp-code">${otp}</div>
                    <p>Deze OTP is slechts korte tijd geldig. Deel deze niet met anderen.</p>
                    <p>Als u deze OTP niet hebt aangevraagd, negeer deze e-mail dan.</p>
                    <p>Met vriendelijke groet,<br />Het Zolpidem-kopen Team</p>
                  </td>
                </tr>
              </table>
              <div class="footer">
                <p>© 2025 Zolpidem-kopen. Alle rechten voorbehouden.</p>
              </div>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};
