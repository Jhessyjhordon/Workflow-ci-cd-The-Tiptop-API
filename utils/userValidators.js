const Yup = require('yup')

let loginSchema = Yup.object({
    email: Yup.string().required().email().min(1).max(155),
    password: Yup.string().required().min(1).max(255)
});

let userSchema = Yup.object({
    lastname: Yup.string().required().min(1).max(155),
    firstname: Yup.string().required().min(1).max(155),
    email: Yup.string().required().email().min(1).max(155),
    phone: Yup.string().required().min(8).max(15),
    password: Yup.string().required().min(1).max(255),
    // idCompteExt:Yup.string().required().min(1).max(155),
    role: Yup.string().required().min(1).max(155),
    birthDate: Yup.date().required(),
    address: Yup.string().required().min(1).max(155),
    newsletter: Yup.boolean().required(),
    // isVerify:Yup.boolean()
});

let userRegisterSchema = Yup.object({
    lastname: Yup.string().required().min(1).max(155),
    firstname: Yup.string().required().min(1).max(155),
    email: Yup.string().required().email().min(1).max(155),
    password: Yup.string().required().min(1).max(255),
});


// Schéma pour valider l'ID utilisateur
const userIdSchema = Yup.object({
    id: Yup.number().required().positive().integer()
});

// const userAccountDeletionSchema = Yup.object({
//     isDeleted:  Yup.boolean().required(),
// });

module.exports = {loginSchema, userSchema, userIdSchema, userRegisterSchema, userAccountDeletionSchema}
