export const welcomeEmailTemplate = async ({ name, site }) => {
  return `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Welkom bij ${site}</title>
    <style type="text/css" rel="stylesheet" media="all">
      @import url("https://fonts.googleapis.com/css?family=Nunito+Sans:400,700&display=swap");
      body {
        width: 100% !important;
        height: 100%;
        margin: 0;
        -webkit-text-size-adjust: none;
        font-family: "Nunito Sans", Helvetica, Arial, sans-serif;
        background-color: #f2f4f6;
        color: #333333;
      }
      .email-wrapper {
        padding: 20px 0;
      }
      .email-body_inner {
        width: 570px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .content-cell {
        padding: 45px;
      }
      .button {
        background-color: #3869d4;
        color: #ffffff;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 5px;
        display: inline-block;
        margin-top: 20px;
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
    <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table class="email-body_inner" width="570" cellpadding="0" cellspacing="0">
            <tr>
              <td class="content-cell">
                <h1>Welkom bij ${site}, ${name}!</h1>

                <p>
                  Bedankt voor je registratie bij <strong>${site}</strong> — jouw betrouwbare partner voor de aankoop van benzodiazepines zoals diazepam, lorazepam, zolpidem, alprazolam en meer.
                </p>

                <p>
                  Bij ons staat discretie, kwaliteit en snelle levering voorop. Jouw bestelling wordt veilig en anoniem verwerkt.
                </p>

                <p>
                  Bezoek je accountdashboard om je bestelling te plaatsen of te beheren.
                </p>

                <a href="<%= dashboard_url %>" class="button">Ga naar Mijn Account</a>

                <p>
                  Heb je vragen? Onze klantenservice staat voor je klaar. Beantwoord deze e-mail of bezoek onze
                  <a href="<%= support_url %>">helpdesk</a>.
                </p>

                <p>Met vriendelijke groet,<br />Het ${site} Team</p>
              </td>
            </tr>
          </table>

          <div class="footer">
            <p>© ${new Date().getFullYear()} ${site} — Alle rechten voorbehouden.</p>
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>
  `;
};
