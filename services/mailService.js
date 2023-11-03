require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.THETIPTOP_GAMIL_LOGIN,
        pass: process.env.THETIPTOP_GAMIL_PASSWORD,
    },
});

function sendConfirmationEmail(userEmail, confirmationToken) {
    const mailOptions = {
        from: process.env.THETIPTOP_GAMIL_LOGIN,
        to: userEmail,
        subject: 'Confirmation de votre compte',
        text: `Cliquez sur ce lien pour confirmer votre compte : http://votre_site.com/user/confirm/${confirmationToken}`, //à mettre à jour 
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Erreur lors de l\'envoi de l\'e-mail :', error);
        } else {
            console.log('E-mail envoyé :', info.response);
        }
    });
}

module.exports = { sendConfirmationEmail };
