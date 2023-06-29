const nodemailer = require('nodemailer');



const SendEmail = async(send, subject, messages ) => {

    const  transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      return await transport.sendMail({
        to: send,
        subject: subject,
        html: messages
      });
}

module.exports = SendEmail;