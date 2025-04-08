export const welcomeEmailTemplate = async ({ name, site }) => {
  const currentYear = new Date().getFullYear();
  return `
<!DOCTYPE html>
<html lang="nl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welkom bij ${site}</title>
    <style>
      body {
        background-color: #f4f4f6;
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        color: #333;
      }
      .email-wrapper {
        width: 100%;
        padding: 20px 0;
      }
      .email-content {
        max-width: 600px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 8px;
        padding: 40px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      h1 {
        color: #2e86de;
      }
      .button {
        display: inline-block;
        background-color: #2e86de;
        color: white;
        padding: 12px 20px;
        text-decoration: none;
        border-radius: 5px;
        margin-top: 20px;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #777;
        margin-top: 30px;
      }
      a {
        color: #2e86de;
      }
    </style>
  </head>
  <body>
    <div class="email-wrapper">
      <div class="email-content">
        <h1>Welkom bij ${site}, ${name}!</h1>
        <p>Bedankt voor je registratie bij <strong>${site}</strong>.</p>

        <p>
          We zijn verheugd je aan boord te hebben. Jouw account is succesvol aangemaakt. Je kunt nu inloggen op je dashboard om je profiel te beheren en bestellingen te plaatsen.
        </p>

        <a href="https://${site}/my-account" class="button" rel="noreferrer">Ga naar Mijn Account</a>

        <p style="margin-top: 20px;">
          Heb je vragen of hulp nodig? Bezoek onze 
          <a href="https://${site}/contact" rel="noreferrer">supportpagina</a> of antwoord op deze e-mail.
        </p>

        <p>Met vriendelijke groet,<br />Het ${site} Team</p>
      </div>

      <div class="footer">
        <p>© ${currentYear} ${site} – Alle rechten voorbehouden.</p>
      </div>
    </div>
  </body>
</html>
  `;
};
