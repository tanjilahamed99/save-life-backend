export const newOrderEmailTemplate = async ({
  name,
  site,
  support_url,
  orderId,
}) => {
  return `
<!DOCTYPE html>
<html lang="nl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bestelbevestiging - ${site}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f7;
        color: #333333;
        margin: 0;
        padding: 0;
      }

      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 30px;
        border-radius: 8px;
      }

      h1 {
        color: #2e86de;
        font-size: 24px;
      }

      p {
        font-size: 16px;
        line-height: 1.6;
        margin: 0 0 15px;
      }

      a {
        color: #2e86de;
        text-decoration: none;
      }

      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #999999;
        text-align: center;
      }

      @media (max-width: 600px) {
        .email-container {
          padding: 20px;
        }

        h1 {
          font-size: 20px;
        }

        p {
          font-size: 14px;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <h1>Bedankt voor uw bestelling!</h1>

      <p>Hallo ${name},</p>

      <p>
        We hebben uw bestelling <strong>#${orderId}</strong> bij <strong>${site}</strong> succesvol ontvangen.
        Ons team is bezig met de verwerking ervan.
      </p>

      <p>
        U ontvangt binnenkort een aparte e-mail met de betalingsinstructies.
        Zodra we de betaling ontvangen hebben, gaan we direct aan de slag met de verzending.
      </p>

      <p>
        Heeft u vragen of hulp nodig? Bezoek dan gerust onze 
        <a href="${support_url}">klantenservicepagina</a>.
      </p>

      <p>Met vriendelijke groet,<br />Het team van ${site}</p>

      <div class="footer">
        &copy; ${new Date().getFullYear()} ${site}. Alle rechten voorbehouden.
      </div>
    </div>
  </body>
</html>
`;
};
