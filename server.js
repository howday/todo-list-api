var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    Task = require('./api/models/todoListModel'), //created model loading here
    User = require('./api/models/User'),
    bodyParser = require('body-parser'),
    verifyToken = require('./VerifyToken');

// mongoose instance connection url connection

try {
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true}, {useMongoClient: true});
} catch (err) {
    console.log("Error caught");
}


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var login = require('./api/routes/loginRoute');
login(app);


app.use(verifyToken);

var routes = require('./api/routes/todoListRoute'); //importing route
routes(app); //register the route


app.listen(port);


console.log('todo list RESTful API server started on: ' + port);
