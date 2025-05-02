export const walletPaymentRequestEmailTemplate = async ({
	expiry_date,
	payment_url,
	name,
	order_url,
	orderDate,
	site,
	order_items,
	shipping,
	subtotal,
	total,
	support_url,
}) => {
	const expiryDate = new Date(expiry_date);
	const formattedExpiryDate = expiryDate.toLocaleDateString("nl-NL", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});

	const formattedOrderDate = new Date(orderDate).toLocaleDateString("nl-NL", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});

	return `
	  <!DOCTYPE html>
	  <html>
	  <head>
		  <meta charset="utf-8">
		  <meta name="viewport" content="width=device-width, initial-scale=1.0">
		  <title>Betalingsverzoek</title>
		  <style>
			  body {
				  font-family: Arial, sans-serif;
				  line-height: 1.6;
				  color: #333;
				  margin: 0;
				  padding: 0;
			  }
			  .container {
				  max-width: 600px;
				  margin: 0 auto;
				  padding: 20px;
			  }
			  .header {
				  text-align: center;
				  padding: 20px 0;
				  background-color: #f8f9fa;
			  }
			  .logo {
				  max-width: 150px;
			  }
			  .content {
				  padding: 20px 0;
			  }
			  .button {
				  display: inline-block;
				  background-color: #14b8a6;
				  color: white;
				  text-decoration: none;
				  padding: 12px 24px;
				  border-radius: 4px;
				  margin: 20px 0;
				  font-weight: bold;
			  }
			  .footer {
				  text-align: center;
				  padding: 20px 0;
				  font-size: 12px;
				  color: #6c757d;
				  border-top: 1px solid #e9ecef;
				  margin-top: 20px;
			  }
			  table {
				  width: 100%;
				  border-collapse: collapse;
				  margin: 20px 0;
			  }
			  th, td {
				  padding: 10px;
				  text-align: left;
				  border-bottom: 1px solid #e9ecef;
			  }
			  th {
				  background-color: #f8f9fa;
			  }
			  .total-row {
				  font-weight: bold;
			  }
			  .expiry-notice {
				  background-color: #fff3cd;
				  border: 1px solid #ffeeba;
				  color: #856404;
				  padding: 10px;
				  border-radius: 4px;
				  margin: 20px 0;
			  }
		  </style>
	  </head>
	  <body>
		  <div class="container">
			  <div class="header">
				  <img src="${site}/logo.png" alt="Logo" class="logo">
			  </div>
			  <div class="content">
				  <h2>Betalingsverzoek voor wallet storting</h2>
				  <p>Beste ${name},</p>
				  <p>Bedankt voor je storting aanvraag. Om je wallet op te laden, kun je nu betalen via de onderstaande link:</p>
				  
				  <div style="text-align: center;">
					  <a href="${payment_url}" class="button">Nu betalen</a>
				  </div>
				  
				  <div class="expiry-notice">
					  <p><strong>Let op:</strong> Deze betaallink is geldig tot ${formattedExpiryDate}.</p>
				  </div>
				  
				  <h3>Storting details:</h3>
				  <table>
					  <tr>
						  <th>Beschrijving</th>
						  <th>Aantal</th>
						  <th>Prijs</th>
					  </tr>
					  ${order_items
							.map(
								(item) => `
					  <tr>
						  <td>${item.name}</td>
						  <td>${item.quantity}</td>
						  <td>€${item.price.toFixed(2)}</td>
					  </tr>
					  `
							)
							.join("")}
					  <tr>
						  <td colspan="2" style="text-align: right;">Subtotaal:</td>
						  <td>€${subtotal.toFixed(2)}</td>
					  </tr>
					  <tr>
						  <td colspan="2" style="text-align: right;">Verzendkosten:</td>
						  <td>€${shipping.toFixed(2)}</td>
					  </tr>
					  <tr class="total-row">
						  <td colspan="2" style="text-align: right;">Totaal:</td>
						  <td>€${total.toFixed(2)}</td>
					  </tr>
				  </table>
				  
				  <p>Datum aanvraag: ${formattedOrderDate}</p>
				  
				  <p>Na betaling wordt je wallet automatisch opgeladen en kun je het saldo gebruiken voor je bestellingen.</p>
				  
				  <p>Je kunt je wallet en transactiegeschiedenis bekijken via <a href="${order_url}">je account</a>.</p>
				  
				  <p>Heb je vragen over deze betaling? Neem dan contact op met onze <a href="${support_url}">klantenservice</a>.</p>
				  
				  <p>Met vriendelijke groet,<br>
				  Het team van ${site.replace("https://", "")}</p>
			  </div>
			  <div class="footer">
				  <p>&copy; ${new Date().getFullYear()} ${site.replace("https://", "")}. Alle rechten voorbehouden.</p>
				  <p>Dit is een automatisch gegenereerde e-mail, antwoord niet op dit bericht.</p>
			  </div>
		  </div>
	  </body>
	  </html>
	  `;
};
