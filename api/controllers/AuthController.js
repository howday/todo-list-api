'use strict';

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../../config');
const User = mongoose.model('User');
const notifier = require('../../module/email/Notifier');
const logger = require('../../module/logging/Logger');

exports.login = function (req, res) {
    let email = req.body.email;
    logger.info("Trying to login with email : " + email);
    User.findOne({email: email}, function (err, user) {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('Email address is not registered yet.');
        let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            logger.info('User with email = ' + email + ' is not authorized.');
            return res.status(401).send({message: 'Authentication failed. Please check your login info'});
        }
        if(user.status[0] === 'pending'){
            logger.info('User with email = '+email+' is not activated yet.');
            notifier.notify({
                type: 'confirmation', email: email
            });
            return res.status(200).send({message: 'Please check your email to verify your account first.'});
        }
        let token = jwt.sign({id: user._id}, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        logger.info('User with email = ' + email + ' is logged in successfully. ');
        res.status(200).send({auth: true, token: token});
    });
};

