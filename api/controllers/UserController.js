'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const User = require('../models/User');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

exports.register_user = function (req, res) {

    let hashedPassword = bcrypt.hashSync(req.body.password, 8);

    User.countDocuments({email: req.body.email}, function (err, count) {

        if (count === 1) {
            return res.status(400).send({message: "Email address is already registered"});
        } else {
            User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: hashedPassword
                },
                function (err, user) {
                    if (err) return res.status(500).send("There was a problem registering the user.")
                    // create a token
                    let token = jwt.sign({id: user._id}, config.secret, {
                        expiresIn: 86400 // expires in 24 hours
                    });
                    res.status(200).send({auth: true, token: token});
                });
        }
    });
};

exports.list_all_users = function (req, res) {
    User.find(function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
}

exports.get_user = function (req, res) {
    User.findById(req.params.id, {password: 0}, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
}

exports.update_user = function (req, res) {
    req.body.password = bcrypt.hashSync(req.body.password, 8);
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send("User updated successfully");
    });
}


exports.delete_user = function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User: " + user.name + " was deleted.");
    });
}