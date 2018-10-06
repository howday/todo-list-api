'use strict';
const config = require('../../config')
const mailer = require('nodemailer');
const emailTemplates = require('./emailTemplates');

const transporter = mailer.createTransport({
    service: config.email_service,
    auth: {
        user: config.email,
        pass: config.password
    }
});

function getMailOptions(body) {
    if (body.type === 'confirmation') {
        return {
            from: config.email,
            to: body.email,
            subject: 'Confirm your registration',
            html: emailTemplates.getConfirmationEmail(body.email)
        };
    } else if(body.type === 'forgot_password'){
        return {
            from: config.email,
            to: body.email,
            subject: 'ToDo Service :: Password Reset Code',
            html: emailTemplates.getPasswordResetCodeEmail(body.reset_code)
        };
    }

}


exports.notify = function (body) {

    let mailOptions = getMailOptions(body);

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

