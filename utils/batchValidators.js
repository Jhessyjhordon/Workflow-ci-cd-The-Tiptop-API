const Yup = require('yup');

const batchSchema = Yup.object({
    valeur: Yup.number().required().positive(),
    type_lot: Yup.string().required().min(1).max(155),
    description: Yup.string().required().min(1).max(255),
    pourcentage_gagnant: Yup.number().required().positive(),
    employee_id: Yup.number().required().positive().integer(),
});

const batchPatchSchema = Yup.object({
    valeur: Yup.number().positive(),
    type_lot: Yup.string().min(1).max(155),
    description: Yup.string().min(1).max(255),
    pourcentage_gagnant: Yup.number().positive(),
    employee_id: Yup.number().positive().integer().moreThan(0),
});

const batchIdSchema = Yup.object({
    id: Yup.number().required().positive().integer()
});

const batchByUserIdSchema = Yup.object({
    user_id: Yup.number().required().positive().integer()
});

module.exports = { batchSchema, batchIdSchema, batchPatchSchema, batchByUserIdSchema};
