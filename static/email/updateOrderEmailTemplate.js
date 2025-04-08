export const updateOrderEmailTemplate = async ({
  firstName,
  lastName,
  email,
  orderId,
  status,
  items = [],
  totalAmount = 0,
}) => {
  let subject = '';
  let statusMessage = '';

  // Set the subject and status message based on the order status
  if (status === 'Shipped') {
    subject = `Uw bestelling is verzonden! Bestelnummer: ${orderId}`;
    statusMessage = `Goed nieuws! Uw bestelling is verzonden en onderweg. Uw trackingnummer is: ${orderId}. U kunt uw bestelling volgen met dit nummer.`;
  } else if (status === 'Delivered') {
    subject = `Uw bestelling is geleverd! Bestelnummer: ${orderId}`;
    statusMessage = `We zijn blij u te kunnen informeren dat uw bestelling is geleverd! We hopen dat u geniet van uw aankoop. Als u problemen heeft, neem dan gerust contact met ons op.`;
  } else if (status === 'Pending') {
    subject = `Uw bestelling is in afwachting! Bestelnummer: ${orderId}`;
    statusMessage = `Uw bestelling is nog in behandeling. We verwerken deze en zullen u op de hoogte stellen zodra deze klaar is om te worden verzonden.`;
  } else if (status === 'Cancelled') {
    subject = `Uw bestelling is geannuleerd! Bestelnummer: ${orderId}`;
    statusMessage = `Het spijt ons u te moeten informeren dat uw bestelling is geannuleerd. Als u vragen heeft, neem dan contact op met onze klantenservice.`;
  } else if (status === 'Processing') {
    subject = `Uw bestelling wordt verwerkt! Bestelnummer: ${orderId}`;
    statusMessage = `Uw bestelling wordt momenteel verwerkt. We zullen u op de hoogte stellen zodra deze is verzonden.`;
  }

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

        .button {
          background-color: #3869d4;
          color: #ffffff;
          padding: 12px 25px;
          text-decoration: none;
          border-radius: 5px;
          display: inline-block;
          margin-top: 25px;
          font-size: 16px;
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
          <h3>Klantinformatie:</h3>
          <p><strong>Naam:</strong> ${firstName} ${lastName}</p>
          <p><strong>E-mail:</strong> ${email}</p>
        </div>

        <h3>Order Informatie:</h3>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Aantal</th>
              <th>Prijs</th>
              <th>Totaal</th>
            </tr>
          </thead>
          <tbody>
            ${items
              ?.map(
                (item) => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>€${item.price.toFixed(2)}</td>
                <td>€${(item.price * item.quantity).toFixed(2)}</td>
              </tr>`
              )
              .join('')}
            <tr class="total">
              <td colspan="3">Totaal</td>
              <td>€${totalAmount?.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div class="order-summary">
          <h3>Bestelstatus:</h3>
          <p><strong>Status:</strong> ${status}</p>
          ${status === 'Shipped' ? `<p><strong>Trackingnummer:</strong> ${orderId}</p>` : ''}
        </div>

        <p>${statusMessage}</p>
        <p>Als u vragen heeft of hulp nodig heeft, neem dan gerust contact met ons op.</p>
        <p>Bedankt voor uw aankoop!</p>

        <a href="https://benzobestellen.com/order-tracking/${orderId}" rel="noreferrer" class="button">Volg uw bestelling</a>

        <div class="footer">
          Deze e-mail is automatisch gegenereerd door benzobestellen.com. Als u geen berichten meer wilt ontvangen, kunt u zich afmelden via uw accountinstellingen.
        </div>
      </div>
    </body>
  </html>
  `;
};
