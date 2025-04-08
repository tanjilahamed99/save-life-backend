export const basicEmailTemplate = async ({
  name = 'Onbekend',
  email = '-',
  subject = 'Geen onderwerp',
  message = '',
}) => {
  return `
<!DOCTYPE html>
<html lang="nl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Nieuw Bericht van Contactformulier</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f6f8fb;
        margin: 0;
        padding: 0;
        color: #333;
      }

      .email-container {
        max-width: 650px;
        margin: auto;
        background-color: #fff;
        border-radius: 8px;
        padding: 30px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
      }

      h2 {
        color: #2c3e50;
      }

      p {
        font-size: 16px;
        line-height: 1.6;
      }

      .info-box {
        background-color: #f1f5f9;
        padding: 15px;
        border-radius: 5px;
        margin: 10px 0 20px 0;
      }

      .info-label {
        font-weight: bold;
      }

      .footer {
        font-size: 12px;
        color: #777;
        text-align: center;
        margin-top: 30px;
      }

      @media (max-width: 600px) {
        .email-container {
          padding: 20px;
        }

        p, .info-box {
          font-size: 14px;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <h2>Nieuw bericht ontvangen</h2>

      <p>Er is een nieuw bericht verzonden via het contactformulier van <strong>benzobestellen.com</strong>.</p>

      <div class="info-box">
        <p><span class="info-label">Naam:</span> ${name}</p>
        <p><span class="info-label">E-mailadres:</span> ${email}</p>
        <p><span class="info-label">Onderwerp:</span> ${subject}</p>
      </div>

      <p><strong>Bericht:</strong></p>
      <p style="white-space: pre-line;">${message}</p>

      <div class="footer">
        Deze e-mail is automatisch gegenereerd door het systeem van benzobestellen.com.
        Als u dit bericht onterecht heeft ontvangen, kunt u het veilig negeren.
      </div>
    </div>
  </body>
</html>
  `;
};
