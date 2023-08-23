const Yup = require('yup');

const batchSchema = Yup.object({
    valeur: Yup.number().required().positive(),
    type_lot: Yup.string().required().min(1).max(155),
    description: Yup.string().required().min(1).max(255),
    pourcentage_gagnant: Yup.number().required().positive(),
    idUser: Yup.number().required().positive().integer(),
    
});

const batchIdSchema = Yup.object({
    id: Yup.number().required().positive().integer()
});

module.exports = { batchSchema, batchIdSchema};
