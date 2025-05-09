export const orderEditEmailTemplate = async ({
	firstName,
	lastName,
	email,
	orderId,
	changes,
	items = [],
	totalAmount = 0,
	orderUrl,
	site,
}) => {
	const subject = "Bestelling Bijgewerkt - Wijzigingen Bevestigd";

	// Create a human-readable list of changes
	const changesText = Object.keys(changes)
		.map((key) => {
			switch (key) {
				case "items":
					return "Producten of hoeveelheden";
				case "address":
					return "Verzendadres";
				case "city":
					return "Stad";
				case "postalCode":
					return "Postcode";
				case "country":
					return "Land";
				case "phone":
					return "Telefoonnummer";
				case "notes":
					return "Bestelnotities";
				case "subtotal":
				case "totalAmount":
					return ""; // Skip these as they're derived from items
				default:
					return key;
			}
		})
		.filter((text) => text !== "")
		.join(", ");

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
  
		  .changes-list {
			background-color: #f0f7ff;
			border-left: 4px solid #2e86de;
			padding: 15px;
			margin: 15px 0;
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
  
		  <p>Beste ${firstName} ${lastName},</p>
		  <p>We bevestigen hierbij dat uw bestelling #${orderId} succesvol is bijgewerkt.</p>
		  
		  <div class="changes-list">
			<h3>Bijgewerkte informatie:</h3>
			<p>${changesText}</p>
		  </div>
  
		  <p>U kunt uw bijgewerkte bestelling bekijken door op de onderstaande knop te klikken:</p>
		  
		  <div style="text-align: center;">
			<a href="${orderUrl}" class="button-link">Bekijk Bestelling</a>
		  </div>
  
		  <div class="order-summary">
			<h3>Bestelgegevens:</h3>
			<p><strong>Bestelnummer:</strong> #${orderId}</p>
			<p><strong>Totaalbedrag:</strong> €${totalAmount.toFixed(2)}</p>
		  </div>
  
		  <p>Als u deze wijzigingen niet heeft aangevraagd of als u vragen heeft, neem dan direct contact met ons op.</p>
		  
		  <p>Bedankt voor uw bestelling!</p>
  
		  <div class="footer">
			Deze e-mail is automatisch gegenereerd door ${site}. Als u geen berichten meer wilt ontvangen, kunt u zich afmelden via uw accountinstellingen.
		  </div>
  
		  <div class="unsubscribe">
			<a href="https://${site}/unsubscribe" target="_blank">Uitschrijven</a>
		  </div>
		</div>
	  </body>
	</html>
	`;
};

export const orderEditAdminEmailTemplate = async ({
	customerName,
	customerEmail,
	orderId,
	changes,
	totalAmount = 0,
	adminOrderLink,
	site,
}) => {
	const subject = "Bestelling Bijgewerkt Door Klant";

	// Create a human-readable list of changes
	const changesText = Object.keys(changes)
		.map((key) => {
			switch (key) {
				case "items":
					return "Producten of hoeveelheden";
				case "address":
					return "Verzendadres";
				case "city":
					return "Stad";
				case "postalCode":
					return "Postcode";
				case "country":
					return "Land";
				case "phone":
					return "Telefoonnummer";
				case "notes":
					return "Bestelnotities";
				case "subtotal":
				case "totalAmount":
					return ""; // Skip these as they're derived from items
				default:
					return key;
			}
		})
		.filter((text) => text !== "")
		.join(", ");

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
  
		  .changes-list {
			background-color: #fff0f0;
			border-left: 4px solid #e74c3c;
			padding: 15px;
			margin: 15px 0;
		  }
  
		  @media (max-width: 600px) {
			.email-container {
			  padding: 15px;
			}
		  }
		</style>
	  </head>
	  <body>
		<div class="email-container">
		  <h1>${subject}</h1>
  
		  <p>Een klant heeft wijzigingen aangebracht aan een bestelling.</p>
		  
		  <div class="order-summary">
			<h3>Bestelgegevens:</h3>
			<p><strong>Bestelnummer:</strong> #${orderId}</p>
			<p><strong>Klant:</strong> ${customerName} (${customerEmail})</p>
			<p><strong>Totaalbedrag:</strong> €${totalAmount.toFixed(2)}</p>
		  </div>
		  
		  <div class="changes-list">
			<h3>Bijgewerkte informatie:</h3>
			<p>${changesText}</p>
		  </div>
  
		  <p>Bekijk de bijgewerkte bestelling in het admin dashboard:</p>
		  
		  <div style="text-align: center;">
			<a href="${adminOrderLink}" class="button-link">Bekijk in Dashboard</a>
		  </div>
  
		  <div class="footer">
			Deze e-mail is automatisch gegenereerd door ${site}.
		  </div>
		</div>
	  </body>
	</html>
	`;
};
