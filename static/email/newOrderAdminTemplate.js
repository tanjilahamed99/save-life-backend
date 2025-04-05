export const newOrderAdminTemplate = async ({
  firstName,
  lastName,
  email,
  address,
  city,
  country,
  postalCode,
  phone,
  items,
  site,
  totalAmount,
}) => {
  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="x-apple-disable-message-reformatting" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="color-scheme" content="light dark" />
      <meta name="supported-color-schemes" content="light dark" />
      <title>New Order Notification for Admin</title>
      <style type="text/css" rel="stylesheet" media="all">
        @import url("https://fonts.googleapis.com/css?family=Nunito+Sans:400,700&display=swap");
        body {
          width: 100% !important;
          height: 100%;
          margin: 0;
          -webkit-text-size-adjust: none;
          font-family: "Nunito Sans", Helvetica, Arial, sans-serif;
        }
  
        .email-wrapper {
          background-color: #f2f4f6;
                color: #000000;
          padding: 20px 0;
        }
  
        .email-body_inner {
          width: 570px;
          margin: 0 auto;
          background-color: #ffffff;
            color: #000000;
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
      <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center">
            <table class="email-body_inner" width="570" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td class="content-cell">
                  <h1>New Order Placed - Admin</h1>
                  <h2>Order ID: ${Date.now()}</h2>
  
                  <h3>Customer Information:</h3>
                  <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Address:</strong> ${address}</p>
                  <p><strong>City:</strong> ${city}</p>
                  <p><strong>Country:</strong> ${country}</p>
                  <p><strong>Postal Code:</strong> ${postalCode}</p>
                  <p><strong>Phone:</strong> ${phone}</p>
                  <p><strong>Website:</strong> ${site}</p>
  
                  <h3>Order Information:</h3>
                  <p><strong>Order Items:</strong> ${items
                    .map((item) => item.name)
                    .join(', ')}</p>
                  <p><strong>Total Amount:</strong> ${totalAmount}</p>
  
                  <p>Please update the order status accordingly.</p>
  
                  <p>If you have any questions or need further information, feel free to reach out.</p>
  
                  <p>Thank you!</p>
                </td>
              </tr>
            </table>
            <div class="footer">
                <p>© 2025 Zolpidem-kopen. Alle rechten voorbehouden.</p>
            </div>
          </td>
        </tr>
      </table>
    </body>
  </html>
    `;
};
