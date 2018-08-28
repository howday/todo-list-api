'use strict';

const jwt = require('jsonwebtoken');
const config = require('./config');
const _ = require('underscore');
const nonSecurePaths = ['/login','/user','/verify'];


const verifyToken = function verifyToken(req, res, next) {
    if ( _.contains(nonSecurePaths, req.path) ) return next();

    let token = req.headers['x-access-token'];
    console.log("Verifying token..." + token);
    if (!token)
        return res.status(403).send({auth: false, message: 'No token provided.'});
    jwt.verify(token, config.secret, function (err, decoded) {
        if (err)
            return res.status(500).send({auth: false, message: 'Failed to authenticate token.'});

        console.log(decoded);
        req.userId = decoded.id;
        next();
    });
};

module.exports = verifyToken;