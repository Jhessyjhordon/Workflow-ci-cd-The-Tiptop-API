const Yup = require('yup')

let shopSchema = Yup.object({
    name: Yup.string().required().min(1).max(155),
    adress: Yup.string().required().min(1).max(155),
    city: Yup.number().required().min(1).max(255),
    userId: Yup.number().required().positive().integer(),
});
let shopPatchSchema = Yup.object({
    name: Yup.string().min(1).max(155),
    adress: Yup.string().min(1).max(155),
    city: Yup.number().min(1).max(255),
    userId: Yup.number().positive().integer(),
});

const shopIdSchema = Yup.object({
    id: Yup.number().required().positive().integer()
});


module.exports = {shopSchema, shopIdSchema, shopPatchSchema}