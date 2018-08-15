var jwt = require('jsonwebtoken');
var config = require('./config');

var verifyToken = function verifyToken(req, res, next) {
    var token = req.headers['x-access-token'];
    console.log("Verifying token..." + token);
    if (!token)
        return res.status(403).send({auth: false, message: 'No token provided.'});
    jwt.verify(token, config.secret, function (err, decoded) {
        if (err)
            return res.status(500).send({auth: false, message: 'Failed to authenticate token.'});
        // if everything good, save to request for use in other routes

        console.log(decoded);
        req.userId = decoded.id;
        next();
    });
}
module.exports = verifyToken;