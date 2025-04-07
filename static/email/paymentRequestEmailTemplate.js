export const paymentRequestEmailTemplate = async ({
  payment_url,
  name,
  site,
  orderDate,
  order_items = [],
  subtotal = 0,
  shipping = 0,
  total = 0,
  order_url,
  support_url = '#',
}) => {
  const itemsRows = order_items
    .map(
      (item) => `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>€${item.price}</td>
          <td>€${item.total}</td>
        </tr>
      `
    )
    .join('');

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
        margin: 0;
        padding: 0;
        color: #333333;
      }
      .email-wrapper {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
      }
      h1 {
        color: #2e86de;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      th, td {
        border: 1px solid #ddd;
        padding: 12px;
        text-align: left;
      }
      th {
        background-color: #2e86de;
        color: white;
      }
      .total {
        font-weight: bold;
      }
      .button {
        display: inline-block;
        margin-top: 20px;
        padding: 12px 24px;
        background-color: #2e86de;
        color: #ffffff;
        text-decoration: none;
        border-radius: 5px;
      }
      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #777777;
        text-align: center;
      }
      @media (max-width: 600px) {
        .email-wrapper {
          padding: 10px;
        }
        table {
          font-size: 14px;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-wrapper">
      <h1>Bedankt voor uw bestelling, ${name}!</h1>
      <p>Uw bestelling is succesvol ontvangen op ${orderDate}.</p>

      <h3>Bestelgegevens:</h3>
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
          ${itemsRows}
          <tr class="total">
            <td colspan="3">Subtotaal</td>
            <td>€${subtotal}</td>
          </tr>
          <tr class="total">
            <td colspan="3">Verzendkosten</td>
            <td>€${shipping}</td>
          </tr>
          <tr class="total">
            <td colspan="3">Totaal</td>
            <td>€${total}</td>
          </tr>
        </tbody>
      </table>

      <p>U kunt uw betaling nu voltooien door op onderstaande knop te klikken:</p>
      <a href="${payment_url}" class="button">💳 Betaal nu</a>

      <p>Uw bestelling wordt verwerkt zodra de betaling is ontvangen. U ontvangt een verzendbevestiging per e-mail.</p>

      <a href="${order_url}" class="button" style="background-color: #10b981; margin-top: 10px;">📦 Bekijk uw bestelling</a>

      <div class="footer">
        <p>© ${new Date().getFullYear()} ${site} – Alle rechten voorbehouden.</p>
        <p>Vragen? <a href="${support_url}">Neem contact op met onze klantenservice</a>.</p>
      </div>
    </div>
  </body>
</html>
`;
};
