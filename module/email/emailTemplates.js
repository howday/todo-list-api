'use strict';

const bcrypt = require('bcryptjs');


exports.getConfirmationEmail = function (params) {

    return '<h1>Greetings,</h1>' +
        '<p>Please click on the link below to verify your ToDo Account.</p>' +
        '' + getConfirmationLink(params);

};

function getConfirmationLink(params) {

    let uniqueCode = bcrypt.hashSync(params, 8);
    return 'http://localhost:3000/verify?token=' + uniqueCode + '&email=' + params;

}