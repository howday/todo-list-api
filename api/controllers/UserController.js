'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const User = require('../models/User');
const notifier = require('../../module/email/Notifier');
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

exports.register_user = function (req, res) {

    let hashedPassword = bcrypt.hashSync(req.body.password, 8);

    User.findOne({email: req.body.email}, function (err, user) {
        if (user) {
            if (user.status[0] === "pending") {
                notifier.notify({
                    type: 'confirmation', email: req.body.email
                });
                return res.status(400).send({message: "Email address is already registered. Please check your email to validate this account."})
            } else {
                return res.status(400).send({message: "Email address is already registered."});
            }
        } else {
            User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: hashedPassword,
                },
                function (err, user) {
                    if (err) return res.status(500).send("There was a problem registering the user.");
                    notifier.notify({
                        type: 'confirmation', email: req.body.email
                    });
                    res.status(200).send({message: "Please click on the link sent to you email to activate your account."});
                });
        }
    });
};

exports.list_all_users = function (req, res) {
    User.find(function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
};

exports.get_user = function (req, res) {
    User.findById(req.params.id, {password: 0}, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
};

exports.update_user = function (req, res) {
    req.body.password = bcrypt.hashSync(req.body.password, 8);
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send("User updated successfully");
    });
};


exports.delete_user = function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User: " + user.name + " was deleted.");
    });
};


exports.verify = function (req, res) {
    console.log('verifying....');
    let queryParams = req.query;
    let isValidRequest = bcrypt.compareSync(queryParams.email, queryParams.token);
    if (isValidRequest) {
        User.update({email: queryParams.email}, {status: "active"}, function (err, res) {
            if (err) res.status(400).send({message: 'Ops !! Something is wrong'});
        });
        return res.status(200).send({message: 'Congratulations ! Your account is active now'});
    }
    else {
        return res.status(400).send({message: 'Ops !! Something is wrong'});
    }
};