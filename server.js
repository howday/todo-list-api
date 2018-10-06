const express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    Task = require('./api/models/ToDo'),
    User = require('./api/models/User'),
    ResetCode = require('./api/models/ResetCode'),
    bodyParser = require('body-parser'),
    verifyToken = require('./VerifyToken'),
    networkListener = require('./module/logging/NetworkLogger');

/**
 * mongoose instance connection url connection
 */


mongoose.connect("mongodb://localhost:27017/test", {useNewUrlParser: true})
    .then(() => {
        console.log('Database connection successful')
    })
    .catch(err => {
        console.error('Database connection error ');
        console.error(err);

    });


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/**
 * This keeps trace all API calls made with network info
 */
app.use(networkListener());

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', '*');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    //intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
        //respond with 200
        res.send(200);
    }

    // Pass to next layer of middleware
    next();
});


/**
 * Verify if the call contains valid token or not
 */
app.use(verifyToken);

/**
 * Registering all the end points
 */

var loginRoute = require('./api/routes/LoginRoute');
loginRoute(app);

var todoRoute = require('./api/routes/TodoRoute');
todoRoute(app); //register the route

var userRoute = require('./api/routes/UserRoute');
userRoute(app);

app.listen(port);


console.log('ToDo RESTful API server started on: ' + port);
