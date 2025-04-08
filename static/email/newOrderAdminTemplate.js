export const newOrderAdminTemplate = async ({
  name,
  email,
  items,
  site,
  totalAmount = 0,
  orderId,
  orderDate,
  adminOrderLink = '#',
}) => {
  const customerEmail = email;

  return `
  <!DOCTYPE html>
<html lang="nl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nieuwe bestelling geplaatst - ${site}</title>
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
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        padding: 30px;
      }

      h1 {
        color: #2c3e50;
        font-size: 24px;
        margin-bottom: 10px;
      }

      p {
        font-size: 16px;
        line-height: 1.6;
        margin: 8px 0;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }

      th, td {
        padding: 12px;
        border: 1px solid #dddddd;
        text-align: left;
      }

      th {
        background-color: #f0f0f0;
      }

      .total {
        font-weight: bold;
        background-color: #f9f9f9;
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

      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #777777;
        text-align: center;
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
      <h1>Nieuwe bestelling geplaatst</h1>

      <p><strong>Website:</strong> ${site}</p>
      <p><strong>Klantnaam:</strong> ${name}</p>
      <p><strong>E-mailadres:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a></p>
      <p><strong>Bestelnummer:</strong> ${orderId}</p>
 

      <h2>Besteloverzicht</h2>
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
            <td>€${item.price?.toFixed(2)}</td>
            <td>€${(item.price * item.quantity)?.toFixed(2)}</td>
          </tr>
          `
            )
            .join('')}
          <tr class="total">
            <td colspan="3">Totaal</td>
            <td>€${totalAmount?.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <a href="${adminOrderLink}" class="button-link" target="_blank">
        Bekijk bestelling in dashboard
      </a>

      <div class="footer">
        &copy; ${new Date().getFullYear()} ${site}. Deze e-mail is automatisch gegenereerd.
      </div>
    </div>
  </body>
</html>
`;
};
