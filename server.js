const express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    Task = require('./api/models/ToDo'),
    User = require('./api/models/User'),
    bodyParser = require('body-parser'),
    verifyToken = require('./VerifyToken'),
    networkListener = require('./NetworkLogger');

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
