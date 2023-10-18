const Yup = require('yup')

let loginSchema = Yup.object({
    email: Yup.string().required().email().min(1).max(155),
    password: Yup.string().required().min(1).max(255)
});

let userSchema = Yup.object({
    lastName: Yup.string().required().min(1).max(155),
    firstName: Yup.string().required().min(1).max(155),
    email: Yup.string().required().email().min(1).max(155),
    phone: Yup.string().required().min(8).max(15),
    password: Yup.string().required().min(1).max(255),
    // idCompteExt:Yup.string().required().min(1).max(155),
    role: Yup.string().required().min(1).max(155),
    birthDate: Yup.date().required(),
    // isVerify:Yup.boolean()
});


// Schéma pour valider l'ID utilisateur
const userIdSchema = Yup.object({
    id: Yup.number().required().positive().integer()
});

module.exports = {loginSchema, userSchema, userIdSchema}
