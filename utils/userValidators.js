const Yup = require('yup')

let login = Yup.object({
    email: Yup.string().required().email().min(1).max(155),
    password: Yup.string().required().min(1).max(255)
});

let user = Yup.object({
    lastname: Yup.string().required().min(1).max(155),
    firstname: Yup.string().required().min(1).max(155),
    email: Yup.string().required().email().min(1).max(155),
    phone: Yup.string().required().min(8).max(15),
    password: Yup.string().required().min(1).max(255),
});



module.exports = {login, user}
