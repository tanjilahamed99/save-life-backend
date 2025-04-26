export const passwordChangeEmailTemplate = async ({ name }) => {
  const currentYear = new Date().getFullYear();
  return `
        <!DOCTYPE html>
        <html lang="nl">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Wachtwoord Gewijzigd</title>
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
                color: #FFFFFF;
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
              .unsubscribe {
                margin-top: 20px;
                text-align: center;
              }
              .unsubscribe a {
                color: #999999;
                font-size: 12px;
                text-decoration: underline;
              }
            </style>
          </head>
          <body>
            <div class="email-wrapper">
              <div class="email-content">
                <h1>Wachtwoord Succesvol Gewijzigd</h1>
                <p>Hallo ${name},</p>
        
                <p>We willen je informeren dat je wachtwoord succesvol is gewijzigd.</p>
        
                <p>Heb je deze wijziging niet zelf aangevraagd? Neem dan onmiddellijk 
                <a href="https://benzobestellen.com/contact" rel="noreferrer">contact op met ons ondersteuningsteam</a>.</p>
        
                <a href="https://benzobestellen.com/login" class="button" rel="noreferrer">Inloggen op Mijn Account</a>
        
                <p style="margin-top: 20px;">
                  Heb je vragen of hulp nodig? Bezoek dan onze 
                  <a href="https://benzobestellen.com/contact" rel="noreferrer">supportpagina</a> of antwoord op deze e-mail.
                </p>
        
                <p>Met vriendelijke groet,<br />Het Benzobestellen Team</p>
              </div>
        
              <div class="footer">
                <p>© ${currentYear} Benzobestellen – Alle rechten voorbehouden.</p>
              </div>
        
              <div class="unsubscribe">
                <a href="https://benzobestellen.com/unsubscribe" target="_blank">Uitschrijven</a>
              </div>
            </div>
          </body>
        </html>
          `;
};
