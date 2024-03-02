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

    sendMail(user){
        let mailOptions = {
            from: 'lelah.orn2@ethereal.email',
            to: user.email,
            subject: 'Bienvenue !',
            text: `Bienvenue ${user.firstName} ${user.lastName} ! Merci de vous être inscrit.`,
        };

        return transporter.sendMail(mailOptions);

    }


}
