require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'dev'}` }); // Utilisez le fichier .env.dev par défaut
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.THETIPTOP_GMAIL_LOGIN,
        pass: "lypm pqio nlnj xaky",
    },
});

function sendConfirmationEmail(userEmail,lastname, firstname, confirmationToken) {
    const mailOptions = {
        from: process.env.THETIPTOP_GMAIL_LOGIN,
        to: userEmail,
        subject: 'Confirmation de votre compte',
        text: `Félicitations ${firstname} ${lastname}, votre compte a été créé ,\n veuillez cliquer sur ce lien pour confirmer votre compte : ${process.env.THETIPTOP_API_URL}user/confirm/${confirmationToken}`, //à mettre à jour 
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
