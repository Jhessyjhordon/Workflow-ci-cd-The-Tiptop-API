const Yup = require('yup');

const batchSchema = Yup.object({
    dateClientGagant: Yup.date().required(),
    idUser: Yup.number().required().positive().integer(),
    
});

const batchIdSchema = Yup.object({
    id: Yup.number().required().positive().integer()
});

module.exports = { batchSchema, batchIdSchema};
