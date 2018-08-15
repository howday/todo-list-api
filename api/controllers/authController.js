'use strict';

var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../../config');
var User = mongoose.model('User');


exports.login = function (req, res) {
    User.findOne({email: req.body.email}, function (err, user) {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({auth: false, token: null});
        var token = jwt.sign({id: user._id}, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({auth: true, token: token});
    });
}

exports.list_all_users = function (req, res) {
    User.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
}

exports.register_user = function (req, res) {

    var hashedPassword = bcrypt.hashSync(req.body.password, 8);

    User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        },
        function (err, user) {
            if (err) return res.status(500).send("There was a problem registering the user.")
            // create a token
            var token = jwt.sign({id: user._id}, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({auth: true, token: token});
        });
};
