export const newOrderEmailTemplate = async ({
  firstName,
  lastName,
  site,
  support_url,
}) => {
  const customerName = `${firstName} ${lastName}`;

  return `
<!DOCTYPE html>
<html lang="nl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bestelling ontvangen - ${site}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f7;
        color: #333;
        margin: 0;
        padding: 0;
      }

      .email-container {
        max-width: 600px;
        margin: auto;
        background-color: #ffffff;
        padding: 30px;
        border-radius: 8px;
      }

      h1 {
        color: #2e86de;
      }

      p {
        font-size: 16px;
        line-height: 1.6;
      }

      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #777;
        text-align: center;
      }

      @media (max-width: 600px) {
        .email-container {
          padding: 15px;
        }

        p {
          font-size: 14px;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <h1>Bestelling ontvangen!</h1>

      <p>Beste ${customerName},</p>

      <p>
        Bedankt voor uw bestelling bij <strong>${site}</strong>.
        We hebben uw bestelling succesvol ontvangen en verwerken deze momenteel.
      </p>

      <p>
        U ontvangt binnenkort een aparte e-mail met een betaallink om de betaling te voltooien.
        Zodra de betaling is ontvangen, starten we direct met het voorbereiden van uw verzending.
      </p>

      <p>
        Mocht u vragen hebben, neem gerust contact met ons op via onze
        <a href="${support_url}">klantenservice</a>.
      </p>

      <p>Met vriendelijke groet,<br />Het ${site} Team</p>

      <div class="footer">
        © ${new Date().getFullYear()} ${site} – Alle rechten voorbehouden
      </div>
    </div>
  </body>
</html>
`;
};
