function generateTemplate(message){
    return `
    <html>
        <head>
            <title>Confirmation de compte</title>
        </head>
        <body>
            <p>${message}</p>
        </body>
      </html>
    `;
  }
  
  module.exports = { generateTemplate };
  