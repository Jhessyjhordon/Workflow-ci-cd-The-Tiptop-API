const Yup = require('yup');

const ticketSchema = Yup.object({
    numTicket: Yup.number().required().positive(),
    montantTicket: Yup.number().required().positive(),
    dateAchat: Yup.date().required(),
    gainAttribue: Yup.boolean().required(),
    statusGain: Yup.string().required().min(1).max(255),
    batchId: Yup.number().required().positive().integer(),
    userId: Yup.number().required().positive().integer(),
    
});

const ticketIdSchema = Yup.object({
    id: Yup.number().required().positive().integer()
});

module.exports = { ticketSchema, ticketIdSchema};
