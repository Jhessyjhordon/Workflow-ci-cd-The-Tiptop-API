const Yup = require('yup')

let shopSchema = Yup.object({
    name: Yup.string().required().min(1).max(155),
    adress: Yup.string().required().min(1).max(155),
    employeeId:  Yup.number().required().positive().integer(),
    city: Yup.number().required().min(1).max(255),
});

const shopIdSchema = Yup.object({
    id: Yup.number().required().positive().integer()
});


module.exports = {shopSchema, shopIdSchema}