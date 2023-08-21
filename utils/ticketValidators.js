const Yup = require('yup');

const ticketSchema = Yup.object({
    valeur: Yup.number().required().positive(),
    description: Yup.string().required().min(1).max(255),
    pourcentage_gagnant: Yup.number().required().positive(),
    idUser: Yup.number().required().positive().integer(),
    
});

const ticketIdSchema = Yup.object({
    id: Yup.number().required().positive().integer()
});

module.exports = { ticketSchema, ticketIdSchema};
