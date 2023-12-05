function generateUniqueTicketNumber() {
    // Utilisez une logique pour générer un numéro de ticket unique, par exemple, en combinant un préfixe avec un timestamp
    const prefix = 'TICKET';
    const timestamp = Date.now();
    const uniqueNumber = Math.floor(Math.random() * 1000); // Utilisez une logique appropriée pour générer le reste du numéro
    const ticketNumber = `${prefix}-${timestamp}-${uniqueNumber}`;
  
    return ticketNumber;
  }

  module.exports = { generateUniqueTicketNumber };