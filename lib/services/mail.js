const nodemailer = require('nodemailer');
const {Service} = require("@hapipal/schmervice");

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'lelah.orn2@ethereal.email',
        pass: 'YeXgCWmE5mark57147'
    }
});
module.exports = class MailService extends Service  {

    sendMailWelcome(user){
        let mailOptions = {
            from: 'lelah.orn2@ethereal.email',
            to: user.email,
            subject: 'Bienvenue !',
            text: `Bienvenue ${user.firstName} ${user.lastName} ! Merci de vous être inscrit.`,
        };

        return transporter.sendMail(mailOptions);
    }

    sendMailNewMovie(movie, user) {
        let mailOptions = {
            from: 'from: lelah.orn2@ethereal.email',
            to: user.email,
            subject: `Nouveau film ${movie.title} ajouté !`,
            text: `Un nouveau film ${movie.title} a été ajouté à la base de données. Sorti en ${movie.releaseDate}, il a été réalisé par ${movie.director}.`,
        };

        return transporter.sendMail(mailOptions);
    }

    sendMailMovieModification(movie, user) {
        let mailOptions = {
            from: 'from: lelah.orn2@ethereal.email',
            to: user.email,
            subject: `Film ${movie.title} modifié !`,
            text: `Le film ${movie.title} a été modifié. Voici les nouvelles informations :\n
                     Description: ${movie.description}\n
                     Date de sortie: ${movie.releaseDate}\n
                     Réalisateur: ${movie.director}`,
        };

        return transporter.sendMail(mailOptions);
    }
}
