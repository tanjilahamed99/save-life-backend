export const updateOrderEmailTemplate = async ({
  firstName,
  lastName,
  email,
  orderId,
  status,

  items,
  totalAmount,
}) => {
  let subject = '';
  let statusMessage = '';

  // Stel het onderwerp en de statusbericht in op basis van de bestellingsstatus
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
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="x-apple-disable-message-reformatting" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        <title>${subject}</title>
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
            padding: 40px;
          }
    
          h1 {
            color: #333333;
            font-size: 24px;
            margin-bottom: 15px;
          }
    
          h2 {
            color: #555555;
            font-size: 18px;
            margin-bottom: 10px;
          }
    
          p {
            color: #555555;
            font-size: 14px;
            margin-top: 15px;
            line-height: 1.5;
          }
  
          .footer {
            text-align: center;
            color: #6b7280;
            font-size: 12px;
            padding: 20px;
            background-color: #f9fafb;
            border-top: 1px solid #e5e7eb;
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
  
          .order-summary {
            margin-top: 20px;
            padding: 10px;
            background-color: #f9fafb;
            border-radius: 5px;
          }
  
          .order-summary h3 {
            color: #333;
            font-size: 18px;
            margin-bottom: 10px;
          }
  
          .order-summary p {
            color: #555;
            margin-bottom: 5px;
          }
  
          @media only screen and (max-width: 600px) {
            .email-body_inner {
              width: 100% !important;
              padding: 20px;
            }
            .content-cell {
              padding: 20px;
            }
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
                    <h1>${subject}</h1>
                    <h2>Bestelnummer: ${orderId}</h2>
  
                    <div class="order-summary">
                      <h3>Klantinformatie:</h3>
                      <p><strong>Naam:</strong> ${firstName} ${lastName}</p>
                      <p><strong>E-mail:</strong> ${email}</p>
                    </div>
                    <h3>Order Information:</h3>
                  <p><strong>Order Items:</strong> ${items
                    .map((item) => item.name)
                    .join(', ')}</p>
                  <p><strong>Item Quantity:</strong> ${items
                    .map((item) => item.quantity)
                    .join(', ')}</p>
                  <p><strong>Total Amount:</strong> ${totalAmount}</p>
                    <div class="order-summary">
                      <h3>Bestelstatus:</h3>
                      <p><strong>Status:</strong> ${status}</p>
                     
                      ${
                        status === 'Shipped'
                          ? `<p><strong>Trackingnummer:</strong> ${orderId}</p>`
                          : ''
                      }
                      
                    </div>
  
                    <p>${statusMessage}</p>
  
                    <p>Als u vragen heeft of hulp nodig heeft, neem dan gerust contact met ons op.</p>
  
                    <p>Bedankt voor uw aankoop!</p>
  
                    <a href="#" class="button">Volg uw bestelling</a>
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
