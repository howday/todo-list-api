'use strict';

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../../config');
const User = mongoose.model('User');
const ResetCode = mongoose.model('ResetCode');
const notifier = require('../../module/email/Notifier');
const logger = require('../../module/logging/Logger');
const helper = require('../helper/helper');

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
        if (user.status[0] === 'pending') {
            logger.info('User with email = ' + email + ' is not activated yet.');
            notifier.notify({
                type: 'confirmation', email: email
            });
            return res.status(200).send({message: 'Please check your email to verify your account first.'});
        }
        let token = jwt.sign({id: user._id}, config.secret, {
            expiresIn: 30 // expires in 24 hours
        });
        logger.info('User with email = ' + email + ' is logged in successfully. ');
        res.status(200).send({auth: true, token: token});
    });
};

exports.forgot_password = function (req, res) {
    let email = req.query.email;
    logger.info('Getting password reset code for email = ' + email);
    User.findOne({email: email}, function (err, user) {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('Unable to find account with associated with email = ' + email);
        let resetCode = helper.getResetCode();
        ResetCode.create({
            email: email,
            reset_code: resetCode
        }, function (err, code) {
            if (err) return res.status(500).send("There was a problem generating reset code.");
            notifier.notify({
                type: 'forgot_password', email: email, reset_code: resetCode
            });
            res.status(200).send({message: "Please use the reset code sent in your email to change your password."});
        })
    });
};

exports.validate_reset_code = function (req, res) {
    let email = req.query.email;
    let code = req.query.code;
    let response = null;
    logger.info('Validating reset code for email = ');
    ResetCode.findOne({'email': email, 'reset_code': code}, function (err, code) {
        if (err) return res.status(500).send("There was a problem validating reset code.");
        if (!code) {
            return res.status(404).send({message: 'Invalid reset code, please try with valid one.'});
        } else {
            if (helper.validateResetCode(code)) {
                response = {code: 200, message: 'Code is validated, please change your password'};
            } else {
                response = {code: 400, message: 'This code is no longer valid, please try requesting new one.'};
            }
        }
        res.status(response.code).send(response);
    });

};

exports.change_password = function (req, res) {
    let email = req.body.email;
    let password = bcrypt.hashSync(req.body.password, 8);
    let code = req.body.code;

    ResetCode.findOne({'email': email, 'reset_code': code, status: 'ACTIVE'}, function (err, code) {
        if (!code) return res.status(400).send({message: "Invalid request."});
        User.findOneAndUpdate({email: email}, {$set: {password: password}}, {new: true}, function (err, user) {
            ResetCode.findOneAndUpdate({reset_code: code.reset_code}, {$set: {status: "EXPIRED"}}, {new: true}, function (err, user) {
                if (err) return res.status(500).send("There was a error changing reset code status.");
            });

            res.status(200).send({message:'Password changed successfully.'});
        });

    });
};

