const generateConfirmationEmailTemplate = (message) => {
    return `
    <html>
        <head>
            <title>Confirmation de compte</title>
        </head>
        <body>
            <h1>${message}</h1>
        </body>
      </html>
    `;
  };

  module.exports = { generateConfirmationEmailTemplate };
  