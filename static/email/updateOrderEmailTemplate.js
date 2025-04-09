export const updateOrderEmailTemplate = async ({
  firstName,
  lastName,
  email,
  orderId,
  status,
  items = [],
  totalAmount = 0,
}) => {
  const subject = 'Order Update - Order Status Changed';
  const statusMessage = `Your order status has been updated to: ${status}.`;

  return `
  <!DOCTYPE html>
  <html lang="nl">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="x-apple-disable-message-reformatting" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="color-scheme" content="light dark" />
      <meta name="supported-color-schemes" content="light dark" />
      <title>${subject}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f7;
          margin: 0;
          padding: 0;
          color: #333;
        }

        .email-container {
          max-width: 700px;
          margin: auto;
          background-color: #fff;
          border-radius: 8px;
          padding: 30px;
        }

        h1 {
          color: #2c3e50;
          font-size: 24px;
        }

        h2 {
          color: #555;
          font-size: 18px;
        }

        p {
          font-size: 16px;
          line-height: 1.6;
        }

        .order-summary {
          background-color: #f9fafb;
          padding: 15px;
          border-radius: 5px;
          margin-top: 20px;
        }

        .order-summary h3 {
          color: #333;
          font-size: 18px;
          margin-bottom: 10px;
        }

        .footer {
          margin-top: 30px;
          font-size: 12px;
          color: #777;
          text-align: center;
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

        a.button-link {
          display: inline-block;
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #2e86de;
          color: #ffffff;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        th, td {
          padding: 12px;
          border: 1px solid #ddd;
          text-align: left;
        }

        th {
          background-color: #f0f0f0;
        }

        .total {
          font-weight: bold;
          background-color: #f9f9f9;
        }

        @media (max-width: 600px) {
          .email-container {
            padding: 15px;
          }

          table, th, td {
            font-size: 14px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <h1>${subject}</h1>
        <h2>Bestelnummer: ${orderId}</h2>

        <div class="order-summary">
          <h3>Bestelstatus:</h3>
          <p><strong>Status:</strong> ${status}</p>
          <p>${statusMessage}</p>
        </div>

        <p>Beste ${firstName} ${lastName},</p>
        <p>Bedankt voor uw bestelling! We willen u op de hoogte stellen dat de status van uw bestelling is bijgewerkt.</p>
        <p>Als u vragen heeft of hulp nodig heeft, neem dan gerust contact met ons op.</p>
        <p>Bedankt voor uw aankoop!</p>

        <div class="footer">
          Deze e-mail is automatisch gegenereerd door benzobestellen.com. Als u geen berichten meer wilt ontvangen, kunt u zich afmelden via uw accountinstellingen.
        </div>

        <div class="unsubscribe">
          <a href="https://benzobestellen.com/unsubscribe" target="_blank">Uitschrijven</a>
        </div>
      </div>
    </body>
  </html>
  `;
};
