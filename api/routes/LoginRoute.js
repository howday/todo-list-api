/**
 * Created by suresh on 8/13/18.
 */


module.exports = function (app) {
    const auth = require('../controllers/AuthController');

    app.route('/login').post(auth.login);
    app.route('/forgot_password').get(auth.forgot_password);
    app.route('/change_password').put(auth.change_password);

};
