const Yup = require('yup')

let shopSchema = Yup.object({
    name: Yup.string().required().min(1).max(155),
    adress: Yup.string().required().min(1).max(155),
    city: Yup.number().required().min(1).max(255),
    userId: Yup.number().required().positive().integer(),
});

const shopIdSchema = Yup.object({
    id: Yup.number().required().positive().integer()
});


module.exports = {shopSchema, shopIdSchema}