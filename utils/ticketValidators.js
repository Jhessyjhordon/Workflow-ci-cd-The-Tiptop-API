const Yup = require('yup');

const ticketSchema = Yup.object({
    numTicket: Yup.number().required().positive(),
    montantTicket: Yup.number().required().positive(),
    dateAchat: Yup.date().required(),
    gainAttribue: Yup.boolean().required(),
    batchId: Yup.number().required().positive().integer(),
    userId: Yup.number().required().positive().integer(),
    
});
const ticketCreationSchema = Yup.object({
    montantTicket: Yup.number().required().positive(),
    batchId: Yup.number().required().positive().integer(),
    userId: Yup.number().required().positive().integer(),
    
});
const ticketPatchSchema = Yup.object({
    numTicket: Yup.number().positive(),
    montantTicket: Yup.number().positive(),
    dateAchat: Yup.date(),
    gainAttribue: Yup.boolean(),
    state: Yup.string().min(1).max(255),
    statusGain: Yup.string().min(1).max(255),
    batchId: Yup.number().positive().integer(),
    userId: Yup.number().positive().integer(),
    
});

const ticketIdSchema = Yup.object({
    id: Yup.number().required().positive().integer()
});
const ticketNumTicketSchema = Yup.object({
    numTicket: Yup.number().required().positive().integer()
});
const ticketUserIdSchema = Yup.object({
    userId: Yup.number().required().positive().integer()
});

module.exports = { ticketSchema, ticketIdSchema, ticketPatchSchema, ticketNumTicketSchema, ticketCreationSchema, ticketUserIdSchema};
