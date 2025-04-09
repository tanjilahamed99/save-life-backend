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
  support_url,
}) => {
  const itemsRows = order_items
    .map(
      (item) => `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>€${item.price.toFixed(2)}</td>
          <td>€${(item.quantity * item.price).toFixed(2)}</td>
        </tr>
      `
    )
    .join('');

  const currentYear = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="nl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Betaalverzoek - ${site}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f7;
        margin: 0;
        padding: 0;
        color: #333;
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
       a.button {
        display: inline-block;
        margin-top: 20px;
        padding: 10px 20px;
        background-color: #2e86de;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
      }
      a.secondary-button {
        background-color: #10b981;
          color: #ffffff;
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
   

      <h3>Besteloverzicht:</h3>
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
            <td>€${subtotal.toFixed(2)}</td>
          </tr>
          <tr class="total">
            <td colspan="3">Verzendkosten</td>
            <td>€${shipping.toFixed(2)}</td>
          </tr>
          <tr class="total">
            <td colspan="3">Totaal</td>
            <td>€${total.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <p>U kunt uw betaling veilig afronden via onderstaande knop:</p>
      <a href="${payment_url}" class="button" target="_blank" rel="noopener noreferrer">Betaal Nu</a>

      <p>Na ontvangst van de betaling starten we direct met het verwerken en verzenden van uw bestelling.</p>

      <a href="${order_url}" class="button secondary-button" target="_blank" rel="noopener noreferrer">Bekijk uw bestelling</a>

      <div class="footer">
        <p>© ${currentYear} ${site}. Alle rechten voorbehouden.</p>
        <p>
          Heeft u vragen? Neem gerust contact op met onze
          <a href="${support_url}" target="_blank" rel="noopener noreferrer">klantenservice</a>.
        </p>
        <p style="margin-top: 8px;">
          ${site} • Jouw vertrouwde webshop
        </p>
      </div>

      <div class="unsubscribe">
          <a href="https://benzobestellen.com/unsubscribe" target="_blank">Uitschrijven</a>
        </div>
    </div>
  </body>
</html>
<!-- Fallback plain-text version -->
<!--
Bedankt voor uw bestelling bij ${site}, ${name}!
Uw bestelling is ontvangen op ${orderDate}.

Bekijk uw bestelling: ${order_url}
Betaal nu: ${payment_url}

Totaal: €${total.toFixed(2)}

Vragen? ${support_url}
-->
`;
};
