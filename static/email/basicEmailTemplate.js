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
    <title>${subject}</title>
    <style>
      body {
        font-family: sans-serif;
        background: #f5f7fa;
        padding: 20px;
        margin: 0;
      }
      .container {
        max-width: 600px;
        margin: auto;
        background: #ffffff;
        border-radius: 6px;
        padding: 30px;
        border: 1px solid #e0e0e0;
      }
      h2 {
        margin-top: 0;
        color: #333;
        font-size: 20px;
      }
      .sender-info {
        font-size: 14px;
        color: #555;
        margin-bottom: 15px;
        font-style: italic;
      }
      .info {
        margin-bottom: 20px;
        font-size: 15px;
        color: #444;
      }
      .info strong {
        display: inline-block;
        width: 100px;
      }
      .message {
        white-space: pre-line;
        font-size: 15px;
        color: #333;
        line-height: 1.6;
        border-top: 1px solid #eee;
        padding-top: 15px;
      }
      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #888;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Nieuw Bericht via Contactformulier</h2>

      <div class="sender-info">${email} – ${name}</div>

      <div class="message">
        ${message}
      </div>
    </div>
  </body>
</html>
  `;
};
