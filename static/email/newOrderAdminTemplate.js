export const newOrderAdminTemplate = async ({
  firstName,
  lastName,
  email,
  items,
  site,
  totalAmount = 0,
  orderId,
  orderDate,
  adminOrderLink = '#',
}) => {
  const customerName = `${firstName} ${lastName}`;
  const customerEmail = email;

  return `
  <!DOCTYPE html>
<html lang="nl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nieuwe bestelling geplaatst</title>
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

      p {
        font-size: 16px;
        line-height: 1.6;
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

      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #777;
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

      <p>Er is zojuist een nieuwe bestelling geplaatst op <strong>${site}</strong>.</p>

      <p><strong>Klantnaam:</strong> ${customerName}</p>
      <p><strong>E-mailadres:</strong> ${customerEmail}</p>
      <p><strong>Bestelnummer:</strong> ${orderId}</p>
      <p><strong>Besteldatum:</strong> ${orderDate}</p>

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

      <p>
        <a href="${adminOrderLink}" style="color: #2c3e50; text-decoration: underline;">
          Bekijk bestelling in dashboard
        </a>
      </p>

      <div class="footer">
        Deze e-mail is automatisch gegenereerd door ${site}.
      </div>
    </div>
  </body>
</html>
`;
};
